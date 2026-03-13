import { Clock, DollarSign, ShoppingCart, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useActor } from "../../hooks/useActor";

export default function AdminDashboardPage() {
  const { actor } = useActor();
  const [pendingFunds, setPendingFunds] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getPendingFundRequests()
      .then((r) => {
        setPendingFunds(r.length);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  const stats = [
    {
      label: "Pending Fund Requests",
      value: pendingFunds,
      icon: Clock,
      color: "yellow",
    },
    { label: "Total Revenue", value: "$--", icon: DollarSign, color: "green" },
    { label: "Total Orders", value: "--", icon: ShoppingCart, color: "blue" },
    { label: "Total Users", value: "--", icon: Users, color: "purple" },
  ];

  const colorMap: Record<string, string> = {
    yellow: "text-yellow-400 bg-yellow-600/10",
    green: "text-green-400 bg-green-600/10",
    blue: "text-blue-400 bg-blue-600/10",
    purple: "text-purple-400 bg-purple-600/10",
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Overview of your SMM Panel
        </p>
      </div>
      {loading ? (
        <div
          className="flex h-40 items-center justify-center"
          data-ocid="admin.loading_state"
        >
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="smm-stat-card"
              data-ocid={`admin.${label.toLowerCase().replace(/ /g, "_")}.card`}
            >
              <div
                className={`inline-flex p-2 rounded-lg mb-3 ${colorMap[color]}`}
              >
                <Icon size={20} />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-sm text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
