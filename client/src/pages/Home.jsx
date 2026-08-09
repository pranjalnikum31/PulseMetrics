import React from "react";
import SideBar from "../components/SideBar";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#080D18] flex">
      <SideBar />
      <main className="flex-1 p-8 text-white">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </main>
    </div>
  );
};

export default Home;
