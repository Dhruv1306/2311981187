import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import type { SelectChangeEvent } from "@mui/material"

interface Props {
  typeFilter: string
  onTypeChange: (v: string) => void
  onRefresh: () => void
  extraActions?: React.ReactNode
  label?: string
}

export default function FilterBar({ typeFilter, onTypeChange, onRefresh, extraActions, label }: Props) {
  const handleChange = (e: SelectChangeEvent) => onTypeChange(e.target.value)

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 3 }}>
      {label && (
        <Typography variant="body2" color="text.secondary" fontWeight={600}>
          {label}
        </Typography>
      )}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Type</InputLabel>
        <Select value={typeFilter} label="Type" onChange={handleChange}>
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>
      {extraActions}
      <Button variant="outlined" size="small" startIcon={<RefreshIcon />} onClick={onRefresh}>
        Refresh
      </Button>
    </Box>
  )
}
