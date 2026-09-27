import { useEffect, useState } from "react";
import { FolderKanban, Plus, X } from "lucide-react";
import { getProjects, createProject } from "../services/api";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const handleCreateProject = async () => {
    setError("");
    if (!projectName.trim()) return;

    try {
      const response = await createProject({
        name: projectName,
      });

      if (!response.success) {
        console.error(response.message);
        return;
      }

      setProjects((prev) => [response.project, ...prev]);
      setProjectName("");
      setShowModal(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <div className="min-h-screen bg-[#080D18] flex text-white">
      <SideBar />

      <main className="flex-1 p-8">
        <Header />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Projects</h1>

            <p className="text-[#94A3B8] text-sm mt-1">
              Manage your PulseMetrics projects
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#6366F1] hover:bg-[#818CF8]"
          >
            Create Project
          </button>
        </div>

        {loading ? (
          <div className="text-[#94A3B8]">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="border border-white/10 bg-[#0D1422] rounded-xl p-12 text-center">
            <FolderKanban size={42} className="mx-auto text-[#6366F1] mb-4" />

            <h2 className="text-lg font-semibold">No projects yet</h2>

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
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#6366F1]/10">
                      <FolderKanban size={20} className="text-[#6366F1]" />
                    </div>

                    <div>
                      <h3 className="font-medium">{project.name}</h3>

                      <p className="text-xs text-[#64748B] mt-1">
                        Created{" "}
                        {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 mt-5 pt-4">
                  <p className="text-sm text-[#94A3B8]">Events</p>

                  <p className="text-xl font-semibold mt-1">
                    {project._count?.events ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-[#0D1422] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Create Project</h2>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    Create a project to start tracking events.
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-[#94A3B8] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project name"
                className="w-full bg-[#080D18] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-[#6366F1]"
              />
              {error && <p className="text-sm text-red-400 mt-2">{error}</p>}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:text-white hover:bg-[#0F1726]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateProject}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#6366F1] hover:bg-[#818CF8]"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;
