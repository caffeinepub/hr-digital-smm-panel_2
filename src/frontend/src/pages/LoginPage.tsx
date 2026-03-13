import { Shield, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, identity, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && !identity.getPrincipal().isAnonymous()) {
      navigate("/dashboard");
    }
  }, [identity, navigate]);

  const features = [
    { icon: TrendingUp, text: "Instagram, YouTube, Facebook, TikTok" },
    { icon: Zap, text: "Fast delivery, 24/7 support" },
    { icon: Users, text: "1CR+ orders completed" },
  ];

  return (
    <div
      className="min-h-screen bg-[#070d1f] flex items-center justify-center p-4"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-4 glow-blue">
            <Shield className="h-8 w-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gradient-blue">HR DIGITAL</h1>
          <p className="text-blue-300/70 text-sm font-medium tracking-widest mt-1">
            SMM PANEL
          </p>
        </div>

        {/* Login card */}
        <div className="smm-card p-8 glow-blue">
          <h2 className="text-xl font-semibold text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Login with Internet Identity to access your panel
          </p>

          <button
            type="button"
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            data-ocid="login.submit_button"
            className="smm-btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn || isInitializing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Connecting...
              </>
            ) : (
              <>
                <Shield size={18} />
                Login with Internet Identity
              </>
            )}
          </button>

          {/* Features */}
          <div className="mt-8 space-y-3">
            {features.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-3 text-sm text-slate-400"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-blue-400" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          Powered by Internet Computer · HR Digital © 2024
        </p>
      </div>
    </div>
  );
}
