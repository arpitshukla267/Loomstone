"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Clapperboard,
  ChevronRight,
  KeyRound,
  X,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  LogOut,
  Mail,
  Terminal,
  Package,
  Phone,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { authFetch, setToken, clearToken } from "@/lib/auth";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Hero Slides", href: "/dashboard/hero", icon: Clapperboard },
  { label: "Products", href: "/dashboard/products", icon: Package },
  { label: "Why Loomstone", href: "/dashboard/why-loomstone", icon: Sparkles },
  { label: "Contact Info", href: "/dashboard/contactinfo", icon: Phone },
];

/* ───────────────────────── Change Password Modal ───────────────────────── */

type Step = "request" | "verify" | "done";

function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("shuklaarpit440@gmail.com");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Fetch current admin email on modal open
  useEffect(() => {
    authFetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d?.user?.email) setEmail(d.user.email);
      })
      .catch(() => {});
  }, []);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await authFetch("/api/auth/password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data.error || "Unable to send the OTP. Please try again.",
        );
      setStep("verify");
      setCooldown(30);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError("");
    if (!/^\d{6}$/.test(otp))
      return setError("Please enter a valid 6-digit OTP.");
    if (newPassword.length < 8)
      return setError("Password must be at least 8 characters long.");
    if (newPassword !== confirmPassword)
      return setError("The passwords you entered do not match.");

    setLoading(true);
    try {
      const res = await authFetch("/api/auth/password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(
          data.error || "Unable to change the password. Please try again.",
        );
      if (data.token) setToken(data.token);
      setStep("done");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl bg-slate-900/80 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-[#4A90C4] transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Change password"
        className="w-full max-w-sm rounded-2xl bg-[#0B1C30] border border-slate-800 p-6 text-slate-300 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <KeyRound className="w-4 h-4 text-[#4A90C4]" />
            Change Password
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === "request" && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                Admin Email for OTP
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="shuklaarpit440@gmail.com"
                  className={cn(inputCls, "pl-9")}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-[11px]">
              <Terminal className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>OTP is sent to email and logged to backend terminal.</span>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00355F] hover:bg-[#0F4C81] disabled:opacity-60 text-white text-xs font-semibold py-2.5 transition-colors cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Send OTP
            </button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              OTP for <span className="text-white font-medium">{email}</span>{" "}
              has been sent. Valid for 10 min.
            </p>
            <input
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              className={cn(
                inputCls,
                "tracking-[0.4em] text-center font-semibold",
              )}
            />
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min. 8 characters)"
                className={cn(inputCls, "pr-9")}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                {showPass ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
            <input
              type={showPass ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className={inputCls}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              onClick={resetPassword}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#00355F] hover:bg-[#0F4C81] disabled:opacity-60 text-white text-xs font-semibold py-2.5 transition-colors cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Update Password
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-4 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-semibold text-white">
              Password Changed
            </h4>
            <p className="text-xs text-slate-400">
              Your password has been updated successfully.
            </p>
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-[#00355F] hover:bg-[#0F4C81] text-white text-xs font-semibold py-2.5 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ───────────────────────────────── Sidebar ───────────────────────────────── */

export function Sidebar() {
  const pathname = usePathname();
  const [showChangePassword, setShowChangePassword] = useState(false);

  return (
    <aside className="w-64 shrink-0 bg-[#0B1C30] h-full flex flex-col border-r border-slate-800/60 text-slate-300">
      {/* Brand Header */}
      <div className="px-6 py-6 border-b border-slate-800/70">
        <div className="flex flex-col items-center gap-3">
          <Image
            src="/logo-white.png"
            alt="Loomstone"
            width={160}
            height={60}
            priority
            className="w-full h-12 object-cover"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 overflow-y-auto space-y-2">
        {NAV.map((item) => {
          const href = item.href;
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-medium transition-colors group",
                active
                  ? "text-white font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
              )}
            >
              {active && (
                <motion.div
                  layoutId="active-sidebar-pill"
                  className="absolute inset-0 bg-[#00355F] rounded-xl shadow-md shadow-[#00355F]/50"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 30,
                  }}
                />
              )}
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0 relative z-10 transition-transform group-hover:scale-110",
                  active ? "text-white" : "text-slate-400",
                )}
              />
              <span className="relative z-10 flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer: Change Password & Sign Out */}
      <div className="px-5 py-4 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
        <button
          onClick={() => setShowChangePassword(true)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium hover:border-[#0F4C81]/50 hover:text-white transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-[#4A90C4]" />
            <span>Change Password</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={() => {
            clearToken();
            window.dispatchEvent(new Event("cms-logout"));
          }}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-rose-400/90 text-xs font-medium hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Sign Out</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <AnimatePresence>
        {showChangePassword && (
          <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
        )}
      </AnimatePresence>
    </aside>
  );
}
