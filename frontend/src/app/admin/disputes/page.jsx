"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertTriangle, CheckCircle2, Landmark } from "lucide-react";

// MOCK_DISPUTES removed

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Use .then() chain so setState is only called in async callbacks
    supabase
      .from("disputes")
      .select(
        "*, jobs(*, client:profiles!jobs_client_id_fkey(*), provider:profiles!jobs_provider_id_fkey(*)), opened_by_profile:profiles!disputes_opened_by_fkey(*)"
      )
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setDisputes(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleResolve = async (disputeId, jobId, resolution) => {
    const status = resolution === "dismiss" ? "dismissed" : "resolved";

    try {
      await supabase
        .from("disputes")
        .update({ status })
        .eq("id", disputeId);

      const nextJobStatus =
        resolution === "payout_provider"
          ? "completed"
          : resolution === "refund_client"
          ? "cancelled"
          : "open";

      await supabase
        .from("jobs")
        .update({ status: nextJobStatus })
        .eq("id", jobId);

      setDisputes((prev) =>
        prev.map((d) =>
          d.id === disputeId
            ? { ...d, status, jobs: { ...d.jobs, status: nextJobStatus } }
            : d
        )
      );

      setMessage({
        type: "success",
        text: `Dispute has been ${status}. Job status set to '${nextJobStatus}'.`,
      });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const openDisputes = disputes.filter((d) => d.status === "open");
  const closedDisputes = disputes.filter((d) => d.status !== "open");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-headline-md text-(--color-on-background)">
          Disputes Board
        </h1>
        <p className="text-body-sm text-(--color-on-surface-variant) mt-1">
          Arbitrate payment disputes between clients and workers. Release escrow
          funds or refund payments.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-lg text-sm font-semibold border bg-emerald-50 text-emerald-800 border-emerald-200 animate-in slide-in-from-top-2">
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Disputes Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-(--color-outline-variant)/30 bg-amber-50/40 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-(--color-on-background)">
                Active Disputes ({openDisputes.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center">
                <span className="inline-block w-8 h-8 border-4 border-(--color-primary)/30 border-t-(--color-primary) rounded-full animate-spin" />
              </div>
            ) : openDisputes.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold">All clear!</p>
                <p className="text-xs text-gray-400 mt-1">
                  No active disputes are pending mediation.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-(--color-outline-variant)/20">
                {openDisputes.map((d) => (
                  <div key={d.id} className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-base text-gray-900">
                          {d.jobs?.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Disputed Contract ID:{" "}
                          <span className="font-mono text-[10px]">
                            {d.job_id}
                          </span>
                        </p>
                      </div>
                      <div className="bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 px-3 py-1 rounded-md text-sm whitespace-nowrap">
                        FCFA {d.jobs?.budget?.toLocaleString()}
                      </div>
                    </div>

                    {/* Dispute Details */}
                    <div className="bg-gray-50 border p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold text-gray-600">
                          Opened By:
                        </span>
                        <span className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold border border-blue-200">
                          {d.opened_by_profile?.name} (
                          {d.opened_by_profile?.role})
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">
                          Reason / Complaint
                        </span>
                        <p className="text-xs text-gray-700 leading-relaxed font-medium bg-white p-3 rounded border">
                          {d.reason}
                        </p>
                      </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="p-3 border rounded-lg bg-gray-50/30">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Employer / Client
                        </span>
                        <div className="font-bold text-gray-800">
                          {d.jobs?.client?.name}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {d.jobs?.client?.email}
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg bg-gray-50/30">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Worker / Provider
                        </span>
                        <div className="font-bold text-gray-800">
                          {d.jobs?.provider?.name || "Unassigned"}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          {d.jobs?.provider?.email || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2.5 justify-end pt-2">
                      <button
                        onClick={() =>
                          handleResolve(d.id, d.job_id, "dismiss")
                        }
                        className="px-3.5 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md text-xs font-bold transition-all"
                      >
                        Dismiss Dispute
                      </button>
                      <button
                        onClick={() =>
                          handleResolve(d.id, d.job_id, "refund_client")
                        }
                        className="px-3.5 py-2 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-xs font-bold transition-all"
                      >
                        Refund Client
                      </button>
                      <button
                        onClick={() =>
                          handleResolve(d.id, d.job_id, "payout_provider")
                        }
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-all shadow-sm"
                      >
                        <Landmark className="w-3.5 h-3.5" /> Payout Worker
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Disputes History sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-(--color-outline-variant)/30 bg-gray-50/50">
              <h2 className="text-md font-semibold text-(--color-on-background)">
                Resolved Disputes
              </h2>
            </div>

            <div className="divide-y divide-(--color-outline-variant)/20 max-h-[400px] overflow-y-auto">
              {closedDisputes.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 italic">
                  No dispute resolution history.
                </div>
              ) : (
                closedDisputes.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 space-y-1 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-gray-800">
                        {d.jobs?.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                          d.status === "dismissed"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {d.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Payout of FCFA {d.jobs?.budget?.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
