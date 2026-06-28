import React, { useState } from "react";
import { Sparkles, ShoppingBag, Eye, EyeOff, KeyRound, Mail, UserPlus, UserCheck } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess: (token: string, user: { id: string; username: string; email: string; role: "admin" | "customer" }) => void;
  onClose: () => void;
}

export default function LoginPage({ onLoginSuccess, onClose }: LoginPageProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!username.trim() || !password) {
      setErrorMsg("Please fill in your credentials.");
      return;
    }

    if (isRegister && !email.trim()) {
      setErrorMsg("Please provide your email address.");
      return;
    }

    setIsLoading(true);
    const url = isRegister ? "/api/auth/register" : "/api/auth/login";
    const bodyObj = isRegister 
      ? { username: username.trim(), password, email: email.trim() }
      : { username: username.trim(), password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyObj),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Authentication failed. Please verify credentials.");
      }

      setSuccessMsg(isRegister ? "Vastram Account Registered Successfully!" : "Namaste! Welcome back.");
      
      // Delay successful response so user sees the nice transition
      setTimeout(() => {
        onLoginSuccess(data.token, data.user);
        onClose();
      }, 1000);

    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12" id="login-container">
      <div className="rounded-3xl border border-stone-800/80 bg-[#0c0b0a] p-6 sm:p-8 shadow-xl relative overflow-hidden">
        
        {/* Background Mandala Accents */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full border border-[#C5A880]/5 scale-125 animate-pulse" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full border border-[#C5A880]/5 scale-125 animate-pulse" />

        <div className="text-center relative z-10 space-y-3 mb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-950 text-[#C5A880] shadow-md border border-stone-800">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold tracking-widest text-[#FCFBF9] uppercase">
              {isRegister ? "Join Ravora" : "Welcome to Ravora"}
            </h2>
            <p className="text-xs text-stone-400 font-sans tracking-tight mt-1.5 leading-relaxed">
              {isRegister 
                ? "Register below to secure complimentary priority loom dispatch on orders over ₹5,000."
                : "Sign in to review loom reserves, custom fabrics, and checkout orders."
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10" id="login-form">
          {errorMsg && (
            <div className="rounded-lg bg-red-950/40 border border-red-900/40 p-3 text-xs text-red-300 font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="rounded-lg bg-emerald-950/40 border border-emerald-900/40 p-3 text-xs text-emerald-300 font-semibold flex items-center space-x-2">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Username Input */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block">
              Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="customer (or 'admin')"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-stone-800 px-3 py-2 pl-9 text-xs focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] focus:outline-none bg-stone-900/50 text-[#FCFBF9]"
                id="login-input-username"
              />
              <KeyRound className="absolute top-2.5 left-3 h-3.5 w-3.5 text-stone-500" />
            </div>
          </div>

          {/* Email Input (only shown if registering) */}
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-stone-800 px-3 py-2 pl-9 text-xs focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] focus:outline-none bg-stone-900/50 text-[#FCFBF9]"
                  id="login-input-email"
                />
                <Mail className="absolute top-2.5 left-3 h-3.5 w-3.5 text-stone-500" />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#C5A880] block">
                Secret Password
              </label>
              {!isRegister && (
                <span className="text-[9px] text-stone-400 font-medium font-sans">
                  Demo password: <strong className="font-mono bg-stone-900 border border-stone-800 px-1 rounded text-[#C5A880]">password</strong>
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-800 px-3 py-2 pl-9 pr-9 text-xs focus:ring-1 focus:ring-[#C5A880] focus:border-[#C5A880] focus:outline-none bg-stone-900/50 text-[#FCFBF9]"
                id="login-input-password"
              />
              <KeyRound className="absolute top-2.5 left-3 h-3.5 w-3.5 text-stone-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 text-stone-500 hover:text-[#C5A880] cursor-pointer"
                id="login-password-visibility"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex w-full items-center justify-center space-x-2 rounded-xl bg-[#C5A880] py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#080807] shadow-md hover:bg-[#E5C49F] transition-all disabled:opacity-50 cursor-pointer"
            id="login-submit-btn"
          >
            <span>{isLoading ? "Authenticating..." : isRegister ? "Create vastram account" : "Begin Premium Session"}</span>
          </button>
        </form>

        {/* Change auth mode */}
        <div className="mt-6 text-center border-t border-stone-800/80 pt-4 relative z-10">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className="text-xs font-semibold text-[#C5A880] hover:text-[#E5C49F] underline decoration-[#C5A880] decoration-1 underline-offset-4 tracking-wider uppercase cursor-pointer"
            id="login-toggle-mode"
          >
            {isRegister 
              ? "Already have an artisan account? Login" 
              : "Don't have an account? Sign Up"
            }
          </button>
        </div>

      </div>
    </div>
  );
}
