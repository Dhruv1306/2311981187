import { useState } from "react"
import {
  Box,
  Typography,
  Alert,
  Button,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import type { SelectChangeEvent } from "@mui/material"
import { Log } from "@middleware"
import { usePriorityNotifications } from "../hooks/useNotifications"
import NotificationCard from "../components/NotificationCard"
import FilterBar from "../components/FilterBar"

const LIMIT_OPTIONS = [10, 15, 20]

export default function PriorityInbox() {
  const [limit, setLimit] = useState(10)
  const [typeFilter, setTypeFilter] = useState("")
  const { notifications, loading, error, refresh } = usePriorityNotifications(limit)

  const handleLimitChange = async (e: SelectChangeEvent<number>) => {
    const val = Number(e.target.value)
    await Log("frontend", "info", "page", `Priority inbox limit changed to: ${val}`)
    setLimit(val)
  }

  const handleTypeChange = async (v: string) => {
    await Log("frontend", "info", "page", `Priority inbox type filter changed to: ${v || "all"}`)
    setTypeFilter(v)
  }

  const filtered = typeFilter ? notifications.filter((n) => n.Type === typeFilter) : notifications

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={refresh}>
          Retry
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <StarIcon color="warning" />
        <Typography variant="h5" fontWeight={700}>
          Priority Inbox
        </Typography>
        <Chip label={`Top ${limit}`} size="small" color="warning" variant="outlined" />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Ranked by type weight (Placement &gt; Result &gt; Event) and recency.
      </Typography>

      <FilterBar
        typeFilter={typeFilter}
        onTypeChange={handleTypeChange}
        onRefresh={refresh}
        extraActions={
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Show top</InputLabel>
            <Select value={limit} label="Show top" onChange={handleLimitChange}>
              {LIMIT_OPTIONS.map((n) => (
                <MenuItem key={n} value={n}>
                  Top {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        Array.from({ length: limit }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={90} sx={{ mb: 1.5, borderRadius: 1 }} />
        ))
      ) : filtered.length === 0 ? (
        <Alert severity="info">No priority notifications found.</Alert>
      ) : (
        filtered.map((n, i) => (
          <Box key={n.ID}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Chip label={`#${i + 1}`} size="small" color="default" variant="outlined" sx={{ fontWeight: 700 }} />
            </Box>
            <NotificationCard notification={n} />
          </Box>
        ))
      )}
    </Box>
  )
}
