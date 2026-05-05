import { Log } from "@middleware"
import type { Notification, NotificationsResponse } from "../types"

const API_BASE = "http://localhost:5000/api/v1"

export async function fetchAllNotifications(
  page: number = 1,
  limit: number = 20,
  notificationType?: string,
  isRead?: boolean
): Promise<NotificationsResponse> {
  await Log("frontend", "info", "api", `Fetching all notifications — page ${page}, type ${notificationType ?? "all"}`)

  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (notificationType) params.set("notification_type", notificationType)
  if (isRead !== undefined) params.set("is_read", String(isRead))

  const res = await fetch(`${API_BASE}/notifications?${params}`)
  const json = await res.json()

  if (!res.ok) {
    await Log("frontend", "error", "api", `fetchAllNotifications failed: ${json.error}`)
    throw new Error(json.error)
  }

  return json.data
}

export async function fetchPriorityNotifications(limit: number = 10): Promise<Notification[]> {
  await Log("frontend", "info", "api", `Fetching top ${limit} priority notifications`)

  const res = await fetch(`${API_BASE}/notifications/priority?limit=${limit}`)
  const json = await res.json()

  if (!res.ok) {
    await Log("frontend", "error", "api", `fetchPriorityNotifications failed: ${json.error}`)
    throw new Error(json.error)
  }

  return json.data.notifications
}

export async function fetchUnreadCount(): Promise<number> {
  const res = await fetch(`${API_BASE}/notifications/unread-count`)
  const json = await res.json()
  return json.data.unread_count
}

export async function markNotificationRead(id: string): Promise<void> {
  await Log("frontend", "info", "api", `Marking notification ${id} as read`)
  await fetch(`${API_BASE}/notifications/${id}/read`, { method: "PATCH" })
}

export async function markAllRead(): Promise<void> {
  await Log("frontend", "info", "api", "Marking all notifications as read")
  await fetch(`${API_BASE}/notifications/read-all`, { method: "PATCH" })
}
