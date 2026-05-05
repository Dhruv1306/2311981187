export type NotificationType = "Placement" | "Result" | "Event"

export interface Notification {
  ID: string
  Type: NotificationType
  Message: string
  Timestamp: string
  isRead?: boolean
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  total_pages: number
}

export interface NotificationsResponse {
  notifications: Notification[]
  total: number
  page: number
  limit: number
  total_pages: number
}
