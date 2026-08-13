import React from 'react'
import { Bell, ChevronDown } from "lucide-react";

const Header = () => {
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
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#1E293B] bg-[#0F1726] text-sm text-[#CBD5E1] hover:bg-[#151E2E]">
            Last 7 days
            <ChevronDown size={15} />
        </button>
        <button className="w-10 h-10 rounded-lg border border-[#1E293B] bg-[#0F1726] flex items-center justify-center hover:bg-[#151E2E]">
            <Bell size={18} className="text-[#94A3B8]" />
        </button>
      </div>
    </header>
  )
}

export default Header
