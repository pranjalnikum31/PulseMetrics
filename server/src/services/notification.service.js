
const prisma = require("../config/prisma");

const getNotifications = async (companyId) => {
    return prisma.notification.findMany({
        where: { companyId },
        orderBy: { createdAt: "desc" }
    });
};

const markAsRead = async (companyId, notificationId) => {
    const result = await prisma.notification.updateMany({
        where: { id: notificationId, companyId },
        data: { isRead: true }
    });

    return result.count;
};

const markAllAsRead = async (companyId) => {
    const result = await prisma.notification.updateMany({
        where: { companyId, isRead: false },
        data: { isRead: true }
    });

    return result.count;
};

const clearReadNotifications = async (companyId) => {
    const result = await prisma.notification.deleteMany({
        where: { companyId, isRead: true }
    });

    return result.count;
};

const createNotification = async ({
    companyId,
    title,
    message,
    type = "INFO"
}) => {
    return prisma.notification.create({
        data: {
            companyId,
            title,
            message,
            type
        }
    });
};


module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
    clearReadNotifications,
    createNotification
};
