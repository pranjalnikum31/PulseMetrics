import { useEffect, useState } from "react";
import { KeyRound, Plus, Copy, Check, X } from "lucide-react";
import {
  getApiKeys,
  getProjects,
  createApiKey,
  updateApiKey,
} from "../services/api";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const ApiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [newKey, setNewKey] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadData = async () => {
    try {
      const [keyData, projectData] = await Promise.all([
        getApiKeys(),
        getProjects(),
      ]);

      setKeys(Array.isArray(keyData) ? keyData : []);
      setProjects(Array.isArray(projectData) ? projectData : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const handleCreate = async () => {
    setError("");

    if (!name.trim() || !projectId) {
      setError("Enter a name and select a project.");
      return;
    }

    try {
      const result = await createApiKey({
        name: name.trim(),
        projectId,
      });

      if (!result.success) {
        setError(result.message || "Failed to create API key");
        return;
      }

      setNewKey(result.data);
      setName("");
      setProjectId("");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create API key");
    }
  };

  const handleToggle = async (key) => {
    setError("");
    setUpdatingId(key.id);

    try {
      const result = await updateApiKey(key.id, {
        isActive: !key.isActive,
      });

      if (!result.success) {
        setError(result.message || "Failed to update API key");
        return;
      }

      setKeys((prev) =>
        prev.map((item) =>
          item.id === key.id ? { ...item, isActive: !key.isActive } : item,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update API key");
    } finally {
      setUpdatingId(null);
    }
  };

  const copyValue = async (value, type) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      setError("Clipboard access failed. Copy the key manually.");
    }
  };

  return (
    <div className="min-h-screen bg-[#080D18] flex text-white">
      <SideBar />

      <main className="flex-1 min-w-0 p-8">
        <Header />

        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold">API Keys</h1>
            <p className="text-sm text-[#94A3B8] mt-1">
              Manage keys used to send events to PulseMetrics.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setError("");
              setNewKey(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#6366F1] hover:bg-[#818CF8] text-sm font-medium"
          >
            <Plus size={17} />
            Create API Key
          </button>
        </div>

        {error && !showModal && (
          <p className="text-sm text-red-400 mb-4">{error}</p>
        )}

        {loading ? (
          <p className="text-[#94A3B8]">Loading API keys...</p>
        ) : keys.length === 0 ? (
          <div className="text-center border border-white/10 bg-[#0D1422] rounded-xl p-12">
            <KeyRound size={40} className="mx-auto mb-4 text-[#6366F1]" />
            <h2 className="text-lg font-semibold">No API keys yet</h2>
            <p className="text-sm text-[#94A3B8] mt-2">
              Create a key to connect a project to PulseMetrics.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-[#0D1422] text-[#94A3B8] text-sm">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Project</th>
                  <th className="p-4 font-medium">Public Key</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Created</th>
                  <th className="p-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} className="border-t border-white/10">
                    <td className="p-4">{key.name}</td>

                    <td className="p-4 text-[#94A3B8]">
                      {key.project?.name || "Unknown"}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-xs break-all">
                          {key.publicKey}
                        </code>
                        <button
                          type="button"
                          aria-label="Copy public key"
                          onClick={() => copyValue(key.publicKey, key.id)}
                          className="text-[#94A3B8] hover:text-white"
                        >
                          {copied === key.id ? (
                            <Check size={15} />
                          ) : (
                            <Copy size={15} />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={
                          key.isActive ? "text-emerald-400" : "text-red-400"
                        }
                      >
                        {key.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-[#94A3B8]">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        disabled={updatingId === key.id}
                        onClick={() => handleToggle(key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-50 ${
                          key.isActive
                            ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                      >
                        {updatingId === key.id
                          ? "Updating..."
                          : key.isActive
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-[#0D1422] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  {newKey ? "API Key Created" : "Create API Key"}
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewKey(null);
                    setError("");
                  }}
                  aria-label="Close dialog"
                  className="text-[#94A3B8] hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {newKey ? (
                <div className="space-y-4">
                  <p className="text-sm text-emerald-400">
                    Your key was created. Copy the secret now because it won't
                    be shown in the key list.
                  </p>

                  {[
                    ["Public Key", newKey.publicKey],
                    ["Secret Key", newKey.secretKey],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <label className="block text-sm text-[#94A3B8] mb-2">
                        {label}
                      </label>

                      <div className="flex gap-2">
                        <input
                          readOnly
                          value={value || ""}
                          className="min-w-0 flex-1 bg-[#080D18] border border-white/10 rounded-lg px-3 py-2 text-xs"
                        />

                        <button
                          type="button"
                          onClick={() => copyValue(value, label)}
                          className="px-3 rounded-lg bg-[#6366F1]"
                        >
                          {copied === label ? (
                            <Check size={16} />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setNewKey(null);
                    }}
                    className="w-full py-2.5 rounded-lg bg-[#6366F1] hover:bg-[#818CF8]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#94A3B8] mb-2">
                      Key Name
                    </label>

                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Production Website"
                      className="w-full bg-[#080D18] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#6366F1]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#94A3B8] mb-2">
                      Project
                    </label>

                    <select
                      value={projectId}
                      onChange={(e) => setProjectId(e.target.value)}
                      className="w-full bg-[#080D18] border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#6366F1]"
                    >
                      <option value="">Select a project</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={!projects.length}
                    className="w-full py-2.5 rounded-lg bg-[#6366F1] hover:bg-[#818CF8] disabled:opacity-50"
                  >
                    Create Key
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ApiKeys;
