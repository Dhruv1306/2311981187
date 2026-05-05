import { Log, getAuthToken } from "../logging_middleware/index.ts"

const NOTIFICATION_API = "http://20.207.122.201/evaluation-service/notifications"

type NotificationType = "Placement" | "Result" | "Event"

interface Notification {
  ID: string
  Type: NotificationType
  Message: string
  Timestamp: string
}

interface ApiResponse {
  notifications: Notification[]
}

const TYPE_WEIGHT: Record<NotificationType, number> = {
  Placement: 300,
  Result: 200,
  Event: 100,
}

function getRecencyScore(timestamp: string, oldest: number, newest: number): number {
  const ts = new Date(timestamp).getTime()
  if (newest === oldest) return 100
  return Math.round(((ts - oldest) / (newest - oldest)) * 100)
}

async function fetchNotifications(): Promise<Notification[]> {
  await Log("backend", "info", "service", "Fetching notifications from test server API")

  const token = await getAuthToken()
  const res = await fetch(NOTIFICATION_API, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    await Log("backend", "error", "service", `Notification API returned status ${res.status}`)
    throw new Error(`API error: ${res.status}`)
  }

  const data: ApiResponse = await res.json()
  await Log("backend", "info", "service", `Fetched ${data.notifications.length} notifications from API`)
  return data.notifications
}

function rankNotifications(notifications: Notification[]): Notification[] {
  const timestamps = notifications.map((n) => new Date(n.Timestamp).getTime())
  const oldest = Math.min(...timestamps)
  const newest = Math.max(...timestamps)

  const scored = notifications.map((n) => ({
    notification: n,
    score: TYPE_WEIGHT[n.Type] + getRecencyScore(n.Timestamp, oldest, newest),
  }))

  scored.sort((a, b) => b.score - a.score)
  return scored.map((s) => s.notification)
}

async function getTopNotifications(limit: number = 10): Promise<void> {
  await Log("backend", "info", "handler", `Priority inbox requested — top ${limit} notifications`)

  const all = await fetchNotifications()
  const ranked = rankNotifications(all)
  const top = ranked.slice(0, limit)

  await Log("backend", "info", "handler", `Returning top ${top.length} priority notifications`)

  console.log(`\n========== TOP ${limit} PRIORITY NOTIFICATIONS ==========\n`)
  top.forEach((n, i) => {
    const weight = TYPE_WEIGHT[n.Type]
    const ts = new Date(n.Timestamp).getTime()
    const oldest = Math.min(...all.map((x) => new Date(x.Timestamp).getTime()))
    const newest = Math.max(...all.map((x) => new Date(x.Timestamp).getTime()))
    const recency = getRecencyScore(n.Timestamp, oldest, newest)
    console.log(`${i + 1}. [${n.Type}] ${n.Message}`)
    console.log(`   Timestamp : ${n.Timestamp}`)
    console.log(`   Score     : ${weight} (type) + ${recency} (recency) = ${weight + recency}`)
    console.log(`   ID        : ${n.ID}\n`)
  })
}

getTopNotifications(10).catch(async (err) => {
  await Log("backend", "fatal", "handler", `Priority inbox failed: ${err.message}`)
  console.error("Failed to get priority notifications:", err.message)
  process.exit(1)
})
