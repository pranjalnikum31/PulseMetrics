import { useCallback, useEffect, useState } from "react";
import { Activity as ActivityIcon, RefreshCw } from "lucide-react";
import { getRecentEvents } from "../services/api";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const Activity = () => {
  const [days, setDays] = useState(7);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadEvents = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const data = await getRecentEvents(days);
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load activity");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [days],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadEvents();
    }, 0);

    return () => clearTimeout(timer);
  }, [loadEvents]);

  return (
    <div className="min-h-screen bg-[#080D18] flex text-white">
      <SideBar />

      <main className="flex-1 min-w-0 p-8">
        <Header days={days} onDaysChange={setDays} />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Activity</h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              Recent events across your projects.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadEvents(true)}
            disabled={loading || refreshing}
            className="flex items-center gap-2 rounded-lg border border-[#1E293B] px-3 py-2 text-sm text-[#CBD5E1] hover:bg-[#0F1726] disabled:opacity-50"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mb-6">
          <label
            htmlFor="activity-range"
            className="block text-sm text-[#94A3B8] mb-2"
          >
            Reporting period
          </label>

          <select
            id="activity-range"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-[#0F1726] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white outline-none focus:border-[#6366F1]"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {error && <p className="text-sm text-red-400 mb-5">{error}</p>}

        <div className="bg-[#0F1726] border border-[#1E293B] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-[#6366F1]/15 text-[#818CF8]">
              <ActivityIcon size={20} />
            </div>

            <div>
              <h2 className="font-semibold">Event history</h2>
              <p className="text-sm text-[#94A3B8]">
                Latest {events.length} event{events.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-[#94A3B8]">Loading activity...</p>
          ) : events.length === 0 ? (
            <div className="text-center py-10">
              <ActivityIcon size={34} className="mx-auto mb-3 text-[#64748B]" />
              <p className="font-medium">No activity found</p>
              <p className="text-sm text-[#94A3B8] mt-1">
                No events were recorded during this period.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#1E293B]">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-1 w-2 h-2 rounded-full bg-[#818CF8] shrink-0" />

                    <div className="min-w-0">
                      <p className="font-medium break-words">
                        {event.eventName}
                      </p>
                      <p className="text-sm text-[#94A3B8] mt-1">
                        Project: {event.project || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs text-[#64748B] sm:text-right shrink-0">
                    <p>{new Date(event.timestamp).toLocaleDateString()}</p>
                    <p className="mt-1">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Activity;
