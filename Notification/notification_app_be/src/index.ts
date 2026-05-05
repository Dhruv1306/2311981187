import express from "express"
import cors from "cors"
import { Log } from "../../logging_middleware/index.ts"
import notificationRoutes from "./routes/notifications.ts"

const app = express()
const PORT = 5000

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

app.use(async (req, _res, next) => {
  await Log("backend", "info", "middleware", `${req.method} ${req.originalUrl}`)
  next()
})

app.use("/api/v1/notifications", notificationRoutes)

app.get("/health", (_req, res) => {
  res.json({ status: "ok" })
})

app.listen(PORT, async () => {
  await Log("backend", "info", "config", `Express server running on port ${PORT}`)
  console.log(`Server running on http://localhost:${PORT}`)
})
