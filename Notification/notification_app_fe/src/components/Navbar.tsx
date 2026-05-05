import { AppBar, Toolbar, Typography, Badge, IconButton, Tabs, Tab, Box } from "@mui/material"
import NotificationsIcon from "@mui/icons-material/Notifications"
import StarIcon from "@mui/icons-material/Star"
import { useNavigate, useLocation } from "react-router-dom"

interface Props {
  unreadCount: number
}

export default function Navbar({ unreadCount }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentTab = location.pathname === "/priority" ? 1 : 0

  return (
    <AppBar position="sticky" elevation={2}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
          <Typography variant="h6" fontWeight={700} sx={{ ml: 1 }}>
            CampusNotify
          </Typography>
        </Box>
        <Tabs
          value={currentTab}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{ "& .MuiTab-root": { color: "rgba(255,255,255,0.7)", "&.Mui-selected": { color: "#fff" } } }}
        >
          <Tab
            icon={<NotificationsIcon fontSize="small" />}
            iconPosition="start"
            label="All Notifications"
            onClick={() => navigate("/")}
          />
          <Tab
            icon={<StarIcon fontSize="small" />}
            iconPosition="start"
            label="Priority Inbox"
            onClick={() => navigate("/priority")}
          />
        </Tabs>
      </Toolbar>
    </AppBar>
  )
}
