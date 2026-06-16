"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Search, Shield, ShieldAlert, ShieldCheck, UserCheck, UserX, Award, Trash2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setUsers(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleToggleVerify = async (userId, currentStatus) => {
    const nextStatus = !currentStatus;
    try {
      // 1. Supabase update
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: nextStatus })
        .eq("id", userId);

      if (!error) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_verified: nextStatus } : u));
      } else {
        throw error;
      }
      
      setMessage({ type: "success", text: `User verification status updated successfully!` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBadge = async (userId, currentBadge) => {
    const badges = ["None", "Top Pro", "Rising Star", "Verified Student"];
    const currentIndex = badges.indexOf(currentBadge || "None");
    const nextIndex = (currentIndex + 1) % badges.length;
    const nextBadge = badges[nextIndex] === "None" ? null : badges[nextIndex];

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ badge: nextBadge })
        .eq("id", userId);

      if (!error) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, badge: nextBadge } : u));
      } else {
        throw error;
      }

      setMessage({ type: "success", text: `User badge updated to ${nextBadge || "None"}` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (!error) {
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        throw error;
      }

      setMessage({ type: "error", text: "User has been removed from the platform." });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    let matchesStatus = true;
    if (statusFilter === "verified") matchesStatus = user.is_verified === true;
    if (statusFilter === "unverified") matchesStatus = user.is_verified === false;
    if (statusFilter === "student_verified") matchesStatus = user.student_status === true;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-headline-md text-(--color-on-background)">
          Users & Verification
        </h1>
        <p className="text-body-sm text-(--color-on-surface-variant) mt-1">
          Manage platform roles, grant badges, verify credentials, and handle suspensions.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg text-sm font-semibold border ${
          message.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-800 border-red-200"
        } animate-in slide-in-from-top-2`}>
          {message.text}
        </div>
      )}

      {/* Filters bar */}
      <div className="bg-white p-5 rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-(--color-outline)" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-(--color-outline-variant)/50 rounded-md text-sm outline-none focus:border-(--color-primary) transition-all"
          />
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white border border-(--color-outline-variant)/50 rounded-md px-3 py-2 text-xs font-semibold outline-none text-gray-700"
          >
            <option value="all">All Roles</option>
            <option value="student">Student Workers</option>
            <option value="employer">Employers</option>
            <option value="admin">Admins</option>
          </select>

          {/* Verification Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-(--color-outline-variant)/50 rounded-md px-3 py-2 text-xs font-semibold outline-none text-gray-700"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified Account</option>
            <option value="unverified">Unverified Account</option>
            <option value="student_verified">Student Status Confirmed</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-(--radius-lg) border border-(--color-outline-variant)/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex justify-center">
            <span className="inline-block w-8 h-8 border-4 border-(--color-primary)/30 border-t-(--color-primary) rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-gray-500">
            No users match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-(--color-outline-variant)/20 text-xs font-bold uppercase tracking-wider text-gray-500">
                  <th className="p-4 pl-6">User</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Trust Score</th>
                  <th className="p-4">Verification</th>
                  <th className="p-4">Badge</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--color-outline-variant)/20">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors text-sm">
                    {/* User profile details */}
                    <td className="p-4 pl-6 flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-600 text-base">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        user.role === "admin" ? "bg-red-100 text-red-800" :
                        user.role === "employer" ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Trust Score */}
                    <td className="p-4 font-semibold text-gray-700">
                      {user.trust_score || 100} / 100
                    </td>

                    {/* Verification Status */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {user.is_verified ? (
                          <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <ShieldCheck className="w-4 h-4" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500 text-xs font-bold bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                            <ShieldAlert className="w-4 h-4" /> Unverified
                          </span>
                        )}
                        
                        {user.student_status && (
                          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium border border-indigo-200">
                            Student
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="p-4 text-xs font-medium text-gray-600">
                      {user.badge ? (
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-1 rounded font-bold border border-blue-200">
                          <Award className="w-3.5 h-3.5" /> {user.badge}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right space-x-1.5">
                      {/* Verify/Unverify Toggle */}
                      <button 
                        onClick={() => handleToggleVerify(user.id, user.is_verified)}
                        title={user.is_verified ? "Unverify User" : "Verify User"}
                        className={`p-2 rounded-md border transition-colors ${
                          user.is_verified 
                            ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200" 
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-emerald-200"
                        }`}
                      >
                        {user.is_verified ? <ShieldAlert className="w-4.5 h-4.5" /> : <ShieldCheck className="w-4.5 h-4.5" />}
                      </button>

                      {/* Rotate Badge */}
                      <button 
                        onClick={() => handleUpdateBadge(user.id, user.badge)}
                        title="Rotate Badge status"
                        className="p-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <Award className="w-4.5 h-4.5" />
                      </button>

                      {/* Delete profile */}
                      <button 
                        onClick={() => handleDeleteUser(user.id)}
                        title="Remove User"
                        className="p-2 bg-gray-50 text-gray-500 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
