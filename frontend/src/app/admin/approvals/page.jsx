"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle, FileText, ShieldCheck } from "lucide-react";

// MOCK_REQUESTS removed

export default function AdminApprovalsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Use .then() chains so setState is only called in async callbacks (not synchronously in the effect body)
    supabase
      .from("verifications")
      .select("*, profiles(*)")
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) {
          setRequests(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleAction = async (requestId, userId, action) => {
    const isApproved = action === "approve";
    const status = isApproved ? "approved" : "rejected";

    try {
      await supabase
        .from("verifications")
        .update({ status })
        .eq("id", requestId);

      if (isApproved) {
        await supabase
          .from("profiles")
          .update({ is_verified: true, student_status: true })
          .eq("id", userId);
      }

      setRequests((prev) =>
        prev.map((req) => (req.id === requestId ? { ...req, status } : req))
      );

      setMessage({
        type: isApproved ? "success" : "error",
        text: `Request has been ${status}. User status updated.`,
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Action handler failed:", err);
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const historyRequests = requests.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-headline-md text-(--color-on-background)">
          Approvals Queue
        </h1>
        <p className="text-body-sm text-(--color-on-surface-variant) mt-1">
          Review uploaded student identity cards, guarantor authorization forms,
          and approve platform access.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-semibold border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          } animate-in slide-in-from-top-2`}
        >
          {message.text}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Verification Queue (List) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-(--color-outline-variant)/30 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-(--color-on-background)">
                Pending Requests ({pendingRequests.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-12 flex justify-center">
                <span className="inline-block w-8 h-8 border-4 border-(--color-primary)/30 border-t-(--color-primary) rounded-full animate-spin" />
              </div>
            ) : pendingRequests.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold">Queue is clear!</p>
                <p className="text-xs text-gray-400 mt-1">
                  No pending verification requests at this moment.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-(--color-outline-variant)/20">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-6 space-y-4 hover:bg-gray-50/50 transition-colors"
                  >
                    {/* User Profile Info */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-base">
                          {req.profiles?.name?.charAt(0) ?? "?"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {req.profiles?.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {req.profiles?.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded">
                        Submitted:{" "}
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Verification Documents */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg border border-(--color-outline-variant)/20">
                      <div>
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">
                          Student ID Card
                        </span>
                        {req.id_card_url ? (
                          <a
                            href={req.id_card_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline"
                          >
                            <FileText className="w-4 h-4 text-blue-500" />
                            View ID Card File
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No file uploaded
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1.5">
                          Guarantor Verification Form
                        </span>
                        {req.guarantor_form_url ? (
                          <a
                            href={req.guarantor_form_url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:underline"
                          >
                            <FileText className="w-4 h-4 text-blue-500" />
                            View Guarantor Form
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            No file uploaded
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        onClick={() =>
                          handleAction(req.id, req.user_id, "reject")
                        }
                        className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 rounded-md text-xs font-bold transition-all"
                      >
                        <XCircle className="w-4 h-4" /> Reject Request
                      </button>
                      <button
                        onClick={() =>
                          handleAction(req.id, req.user_id, "approve")
                        }
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold transition-all shadow-sm"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve User
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Verification History sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-(--color-outline-variant)/30">
              <h2 className="text-md font-semibold text-(--color-on-background)">
                Recent Review History
              </h2>
            </div>

            <div className="divide-y divide-(--color-outline-variant)/20 max-h-[400px] overflow-y-auto">
              {historyRequests.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400 italic">
                  No review history found.
                </div>
              ) : (
                historyRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 flex items-center justify-between text-xs hover:bg-gray-50/50 transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-gray-800">
                        {req.profiles?.name}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {req.profiles?.email}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider text-[9px] ${
                        req.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {req.status}
                    </span>
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
