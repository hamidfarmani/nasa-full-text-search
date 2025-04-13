"use server";

import client, { APOD_INDEX, APOD_MAPPING } from "@/lib/elasticsearch";
import { estypes } from "@elastic/elasticsearch";

export type ApodData = {
  title: string;
  explanation: string;
  date: string;
  image_url: string;
  authors: string;
};

export type YearAggregation = {
  key: string;
  doc_count: number;
};

export type SearchResult = {
  items: ApodData[];
  total: number;
  yearAggregations: YearAggregation[];
};

async function waitForIndexReady(maxRetries = 10, delay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const health = await client.cluster.health({
        index: APOD_INDEX,
        timeout: "30s",
        wait_for_status: "yellow",
      });

      if (health.status === "green" || health.status === "yellow") {
        console.log(`Index is ready with status: ${health.status}`);
        return true;
      }
    } catch (error) {
      console.log(
        `Waiting for index to be ready... (attempt ${i + 1}/${maxRetries})`
      );
    }

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Index failed to become ready");
}

export async function initializeIndex() {
  const exists = await client.indices.exists({ index: APOD_INDEX });
  if (!exists) {
    await client.indices.create({
      index: APOD_INDEX,
      ...APOD_MAPPING,
    });
  }

  await waitForIndexReady();
}

export async function indexApodData(data: ApodData[]) {
  if (data.length === 0) {
    return true;
  }

  try {
    const operations = data.flatMap((doc) => [
      { index: { _index: APOD_INDEX } },
      doc,
    ]);

    const { items } = await client.bulk({
      operations,
      refresh: true,
      timeout: "30s",
    });

    const hasErrors = items.some((item) => item.index?.error);
    if (hasErrors) {
      console.error(
        "Some items failed to index:",
        items
          .filter((item) => item.index?.error)
          .map((item) => item.index?.error)
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Bulk indexing error:", error);
    return false;
  }
}

export async function searchApodData(
  query: string = "",
  page: number = 0,
  pageSize: number = 10,
  yearFilter?: string
): Promise<SearchResult> {
  const must: estypes.QueryDslQueryContainer[] = [];
  const should: estypes.QueryDslQueryContainer[] = [];

  if (query) {
    should.push(
      {
        match: {
          title: {
            query,
            boost: 4,
          },
        },
      },
      {
        match_phrase: {
          title: {
            query,
            boost: 10,
          },
        },
      },
      {
        multi_match: {
          query,
          fields: ["title^2", "explanation"],
          type: "best_fields",
          fuzziness: "AUTO",
          minimum_should_match: "70%",
        },
      }
    );
  }

  if (yearFilter) {
    must.push({
      term: {
        "date.year": yearFilter,
      },
    });
  }

  const searchQuery: estypes.QueryDslQueryContainer =
    query || yearFilter
      ? {
          bool: {
            must,
            should: should.length > 0 ? should : undefined,
            minimum_should_match: should.length > 0 ? 1 : undefined,
          },
        }
      : { match_all: {} };

  const response = await client.search({
    index: APOD_INDEX,
    from: page * pageSize,
    size: pageSize,
    query: searchQuery,
    sort: query ? ["_score", { date: "desc" }] : [{ date: "desc" }],
    track_total_hits: true,
    aggs: {
      years: {
        terms: {
          field: "date.year",
          size: 50,
          order: { _key: "desc" },
        },
      },
    },
  });

  const { hits, aggregations } = response;
  const yearBuckets = aggregations?.years as unknown as {
    buckets: YearAggregation[];
  };

  return {
    items: hits.hits.map((hit) => hit._source as ApodData),
    total: typeof hits.total === "number" ? hits.total : hits.total?.value || 0,
    yearAggregations: yearBuckets?.buckets || [],
  };
}
