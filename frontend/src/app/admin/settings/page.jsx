"use client";

import { useState } from "react";
import { Save, Key, ShieldAlert, Mail, Percent, Banknote, Bell } from "lucide-react";

export default function AdminSettingsPage() {
  const [general, setGeneral] = useState({
    siteName: "HustleHub",
    supportEmail: "support@hustlehub.com",
    serviceFee: 10,
    minWithdrawal: 15,
  });

  const [notifications, setNotifications] = useState({
    newUserAlert: true,
    newDisputeAlert: true,
    weeklyDigest: false,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSaveGeneral = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-headline-md text-(--color-on-background)">
          System Settings
        </h1>
        <p className="text-body-sm text-(--color-on-surface-variant) mt-1">
          Configure fees, escrow percentages, system preferences, and notification defaults.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-lg text-sm font-semibold border bg-emerald-50 text-emerald-800 border-emerald-200 animate-in slide-in-from-top-2">
          Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* General Settings */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveGeneral} className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-(--color-outline-variant)/20">
              <h2 className="text-md font-semibold text-gray-900">Platform Configuration</h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Site Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Site Name</label>
                  <input 
                    type="text" 
                    value={general.siteName}
                    onChange={(e) => setGeneral({ ...general, siteName: e.target.value })}
                    className="w-full bg-gray-50 border rounded-md px-3.5 py-2 text-sm outline-none focus:border-(--color-primary) transition-all"
                  />
                </div>

                {/* Support Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">System Support Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="email" 
                      value={general.supportEmail}
                      onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-md text-sm outline-none focus:border-(--color-primary) transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Fee */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Service Fee Percentage (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type="number" 
                      value={general.serviceFee}
                      onChange={(e) => setGeneral({ ...general, serviceFee: Number(e.target.value) })}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-md text-sm outline-none focus:border-(--color-primary) transition-all"
                    />
                  </div>
                </div>

                {/* Minimum Payout */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Minimum Withdrawal Amount (FCFA)</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                    <input 
                      type="number" 
                      value={general.minWithdrawal}
                      onChange={(e) => setGeneral({ ...general, minWithdrawal: Number(e.target.value) })}
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-md text-sm outline-none focus:border-(--color-primary) transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-(--color-outline-variant)/20 flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold transition-all shadow-sm disabled:opacity-75"
              >
                {saving ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save General settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar settings (notifications & system key) */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-md font-semibold text-gray-900 border-b pb-3 border-gray-100">
              <Bell className="w-4.5 h-4.5 text-blue-500" />
              <span>Admin Notifications</span>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer">
                <span>New User Registration alerts</span>
                <input 
                  type="checkbox" 
                  checked={notifications.newUserAlert} 
                  onChange={(e) => setNotifications({ ...notifications, newUserAlert: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-gray-700 cursor-pointer">
                <span>New Dispute alerts</span>
                <input 
                  type="checkbox" 
                  checked={notifications.newDisputeAlert}
                  onChange={(e) => setNotifications({ ...notifications, newDisputeAlert: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
              </label>
            </div>
          </div>

          {/* System Keys placeholder */}
          <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 text-md font-semibold text-gray-900 border-b pb-3 border-gray-100">
              <Key className="w-4.5 h-4.5 text-blue-500" />
              <span>Escrow API Credentials</span>
            </div>
            <p className="text-[10px] text-gray-400">Escrow service parameters (Fapshi API configuration, secret keys).</p>
            <div className="pt-2">
              <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-3 py-2 rounded-lg block font-semibold text-center">
                Mock Mode Active
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
