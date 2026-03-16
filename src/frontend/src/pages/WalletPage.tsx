import { CheckCircle, Upload, Wallet } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useActor } from "../hooks/useActor";

export default function WalletPage() {
  const { actor } = useActor();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [screenshotName, setScreenshotName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [blobId, setBlobId] = useState("");

  const refresh = useCallback(() => {
    if (!actor) return;
    actor.getBalance().then(setBalance);
  }, [actor]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotName(file.name);
    setUploading(true);
    await new Promise((r) => setTimeout(r, 800));
    setBlobId(`screenshot-${Date.now()}`);
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!actor || !amount || !blobId) return;
    setSubmitting(true);
    setError("");
    try {
      await actor.requestFunds(Number(amount), blobId);
      setSuccess(true);
      setAmount("");
      setBlobId("");
      setScreenshotName("");
      refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Failed to submit. Try again.");
    }
    setSubmitting(false);
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your balance and add funds
        </p>
      </div>

      <div className="smm-stat-card max-w-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Wallet className="text-blue-400" size={22} />
          </div>
          <span className="text-slate-400 text-sm">Available Balance</span>
        </div>
        <div className="text-4xl font-bold text-white">
          ₹{balance.toFixed(2)}
        </div>
      </div>

      <div className="smm-card p-6 max-w-lg">
        <h2 className="text-lg font-semibold text-white mb-4">
          Add Funds via UPI
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="wallet-amount"
              className="block text-sm text-slate-300 mb-1"
            >
              Amount (₹)
            </label>
            <input
              id="wallet-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              data-ocid="wallet.amount.input"
              className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="border border-blue-800/40 rounded-xl p-6 bg-blue-950/20 flex flex-col items-center gap-3">
            <div className="bg-white rounded-xl p-2 shadow-lg shadow-blue-900/40">
              <img
                src="/assets/uploads/AccountQRCodeIndian-Bank-4536_LIGHT_THEME-1.png"
                alt="PhonePe UPI QR Code - Ms Rukhsana"
                width={200}
                height={200}
                className="rounded-lg object-contain"
                style={{ width: 200, height: 200 }}
              />
            </div>
            <p className="text-slate-400 text-sm text-center">
              Scan UPI QR code and pay
              <br />
              <span className="text-blue-400 font-semibold text-base tracking-wide">
                9730368351-3@axl
              </span>
            </p>
            <p className="text-slate-500 text-xs text-center">
              Ms Rukhsana · PhonePe
            </p>
          </div>

          <div>
            <p className="block text-sm text-slate-300 mb-1">
              Upload Payment Screenshot
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              data-ocid="wallet.screenshot.upload_button"
              className="w-full border-2 border-dashed border-blue-800/50 rounded-lg p-4 flex items-center justify-center gap-2 text-slate-400 hover:border-blue-500 hover:text-blue-400 transition-colors"
            >
              {uploading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 rounded-full" />
                  Uploading...
                </>
              ) : screenshotName ? (
                <>
                  <CheckCircle size={18} className="text-green-400" />
                  <span className="text-green-400 text-sm">
                    {screenshotName}
                  </span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span className="text-sm">Click to upload screenshot</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <p
              className="text-red-400 text-sm"
              data-ocid="wallet.submit.error_state"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="text-green-400 text-sm"
              data-ocid="wallet.submit.success_state"
            >
              Fund request submitted! Admin will approve shortly.
            </p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting || !amount || !blobId}
            data-ocid="wallet.submit_button"
            className="smm-btn-primary w-full py-3 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit for Approval"}
          </button>
        </div>
      </div>
    </div>
  );
}
