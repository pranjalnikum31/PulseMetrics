
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Building2,
  ShieldCheck,
  RefreshCw,
  LogOut,
} from "lucide-react";
import { getProfile } from "../services/api";
import SideBar from "../components/SideBar";
import Header from "../components/Header";

const Settings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      try {
        const data = await getProfile();

        if (active) {
          setProfile(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Failed to load account settings"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const user = profile?.user;
  const company = profile?.company;

  return (
    <div className="min-h-screen bg-[#080D18] flex text-white">
      <SideBar />

      <main className="flex-1 min-w-0 p-8">
        <Header />

        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Manage your account and company information.
          </p>
        </div>

        {loading ? (
          <p className="text-[#94A3B8]">Loading settings...</p>
        ) : error ? (
          <div className="max-w-3xl bg-red-500/10 border border-red-500/20 rounded-xl p-5">
            <p className="text-red-400">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mt-3 text-sm text-white"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        ) : (
          <div className="max-w-3xl space-y-6">
            <section className="bg-[#0D1422] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#6366F1]/10">
                  <UserRound
                    size={20}
                    className="text-[#818CF8]"
                  />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Account information
                  </h2>
                  <p className="text-sm text-[#94A3B8]">
                    Your authenticated account details.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#64748B] mb-1">
                    Name
                  </p>
                  <p className="text-sm">
                    {user?.name || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B] mb-1">
                    Email
                  </p>
                  <p className="text-sm">
                    {user?.email || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B] mb-1">
                    Role
                  </p>
                  <p className="text-sm">
                    {user?.role || "Not available"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-[#0D1422] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#6366F1]/10">
                  <Building2
                    size={20}
                    className="text-[#818CF8]"
                  />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Company information
                  </h2>
                  <p className="text-sm text-[#94A3B8]">
                    Your workspace details.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#64748B] mb-1">
                    Company
                  </p>
                  <p className="text-sm">
                    {company?.name || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B] mb-1">
                    Plan
                  </p>
                  <p className="text-sm">
                    {company?.plan || "Not available"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-[#64748B] mb-1">
                    Company ID
                  </p>
                  <p className="text-sm break-words">
                    {company?.id || "Not available"}
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-[#0D1422] border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#6366F1]/10">
                  <ShieldCheck
                    size={20}
                    className="text-[#818CF8]"
                  />
                </div>

                <div>
                  <h2 className="font-semibold">Security</h2>
                  <p className="text-sm text-[#94A3B8]">
                    Your account uses authenticated access.
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#94A3B8] mt-4">
                Password changes and session management are not
                configured yet.
              </p>
            </section>

            <section className="bg-[#0D1422] border border-red-500/20 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold">
                    Log out
                  </h2>
                  <p className="text-sm text-[#94A3B8] mt-1">
                    Sign out of your PulseMetrics account on this
                    device.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;
