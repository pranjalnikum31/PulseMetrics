const ProjectList = ({ projects }) => {
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

      {projects.length === 0 ? (
        <p className="text-sm text-[#64748B]">
          No projects created yet.
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
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
                  {project._count?.events ?? 0} events
                </p>
              </div>

              <span className="text-xs px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981]">
                Active
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;