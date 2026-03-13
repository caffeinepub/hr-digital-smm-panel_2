import { ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import type { Order } from "../../backend";
import { useActor } from "../../hooks/useActor";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

const statusColor: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400",
  processing: "bg-blue-500/20 text-blue-400",
  completed: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function AdminOrdersPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor || !identity) return;
    // Admin sees their own orders for now (backend limitation)
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
        <h1 className="text-2xl font-bold text-white">Manage Orders</h1>
        <p className="text-slate-400 text-sm mt-1">
          View and manage all orders
        </p>
      </div>
      <div className="smm-card p-6">
        {loading ? (
          <div
            className="flex h-40 items-center justify-center"
            data-ocid="admin.orders.loading_state"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
          </div>
        ) : orders.length === 0 ? (
          <div
            className="text-center py-12 text-slate-500"
            data-ocid="admin.orders.empty_state"
          >
            <ClipboardList size={48} className="mx-auto mb-3 opacity-30" />
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto" data-ocid="admin.orders.table">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-blue-900/30 text-left">
                  <th className="pb-3 pr-4">ID</th>
                  <th className="pb-3 pr-4">Service</th>
                  <th className="pb-3 pr-4">Link</th>
                  <th className="pb-3 pr-4">Qty</th>
                  <th className="pb-3 pr-4">Price</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900/20">
                {orders.map((o, i) => (
                  <tr
                    key={String(o.id)}
                    data-ocid={`admin.orders.row.${i + 1}`}
                    className="hover:bg-blue-900/10"
                  >
                    <td className="py-3 pr-4 text-slate-300 font-mono">
                      #{String(o.id)}
                    </td>
                    <td className="py-3 pr-4 text-slate-300">
                      {String(o.serviceId)}
                    </td>
                    <td className="py-3 pr-4 text-slate-400 max-w-[150px] truncate">
                      {o.link}
                    </td>
                    <td className="py-3 pr-4 text-slate-300">
                      {String(o.quantity)}
                    </td>
                    <td className="py-3 pr-4 text-green-400">
                      ${o.totalPrice.toFixed(2)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[o.status]}`}
                      >
                        {o.status}
                      </span>
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
