const projects = [
  {
    name: "Netflix Web App",
    events: "12,450 events",
    status: "Active",
  },
  {
    name: "Mobile App",
    events: "8,920 events",
    status: "Active",
  },
  {
    name: "Marketing Website",
    events: "5,240 events",
    status: "Active",
  },
  {
    name: "Internal API",
    events: "1,820 events",
    status: "Active",
  },
];


const ProjectList = () => {
  return (
    <div className="bg-[#0F1726] border border-[#1E293B] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#F8FAFC]">
            Projects
          </h2>

          <p className="text-sm text-[#94A3B8] mt-1">
            Your PulseMetrics projects
          </p>
        </div>

        <button className="text-sm text-[#818CF8] hover:text-[#A78BFA]">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.name}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#151E2E]"
          >
            <div className="w-10 h-10 rounded-lg bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center font-semibold">
              {project.name.charAt(0)}
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-[#F8FAFC]">
                {project.name}
              </p>

              <p className="text-xs text-[#64748B] mt-1">
                {project.events}
              </p>
            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981]">
              {project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default ProjectList
