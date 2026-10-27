
const notificationService = require("../services/notification.service");

const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationService.getNotifications(req.user.companyId);
        res.json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
};

const markAsRead = async (req, res) => {
    try {
        const count = await notificationService.markAsRead(req.user.companyId, req.params.id);

        if (!count) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update notification" });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const count = await notificationService.markAllAsRead(req.user.companyId);
        res.json({ success: true, updated: count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update notifications" });
    }
};

const clearReadNotifications = async (req, res) => {
    try {
        const count = await notificationService.clearReadNotifications(req.user.companyId);
        res.json({ success: true, deleted: count });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to clear notifications" });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearReadNotifications
};
