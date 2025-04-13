# NASA APOD Search

A full-text search application for NASA's Astronomy Picture of the Day (APOD) archive. This application provides a modern interface to search through thousands of astronomy pictures and their descriptions.

## Features

- **Full-Text Search**: Search through titles and explanations of NASA's astronomy pictures
- **Advanced Search Capabilities**:
  - Exact phrase matching for titles
  - Fuzzy matching for typo tolerance
  - Relevance-based sorting
- **Year-based Filtering**: Filter results by year with aggregated counts
- **Responsive Grid Display**: View results in a clean, organized table format
- **Real-time Search**: Search results update as you type
- **Server-side Pagination**: Efficient loading of large datasets

## Tech Stack

- **Frontend**: Next.js with React
- **UI Components**: Material-UI (MUI)
- **Search Engine**: Elasticsearch
- **Language**: TypeScript
- **Package Manager**: pnpm

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Elasticsearch (v8.x)
- Docker (optional, for running Elasticsearch)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd nasa-full-text-search
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start Elasticsearch**

   Make sure Elasticsearch is running on `http://localhost:9200`

   If using Docker:

   ```bash
   docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" elasticsearch:8.x
   ```

4. **Load the data**

   ```bash
   pnpm run load-data
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

## Search Features

### Text Search

- Searches across title and explanation fields
- Title matches are boosted for higher relevance
- Exact phrase matching for titles
- Fuzzy matching for typo tolerance
- Minimum match threshold for better quality results

### Filtering

- Year-based filtering using Elasticsearch aggregations
- Real-time counts of items per year
- Combines with text search

### Sorting

- Results are sorted by relevance when searching
- Chronological sorting (newest first) when not searching

## Data Loading

The application includes a data loading script that:

- Creates the Elasticsearch index with proper mappings
- Loads APOD data in chunks to prevent overwhelming the server
- Includes error handling and retry logic
- Shows progress during loading

## Elasticsearch Mapping

The application uses a custom Elasticsearch mapping that includes:

- Text fields with standard analyzer for better search
- Date fields with proper formatting
- Runtime fields for year extraction
- Keyword fields for exact matching
- Custom analyzers for improved search quality

## Development

### Available Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Build for production
- `pnpm start`: Start production server
- `pnpm load-data`: Load data into Elasticsearch

### Environment Variables

Create a `.env.local` file with:

```
ELASTICSEARCH_URL=http://localhost:9200
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
