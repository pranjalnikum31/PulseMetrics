import {
  LayoutDashboard,
  FolderKanban,
  KeyRound,
  BarChart3,
  Activity,
  Settings,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div>
      <aside>
        <h1>
          Pulse<span className="text-[#6366F1]">Metrics</span>
        </h1>
        <nav className="space-y-2">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={location.pathname === "/"}
          />
          <NavItem
            icon={<FolderKanban size={18} />}
            label="Projects"
            active={location.pathname === "/projects"}
            onClick={() => navigate("/projects")}
          />

          <NavItem icon={<KeyRound size={18} />} label="API Keys" />

          <NavItem icon={<BarChart3 size={18} />} label="Analytics" />

          <NavItem icon={<Activity size={18} />} label="Activity" />

          <NavItem icon={<Settings size={18} />} label="Settings" />
        </nav>
      </aside>
    </div>
  );
};

function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
        active
          ? "bg-[#6366F1] text-white"
          : "text-[#94A3B8] hover:bg-[#0F1726] hover:text-white"
      }`}
    >
      {icon}

      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default SideBar;
