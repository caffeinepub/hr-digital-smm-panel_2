import {
  CheckCircle,
  Clock,
  LifeBuoy,
  Package,
  Plus,
  ShoppingCart,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { type Order, OrderStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function DashboardPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || !identity) return;
    Promise.all([
      actor.getBalance(),
      actor.getUserOrders(identity.getPrincipal()),
    ])
      .then(([bal, ords]) => {
        setBalance(bal);
        setOrders(ords);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, identity]);

  const stats = [
    {
      label: "Wallet Balance",
      value: `$${balance.toFixed(2)}`,
      icon: Wallet,
      color: "blue",
      iconColor: "text-blue-400",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "purple",
      iconColor: "text-purple-400",
    },
    {
      label: "Active Orders",
      value: orders.filter(
        (o) =>
          o.status === OrderStatus.processing ||
          o.status === OrderStatus.pending,
      ).length,
      icon: Clock,
      color: "yellow",
      iconColor: "text-yellow-400",
    },
    {
      label: "Completed",
      value: orders.filter((o) => o.status === OrderStatus.completed).length,
      icon: CheckCircle,
      color: "green",
      iconColor: "text-green-400",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "from-blue-600/20 to-blue-800/10 border-blue-500/20",
    purple: "from-purple-600/20 to-purple-800/10 border-purple-500/20",
    yellow: "from-yellow-600/20 to-yellow-800/10 border-yellow-500/20",
    green: "from-green-600/20 to-green-800/10 border-green-500/20",
  };

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    processing: "bg-blue-500/20 text-blue-400",
    completed: "bg-green-500/20 text-green-400",
    cancelled: "bg-red-500/20 text-red-400",
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back to HR Digital SMM Panel
        </p>
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center h-40"
          data-ocid="dashboard.loading_state"
        >
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map(({ label, value, icon: Icon, color, iconColor }) => (
              <div
                key={label}
                className={`smm-stat-card bg-gradient-to-br ${colorMap[color]}`}
                data-ocid={`dashboard.${label.toLowerCase().replace(/ /g, "_")}.card`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={"p-2 rounded-lg bg-white/5"}>
                    <Icon size={20} className={iconColor} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-sm text-slate-400 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => navigate("/wallet")}
              data-ocid="dashboard.add_funds.button"
              className="smm-card smm-card-hover p-4 flex flex-col items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Plus size={24} />
              <span className="text-sm font-medium">Add Funds</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/services")}
              data-ocid="dashboard.new_order.button"
              className="smm-card smm-card-hover p-4 flex flex-col items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <Package size={24} />
              <span className="text-sm font-medium">New Order</span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/support")}
              data-ocid="dashboard.support.button"
              className="smm-card smm-card-hover p-4 flex flex-col items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <LifeBuoy size={24} />
              <span className="text-sm font-medium">Support</span>
            </button>
          </div>

          {/* Recent orders */}
          <div className="smm-card p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Recent Orders
            </h2>
            {orders.length === 0 ? (
              <div
                className="text-center py-8 text-slate-500"
                data-ocid="dashboard.orders.empty_state"
              >
                <ShoppingCart size={40} className="mx-auto mb-2 opacity-30" />
                <p>No orders yet. Place your first order!</p>
              </div>
            ) : (
              <div
                className="overflow-x-auto"
                data-ocid="dashboard.orders.table"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-blue-900/30">
                      <th className="text-left pb-3">ID</th>
                      <th className="text-left pb-3">Link</th>
                      <th className="text-left pb-3">Qty</th>
                      <th className="text-left pb-3">Price</th>
                      <th className="text-left pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20">
                    {orders.slice(0, 5).map((order, i) => (
                      <tr
                        key={String(order.id)}
                        data-ocid={`dashboard.orders.row.${i + 1}`}
                        className="py-3 hover:bg-blue-900/10 transition-colors"
                      >
                        <td className="py-3 text-slate-300">
                          #{String(order.id)}
                        </td>
                        <td className="py-3 text-slate-400 max-w-[150px] truncate">
                          {order.link}
                        </td>
                        <td className="py-3 text-slate-300">
                          {String(order.quantity)}
                        </td>
                        <td className="py-3 text-green-400">
                          ${order.totalPrice.toFixed(2)}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
