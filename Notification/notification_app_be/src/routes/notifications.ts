import { Router } from "express"
import {
  handleGetAll,
  handleGetById,
  handleMarkAsRead,
  handleMarkAllAsRead,
  handleGetUnreadCount,
  handleGetPriority,
} from "../controllers/notificationController.ts"

const router = Router()

router.get("/", handleGetAll)
router.get("/priority", handleGetPriority)
router.get("/unread-count", handleGetUnreadCount)
router.patch("/read-all", handleMarkAllAsRead)
router.get("/:id", handleGetById)
router.patch("/:id/read", handleMarkAsRead)

export default router
