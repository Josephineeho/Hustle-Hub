"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSuccessMsg("");
    setErrors({});
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        let errorMsg = error.message;
        if (error.message.toLowerCase().includes("email not confirmed") ||
            error.message.toLowerCase().includes("confirm")) {
          errorMsg = "Please confirm your email first. Check your inbox for a confirmation link from HustleHub.";
        } else if (error.message.toLowerCase().includes("invalid login") ||
                   error.message.toLowerCase().includes("invalid credentials")) {
          errorMsg = "Incorrect email or password. Please try again.";
        }
        setErrors({ submit: errorMsg });
        setIsLoading(false);
        return;
      }

      // Fetch user profile to determine role
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();

      let targetRole = "student";
      if (profile && !profileError) {
        targetRole = profile.role;
      } else {
        console.warn("Could not fetch user profile from profiles table, using metadata:", profileError);
        targetRole = data.user.user_metadata?.role || "student";
      }

      setIsLoading(false);
      setSuccessMsg("Welcome back to HustleHub! Logging you in...");

      setTimeout(() => {
        if (targetRole === "admin") {
          router.push("/admin");
        } else if (targetRole === "employer") {
          router.push("/client-dashboard");
        } else {
          router.push("/dashboard");
        }
      }, 1000);
    } catch (err) {
      setErrors({ submit: err.message || "An unexpected error occurred during login." });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-(--color-background) to-(--color-surface-container-high) flex flex-col items-center justify-center p-5 md:p-12 relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[300px] md:w-[600px] aspect-square rounded-full bg-blue-100/50 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[300px] md:w-[600px] aspect-square rounded-full bg-indigo-100/40 blur-3xl -z-10 animate-pulse duration-5000" />

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 md:left-12">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-body-sm font-semibold text-(--color-on-background) hover:text-(--color-primary) transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[420px] bg-white/80 border border-(--color-outline-variant)/30 rounded-(--radius-xl) p-8 shadow-level-3">
{        /* Card Header */}
          <div className="mb-8">
            <div className="text-xl font-bold font-[family-name:--font-headline] text-(--color-primary) mb-1">
              HustleHub
            </div>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background)">
              Log in to your account
            </h2>
            <p className="text-body-sm text-(--color-on-surface-variant) mt-1.5">
              Empowering student talent and community support
            </p>
          </div>

          {/* Status Messages */}
        {successMsg && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-(--radius-md) text-body-sm text-center font-medium animate-in fade-in duration-200">
            {successMsg}
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-(--radius-md) text-body-sm text-center font-medium animate-in fade-in duration-200">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-(--color-outline) pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-white border ${
                  errors.email ? "border-(--color-error)" : "border-(--color-outline-variant)/50"
                } rounded-(--radius-md) pl-10 pr-4 py-3 text-body-md outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all`}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-(--color-error) font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-(--color-primary) hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-(--color-outline) pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-white border ${
                  errors.password ? "border-(--color-error)" : "border-(--color-outline-variant)/50"
                } rounded-(--radius-md) pl-10 pr-10 py-3 text-body-md outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-(--color-outline) hover:text-(--color-on-background) transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-(--color-error) font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-(--color-primary) text-(--color-on-primary) py-3 rounded-(--radius-md) font-semibold text-body-md shadow-level-1 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none transition-all mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Footer Nav */}
        <div className="text-center mt-8 pt-6 border-t border-(--color-outline-variant)/20 text-body-sm text-(--color-on-surface-variant)">
          New to HustleHub?{" "}
          <Link href="/signup" className="font-semibold text-(--color-primary) hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </main>
  );
}
