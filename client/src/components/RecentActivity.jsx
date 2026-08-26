const RecentActivity = ({ events }) => {
  return (
    <div className="bg-[#0F1726] border border-[#1E293B] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#F8FAFC]">
            Recent Activity
          </h2>

          <p className="text-sm text-[#94A3B8] mt-1">
            Latest events from your projects
          </p>
        </div>

        <button className="text-sm text-[#818CF8] hover:text-[#A78BFA]">
          View all
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">
          No recent activity
        </p>
      ) : (
        <div className="space-y-5">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center">
                •
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F8FAFC] truncate">
                  {event.eventName}
                </p>

                <p className="text-xs text-[#64748B] mt-1">
                  {event.project?.name}
                </p>
              </div>

              <span className="text-xs text-[#64748B] whitespace-nowrap">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;