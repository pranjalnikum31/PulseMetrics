
import './App.css'

import {
  LayoutDashboard,
  FolderKanban,
  KeyRound,
  BarChart3,
  Activity,
  Settings,
  CreditCard,
  Users,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ArrowUpRight,
  Moon,
} from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-[#080D18] text-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen border-r border-[#1E293B] bg-[#0A101D] flex flex-col">
        <div className="px-6 py-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Pulse<span className="text-[#6366F1]">Metrics</span>
          </h1>
        </div>

        {/* Company */}
        <div className="px-4 mb-6">
          <div className="border border-[#1E293B] rounded-xl p-3 flex items-center justify-between hover:bg-[#0F1726] cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#6366F1] flex items-center justify-center font-semibold">
                AC
              </div>

              <div>
                <p className="text-sm font-medium">Acme Corp</p>
                <p className="text-xs text-[#94A3B8]">Enterprise Plan</p>
              </div>
            </div>

            <ChevronDown size={16} className="text-[#94A3B8]" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active
          />

          <NavItem
            icon={<FolderKanban size={18} />}
            label="Projects"
          />

          <NavItem
            icon={<KeyRound size={18} />}
            label="API Keys"
          />

          <NavItem
            icon={<BarChart3 size={18} />}
            label="Analytics"
          />

          <NavItem
            icon={<Activity size={18} />}
            label="Activity"
          />

          <NavItem
            icon={<Settings size={18} />}
            label="Settings"
          />

          <NavItem
            icon={<CreditCard size={18} />}
            label="Billing"
          />

          <NavItem
            icon={<Users size={18} />}
            label="Team"
          />
        </nav>

        {/* Usage */}
        <div className="mt-auto px-4 mb-5">
          <div className="border border-[#1E293B] rounded-xl p-4 bg-[#0F1726]">
            <p className="text-xs text-[#94A3B8]">
              Events This Month
            </p>

            <div className="flex items-end gap-1 mt-2">
              <span className="text-xl font-bold">12.45M</span>
              <span className="text-xs text-[#94A3B8] mb-1">
                / 20M
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#1E293B] rounded-full mt-3">
              <div className="w-[62%] h-full bg-[#6366F1] rounded-full" />
            </div>

            <p className="text-xs text-[#6366F1] mt-2 text-right">
              62%
            </p>
          </div>
        </div>

        {/* User */}
        <div className="border-t border-[#1E293B] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8B5CF6] flex items-center justify-center font-semibold">
                A
              </div>

              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-[#94A3B8]">
                  admin@acme.com
                </p>
              </div>
            </div>

            <ChevronDown
              size={16}
              className="text-[#94A3B8]"
            />
          </div>
        </div>

        <div className="px-6 pb-5 text-[#94A3B8]">
          <Moon size={16} />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Dashboard
            </h2>

            <p className="text-[#94A3B8] mt-1">
              Welcome back, Admin! Here's what's happening with
              your projects.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="border border-[#1E293B] bg-[#0F1726] rounded-lg px-4 py-2 text-sm text-[#CBD5E1]">
              May 10 - May 17
              <ChevronDown
                size={15}
                className="inline ml-2"
              />
            </button>

            <button className="w-10 h-10 rounded-lg border border-[#1E293B] bg-[#0F1726] flex items-center justify-center">
              <Bell size={18} className="text-[#94A3B8]" />
            </button>
          </div>
        </header>

        {/* Metric Cards */}
        <section className="grid grid-cols-4 gap-5 mb-6">
          <MetricCard
            title="Total Events"
            value="12.4M"
            change="+18.5%"
            positive
            icon={<Activity size={20} />}
          />

          <MetricCard
            title="Active Users"
            value="45.8K"
            change="+12.4%"
            positive
            icon={<Users size={20} />}
          />

          <MetricCard
            title="Avg. Response Time"
            value="124ms"
            change="-8.2%"
            positive
            icon={<TrendingUp size={20} />}
          />

          <MetricCard
            title="Error Rate"
            value="0.04%"
            change="-35.6%"
            positive
            icon={<BarChart3 size={20} />}
          />
        </section>

        {/* Chart + Activity */}
        <section className="grid grid-cols-3 gap-5 mb-6">
          {/* Events Chart */}
          <div className="col-span-2 bg-[#0F1726] border border-[#1E293B] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">
                  Events Over Time
                </h3>

                <p className="text-xs text-[#94A3B8] mt-1">
                  Volume of events across your projects
                </p>
              </div>

              <div className="flex gap-2">
                <button className="text-xs border border-[#1E293B] rounded-lg px-3 py-2 text-[#CBD5E1]">
                  Line
                  <ChevronDown
                    size={13}
                    className="inline ml-1"
                  />
                </button>

                <button className="text-xs border border-[#1E293B] rounded-lg px-3 py-2 text-[#CBD5E1]">
                  7D
                  <ChevronDown
                    size={13}
                    className="inline ml-1"
                  />
                </button>
              </div>
            </div>

            <div className="h-64 relative">
              {/* Grid */}
              <div className="absolute inset-0 flex flex-col justify-between">
                <div className="border-t border-[#1E293B]" />
                <div className="border-t border-[#1E293B]" />
                <div className="border-t border-[#1E293B]" />
                <div className="border-t border-[#1E293B]" />
                <div className="border-t border-[#1E293B]" />
              </div>

              {/* Fake chart */}
              <svg
                viewBox="0 0 800 250"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="chartGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#6366F1"
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor="#6366F1"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M0 220
                     C60 170 90 185 140 150
                     C200 110 230 130 280 125
                     C340 115 350 50 420 45
                     C490 40 510 115 560 125
                     C620 140 640 100 690 110
                     C740 120 760 90 800 55
                     L800 250
                     L0 250 Z"
                  fill="url(#chartGradient)"
                />

                <path
                  d="M0 220
                     C60 170 90 185 140 150
                     C200 110 230 130 280 125
                     C340 115 350 50 420 45
                     C490 40 510 115 560 125
                     C620 140 640 100 690 110
                     C740 120 760 90 800 55"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="3"
                />
              </svg>

              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#64748B]">
                <span>May 10</span>
                <span>May 11</span>
                <span>May 12</span>
                <span>May 13</span>
                <span>May 14</span>
                <span>May 15</span>
                <span>May 16</span>
                <span>May 17</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#0F1726] border border-[#1E293B] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">
                Recent Activity
              </h3>

              <button className="text-xs text-[#818CF8] hover:text-[#A78BFA]">
                View all
              </button>
            </div>

            <div className="space-y-5">
              <ActivityItem
                icon={<KeyRound size={16} />}
                title="API Key Generated"
                subtitle="Production Key · Web App"
                time="2m ago"
                color="bg-[#6366F1]"
              />

              <ActivityItem
                icon={<span>✓</span>}
                title="Deployment Successful"
                subtitle="Web App · Production"
                time="15m ago"
                color="bg-[#10B981]"
              />

              <ActivityItem
                icon={<span>!</span>}
                title="Rate Limit Exceeded"
                subtitle="API Key · Mobile App"
                time="32m ago"
                color="bg-[#F59E0B]"
              />

              <ActivityItem
                icon={<Users size={16} />}
                title="New User Invited"
                subtitle="user@acme.com"
                time="1h ago"
                color="bg-[#8B5CF6]"
              />
            </div>
          </div>
        </section>

        {/* Bottom Section */}
        <section className="grid grid-cols-3 gap-5">
          {/* Top Events */}
          <div className="col-span-2 bg-[#0F1726] border border-[#1E293B] rounded-xl">
            <div className="flex items-center justify-between p-6 border-b border-[#1E293B]">
              <div>
                <h3 className="text-lg font-semibold">
                  Top Events
                </h3>

                <p className="text-xs text-[#94A3B8] mt-1">
                  Most frequently recorded events
                </p>
              </div>

              <button className="border border-[#1E293B] rounded-lg px-3 py-2 text-xs text-[#CBD5E1]">
                All Events
                <ChevronDown
                  size={13}
                  className="inline ml-1"
                />
              </button>
            </div>

            <div className="overflow-hidden">
              <table className="w-full text-sm">
                <thead className="text-xs text-[#64748B] uppercase">
                  <tr>
                    <th className="text-left px-6 py-4">
                      Event Name
                    </th>
                    <th className="text-left px-4 py-4">
                      Volume
                    </th>
                    <th className="text-left px-4 py-4">
                      Trend
                    </th>
                    <th className="text-left px-4 py-4">
                      Change
                    </th>
                    <th className="text-right px-6 py-4">
                      Last Seen
                    </th>
                  </tr>
                </thead>

                <tbody>
                  <EventRow
                    name="page_view"
                    volume="4,521,389"
                    change="+24.5%"
                    positive
                    time="1m ago"
                  />

                  <EventRow
                    name="user_signed_up"
                    volume="1,251,332"
                    change="+18.7%"
                    positive
                    time="2m ago"
                  />

                  <EventRow
                    name="button_clicked"
                    volume="982,211"
                    change="+12.3%"
                    positive
                    time="5m ago"
                  />

                  <EventRow
                    name="purchase"
                    volume="321,987"
                    change="+8.1%"
                    positive
                    time="8m ago"
                  />

                  <EventRow
                    name="file_download"
                    volume="210,987"
                    change="-3.2%"
                    positive={false}
                    time="12m ago"
                  />
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-[#1E293B] flex justify-between items-center">
              <span className="text-xs text-[#64748B]">
                Showing 5 of 24 events
              </span>

              <button className="text-xs text-[#818CF8] flex items-center gap-1">
                View All Events
                <ArrowUpRight size={13} />
              </button>
            </div>
          </div>

          {/* Projects */}
          <div className="bg-[#0F1726] border border-[#1E293B] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold">
                Projects
              </h3>

              <button className="text-xs text-[#818CF8]">
                View all
              </button>
            </div>

            <div className="space-y-4">
              <ProjectItem
                initials="WS"
                name="Web Storefront"
                events="12.45M events"
                color="bg-[#6366F1]"
              />

              <ProjectItem
                initials="MA"
                name="Mobile App"
                events="8.92M events"
                color="bg-[#8B5CF6]"
              />

              <ProjectItem
                initials="IA"
                name="Internal API"
                events="1.20M events"
                color="bg-[#F59E0B]"
              />

              <ProjectItem
                initials="MS"
                name="Marketing Site"
                events="982K events"
                color="bg-[#10B981]"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* Components */

function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
        active
          ? "bg-[#6366F1] text-white"
          : "text-[#94A3B8] hover:bg-[#0F1726] hover:text-white"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">
        {label}
      </span>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  positive,
  icon,
}) {
  return (
    <div className="bg-[#0F1726] border border-[#1E293B] rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#94A3B8]">
            {title}
          </p>

          <h3 className="text-3xl font-bold mt-3">
            {value}
          </h3>
        </div>

        <div className="w-10 h-10 rounded-lg bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="flex items-center gap-1 mt-4">
        {positive ? (
          <TrendingUp size={14} className="text-[#10B981]" />
        ) : (
          <TrendingDown size={14} className="text-[#EF4444]" />
        )}

        <span
          className={`text-xs font-medium ${
            positive
              ? "text-[#10B981]"
              : "text-[#EF4444]"
          }`}
        >
          {change}
        </span>

        <span className="text-xs text-[#64748B] ml-1">
          vs previous period
        </span>
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  subtitle,
  time,
  color,
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white shrink-0`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-2">
          <p className="text-sm font-medium truncate">
            {title}
          </p>

          <span className="text-[11px] text-[#64748B] whitespace-nowrap">
            {time}
          </span>
        </div>

        <p className="text-xs text-[#64748B] mt-1 truncate">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function EventRow({
  name,
  volume,
  change,
  positive,
  time,
}) {
  return (
    <tr className="border-t border-[#1E293B]">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
          <span className="font-medium">
            {name}
          </span>
        </div>
      </td>

      <td className="px-4 py-4 text-[#CBD5E1]">
        {volume}
      </td>

      <td className="px-4 py-4">
        <div className="flex items-end gap-1 h-6">
          {[30, 45, 35, 55, 42, 60, 50].map(
            (height, index) => (
              <div
                key={index}
                className="w-1 bg-[#6366F1] rounded-full"
                style={{ height: `${height / 2}%` }}
              />
            )
          )}
        </div>
      </td>

      <td
        className={`px-4 py-4 ${
          positive
            ? "text-[#10B981]"
            : "text-[#EF4444]"
        }`}
      >
        {positive ? "↑" : "↓"} {change}
      </td>

      <td className="px-6 py-4 text-right text-[#64748B]">
        {time}
      </td>
    </tr>
  );
}

function ProjectItem({
  initials,
  name,
  events,
  color,
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#151E2E] transition">
      <div
        className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center text-xs font-semibold`}
      >
        {initials}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">
          {name}
        </p>

        <p className="text-xs text-[#64748B] mt-1">
          {events}
        </p>
      </div>

      <MoreHorizontal
        size={17}
        className="text-[#64748B]"
      />
    </div>
  );
}

export default App;
