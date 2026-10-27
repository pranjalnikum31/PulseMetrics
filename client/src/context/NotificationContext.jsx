
import { createContext, useContext, useEffect, useState } from "react";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearReadNotifications as deleteReadNotifications,
} from "../services/api";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();

        if (active) {
          setNotifications(
            data.map((item) => ({
              ...item,
              read: item.isRead,
              time: new Date(item.createdAt).toLocaleString(),
            }))
          );
        }
      } catch (error) {
        if (active) {
          console.error("Failed to fetch notifications:", error);
        }
      }
    };

    fetchNotifications();

    return () => {
      active = false;
    };
  }, []);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, read: true, isRead: true } : item
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({ ...item, read: true, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  const clearReadNotifications = async () => {
    try {
      await deleteReadNotifications();

      setNotifications((prev) => prev.filter((item) => !item.isRead));
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        markAsRead,
        markAllAsRead,
        clearReadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationProvider"
    );
  }

  return context;
};
