import { ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Service } from "../backend";
import { useActor } from "../hooks/useActor";

const MOCK_SERVICES: Service[] = [
  {
    id: 1n,
    name: "Instagram Followers",
    category: "Instagram",
    serviceType: "Followers",
    pricePerThousand: 1.5,
    minQuantity: 100n,
    maxQuantity: 100000n,
    isActive: true,
    apiServiceId: "ig-followers",
  },
  {
    id: 2n,
    name: "Instagram Likes",
    category: "Instagram",
    serviceType: "Likes",
    pricePerThousand: 0.8,
    minQuantity: 100n,
    maxQuantity: 50000n,
    isActive: true,
    apiServiceId: "ig-likes",
  },
  {
    id: 3n,
    name: "Instagram Views",
    category: "Instagram",
    serviceType: "Views",
    pricePerThousand: 0.4,
    minQuantity: 500n,
    maxQuantity: 1000000n,
    isActive: true,
    apiServiceId: "ig-views",
  },
  {
    id: 4n,
    name: "Instagram Comments",
    category: "Instagram",
    serviceType: "Comments",
    pricePerThousand: 3.0,
    minQuantity: 10n,
    maxQuantity: 5000n,
    isActive: true,
    apiServiceId: "ig-comments",
  },
  {
    id: 5n,
    name: "YouTube Subscribers",
    category: "YouTube",
    serviceType: "Subscribers",
    pricePerThousand: 3.5,
    minQuantity: 100n,
    maxQuantity: 50000n,
    isActive: true,
    apiServiceId: "yt-subs",
  },
  {
    id: 6n,
    name: "YouTube Views",
    category: "YouTube",
    serviceType: "Views",
    pricePerThousand: 0.6,
    minQuantity: 500n,
    maxQuantity: 1000000n,
    isActive: true,
    apiServiceId: "yt-views",
  },
  {
    id: 7n,
    name: "YouTube Likes",
    category: "YouTube",
    serviceType: "Likes",
    pricePerThousand: 1.2,
    minQuantity: 100n,
    maxQuantity: 50000n,
    isActive: true,
    apiServiceId: "yt-likes",
  },
  {
    id: 8n,
    name: "YouTube Watch Time",
    category: "YouTube",
    serviceType: "Watch Time",
    pricePerThousand: 5.0,
    minQuantity: 100n,
    maxQuantity: 10000n,
    isActive: true,
    apiServiceId: "yt-watchtime",
  },
  {
    id: 9n,
    name: "Facebook Page Likes",
    category: "Facebook",
    serviceType: "Likes",
    pricePerThousand: 2.0,
    minQuantity: 100n,
    maxQuantity: 50000n,
    isActive: true,
    apiServiceId: "fb-likes",
  },
  {
    id: 10n,
    name: "Facebook Followers",
    category: "Facebook",
    serviceType: "Followers",
    pricePerThousand: 1.8,
    minQuantity: 100n,
    maxQuantity: 50000n,
    isActive: true,
    apiServiceId: "fb-followers",
  },
  {
    id: 11n,
    name: "Facebook Video Views",
    category: "Facebook",
    serviceType: "Views",
    pricePerThousand: 0.5,
    minQuantity: 500n,
    maxQuantity: 1000000n,
    isActive: true,
    apiServiceId: "fb-views",
  },
  {
    id: 12n,
    name: "TikTok Followers",
    category: "TikTok",
    serviceType: "Followers",
    pricePerThousand: 2.5,
    minQuantity: 100n,
    maxQuantity: 100000n,
    isActive: true,
    apiServiceId: "tt-followers",
  },
  {
    id: 13n,
    name: "TikTok Likes",
    category: "TikTok",
    serviceType: "Likes",
    pricePerThousand: 0.7,
    minQuantity: 100n,
    maxQuantity: 100000n,
    isActive: true,
    apiServiceId: "tt-likes",
  },
  {
    id: 14n,
    name: "TikTok Views",
    category: "TikTok",
    serviceType: "Views",
    pricePerThousand: 0.3,
    minQuantity: 500n,
    maxQuantity: 10000000n,
    isActive: true,
    apiServiceId: "tt-views",
  },
];

const CATEGORIES = ["All", "Instagram", "YouTube", "Facebook", "TikTok"];

const categoryColor: Record<string, string> = {
  Instagram:
    "from-pink-600/20 to-purple-600/20 border-pink-500/30 text-pink-300",
  YouTube: "from-red-600/20 to-red-800/20 border-red-500/30 text-red-300",
  Facebook: "from-blue-600/20 to-blue-800/20 border-blue-500/30 text-blue-300",
  TikTok:
    "from-slate-600/20 to-slate-800/20 border-slate-500/30 text-slate-300",
};

