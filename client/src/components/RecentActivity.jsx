import { Activity, UserPlus, ShoppingCart, Play } from "lucide-react";

const activities = [
  {
    event: "video_played",
    project: "Netflix Web App",
    time: "2 min ago",
    icon: <Play size={15} />,
  },
  {
    event: "user_signed_up",
    project: "Marketing Site",
    time: "5 min ago",
    icon: <UserPlus size={15} />,
  },
  {
    event: "purchase",
    project: "Web Store",
    time: "8 min ago",
    icon: <ShoppingCart size={15} />,
  },
  {
    event: "page_view",
    project: "Mobile App",
    time: "12 min ago",
    icon: <Activity size={15} />,
  },
];

const RecentActivity = () => {
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

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center">
              {activity.icon}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#F8FAFC]">
                {activity.event}
              </p>

              <p className="text-xs text-[#64748B] mt-1">{activity.project}</p>
            </div>

            <span className="text-xs text-[#64748B] whitespace-nowrap">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
