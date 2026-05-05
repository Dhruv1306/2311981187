import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material"
import DoneAllIcon from "@mui/icons-material/DoneAll"
import type { Notification, NotificationType } from "../types"

interface Props {
  notification: Notification
  onMarkRead?: (n: Notification) => void
}

const typeColor: Record<NotificationType, "success" | "primary" | "warning"> = {
  Placement: "success",
  Result: "primary",
  Event: "warning",
}

export default function NotificationCard({ notification, onMarkRead }: Props) {
  const isUnread = !notification.isRead

  return (
    <Card
      elevation={isUnread ? 3 : 1}
      sx={{
        mb: 1.5,
        borderLeft: isUnread ? "4px solid" : "4px solid transparent",
        borderLeftColor: isUnread ? `${typeColor[notification.Type]}.main` : "transparent",
        bgcolor: isUnread ? "background.paper" : "action.hover",
        transition: "all 0.2s ease",
        "&:hover": { elevation: 6, transform: "translateY(-1px)" },
      }}
    >
      <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", pb: "12px !important" }}>
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Chip
              label={notification.Type}
              color={typeColor[notification.Type]}
              size="small"
              variant={isUnread ? "filled" : "outlined"}
            />
            {isUnread && (
              <Typography variant="caption" color="primary" fontWeight={700}>
                NEW
              </Typography>
            )}
          </Box>
          <Typography
            variant="body1"
            fontWeight={isUnread ? 600 : 400}
            color={isUnread ? "text.primary" : "text.secondary"}
            sx={{ mt: 0.5 }}
          >
            {notification.Message}
          </Typography>
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>
        {isUnread && onMarkRead && (
          <Tooltip title="Mark as read">
            <IconButton size="small" onClick={() => onMarkRead(notification)} sx={{ ml: 1, mt: 0.5 }}>
              <DoneAllIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  )
}
