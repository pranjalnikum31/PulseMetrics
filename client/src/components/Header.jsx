
import { useState } from "react";
import { Bell, ChevronDown, CheckCheck, Trash2 } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

const Header = ({ days, onDaysChange }) => {
  const [open, setOpen] = useState(false);

  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearReadNotifications,
  } = useNotifications();

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F8FAFC]">
          Dashboard
        </h1>
        <p className="text-[#94A3B8] mt-1">
          Monitor your project activity and performance.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {days !== undefined && onDaysChange && (
          <div className="relative">
            <select
              value={days}
              onChange={(e) => onDaysChange(Number(e.target.value))}
              className="appearance-none cursor-pointer px-4 py-2.5 pr-10 rounded-lg border border-[#1E293B] bg-[#0F1726] text-sm text-[#CBD5E1] hover:bg-[#151E2E] focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Analytics date range"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>

            <ChevronDown
              size={15}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#CBD5E1]"
            />
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            aria-label={`Notifications, ${unreadCount} unread`}
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
            className="relative w-10 h-10 rounded-lg border border-[#1E293B] bg-[#0F1726] flex items-center justify-center hover:bg-[#151E2E]"
          >
            <Bell size={18} className="text-[#94A3B8]" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <>
              <button
                type="button"
                aria-label="Close notifications"
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />

              <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-[#1E293B] bg-[#0D1422] shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
                  <div>
                    <h2 className="font-semibold text-white">
                      Notifications
                    </h2>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      {unreadCount} unread
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 disabled:text-[#475569] disabled:cursor-not-allowed"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-6 text-center text-sm text-[#94A3B8]">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-4 border-b border-[#1E293B] last:border-b-0 ${
                          !notification.read ? "bg-indigo-500/5" : ""
                        }`}
                      >
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                            notification.read
                              ? "bg-[#475569]"
                              : "bg-indigo-400"
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => markAsRead(notification.id)}
                          className="flex-1 min-w-0 text-left"
                        >
                          <p className="text-sm font-medium text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-[#94A3B8] mt-1">
                            {notification.message}
                          </p>
                          <p className="text-[11px] text-[#64748B] mt-2">
                            {notification.time}
                          </p>
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {notifications.some((item) => item.read) && (
                  <div className="p-3 border-t border-[#1E293B]">
                    <button
                      type="button"
                      onClick={clearReadNotifications}
                      className="flex items-center justify-center gap-2 w-full text-xs text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={14} />
                      Remove read notifications
                    </button>
                  </div>
                )}

                <div className="p-3 text-center border-t border-[#1E293B]">
                  <p className="text-[11px] text-[#64748B]">
                    Demo notifications · Not connected to live events
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