export default function ServicesPage() {
  const { actor } = useActor();
  const [services, setServices] = useState<Service[]>([]);
  const [tab, setTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [orderModal, setOrderModal] = useState<Service | null>(null);
  const [orderLink, setOrderLink] = useState("");
  const [orderQty, setOrderQty] = useState("");
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!actor) return;
    // Check admin status
    actor
      .isCallerAdmin()
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false));
    actor
      .getServices()
      .then((s) => {
        setServices(s.length > 0 ? s : MOCK_SERVICES);
        setLoading(false);
      })
      .catch(() => {
        setServices(MOCK_SERVICES);
        setLoading(false);
      });
  }, [actor]);

  const filtered =
    tab === "All" ? services : services.filter((s) => s.category === tab);
  const calcPrice = () => {
    if (!orderModal || !orderQty) return 0;
    return (Number(orderQty) / 1000) * orderModal.pricePerThousand;
  };

  const handleOrder = async () => {
    if (!actor || !orderModal || !orderLink || !orderQty) return;
    setPlacing(true);
    setError("");
    try {
      if (isAdmin) {
        // Admin gets all services completely free via dedicated endpoint
        await actor.adminPlaceOrder(orderModal.id, orderLink, BigInt(orderQty));
      } else {
        await actor.placeOrder(orderModal.id, orderLink, BigInt(orderQty));
      }
      setSuccess(true);
      setTimeout(() => {
        setOrderModal(null);
        setSuccess(false);
        setOrderLink("");
        setOrderQty("");
      }, 2000);
    } catch (_e) {
      if (isAdmin) {
        setError("Order failed. Please try again.");
      } else {
        setError("Order failed. Check your wallet balance.");
      }
    }
    setPlacing(false);
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Services</h1>
        <p className="text-slate-400 text-sm mt-1">
          {isAdmin ? (
            <span className="text-green-400 font-medium">
              Admin mode: All services are FREE
            </span>
          ) : (
            "Choose a service and grow your social media"
          )}
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap" data-ocid="services.category.tab">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            onClick={() => setTab(cat)}
            data-ocid={`services.${cat.toLowerCase()}.tab`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === cat
                ? "bg-blue-600 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]"
                : "smm-card text-slate-400 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div
          className="flex items-center justify-center h-40"
          data-ocid="services.loading_state"
        >
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="services.list"
        >
          {filtered.map((svc, i) => (
            <div
              key={String(svc.id)}
              className={`smm-card smm-card-hover p-5 bg-gradient-to-br ${categoryColor[svc.category] || ""}`}
              data-ocid={`services.item.${i + 1}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {svc.name}
                  </h3>
                  <span className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {svc.serviceType}
                  </span>
                </div>
                <div className="text-right">
                  {isAdmin ? (
                    <div className="text-green-400 font-bold text-xs">FREE</div>
                  ) : (
                    <>
                      <div className="text-green-400 font-bold">
                        ${svc.pricePerThousand.toFixed(2)}
                      </div>
                      <div className="text-xs text-slate-400">per 1000</div>
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mb-4">
                <span>Min: {String(svc.minQuantity)}</span>
                <span>Max: {String(svc.maxQuantity)}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOrderModal(svc);
                  setOrderLink("");
                  setOrderQty(String(svc.minQuantity));
                  setError("");
                  setSuccess(false);
                }}
                data-ocid={`services.order.open_modal_button.${i + 1}`}
                className="smm-btn-primary w-full text-sm py-2"
              >
                Order Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Order Modal */}
      {orderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            className="smm-card w-full max-w-md p-6 relative"
            data-ocid="services.order.dialog"
          >
            <button
              type="button"
              onClick={() => setOrderModal(null)}
              data-ocid="services.order.close_button"
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-white mb-1">
              {orderModal.name}
            </h2>
            <p className="text-slate-400 text-sm mb-5">
              {isAdmin ? (
                <span className="text-green-400 font-semibold">
                  FREE for Admin
                </span>
              ) : (
                <>
                  ${orderModal.pricePerThousand.toFixed(2)} per 1000 · Min{" "}
                  {String(orderModal.minQuantity)} · Max{" "}
                  {String(orderModal.maxQuantity)}
                </>
              )}
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="order-link"
                  className="block text-sm text-slate-300 mb-1"
                >
                  Target URL / Link
                </label>
                <input
                  id="order-link"
                  value={orderLink}
                  onChange={(e) => setOrderLink(e.target.value)}
                  placeholder="https://instagram.com/yourprofile"
                  data-ocid="services.order.link.input"
                  className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="order-qty"
                  className="block text-sm text-slate-300 mb-1"
                >
                  Quantity
                </label>
                <input
                  id="order-qty"
                  type="number"
                  value={orderQty}
                  onChange={(e) => setOrderQty(e.target.value)}
                  min={String(orderModal.minQuantity)}
                  max={String(orderModal.maxQuantity)}
                  data-ocid="services.order.quantity.input"
                  className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="bg-blue-900/20 rounded-lg p-3 flex justify-between">
                <span className="text-slate-400 text-sm">Total Price</span>
                <span className="text-green-400 font-bold">
                  {isAdmin ? "FREE" : `$${calcPrice().toFixed(2)}`}
                </span>
              </div>
              {error && (
                <p
                  className="text-red-400 text-sm"
                  data-ocid="services.order.error_state"
                >
                  {error}
                </p>
              )}
              {success && (
                <p
                  className="text-green-400 text-sm"
                  data-ocid="services.order.success_state"
                >
                  Order placed successfully!
                </p>
              )}
              <button
                type="button"
                onClick={handleOrder}
                disabled={placing || !orderLink || !orderQty}
                data-ocid="services.order.submit_button"
                className="smm-btn-primary w-full py-3 disabled:opacity-50"
              >
                {placing ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
