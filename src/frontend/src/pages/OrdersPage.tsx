import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { type Order, OrderStatus } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20",
  processing: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
  completed: "bg-green-500/20 text-green-400 border border-green-500/20",
  cancelled: "bg-red-500/20 text-red-400 border border-red-500/20",
};

export default function OrdersPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || !identity) return;
    actor
      .getUserOrders(identity.getPrincipal())
      .then((o) => {
        setOrders(o);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor, identity]);

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Order History</h1>
        <p className="text-slate-400 text-sm mt-1">Track all your SMM orders</p>
      </div>
      <div className="smm-card p-6">
        {loading ? (
          <div
            className="flex items-center justify-center h-40"
            data-ocid="orders.loading_state"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
          </div>
        ) : orders.length === 0 ? (
          <div
            className="text-center py-16 text-slate-500"
            data-ocid="orders.empty_state"
          >
            <ClipboardList size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No orders yet</p>
            <p className="text-sm mt-1">
              Go to Services to place your first order
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto" data-ocid="orders.table">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-blue-900/30 text-left">
                  <th className="pb-3 pr-4">Order ID</th>
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 pr-4">Link</th>
                  <th className="pb-3 pr-4">Quantity</th>
                  <th className="pb-3 pr-4">Price</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900/20">
                {orders.map((order, i) => (
                  <tr
                    key={String(order.id)}
                    data-ocid={`orders.row.${i + 1}`}
                    className="hover:bg-blue-900/10 transition-colors"
                  >
                    <td className="py-3 pr-4 text-slate-300 font-mono">
                      #{String(order.id)}
                    </td>
                    <td className="py-3 pr-4 text-slate-300">
                      {String(order.serviceId)}
                    </td>
                    <td className="py-3 pr-4 text-slate-400 max-w-[160px] truncate">
                      {order.link}
                    </td>
                    <td className="py-3 pr-4 text-slate-300">
                      {String(order.quantity)}
                    </td>
                    <td className="py-3 pr-4 text-green-400 font-medium">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[order.status]}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-xs">
                      {new Date(
                        Number(order.timestamp) / 1_000_000,
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
