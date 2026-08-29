import React from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import MetricCard from "../components/MetricCard";
import EventsChart from "../components/EventsChart";
import RecentActivity from "../components/RecentActivity";
import TopEvents from "../components/TopEvents";
import ProjectList from "../components/ProjectList";
import { useEffect, useState } from "react";
import {
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

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [overviewData, topEventsData, recentEventsData, eventsByDayData, projectsData] =
          await Promise.all([
            getOverview(),
            getTopEvents(),
            getRecentEvents(),
            getEventsByDay(),
            getProjects(),
          ]);

        setTopEvents(topEventsData);
        setOverview(overviewData);
        setRecentEvents(recentEventsData);
        setEventsByDay(eventsByDayData);
        setProjects(projectsData);      
      } catch (error) {
        console.error("Failed to fetch overview:", error);
      }
    };
    fetchOverview();
  }, []);
  const chartData  = eventsByDay.map((item) => ({
    date: item.date,
    events: item.count,
  }));

  return (
    <div className="min-h-screen bg-[#080D18] flex">
      <SideBar />
      <main className="flex-1 p-8 ">
        <Header />

        <section className="grid grid-cols-3 gap-5 mb-6">
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
