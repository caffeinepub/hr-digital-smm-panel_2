import { CheckCircle, Wallet, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { FundRequest } from "../../backend";
import { useActor } from "../../hooks/useActor";

export default function AdminWalletPage() {
  const { actor } = useActor();
  const [requests, setRequests] = useState<FundRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const refresh = useCallback(() => {
    if (!actor) return;
    actor
      .getPendingFundRequests()
      .then((r) => {
        setRequests(r);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [actor]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleApprove = async (id: bigint) => {
    if (!actor) return;
    setProcessing(String(id));
    try {
      await actor.approveFundRequest(id);
      refresh();
    } catch {}
    setProcessing(null);
  };

  const handleReject = async (id: bigint) => {
    if (!actor) return;
    setProcessing(String(id));
    try {
      await actor.rejectFundRequest(id);
      refresh();
    } catch {}
    setProcessing(null);
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Fund Approvals</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review and approve user fund requests
        </p>
      </div>
      <div className="smm-card p-6">
        {loading ? (
          <div
            className="flex h-40 items-center justify-center"
            data-ocid="admin.wallet.loading_state"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
          </div>
        ) : requests.length === 0 ? (
          <div
            className="text-center py-12 text-slate-500"
            data-ocid="admin.wallet.empty_state"
          >
            <Wallet size={48} className="mx-auto mb-3 opacity-30" />
            <p>No pending fund requests</p>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="admin.wallet.list">
            {requests.map((r, i) => (
              <div
                key={String(r.id)}
                className="border border-blue-900/30 rounded-xl p-4 flex items-center justify-between"
                data-ocid={`admin.wallet.item.${i + 1}`}
              >
                <div>
                  <div className="text-white font-semibold">
                    ${r.amount.toFixed(2)}
                  </div>
                  <div className="text-slate-400 text-xs mt-1">
                    User: {r.userId.toText().slice(0, 20)}...
                  </div>
                  <div className="text-slate-500 text-xs">
                    Screenshot: {r.screenshotBlobId}
                  </div>
                  <div className="text-slate-500 text-xs">
                    {new Date(Number(r.timestamp) / 1_000_000).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(r.id)}
                    disabled={processing === String(r.id)}
                    data-ocid={`admin.wallet.approve.button.${i + 1}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600/20 text-green-400 border border-green-500/30 rounded-lg text-sm hover:bg-green-600/30 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={16} />
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(r.id)}
                    disabled={processing === String(r.id)}
                    data-ocid={`admin.wallet.reject.button.${i + 1}`}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-600/30 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
