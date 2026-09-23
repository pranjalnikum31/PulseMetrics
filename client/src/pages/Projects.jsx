import { useEffect, useState } from "react";
import { FolderKanban, Plus } from "lucide-react";
import { getProjects } from "../services/api";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#080D18] flex text-white">
      <SideBar />

      <main className="flex-1 p-8">
        <Header />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">
              Projects
            </h1>

            <p className="text-[#94A3B8] text-sm mt-1">
              Manage your PulseMetrics projects
            </p>
          </div>

          <button className="flex items-center gap-2 bg-[#6366F1] hover:bg-[#818CF8] px-4 py-2.5 rounded-lg text-sm font-medium transition">
            <Plus size={18} />
            Create Project
          </button>
        </div>

        {loading ? (
          <div className="text-[#94A3B8]">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="border border-white/10 bg-[#0D1422] rounded-xl p-12 text-center">
            <FolderKanban
              size={42}
              className="mx-auto text-[#6366F1] mb-4"
            />

            <h2 className="text-lg font-semibold">
              No projects yet
            </h2>

            <p className="text-[#94A3B8] text-sm mt-2">
              Create your first project to start tracking events.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-[#0D1422] border border-white/10 rounded-xl p-5 hover:border-[#6366F1]/40 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#6366F1]/10">
                      <FolderKanban
                        size={20}
                        className="text-[#6366F1]"
                      />
                    </div>

                    <div>
                      <h3 className="font-medium">
                        {project.name}
                      </h3>

                      <p className="text-xs text-[#64748B] mt-1">
                        Created{" "}
                        {new Date(
                          project.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 mt-5 pt-4">
                  <p className="text-sm text-[#94A3B8]">
                    Events
                  </p>

                  <p className="text-xl font-semibold mt-1">
                    {project._count?.events ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;