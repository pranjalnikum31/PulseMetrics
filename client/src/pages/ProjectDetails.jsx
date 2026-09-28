import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getProjectById,
  getApiKeys,
  createApiKey,
  getProjectAnalytics,
} from "../services/api";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import { X } from "lucide-react";

const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(text);
};

const ProjectDetails = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [createdKey, setCreatedKey] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await getProjectById(id);
        const keys = await getApiKeys();
        const analyticsData = await getProjectAnalytics(id);
        setAnalytics(analyticsData);

        setProject(data);
        setApiKeys(keys);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleCreateApiKey = async () => {
    if (!keyName.trim()) return;

    try {
      const response = await createApiKey({
        name: keyName,
        projectId: id,
      });

      if (!response.success) {
        console.error(response.message);
        return;
      }

      setApiKeys((prev) => [response.data, ...prev]);
      setCreatedKey(response.data);
      setKeyName("");
      setShowKeyModal(false);
    } catch (error) {
      console.error("Failed to create API key:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#080D18] flex text-white">
      <SideBar />

      <main className="flex-1 p-8">
        <Header />

        {loading ? (
          <div className="text-[#94A3B8]">Loading project...</div>
        ) : !project ? (
          <div className="text-red-400">Project not found</div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">{project.name}</h1>

            <p className="text-[#94A3B8] text-sm mt-1">
              Project details and analytics
            </p>

            <div className="grid grid-cols-3 gap-5 mt-8">
              <div className="bg-[#0D1422] border border-white/10 rounded-xl p-5">
                <p className="text-sm text-[#94A3B8]">Project ID</p>

                <p className="text-sm mt-2 break-all">{project.id}</p>
              </div>

              <div className="bg-[#0D1422] border border-white/10 rounded-xl p-5">
                <p className="text-sm text-[#94A3B8]">Created</p>

                <p className="text-sm mt-2">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-[#0D1422] border border-white/10 rounded-xl p-5">
                <p className="text-sm text-[#94A3B8]">Project</p>

                <p className="text-sm mt-2">{project.name}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5 mt-8">
              <div className="bg-[#0D1422] border border-white/10 rounded-xl p-5">
                <p className="text-sm text-[#94A3B8]">Total Events</p>

                <p className="text-2xl font-semibold mt-2">
                  {analytics?.totalEvents ?? 0}
                </p>
              </div>
            </div>
            <div className="mt-6 bg-[#0D1422] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold">Top Events</h2>

              <div className="mt-4 space-y-3">
                {analytics?.topEvents?.length === 0 ? (
                  <p className="text-sm text-[#94A3B8]">
                    No events recorded yet.
                  </p>
                ) : (
                  analytics?.topEvents?.map((event) => (
                    <div
                      key={event.eventName}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm">{event.eventName}</span>

                      <span className="text-sm text-[#94A3B8]">
                        {event.count}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="mt-6 bg-[#0D1422] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold">Recent Events</h2>

              <div className="mt-4 space-y-3">
                {analytics?.recentEvents?.length === 0 ? (
                  <p className="text-sm text-[#94A3B8]">
                    No events recorded yet.
                  </p>
                ) : (
                  analytics?.recentEvents?.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm">{event.eventName}</p>

                        <p className="text-xs text-[#94A3B8] mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">API Keys</h2>

                  <p className="text-sm text-[#94A3B8] mt-1">
                    Manage keys used to send events to this project.
                  </p>
                </div>

                <button
                  onClick={() => setShowKeyModal(true)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#6366F1] hover:bg-[#818CF8]"
                >
                  Create API Key
                </button>
              </div>

              {apiKeys.filter((key) => key.project?.id === id).length === 0 ? (
                <div className="bg-[#0D1422] border border-white/10 rounded-xl p-8 text-center">
                  <p className="text-[#94A3B8] text-sm">
                    No API keys for this project yet.
                  </p>
                </div>
              ) : (
                <div className="bg-[#0D1422] border border-white/10 rounded-xl overflow-hidden">
                  {apiKeys
                    .filter((key) => key.project?.id === id)
                    .map((key) => (
                      <div
                        key={key.id}
                        className="flex items-center justify-between p-5 border-b border-white/10 last:border-b-0"
                      >
                        <div>
                          <h3 className="font-medium">{key.name}</h3>

                          <p className="text-sm text-[#94A3B8] mt-1">
                            {key.publicKey}
                          </p>
                        </div>

                        <span
                          className={`text-xs px-2.5 py-1 rounded-full ${
                            key.isActive
                              ? "bg-green-500/10 text-green-400"
                              : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {key.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </>
        )}

        {showKeyModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-[#0D1422] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Create API Key</h2>

                  <p className="text-sm text-[#94A3B8] mt-1">
                    Create a key for this project.
                  </p>
                </div>

                <button
                  onClick={() => setShowKeyModal(false)}
                  className="text-[#94A3B8] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <input
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="API key name"
                className="w-full bg-[#080D18] border border-white/10 rounded-lg px-4 py-3 text-sm text-white outline-none placeholder:text-[#475569] focus:border-[#6366F1]"
              />

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:text-white hover:bg-[#0F1726]"
                >
                  Cancel
                </button>

                <button
                  onClick={handleCreateApiKey}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#6366F1] hover:bg-[#818CF8]"
                >
                  Create API Key
                </button>
              </div>
            </div>
          </div>
        )}
        {createdKey && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="w-full max-w-md bg-[#0D1422] border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold">API Key Created</h2>

              <p className="text-sm text-[#94A3B8] mt-2">
                Save your secret key now. You won't be able to view it again.
              </p>

              <div className="mt-6">
                <p className="text-xs text-[#94A3B8] mb-2">Public Key</p>

                <div className="flex items-center gap-2 bg-[#080D18] border border-white/10 rounded-lg px-4 py-3">
                  <span className="text-sm break-all flex-1">
                    {createdKey.publicKey}
                  </span>

                  <button
                    onClick={() => copyToClipboard(createdKey.publicKey)}
                    className="text-xs text-[#6366F1] hover:text-[#818CF8]"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-[#94A3B8] mb-2">Secret Key</p>

                <div className="flex items-center gap-2 bg-[#080D18] border border-white/10 rounded-lg px-4 py-3">
                  <span className="text-sm break-all flex-1 text-red-300">
                    {createdKey.secretKey}
                  </span>

                  <button
                    onClick={() => copyToClipboard(createdKey.secretKey)}
                    className="text-xs text-[#6366F1] hover:text-[#818CF8]"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setCreatedKey(null)}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium bg-[#6366F1] hover:bg-[#818CF8]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">SDK Setup</h2>
            <p className="text-sm text-[#94A3B8] mt-1">
              Connect your application to PulseMetrics.
            </p>
          </div>

          <div className="bg-[#0D1422] border border-white/10 rounded-xl p-6">
            <div>
              <p className="text-sm font-medium mb-2">1. Install the SDK</p>

              <div className="bg-[#080D18] border border-white/10 rounded-lg px-4 py-3">
                <code className="text-sm text-[#94A3B8]">
                  npm install pulsemetrics
                </code>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium mb-2">
                2. Initialize PulseMetrics
              </p>

              <div className="bg-[#080D18] border border-white/10 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-[#94A3B8]">
                  {`PulseMetrics.init({
  apiKey: "${apiKeys.find((key) => key.project?.id === id)?.publicKey || "pk_live_..."}",
  baseUrl: "http://localhost:3000"
})`}
                </pre>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-medium mb-2">3. Track an event</p>

              <div className="bg-[#080D18] border border-white/10 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-[#94A3B8]">
                  {`PulseMetrics.track("signup", {
  plan: "pro"
})`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
