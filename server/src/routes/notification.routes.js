
const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/auth.middleware");
const notificationController = require("../controllers/notification.controller");

router.get("/", verifyUser, notificationController.getNotifications);
router.patch("/:id/read", verifyUser, notificationController.markAsRead);
router.patch("/read-all", verifyUser, notificationController.markAllAsRead);
router.delete("/read", verifyUser, notificationController.clearReadNotifications);

module.exports = router;
