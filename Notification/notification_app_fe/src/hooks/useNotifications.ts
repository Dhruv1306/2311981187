import { useState, useEffect, useCallback } from "react"
import { Log } from "@middleware"
import { fetchAllNotifications, markNotificationRead, markAllRead, fetchUnreadCount } from "../api/notifications"
import type { Notification, NotificationsResponse } from "../types"

export function useNotifications(initialPage: number = 1, limit: number = 20, notificationType?: string) {
  const [data, setData] = useState<NotificationsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(initialPage)
  const [unreadCount, setUnreadCount] = useState(0)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await Log("frontend", "info", "hook", `Loading notifications — page ${page}`)
      const result = await fetchAllNotifications(page, limit, notificationType)
      setData(result)
      const count = await fetchUnreadCount()
      setUnreadCount(count)
    } catch (err: any) {
      await Log("frontend", "error", "hook", `Failed to load notifications: ${err.message}`)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [page, limit, notificationType])

  useEffect(() => {
    load()
  }, [load])

  const markRead = async (notification: Notification) => {
    await markNotificationRead(notification.ID)
    await Log("frontend", "info", "hook", `Notification ${notification.ID} marked as read`)
    load()
  }

  const markAllAsRead = async () => {
    await markAllRead()
    await Log("frontend", "info", "hook", "All notifications marked as read")
    load()
  }

  return { data, loading, error, page, setPage, unreadCount, markRead, markAllAsRead, refresh: load }
}

export function usePriorityNotifications(limit: number = 10) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      await Log("frontend", "info", "hook", `Loading priority inbox — top ${limit}`)
      const { fetchPriorityNotifications } = await import("../api/notifications")
      const result = await fetchPriorityNotifications(limit)
      setNotifications(result)
    } catch (err: any) {
      await Log("frontend", "error", "hook", `Failed to load priority notifications: ${err.message}`)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    load()
  }, [load])

  return { notifications, loading, error, refresh: load }
}
