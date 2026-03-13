import { Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { Service } from "../../backend";
import { useActor } from "../../hooks/useActor";

const EMPTY = {
  name: "",
  category: "Instagram",
  serviceType: "",
  pricePerThousand: "",
  minQuantity: "",
  maxQuantity: "",
  apiServiceId: "",
};

const FIELDS: [string, keyof typeof EMPTY, string, string][] = [
  ["Service Name", "name", "text", "e.g. Instagram Followers"],
  ["Service Type", "serviceType", "text", "Followers / Likes / Views"],
  ["Price per 1000 ($)", "pricePerThousand", "number", "1.50"],
  ["Min Quantity", "minQuantity", "number", "100"],
  ["Max Quantity", "maxQuantity", "number", "100000"],
  ["API Service ID", "apiServiceId", "text", "supplier-id-123"],
];

export default function AdminServicesPage() {
  const { actor } = useActor();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refresh = useCallback(() => {
    if (!actor) return;
    actor
      .getServices()
      .then((s) => {
        setServices(s);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleAdd = async () => {
    if (!actor) return;
    setSaving(true);
    setError("");
    try {
      await actor.addService(
        form.name,
        form.category,
        form.serviceType,
        Number(form.pricePerThousand),
        BigInt(form.minQuantity),
        BigInt(form.maxQuantity),
        form.apiServiceId,
      );
      setShowModal(false);
      setForm({ ...EMPTY });
      refresh();
    } catch {
      setError("Failed to add service.");
    }
    setSaving(false);
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Services</h1>
          <p className="text-slate-400 text-sm mt-1">
            Add and manage SMM services
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          data-ocid="admin.services.add.open_modal_button"
          className="smm-btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Add Service
        </button>
      </div>

      <div className="smm-card p-6">
        {loading ? (
          <div
            className="flex h-40 items-center justify-center"
            data-ocid="admin.services.loading_state"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
          </div>
        ) : services.length === 0 ? (
          <div
            className="text-center py-12 text-slate-500"
            data-ocid="admin.services.empty_state"
          >
            <p>No services yet. Add your first service.</p>
          </div>
        ) : (
          <div className="overflow-x-auto" data-ocid="admin.services.table">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-blue-900/30 text-left">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Price/1k</th>
                  <th className="pb-3 pr-4">Min</th>
                  <th className="pb-3">Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-900/20">
                {services.map((s, i) => (
                  <tr
                    key={String(s.id)}
                    data-ocid={`admin.services.row.${i + 1}`}
                    className="hover:bg-blue-900/10"
                  >
                    <td className="py-3 pr-4 text-white font-medium">
                      {s.name}
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{s.category}</td>
                    <td className="py-3 pr-4 text-slate-300">
                      {s.serviceType}
                    </td>
                    <td className="py-3 pr-4 text-green-400">
                      ${s.pricePerThousand.toFixed(2)}
                    </td>
                    <td className="py-3 pr-4 text-slate-400">
                      {String(s.minQuantity)}
                    </td>
                    <td className="py-3 text-slate-400">
                      {String(s.maxQuantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="smm-card w-full max-w-md p-6 relative"
            data-ocid="admin.services.add.dialog"
          >
            <button
              type="button"
              onClick={() => setShowModal(false)}
              data-ocid="admin.services.add.close_button"
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-white mb-5">
              Add New Service
            </h2>
            <div className="space-y-3">
              {FIELDS.map(([label, key, type, placeholder]) => (
                <div key={key}>
                  <label
                    htmlFor={`svc-${key}`}
                    className="block text-sm text-slate-300 mb-1"
                  >
                    {label}
                  </label>
                  <input
                    id={`svc-${key}`}
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [key]: e.target.value }))
                    }
                    placeholder={placeholder}
                    data-ocid={`admin.services.add.${key}.input`}
                    className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="svc-category"
                  className="block text-sm text-slate-300 mb-1"
                >
                  Category
                </label>
                <select
                  id="svc-category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  data-ocid="admin.services.add.category.select"
                  className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {["Instagram", "YouTube", "Facebook", "TikTok"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              {error && (
                <p
                  className="text-red-400 text-sm"
                  data-ocid="admin.services.add.error_state"
                >
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={handleAdd}
                disabled={saving}
                data-ocid="admin.services.add.submit_button"
                className="smm-btn-primary w-full py-3 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
