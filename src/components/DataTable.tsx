import { DataGrid, GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { ApodData } from "../lib/actions";
import { Box, Typography, useTheme, Paper } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import { useState } from "react";
import { ImageDialog } from "./ImageDialog";

interface DataTableProps {
  rows: ApodData[];
  totalRows: number;
  loading: boolean;
  page: number;
  pageSize: number;
  onPaginationChange: (page: number, pageSize: number) => void;
}

export function DataTable({
  rows,
  totalRows,
  loading,
  page,
  pageSize,
  onPaginationChange,
}: DataTableProps) {
  const [selectedImage, setSelectedImage] = useState<ApodData | null>(null);
  const theme = useTheme();

  const handleImageClick = (data: ApodData) => {
    setSelectedImage(data);
  };

  const columns: GridColDef[] = [
    {
      field: "date",
      headerName: "Date",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontFamily: "var(--font-geist-mono)" }}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "title",
      headerName: "Title",
      width: 300,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "explanation",
      headerName: "Explanation",
      minWidth: 500,
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: theme.palette.text.secondary,
              width: "100%",
            }}
          >
            {params.value as string}
          </Typography>
        </Box>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Image",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key={`view-image-${params.row.date}`}
          icon={
            <ImageIcon
              sx={{
                color: theme.palette.primary.main,
                transition: "color 0.2s",
                "&:hover": {
                  color: theme.palette.primary.dark,
                },
              }}
            />
          }
          label="View Image"
          onClick={() => handleImageClick(params.row)}
          sx={{
            "&:hover": {
              bgcolor: `${theme.palette.primary.main}15`,
            },
          }}
        />,
      ],
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        height: 800,
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
        border: `1px solid ${theme.palette.divider}`,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.date}
        rowCount={totalRows}
        loading={loading}
        pageSizeOptions={[5, 10, 25, 50]}
        paginationMode="server"
        paginationModel={{
          page,
          pageSize,
        }}
        onPaginationModelChange={(model) => {
          onPaginationChange(model.page, model.pageSize);
        }}
        sx={{
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: theme.palette.background.default,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-cell": {
            borderColor: theme.palette.divider,
          },
          "& .MuiDataGrid-row:hover": {
            bgcolor: `${theme.palette.primary.main}08`,
          },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${theme.palette.divider}`,
          },
        }}
      />
      <ImageDialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        data={selectedImage}
      />
    </Paper>
  );
}
