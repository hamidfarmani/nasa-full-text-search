"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  useTheme,
  alpha,
} from "@mui/material";
import {
  searchApodData,
  type ApodData,
  type YearAggregation,
} from "../lib/actions";
import { useDebounce } from "@/hooks/useDebounce";
import { SearchBar } from "../components/SearchBar";
import { DataTable } from "../components/DataTable";
import { FilterBar } from "../components/FilterBar";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ApodData[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [yearAggregations, setYearAggregations] = useState<YearAggregation[]>(
    []
  );
  const theme = useTheme();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await searchApodData(
        debouncedSearchTerm,
        page,
        pageSize,
        selectedYear
      );
      setRows(result.items);
      setTotalRows(result.total);
      setYearAggregations(result.yearAggregations);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, page, pageSize, selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePaginationChange = (newPage: number, newPageSize: number) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    setPage(0);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        py: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: { xs: 3, sm: 5 } }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              textAlign: "center",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              mb: 1,
            }}
          >
            NASA Astronomy Picture of the Day
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            sx={{
              color: theme.palette.text.secondary,
              maxWidth: "900px",
              mx: "auto",
              px: 2,
            }}
          >
            Explore the cosmos through NASA&apos;s curated collection of
            astronomical photographs and their fascinating explanations.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: "blur(8px)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 4,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </Box>
            <FilterBar
              yearAggregations={yearAggregations}
              selectedYear={selectedYear}
              onYearChange={handleYearChange}
            />
          </Box>

          <DataTable
            rows={rows}
            totalRows={totalRows}
            loading={loading}
            page={page}
            pageSize={pageSize}
            onPaginationChange={handlePaginationChange}
          />
        </Paper>
      </Container>
    </Box>
  );
}
