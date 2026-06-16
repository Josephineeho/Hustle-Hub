"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const categories = ["Cleaning", "Moving", "Delivery", "Assembly", "Tech Support", "Yard Work", "Other"];

export default function PostJobPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [form, setForm] = useState({ 
    title: "", 
    category: "", 
    desc: "", 
    location: "", 
    budget: "", 
    date: "" 
  });

  const set = (key, val) => { 
    setForm(p => ({ ...p, [key]: val })); 
    setError(""); 
  };

  const nextStep1 = () => {
    if (!form.title) return setError("Please enter a job title.");
    if (!form.category) return setError("Please select a category.");
    if (!form.desc) return setError("Please add a description.");
    setError(""); 
    setStep(2);
  };

  const nextStep2 = () => {
    if (!form.location) return setError("Please enter a location.");
    if (!form.budget) return setError("Please enter your budget.");
    if (!form.date) return setError("Please pick a date.");
    setError(""); 
    setStep(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError("You must be logged in to post a job.");
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from("jobs").insert({
        client_id: session.user.id,
        title: form.title,
        category: form.category,
        description: form.desc,
        location: form.location,
        budget: Number(form.budget),
        status: "open",
      });

      if (insertError) {
        setError("Failed to post job: " + insertError.message);
        setLoading(false);
        return;
      }

      router.push("/client-dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-(--color-background) py-12 px-5 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] aspect-square rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-5%] w-[300px] aspect-square rounded-full bg-indigo-100/30 blur-3xl pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        <Link 
          href="/client-dashboard" 
          className="inline-flex items-center gap-2 text-body-sm font-semibold text-(--color-on-background) hover:text-(--color-primary) transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white border border-(--color-outline-variant)/30 rounded-(--radius-xl) shadow-level-3 overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          
          {/* Header */}
          <div className="p-8 border-b border-(--color-outline-variant)/30 bg-gradient-to-r from-blue-50/50 to-white">
            <h1 className="text-headline-sm font-bold text-(--color-primary) mb-2">Post a New Job</h1>
            <p className="text-body-sm text-(--color-on-surface-variant)">Tell us what you need help with, and we&apos;ll connect you with trusted local workers.</p>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mt-8">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={cn(
                    "h-2 w-full rounded-full transition-colors duration-300",
                    s <= step ? "bg-(--color-primary)" : "bg-(--color-outline-variant)/30"
                  )} />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs font-semibold text-(--color-on-surface-variant) mt-2 px-1 uppercase tracking-widest">
              <span className={cn(step >= 1 && "text-(--color-primary)")}>Details</span>
              <span className={cn(step >= 2 && "text-(--color-primary)")}>Logistics</span>
              <span className={cn(step >= 3 && "text-(--color-primary)")}>Review</span>
            </div>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-(--radius-md) text-sm font-medium border border-red-200 animate-in fade-in">
                {error}
              </div>
            )}

            {/* Step 1: Details */}
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Job Title</label>
                  <input 
                    className="w-full bg-white border border-(--color-outline-variant)/50 rounded-(--radius-md) px-4 py-3 text-body-md outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all" 
                    placeholder="e.g. Deep house cleaning"
                    value={form.title} 
                    onChange={e => set("title", e.target.value)} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(c => (
                      <button 
                        key={c} 
                        type="button"
                        className={cn(
                          "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                          form.category === c 
                            ? "bg-(--color-primary-container) border-(--color-primary-container) text-(--color-on-primary-container)" 
                            : "bg-white border-(--color-outline-variant)/50 text-(--color-on-surface-variant) hover:border-(--color-primary)"
                        )}
                        onClick={() => set("category", c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Description</label>
                  <textarea 
                    className="w-full bg-white border border-(--color-outline-variant)/50 rounded-(--radius-md) px-4 py-3 text-body-md outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all min-h-[120px]" 
                    placeholder="Describe exactly what needs to be done..."
                    value={form.desc} 
                    onChange={e => set("desc", e.target.value)} 
                  />
                </div>

                <button 
                  onClick={nextStep1}
                  className="w-full bg-(--color-primary) text-(--color-on-primary) py-3.5 rounded-(--radius-md) font-semibold text-body-md shadow-level-1 hover:opacity-95 transition-all flex items-center justify-center gap-2 mt-4"
                >
                  Continue to Logistics
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Logistics */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-(--color-outline)" />
                    <input 
                      className="w-full bg-white border border-(--color-outline-variant)/50 rounded-(--radius-md) pl-11 pr-4 py-3 text-body-md outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all" 
                      placeholder="e.g. North Campus Dorms"
                      value={form.location} 
                      onChange={e => set("location", e.target.value)} 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Budget (FCFA)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs font-bold text-(--color-outline)">FCFA</span>
                      <input 
                        type="number" 
                        className="w-full bg-white border border-(--color-outline-variant)/50 rounded-(--radius-md) pl-14 pr-4 py-3 text-body-md outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all" 
                        placeholder="e.g. 50"
                        value={form.budget} 
                        onChange={e => set("budget", e.target.value)} 
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-(--color-on-surface-variant)">Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-white border border-(--color-outline-variant)/50 rounded-(--radius-md) px-4 py-3 text-body-md outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) transition-all" 
                      value={form.date} 
                      onChange={e => set("date", e.target.value)} 
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-white border border-(--color-outline-variant)/50 text-(--color-on-surface) py-3.5 rounded-(--radius-md) font-semibold text-body-md hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button 
                    onClick={nextStep2}
                    className="flex-[2] bg-(--color-primary) text-(--color-on-primary) py-3.5 rounded-(--radius-md) font-semibold text-body-md shadow-level-1 hover:opacity-95 transition-all flex items-center justify-center gap-2"
                  >
                    Review Job
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                
                <div className="bg-gray-50 p-6 rounded-(--radius-md) border border-(--color-outline-variant)/20 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-(--color-on-background)">{form.title}</h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-(--color-primary-container) text-(--color-on-primary-container) rounded-full text-xs font-bold uppercase">
                      {form.category}
                    </span>
                  </div>
                  
                  <p className="text-(--color-on-surface-variant) whitespace-pre-wrap">{form.desc}</p>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-(--color-outline-variant)/20">
                    <div>
                      <span className="block text-xs font-bold text-(--color-outline) uppercase tracking-wider mb-1">Location</span>
                      <span className="text-sm font-semibold text-(--color-on-background)">{form.location}</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-(--color-outline) uppercase tracking-wider mb-1">Date</span>
                      <span className="text-sm font-semibold text-(--color-on-background)">{form.date}</span>
                    </div>
                    <div className="col-span-2 mt-2 bg-emerald-50 p-3 rounded border border-emerald-100 flex items-center justify-between">
                      <span className="font-bold text-emerald-800">Total Budget</span>
                      <span className="text-xl font-bold text-emerald-600">FCFA {Number(form.budget).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="flex-1 bg-white border border-(--color-outline-variant)/50 text-(--color-on-surface) py-3.5 rounded-(--radius-md) font-semibold text-body-md hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] bg-emerald-600 text-white py-3.5 rounded-(--radius-md) font-bold text-body-md shadow-level-1 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Confirm & Post Job
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}