import { TextField, InputAdornment, useTheme } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  const theme = useTheme();

  return (
    <TextField
      fullWidth
      placeholder="Search for astronomical wonders..."
      variant="outlined"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx={{ color: theme.palette.text.secondary }} />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          transition: theme.transitions.create(["border-color", "box-shadow"]),
          "&:hover": {
            borderColor: theme.palette.primary.main,
          },
          "&.Mui-focused": {
            boxShadow: `0 0 0 2px ${theme.palette.primary.main}15`,
          },
        },
      }}
    />
  );
}
