const events = [
  {
    name: "page_view",
    count: 4521,
  },
  {
    name: "user_signed_up",
    count: 1251,
  },
  {
    name: "button_clicked",
    count: 982,
  },
  {
    name: "purchase",
    count: 321,
  },
  {
    name: "video_played",
    count: 210,
  },
];


const TopEvents = () => {
   return (
    <div className="bg-[#0F1726] border border-[#1E293B] rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#F8FAFC]">
          Top Events
        </h2>

        <p className="text-sm text-[#94A3B8] mt-1">
          Most frequently recorded events
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={event.name}
            className="flex items-center gap-4"
          >
            <div className="w-7 h-7 rounded-lg bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center text-xs font-medium">
              {index + 1}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-[#F8FAFC]">
                {event.name}
              </p>

              <div className="mt-2 h-1.5 bg-[#1E293B] rounded-full">
                <div
                  className="h-full bg-[#6366F1] rounded-full"
                  style={{
                    width: `${(event.count / events[0].count) * 100}%`,
                  }}
                />
              </div>
            </div>

            <span className="text-sm text-[#CBD5E1]">
              {event.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopEvents
