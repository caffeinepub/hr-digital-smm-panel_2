import { ArrowRightLeft, IndianRupee, Shield, Users } from "lucide-react";
import { useState } from "react";
import { UserRole } from "../../backend";
import { useActor } from "../../hooks/useActor";

export default function AdminUsersPage() {
  const { actor } = useActor();

  // Assign role state
  const [principalInput, setPrincipalInput] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Add balance state
  const [addingBalance, setAddingBalance] = useState(false);
  const [addBalanceSuccess, setAddBalanceSuccess] = useState("");
  const [addBalanceError, setAddBalanceError] = useState("");

  // Transfer balance state
  const [transferPrincipal, setTransferPrincipal] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferring, setTransferring] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState("");
  const [transferError, setTransferError] = useState("");

  const handleAssign = async (role: UserRole) => {
    if (!actor || !principalInput) return;
    setAssigning(true);
    setError("");
    setSuccess("");
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      const p = Principal.fromText(principalInput);
      await actor.assignCallerUserRole(p, role);
      setSuccess(
        `Role '${role}' assigned to ${principalInput.slice(0, 20)}...`,
      );
      setPrincipalInput("");
    } catch {
      setError("Failed. Check the Principal ID.");
    }
    setAssigning(false);
  };

  const handleAddBalance = async () => {
    if (!actor) return;
    setAddingBalance(true);
    setAddBalanceError("");
    setAddBalanceSuccess("");
    try {
      await (actor as any).adminAddBalance(100000000);
      setAddBalanceSuccess("✅ ₹100 Crore added to your wallet successfully!");
      setTimeout(() => setAddBalanceSuccess(""), 5000);
    } catch {
      setAddBalanceError("Failed to add balance. Try again.");
    }
    setAddingBalance(false);
  };

  const handleTransfer = async () => {
    if (!actor || !transferPrincipal || !transferAmount) return;
    setTransferring(true);
    setTransferError("");
    setTransferSuccess("");
    try {
      const { Principal } = await import("@icp-sdk/core/principal");
      const p = Principal.fromText(transferPrincipal);
      await (actor as any).transferBalance(p, Number(transferAmount));
      setTransferSuccess(
        `✅ ₹${Number(transferAmount).toLocaleString("en-IN")} transferred to ${transferPrincipal.slice(0, 20)}...`,
      );
      setTransferPrincipal("");
      setTransferAmount("");
      setTimeout(() => setTransferSuccess(""), 5000);
    } catch {
      setTransferError("Transfer failed. Check Principal ID and balance.");
    }
    setTransferring(false);
  };

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        <p className="text-slate-400 text-sm mt-1">Assign roles to users</p>
      </div>

      {/* Assign Role Card */}
      <div className="smm-card p-6 max-w-lg">
        <h2 className="text-lg font-semibold text-white mb-4">Assign Role</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="user-principal"
              className="block text-sm text-slate-300 mb-1"
            >
              User Principal ID
            </label>
            <input
              id="user-principal"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              placeholder="xxxxx-xxxxx-xxxxx-xxxxx-cai"
              data-ocid="admin.users.principal.input"
              className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          {error && (
            <p
              className="text-red-400 text-sm"
              data-ocid="admin.users.error_state"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="text-green-400 text-sm"
              data-ocid="admin.users.success_state"
            >
              {success}
            </p>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => handleAssign(UserRole.admin)}
              disabled={assigning || !principalInput}
              data-ocid="admin.users.assign_admin.button"
              className="flex items-center gap-2 px-5 py-2.5 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm hover:bg-purple-600/30 transition-colors disabled:opacity-50"
            >
              <Shield size={16} />
              Make Admin
            </button>
            <button
              type="button"
              onClick={() => handleAssign(UserRole.user)}
              disabled={assigning || !principalInput}
              data-ocid="admin.users.assign_user.button"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm hover:bg-blue-600/30 transition-colors disabled:opacity-50"
            >
              <Users size={16} />
              Make User
            </button>
          </div>
        </div>
      </div>

      {/* Add Balance to My Wallet */}
      <div className="smm-card p-6 max-w-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-600/20 rounded-lg">
            <IndianRupee className="text-green-400" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Add Balance to My Wallet
          </h2>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Add ₹100 Crore (10,00,00,000) instantly to your admin wallet.
        </p>
        {addBalanceError && (
          <p
            className="text-red-400 text-sm mb-3"
            data-ocid="admin.users.add_balance.error_state"
          >
            {addBalanceError}
          </p>
        )}
        {addBalanceSuccess && (
          <p
            className="text-green-400 text-sm mb-3"
            data-ocid="admin.users.add_balance.success_state"
          >
            {addBalanceSuccess}
          </p>
        )}
        <button
          type="button"
          onClick={handleAddBalance}
          disabled={addingBalance}
          data-ocid="admin.users.add_balance.button"
          className="flex items-center gap-2 px-6 py-3 bg-green-600/20 text-green-400 border border-green-500/40 rounded-lg text-sm font-semibold hover:bg-green-600/30 transition-colors disabled:opacity-50"
        >
          <IndianRupee size={16} />
          {addingBalance ? "Adding..." : "Add ₹100 Crore to My Wallet"}
        </button>
      </div>

      {/* Transfer Balance to User */}
      <div className="smm-card p-6 max-w-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <ArrowRightLeft className="text-blue-400" size={20} />
          </div>
          <h2 className="text-lg font-semibold text-white">
            Transfer Balance to User
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="transfer-principal"
              className="block text-sm text-slate-300 mb-1"
            >
              User Principal ID
            </label>
            <input
              id="transfer-principal"
              value={transferPrincipal}
              onChange={(e) => setTransferPrincipal(e.target.value)}
              placeholder="xxxxx-xxxxx-xxxxx-xxxxx-cai"
              data-ocid="admin.users.transfer.principal.input"
              className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="transfer-amount"
              className="block text-sm text-slate-300 mb-1"
            >
              Amount (₹)
            </label>
            <input
              id="transfer-amount"
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount in rupees"
              data-ocid="admin.users.transfer.amount.input"
              className="w-full bg-blue-950/50 border border-blue-800/50 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
          {transferError && (
            <p
              className="text-red-400 text-sm"
              data-ocid="admin.users.transfer.error_state"
            >
              {transferError}
            </p>
          )}
          {transferSuccess && (
            <p
              className="text-green-400 text-sm"
              data-ocid="admin.users.transfer.success_state"
            >
              {transferSuccess}
            </p>
          )}
          <button
            type="button"
            onClick={handleTransfer}
            disabled={transferring || !transferPrincipal || !transferAmount}
            data-ocid="admin.users.transfer.submit_button"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-500/40 rounded-lg text-sm font-semibold hover:bg-blue-600/30 transition-colors disabled:opacity-50"
          >
            <ArrowRightLeft size={16} />
            {transferring ? "Transferring..." : "Transfer Balance"}
          </button>
        </div>
      </div>
    </div>
  );
}
