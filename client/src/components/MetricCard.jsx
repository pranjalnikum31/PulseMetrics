import React from 'react'

function MetricCard({ title, value, change }) {
  return (
    <div className="bg-[#0F1726] border border-[#1E293B] rounded-xl p-5">
      <p className="text-sm text-[#94A3B8]">
        {title}
      </p>

      <div className="flex items-end justify-between mt-3">
        <h2 className="text-3xl font-bold text-[#F8FAFC]">
          {value}
        </h2>

        <span className="text-sm text-[#10B981]">
          {change}
        </span>
      </div>
    </div>
  );
}

export default MetricCard;
