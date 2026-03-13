import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Settings,
  Shield,
  Users,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const userLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/services", label: "Services", icon: LayoutDashboard },
  { to: "/orders", label: "Orders", icon: ClipboardList },
  { to: "/wallet", label: "Wallet", icon: Wallet },
  { to: "/support", label: "Support", icon: LifeBuoy },
];

const adminLinks = [
  { to: "/admin", label: "Admin Panel", icon: BarChart3 },
  { to: "/admin/services", label: "Manage Services", icon: Settings },
  { to: "/admin/orders", label: "Manage Orders", icon: ClipboardList },
  { to: "/admin/wallet", label: "Fund Approvals", icon: CreditCard },
  { to: "/admin/users", label: "Manage Users", icon: Users },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { clear, identity } = useInternetIdentity();
  const { actor } = useActor();
  const navigate = useNavigate();

  useEffect(() => {
    if (actor) actor.isCallerAdmin().then(setIsAdmin);
  }, [actor]);

  const handleLogout = useCallback(() => {
    clear();
    navigate("/login");
  }, [clear, navigate]);

  return (
    <aside
      className={`smm-sidebar flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"} min-h-screen relative z-10`}
    >
      <div
        className={`p-4 flex items-center ${collapsed ? "justify-center" : "justify-between"} border-b border-blue-900/30`}
      >
        {!collapsed && (
          <div>
            <span className="text-lg font-bold text-gradient-blue">
              HR DIGITAL
            </span>
            <div className="text-xs text-blue-400/70 font-medium">
              SMM PANEL
            </div>
          </div>
        )}
        {collapsed && <Shield className="h-6 w-6 text-blue-400" />}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-lg text-blue-400 hover:bg-blue-900/30 transition-colors"
          data-ocid="sidebar.toggle"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {userLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            data-ocid={`nav.${label.toLowerCase().replace(/ /g, "_")}.link`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                  : "text-slate-400 hover:text-slate-200 hover:bg-blue-900/20"
              }`
            }
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            <div className={`pt-3 pb-1 ${collapsed ? "px-1" : "px-3"}`}>
              {!collapsed && (
                <div className="text-[10px] uppercase tracking-widest text-blue-400/50 font-semibold">
                  Admin
                </div>
              )}
              {collapsed && <div className="h-px bg-blue-900/40" />}
            </div>
            {adminLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/admin"}
                data-ocid={`nav.admin_${label.toLowerCase().replace(/ /g, "_")}.link`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      : "text-slate-400 hover:text-slate-200 hover:bg-blue-900/20"
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="p-3 border-t border-blue-900/30">
        {!collapsed && (
          <div className="mb-2 px-3 py-2">
            <div className="text-xs text-slate-400 truncate">
              {identity?.getPrincipal().toText().slice(0, 20)}...
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          data-ocid="nav.logout.button"
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
