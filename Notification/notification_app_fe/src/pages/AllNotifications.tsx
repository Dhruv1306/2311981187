import { useState } from "react"
import {
  Box,
  Typography,
  Pagination,
  CircularProgress,
  Alert,
  Button,
  Skeleton,
  Divider,
} from "@mui/material"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import { Log } from "@middleware"
import { useNotifications } from "../hooks/useNotifications"
import NotificationCard from "../components/NotificationCard"
import FilterBar from "../components/FilterBar"

export default function AllNotifications() {
  const [typeFilter, setTypeFilter] = useState("")
  const { data, loading, error, page, setPage, markRead, markAllAsRead, refresh } = useNotifications(
    1,
    20,
    typeFilter || undefined
  )

  const handleTypeChange = async (v: string) => {
    await Log("frontend", "info", "page", `Filter changed to: ${v || "all"}`)
    setTypeFilter(v)
    setPage(1)
  }

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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={700}>
          All Notifications
          {data && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({data.total} total)
            </Typography>
          )}
        </Typography>
      </Box>

      <FilterBar
        typeFilter={typeFilter}
        onTypeChange={handleTypeChange}
        onRefresh={refresh}
        extraActions={
          <Button
            variant="outlined"
            size="small"
            startIcon={<DoneAllIcon />}
            onClick={markAllAsRead}
          >
            Mark All Read
          </Button>
        }
      />

      <Divider sx={{ mb: 2 }} />

      {loading ? (
        Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={90} sx={{ mb: 1.5, borderRadius: 1 }} />
        ))
      ) : data?.notifications.length === 0 ? (
        <Alert severity="info">No notifications found.</Alert>
      ) : (
        data?.notifications.map((n) => (
          <NotificationCard key={n.ID} notification={n} onMarkRead={markRead} />
        ))
      )}

      {data && data.total_pages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={data.total_pages}
            page={page}
            onChange={(_e, v) => setPage(v)}
            color="primary"
            size="large"
          />
        </Box>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
    </Box>
  )
}
