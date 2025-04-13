import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useTheme,
  Typography,
} from "@mui/material";
import { YearAggregation } from "../lib/actions";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

interface FilterBarProps {
  yearAggregations: YearAggregation[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

export function FilterBar({
  yearAggregations,
  selectedYear,
  onYearChange,
}: FilterBarProps) {
  const theme = useTheme();

  return (
    <FormControl
      sx={{
        minWidth: { xs: "100%", sm: 220 },
      }}
    >
      <InputLabel id="year-filter-label" sx={{ bgcolor: "transparent" }}>
        Filter by Year
      </InputLabel>
      <Select
        labelId="year-filter-label"
        id="year-filter"
        value={selectedYear}
        label="Filter by Year"
        onChange={(e) => onYearChange(e.target.value)}
        startAdornment={
          <CalendarTodayIcon
            sx={{
              ml: 1,
              mr: 1,
              color: theme.palette.text.secondary,
              fontSize: "1.2rem",
            }}
          />
        }
        sx={{
          borderRadius: 2,
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
          },
          "&:hover": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              boxShadow: `0 0 0 2px ${theme.palette.primary.main}15`,
            },
          },
        }}
      >
        <MenuItem value="">
          <em>All Years</em>
        </MenuItem>
        {yearAggregations.map((agg) => (
          <MenuItem
            key={agg.key}
            value={agg.key}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {agg.key}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                bgcolor: theme.palette.action.hover,
                px: 1,
                py: 0.5,
                borderRadius: 1,
                minWidth: 32,
                textAlign: "center",
              }}
            >
              {agg.doc_count}
            </Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
