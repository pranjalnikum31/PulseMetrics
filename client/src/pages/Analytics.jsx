import { useEffect, useState } from "react";
import { getEventsByDay, getTopEvents, getRecentEvents } from "../services/api";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import EventsChart from "../components/EventsChart";
import TopEvents from "../components/TopEvents";
import RecentActivity from "../components/RecentActivity";

const Analytics = () => {
  const [days, setDays] = useState(7);
  const [chartData, setChartData] = useState([]);
  const [topEvents, setTopEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      setLoading(true);
      setError("");

      try {
        const [dailyData, topData, recentData] = await Promise.all([
          getEventsByDay(days),
          getTopEvents(days),
          getRecentEvents(days),
        ]);

        if (cancelled) return;

        setChartData(
          (Array.isArray(dailyData) ? dailyData : []).map((item) => ({
            date: item.date,
            events: Number(item.count ?? item.events ?? 0),
          }))
        );
        setTopEvents(Array.isArray(topData) ? topData : []);
        setRecentEvents(Array.isArray(recentData) ? recentData : []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err.response?.data?.message || "Failed to load analytics"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [days]);

  return (
    <div className="min-h-screen bg-[#080D18] flex text-white">
      <SideBar />

      <main className="flex-1 min-w-0 p-8">
        <Header days={days} onDaysChange={setDays} />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Analytics</h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Explore event activity across your projects.
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="analytics-range"
            className="block text-sm text-[#94A3B8] mb-2"
          >
            Reporting period
          </label>
          <select
            id="analytics-range"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-[#0F1726] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#6366F1]"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-400 mb-6">{error}</p>
        )}

        {loading ? (
          <p className="text-[#94A3B8]">Loading analytics...</p>
        ) : (
          <div className="space-y-6">
            <EventsChart data={chartData} days={days} />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <TopEvents events={topEvents} />
              <RecentActivity events={recentEvents} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;