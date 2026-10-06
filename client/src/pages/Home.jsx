import SideBar from "../components/SideBar";
import Header from "../components/Header";
import MetricCard from "../components/MetricCard";
import EventsChart from "../components/EventsChart";
import RecentActivity from "../components/RecentActivity";
import TopEvents from "../components/TopEvents";
import ProjectList from "../components/ProjectList";
import { useEffect, useState } from "react";
import {
  getUsage,
  getOverview,
  getTopEvents,
  getRecentEvents,
  getEventsByDay,
  getProjects,
} from "../services/api";

const Home = () => {
  const [overview, setOverview] = useState(null);
  const [topEvents, setTopEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [eventsByDay, setEventsByDay] = useState([]);
  const [projects, setProjects] = useState([]);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [
          overviewData,
          topEventsData,
          recentEventsData,
          eventsByDayData,
          projectsData,
          usageData,
        ] = await Promise.all([
          getOverview(),
          getTopEvents(),
          getRecentEvents(),
          getEventsByDay(),
          getProjects(),
          getUsage(),
        ]);

        setOverview(overviewData);
        setTopEvents(topEventsData);
        setRecentEvents(recentEventsData);
        setEventsByDay(eventsByDayData);
        setProjects(projectsData);
        setUsage(usageData);
      } catch (error) {
        console.error("Failed to fetch overview:", error);
      }
    };

    fetchOverview();
  }, []);

  const chartData = eventsByDay.map((item) => ({
    date: item.date,
    events: item.count,
  }));

  return (
    <div className="min-h-screen bg-[#080D18] flex">
      <SideBar />

      <main className="flex-1 p-8">
        <Header />

        <section className="grid grid-cols-4 gap-5 mb-6">
          <MetricCard
            title="Total Projects"
            value={overview?.totalProjects ?? 0}
            change="+12%"
          />

          <MetricCard
            title="Total Events"
            value={overview?.totalEvents ?? 0}
            change="+18%"
          />

          <MetricCard
            title="Active API Keys"
            value={overview?.activeApiKeys ?? 0}
            change="+5%"
          />

          {usage && (
            <div className="bg-[#111827] border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">
                  Monthly Usage
                </h3>

                <span className="text-xs font-medium px-2 py-1 rounded-md bg-blue-500/10 text-blue-400">
                  {usage.plan}
                </span>
              </div>

              <div className="flex items-end justify-between mb-3">
                <span className="text-2xl font-bold text-white">
                  {usage.usage.toLocaleString()}
                </span>

                <span className="text-xs text-gray-500">
                  / {usage.limit.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    usage.percentage >= 100
                      ? "bg-red-500"
                      : usage.percentage >= 80
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${usage.percentage}%` }}
                />
              </div>

              <p
                className={`text-xs mt-2 ${
                  usage.percentage >= 100
                    ? "text-red-400"
                    : usage.percentage >= 80
                      ? "text-yellow-400"
                      : "text-gray-500"
                }`}
              >
                {usage.percentage >= 100
                  ? "Monthly event limit reached"
                  : `${usage.remaining.toLocaleString()} events remaining`}
              </p>
            </div>
          )}
        </section>

        <section className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <EventsChart data={chartData} />
          </div>

          <RecentActivity events={recentEvents} />
        </section>

        <section className="grid grid-cols-3 gap-5 mt-6">
          <div className="col-span-2">
            <TopEvents events={topEvents} />
          </div>

          <ProjectList projects={projects} />
        </section>
      </main>
    </div>
  );
};

export default Home;
