
import { Bell, ChevronDown } from "lucide-react";

const Header = ({ days, onDaysChange }) => {
  return (
    <header className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[#F8FAFC]">
          Dashboard
        </h1>
        <p className="text-[#94A3B8] mt-1">
          Monitor your project activity and performance.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            value={days}
            onChange={(e) => onDaysChange(Number(e.target.value))}
            className="appearance-none cursor-pointer px-4 py-2.5 pr-10 rounded-lg border border-[#1E293B] bg-[#0F1726] text-sm text-[#CBD5E1] hover:bg-[#151E2E] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Analytics date range"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
          <ChevronDown
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#CBD5E1]"
          />
        </div>

        <button
          type="button"
          aria-label="Notifications"
          className="w-10 h-10 rounded-lg border border-[#1E293B] bg-[#0F1726] flex items-center justify-center hover:bg-[#151E2E]"
        >
          <Bell size={18} className="text-[#94A3B8]" />
        </button>
      </div>
    </header>
  );
};

export default Header;
