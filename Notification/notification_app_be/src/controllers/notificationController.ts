import { Request, Response } from "express"
import { Log } from "../../../logging_middleware/index.ts"
import {
  getAllNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  getPriorityNotifications,
} from "../services/notificationService.ts"

export async function handleGetAll(req: Request, res: Response): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 20
    const notificationType = req.query.notification_type as string | undefined
    const isRead = req.query.is_read as string | undefined

    const data = await getAllNotifications(page, limit, notificationType, isRead)
    res.json({ success: true, data })
  } catch (err: any) {
    await Log("backend", "error", "handler", `handleGetAll failed: ${err.message}`)
    res.status(500).json({ success: false, error: "Failed to fetch notifications" })
  }
}

export async function handleGetById(req: Request, res: Response): Promise<void> {
  try {
    const notification = await getNotificationById(req.params.id)
    if (!notification) {
      res.status(404).json({ success: false, error: "Notification not found" })
      return
    }
    res.json({ success: true, data: notification })
  } catch (err: any) {
    await Log("backend", "error", "handler", `handleGetById failed: ${err.message}`)
    res.status(500).json({ success: false, error: "Failed to fetch notification" })
  }
}

export async function handleMarkAsRead(req: Request, res: Response): Promise<void> {
  try {
    await markAsRead(req.params.id)
    await Log("backend", "info", "handler", `Notification ${req.params.id} marked as read`)
    res.json({ success: true, message: "Notification marked as read" })
  } catch (err: any) {
    await Log("backend", "error", "handler", `handleMarkAsRead failed: ${err.message}`)
    res.status(500).json({ success: false, error: "Failed to mark as read" })
  }
}

export async function handleMarkAllAsRead(_req: Request, res: Response): Promise<void> {
  try {
    const count = await markAllAsRead()
    res.json({ success: true, message: "All notifications marked as read", updated_count: count })
  } catch (err: any) {
    await Log("backend", "error", "handler", `handleMarkAllAsRead failed: ${err.message}`)
    res.status(500).json({ success: false, error: "Failed to mark all as read" })
  }
}

export async function handleGetUnreadCount(_req: Request, res: Response): Promise<void> {
  try {
    const count = await getUnreadCount()
    res.json({ success: true, data: { unread_count: count } })
  } catch (err: any) {
    await Log("backend", "error", "handler", `handleGetUnreadCount failed: ${err.message}`)
    res.status(500).json({ success: false, error: "Failed to get unread count" })
  }
}

export async function handleGetPriority(req: Request, res: Response): Promise<void> {
  try {
    const limit = parseInt(req.query.limit as string) || 10
    const notifications = await getPriorityNotifications(limit)
    res.json({ success: true, data: { notifications } })
  } catch (err: any) {
    await Log("backend", "error", "handler", `handleGetPriority failed: ${err.message}`)
    res.status(500).json({ success: false, error: "Failed to get priority notifications" })
  }
}
