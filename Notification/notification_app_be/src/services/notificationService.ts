import { Log, getAuthToken } from "../../../logging_middleware/index.ts"

const TEST_SERVER = "http://20.207.122.201/evaluation-service/notifications"

export type NotificationType = "Placement" | "Result" | "Event"

export interface Notification {
  ID: string
  Type: NotificationType
  Message: string
  Timestamp: string
  isRead?: boolean
}

const readNotificationIds = new Set<string>()

const TYPE_WEIGHT: Record<NotificationType, number> = {
  Placement: 300,
  Result: 200,
  Event: 100,
}

function getRecencyScore(ts: string, oldest: number, newest: number): number {
  const t = new Date(ts).getTime()
  if (newest === oldest) return 100
  return Math.round(((t - oldest) / (newest - oldest)) * 100)
}

async function callTestServer(notificationType?: string): Promise<Notification[]> {
  const token = await getAuthToken()
  const all: Notification[] = []
  let page = 1
  const pageSize = 10
  const MAX_PAGES = 5

  while (page <= MAX_PAGES) {
    const url = new URL(TEST_SERVER)
    url.searchParams.set("limit", String(pageSize))
    url.searchParams.set("page", String(page))
    if (notificationType) url.searchParams.set("notification_type", notificationType)

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!res.ok) {
      await Log("backend", "error", "service", `Test server responded with ${res.status} on page ${page}`)
      break
    }

    const data = await res.json()
    const batch: Notification[] = data.notifications ?? []
    all.push(...batch)

    if (batch.length < pageSize) break
    page++
  }

  return all
}

export async function getAllNotifications(
  page: number,
  limit: number,
  notificationType?: string,
  isRead?: string
): Promise<{ notifications: Notification[]; total: number; page: number; limit: number; total_pages: number }> {
  await Log("backend", "info", "service", `Fetching notifications — page ${page}, limit ${limit}`)

  const all = await callTestServer(notificationType)

  let notifications: Notification[] = all.map((n) => ({
    ...n,
    isRead: readNotificationIds.has(n.ID),
  }))

  if (isRead === "true") notifications = notifications.filter((n) => n.isRead === true)
  else if (isRead === "false") notifications = notifications.filter((n) => n.isRead === false)

  const total = notifications.length
  const offset = (page - 1) * limit
  const paginated = notifications.slice(offset, offset + limit)

  await Log("backend", "info", "service", `Returning ${paginated.length} of ${total} total notifications`)

  return { notifications: paginated, total, page, limit, total_pages: Math.ceil(total / limit) }
}

export async function getNotificationById(id: string): Promise<Notification | null> {
  await Log("backend", "info", "service", `Fetching notification by ID: ${id}`)
  const all = await callTestServer()
  const found = all.find((n) => n.ID === id) ?? null
  if (!found) await Log("backend", "warn", "service", `Notification not found: ${id}`)
  return found ? { ...found, isRead: readNotificationIds.has(found.ID) } : null
}

export async function markAsRead(id: string): Promise<boolean> {
  await Log("backend", "info", "service", `Marking notification as read: ${id}`)
  readNotificationIds.add(id)
  return true
}

export async function markAllAsRead(): Promise<number> {
  await Log("backend", "info", "service", "Marking all notifications as read")
  const all = await callTestServer()
  const unread = all.filter((n) => !readNotificationIds.has(n.ID))
  unread.forEach((n) => readNotificationIds.add(n.ID))
  await Log("backend", "info", "service", `Marked ${unread.length} notifications as read`)
  return unread.length
}

export async function getUnreadCount(): Promise<number> {
  await Log("backend", "info", "service", "Getting unread notification count")
  const all = await callTestServer()
  const count = all.filter((n) => !readNotificationIds.has(n.ID)).length
  await Log("backend", "info", "service", `Unread count: ${count}`)
  return count
}

export async function getPriorityNotifications(limit: number): Promise<Notification[]> {
  await Log("backend", "info", "service", `Getting top ${limit} priority notifications`)
  const all = await callTestServer()

  const notifications: Notification[] = all.map((n) => ({
    ...n,
    isRead: readNotificationIds.has(n.ID),
  }))

  const timestamps = notifications.map((n) => new Date(n.Timestamp).getTime())
  const oldest = Math.min(...timestamps)
  const newest = Math.max(...timestamps)

  const scored = notifications
    .map((n) => ({
      notification: n,
      score: TYPE_WEIGHT[n.Type] + getRecencyScore(n.Timestamp, oldest, newest),
    }))
    .sort((a, b) => b.score - a.score)

  await Log("backend", "info", "service", `Returning top ${limit} priority notifications`)
  return scored.slice(0, limit).map((s) => s.notification)
}
