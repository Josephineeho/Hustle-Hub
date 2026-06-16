"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

export default function ClientDashboardPage() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        
        const { data: userData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
          
        const { data: jobsData } = await supabase
          .from("jobs")
          .select("*")
          .eq("client_id", session.user.id)
          .order("created_at", { ascending: false });

        setUser(userData);
        setJobs(jobsData || []);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <span className="inline-block w-8 h-8 border-4 border-(--color-primary)/30 border-t-(--color-primary) rounded-full animate-spin" />
      </div>
    );
  }

  const activeJobsCount = jobs.filter(j => j.status !== "completed" && j.status !== "cancelled").length;
  const completedJobsCount = jobs.filter(j => j.status === "completed").length;
  const totalSpent = jobs.filter(j => j.status === "completed").reduce((sum, j) => sum + j.budget, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-md text-(--color-on-background)">
            Welcome back, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="text-body-sm text-(--color-on-surface-variant) mt-1">
            Here&apos;s what&apos;s happening with your jobs today.
          </p>
        </div>
        
        <Link 
          href="/post-job" 
          className="bg-(--color-primary) text-(--color-on-primary) px-5 py-2.5 rounded-(--radius-md) font-semibold text-body-sm shadow-level-1 hover:opacity-95 flex items-center gap-2 transition-all w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          Post a New Job
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-(--color-on-surface-variant) text-sm font-semibold">
            <Clock className="w-4 h-4 text-blue-500" />
            Active Jobs
          </div>
          <div className="text-3xl font-bold text-(--color-on-background)">{activeJobsCount}</div>
        </div>

        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-(--color-on-surface-variant) text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Completed Jobs
          </div>
          <div className="text-3xl font-bold text-(--color-on-background)">{completedJobsCount}</div>
        </div>

        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-(--color-on-surface-variant) text-sm font-semibold">
            <span className="text-amber-500 font-bold">F</span>
            Total Spent
          </div>
          <div className="text-3xl font-bold text-(--color-on-background)">FCFA {totalSpent.toLocaleString()}</div>
        </div>
      </div>

      {/* Recent Jobs Table/List */}
      <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-(--color-outline-variant)/30 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-(--color-on-background)">Recent Jobs</h2>
          <Link href="/client-dashboard/jobs" className="text-body-sm font-semibold text-(--color-primary) hover:underline flex items-center gap-1">
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {jobs.length === 0 ? (
          <div className="p-8 text-center text-(--color-on-surface-variant)">
            <p>You haven&apos;t posted any jobs yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-(--color-outline-variant)/20">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-semibold text-(--color-on-background)">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-(--color-on-surface-variant) mt-1.5">
                    <span>FCFA {job.budget.toLocaleString()}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                    <span>{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                    job.status === "completed" ? "bg-emerald-100 text-emerald-800" :
                    job.status === "open" ? "bg-blue-100 text-blue-800" :
                    job.status === "in_progress" ? "bg-amber-100 text-amber-800" :
                    "bg-gray-100 text-gray-800"
                  )}>
                    {job.status.replace("_", " ")}
                  </span>
                  
                  <Link href={`/client-dashboard/jobs/${job.id}`} className="text-sm font-semibold text-(--color-primary) hover:underline">
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}