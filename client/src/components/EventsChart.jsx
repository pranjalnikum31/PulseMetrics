import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const data = [
  { date: "Aug 7", events: 120 },
  { date: "Aug 8", events: 185 },
  { date: "Aug 9", events: 150 },
  { date: "Aug 10", events: 240 },
  { date: "Aug 11", events: 210 },
  { date: "Aug 12", events: 320 },
  { date: "Aug 13", events: 280 },
];

const EventsChart = () => {
  return (
    <div className="bg-[#0F1726] border border-[#1E293B] rounded-xl p-6 ">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#F8FAFC]">
          Events Over Time
        </h2>

        <p className="text-sm text-[#94A3B8] mt-1">
          Event activity over the last 7 days
        </p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748B"
              tickLine={false}
              axisLine={false}
            />
            <YAxis stroke="#64748B" tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F1726",
                border: "1px solid #1E293B",
                borderRadius: "8px",
                color: "#F8FAFC",
              }}
            />
            <Line
              type="monotone"
              dataKey="events"
              stroke="#6366F1"
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EventsChart;
