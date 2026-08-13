import React from "react";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import MetricCard from "../components/MetricCard";
import EventsChart from "../components/EventsChart";
import RecentActivity from "../components/RecentActivity";
import TopEvents from "../components/TopEvents";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#080D18] flex">
      <SideBar />
      <main className="flex-1 p-8 ">
        <Header />

        <section className="grid grid-cols-3 gap-5 mb-6">
          <MetricCard title="Total Projects" value="3" change="+12%" />

          <MetricCard title="Total Events" value="12,450" change="+18%" />

          <MetricCard title="Active API Keys" value="7" change="+5%" />
        </section>
        <section className="grid grid-cols-3 gap-5">
          <div className="col-span-2">
            <EventsChart />
          </div>

          <RecentActivity />
        </section>
        <section className="grid grid-cols-3 gap-5 mt-6">
          <div className="col-span-2">
            <TopEvents />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
