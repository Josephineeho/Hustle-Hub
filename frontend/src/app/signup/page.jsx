"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Eye, EyeOff, GraduationCap, Lock, Mail, User } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const [role, setRole] = useState(null); // 'student' or 'employer'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const validate = () => {
    const newErrors = {};
    if (!role) {
      newErrors.role = "Please select an account type to proceed";
    }
    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: role === "student" ? "student" : "employer",
          },
        },
      });

      if (error) {
        setErrors({ submit: error.message });
        setIsLoading(false);
        return;
      }

      setIsLoading(false);

      // If session is null, email confirmation is required
      if (!data.session) {
        setSuccessMsg(
          "Account created! Please check your email inbox and click the confirmation link to activate your account. Then come back to log in."
        );
        return; // Don't auto-redirect — user needs to confirm email first
      }

      // Session exists → email confirmation is disabled, log in immediately
      setSuccessMsg(
        `Welcome to HustleHub! Your ${role === "student" ? "worker" : "client"} account is ready.`
      );
      setTimeout(() => {
        router.push(role === "student" ? "/dashboard" : "/client-dashboard");
      }, 1200);
    } catch (err) {
      setErrors({ submit: err.message || "An unexpected error occurred during signup." });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-(--color-background) to-(--color-surface-container-high) flex flex-col items-center justify-center p-5 md:p-12 relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] aspect-square rounded-full bg-blue-100/50 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[300px] md:w-[600px] aspect-square rounded-full bg-indigo-100/40 blur-3xl -z-10 animate-pulse duration-5000" />

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

      {/* Signup Card */}
      <div className="w-full max-w-[480px] bg-white/80 border border-(--color-outline-variant)/30 rounded-(--radius-xl) p-8 shadow-level-3">
       { /* Card Header */}
          <div className="mb-8">
            <div className="text-xl font-bold font-[family-name:--font-headline] text-(--color-primary) mb-2">
              HustleHub
            </div>
            <h2 className="text-headline-sm font-semibold text-(--color-on-background)">
              Create your account
            </h2>
            <p className="text-body-sm text-(--color-on-surface-variant) mt-1.5">
              Join the community of workers and households looking to connect
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
          {/* Step 1: Select Role */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">
              I want to...
            </label>
            <div className="grid grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => {
                  setRole("student");
                  if (errors.role) setErrors((prev) => ({ ...prev, role: null }));
                }}
                className={`flex flex-col items-center gap-3 p-4 rounded-(--radius-md) border-2 text-center transition-all ${
                  role === "student"
                    ? "border-(--color-primary) bg-blue-50/30 text-(--color-primary) shadow-level-1"
                    : "border-(--color-outline-variant)/40 bg-white hover:border-gray-300 text-(--color-on-surface-variant)"
                }`}
              >
                <GraduationCap className={`w-8 h-8 ${role === "student" ? "text-(--color-primary)" : "text-(--color-outline)"}`} />
                <span className="text-xs font-bold tracking-wide">Offer My Skills</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setRole("employer");
                  if (errors.role) setErrors((prev) => ({ ...prev, role: null }));
                }}
                className={`flex flex-col items-center gap-3 p-4 rounded-(--radius-md) border-2 text-center transition-all ${
                  role === "employer"
                    ? "border-(--color-primary) bg-blue-50/30 text-(--color-primary) shadow-level-1"
                    : "border-(--color-outline-variant)/40 bg-white hover:border-gray-300 text-(--color-on-surface-variant)"
                }`}
              >
                <Briefcase className={`w-8 h-8 ${role === "employer" ? "text-(--color-primary)" : "text-(--color-outline)"}`} />
                <span className="text-xs font-bold tracking-wide">Hire Local Help</span>
              </button>
            </div>
            {errors.role && (
              <span className="text-xs text-(--color-error) font-medium animate-in fade-in duration-200">
                {errors.role}
              </span>
            )}
          </div>

          {/* Step 2: Input Details */}
          <div className="flex flex-col gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-(--color-outline) pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-white border ${
                    errors.name ? "border-(--color-error)" : "border-(--color-outline-variant)/50"
                  } rounded-(--radius-md) pl-10 pr-4 py-3 text-body-md outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all`}
                />
              </div>
              {errors.name && (
                <span className="text-xs text-(--color-error) font-medium animate-in fade-in duration-200">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
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
                <span className="text-xs text-(--color-error) font-medium animate-in fade-in duration-200">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">
                Password
              </label>
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
                <span className="text-xs text-(--color-error) font-medium animate-in fade-in duration-200">
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-(--color-primary) text-(--color-on-primary) py-3.5 rounded-(--radius-md) font-semibold text-body-md shadow-level-1 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none transition-all mt-2 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        {/* Footer Nav */}
        <div className="text-center mt-8 pt-6 border-t border-(--color-outline-variant)/20 text-body-sm text-(--color-on-surface-variant)">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-(--color-primary) hover:underline">
            Log in here
          </Link>
        </div>
      </div>
    </main>
  );
}
