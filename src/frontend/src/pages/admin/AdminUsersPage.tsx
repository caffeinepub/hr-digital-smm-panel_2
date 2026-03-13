import { Shield, Users } from "lucide-react";
import { useState } from "react";
import { UserRole } from "../../backend";
import { useActor } from "../../hooks/useActor";

export default function AdminUsersPage() {
  const { actor } = useActor();
  const [principalInput, setPrincipalInput] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

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

  return (
    <div
      className="p-6 space-y-6"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        <p className="text-slate-400 text-sm mt-1">Assign roles to users</p>
      </div>
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
    </div>
  );
}
