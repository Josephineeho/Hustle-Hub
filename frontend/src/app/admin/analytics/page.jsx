"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TrendingUp, Users, Briefcase, DollarSign, ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalUsers: 1245,
    activeJobs: 342,
    totalVolume: 5450000,
    disputesRate: 0.8,
    userGrowth: 12.5,
    jobGrowth: 8.2,
    volumeGrowth: 15.4,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [
          { count: usersCount },
          { count: jobsCount },
          { data: jobsData },
          { count: disputesCount }
        ] = await Promise.all([
          supabase.from("profiles").select("*", { count: "exact", head: true }),
          supabase.from("jobs").select("*", { count: "exact", head: true }).in("status", ["open", "in_progress"]),
          supabase.from("jobs").select("budget, status"),
          supabase.from("disputes").select("*", { count: "exact", head: true })
        ]);

        const completedJobs = jobsData?.filter(j => j.status === "completed") || [];
        const volume = completedJobs.reduce((sum, j) => sum + Number(j.budget || 0), 0);
        
        const totalJobsCount = jobsData?.length || 1; // avoid div by 0
        const dRate = disputesCount ? ((disputesCount / totalJobsCount) * 100).toFixed(1) : 0;

        setStats(prev => ({
          ...prev,
          totalUsers: usersCount || 0,
          activeJobs: jobsCount || 0,
          totalVolume: volume,
          disputesRate: dRate,
        }));
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  const categories = [
    { name: "Cleaning", count: 124, percentage: 36, color: "bg-blue-500" },
    { name: "Moving & Assembly", count: 86, percentage: 25, color: "bg-indigo-500" },
    { name: "Yard Work", count: 52, percentage: 15, color: "bg-emerald-500" },
    { name: "Tech Support", count: 48, percentage: 14, color: "bg-amber-500" },
    { name: "Other", count: 32, percentage: 10, color: "bg-gray-400" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-headline-md text-(--color-on-background)">
          Platform Analytics
        </h1>
        <p className="text-body-sm text-(--color-on-surface-variant) mt-1">
          Monitor transactional volume, user acquisition, job fulfillment metrics, and category trends.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>Total Registered</span>
            <Users className="w-4.5 h-4.5 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{stats.totalUsers}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +{stats.userGrowth}%
            </span>
          </div>
          <p className="text-[10px] text-gray-400">Monthly new student & employer signups</p>
        </div>

        {/* Active Jobs */}
        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>Active Gig Contracts</span>
            <Briefcase className="w-4.5 h-4.5 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{stats.activeJobs}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +{stats.jobGrowth}%
            </span>
          </div>
          <p className="text-[10px] text-gray-400">Contracts currently open or in-progress</p>
        </div>

        {/* Transaction Volume */}
        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>Escrow Volume</span>
            <DollarSign className="w-4.5 h-4.5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">FCFA {stats.totalVolume.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +{stats.volumeGrowth}%
            </span>
          </div>
          <p className="text-[10px] text-gray-400">Total processed payment volume</p>
        </div>

        {/* Disputes rate */}
        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase tracking-wider">
            <span>Disputes Rate</span>
            <Activity className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{stats.disputesRate}%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <ArrowDownRight className="w-3 h-3" /> -0.2%
            </span>
          </div>
          <p className="text-[10px] text-gray-400">Percentage of contracts disputed</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gig Categories Distribution */}
        <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Popular Gig Categories</h2>
            <p className="text-xs text-gray-400 mt-0.5">Breakdown of platform requests by category segment</p>
          </div>

          <div className="space-y-4">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-700">{cat.name} ({cat.count} gigs)</span>
                  <span className="font-bold text-gray-900">{cat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className={`${cat.color} h-full rounded-full`} style={{ width: `${cat.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Trends Summary */}
        <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Growth & Target Performance</h2>
            <p className="text-xs text-gray-400 mt-0.5">Platform milestones and key target updates</p>
          </div>

          <div className="my-6 space-y-4 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <span className="block font-bold text-blue-900">Student Signups Target Achieved</span>
                <span className="text-[10px] text-blue-700 font-medium">Platform student network has reached over 800 active profiles on campus.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0" />
              <div>
                <span className="block font-bold text-emerald-900"> escrow Release Rate is 99.2%</span>
                <span className="text-[10px] text-emerald-700 font-medium">Gig payments are being successfully finalized and paid out without mediation.</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
            <span>Last Updated: Today, 12:00 PM</span>
            <button className="text-blue-500 font-semibold hover:underline">Export Report</button>
          </div>
        </div>

      </div>
    </div>
  );
}
