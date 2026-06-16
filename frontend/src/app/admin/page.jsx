"use client";

import { Activity, AlertCircle, ArrowRight, CheckCircle2, ShieldAlert, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ users: 0, jobs: 0, verifications: 0, disputes: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: usersCount },
        { count: jobsCount },
        { count: verificationsCount },
        { count: disputesCount }
      ] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
        supabase.from("verifications").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("disputes").select("*", { count: "exact", head: true }).eq("status", "open")
      ]);

      setStats({
        users: usersCount || 0,
        jobs: jobsCount || 0,
        verifications: verificationsCount || 0,
        disputes: disputesCount || 0
      });
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-headline-md text-(--color-on-background)">
            Admin Overview
          </h1>
          <p className="text-body-sm text-(--color-on-surface-variant) mt-1">
            Monitor platform activity, resolve disputes, and verify new users.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-(--color-on-surface-variant) text-sm font-semibold">
            <Users className="w-4 h-4 text-blue-500" />
            Total Users
          </div>
          <div className="text-3xl font-bold text-(--color-on-background)">{stats.users}</div>
        </div>

        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-(--color-on-surface-variant) text-sm font-semibold">
            <Activity className="w-4 h-4 text-emerald-500" />
            Active Jobs
          </div>
          <div className="text-3xl font-bold text-(--color-on-background)">{stats.jobs}</div>
        </div>

        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-red-600 text-sm font-semibold">
            <ShieldAlert className="w-4 h-4" />
            Pending Verifications
          </div>
          <div className="text-3xl font-bold text-red-600">{stats.verifications}</div>
        </div>

        <div className="bg-white p-6 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-amber-600 text-sm font-semibold">
            <AlertCircle className="w-4 h-4" />
            Active Disputes
          </div>
          <div className="text-3xl font-bold text-amber-600">{stats.disputes}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Queue */}
        <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-(--color-outline-variant)/30 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-(--color-on-background)">Verification Queue</h2>
            <button className="text-body-sm font-semibold text-(--color-primary) hover:underline flex items-center gap-1">
              View All
            </button>
          </div>
          
          <div className="divide-y divide-(--color-outline-variant)/20">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-(--color-on-background)">Student {i}</h3>
                    <p className="text-xs text-(--color-on-surface-variant)">ID Card & Guarantor Form uploaded</p>
                  </div>
                </div>
                <button className="text-xs font-semibold bg-(--color-primary) text-(--color-on-primary) px-3 py-1.5 rounded-md hover:bg-(--color-primary-container)">
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Platform Activity */}
        <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-(--color-outline-variant)/30 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-(--color-on-background)">Recent Platform Activity</h2>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex gap-3">
              <div className="mt-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-(--color-on-background)">Job &quot;Dorm Cleaning&quot; marked as completed</p>
                <p className="text-xs text-(--color-on-surface-variant)">2 mins ago</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="mt-1">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-(--color-on-background)">Dispute opened for &quot;Furniture Assembly&quot;</p>
                <p className="text-xs text-(--color-on-surface-variant)">15 mins ago</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-(--color-on-background)">New client registration</p>
                <p className="text-xs text-(--color-on-surface-variant)">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
