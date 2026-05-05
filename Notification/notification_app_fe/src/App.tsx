import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material"
import { useNotifications } from "./hooks/useNotifications"
import Navbar from "./components/Navbar"
import AllNotifications from "./pages/AllNotifications"
import PriorityInbox from "./pages/PriorityInbox"

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#f57c00" },
    background: { default: "#f5f5f5" },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
  shape: { borderRadius: 8 },
})

function AppShell() {
  const { unreadCount } = useNotifications(1, 1)

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar unreadCount={unreadCount} />
      <Box component="main" sx={{ pt: 2 }}>
        <Routes>
          <Route path="/" element={<AllNotifications />} />
          <Route path="/priority" element={<PriorityInbox />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  )
}
