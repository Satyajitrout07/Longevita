import React, { useState } from 'react';
import { Search, ChevronDown, User, MoreHorizontal, ShieldCheck, Mail, Phone, Plus } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function AdminMembersView() {
  const { assignedMembers, updateMemberPlan } = useHealthData();
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('All Plans');
  const [editingMember, setEditingMember] = useState(null);

  const filteredMembers = assignedMembers.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlan = 
      planFilter === 'All Plans' || 
      m.plan.toLowerCase() === planFilter.toLowerCase();
    return matchesSearch && matchesPlan;
  });

  const handlePlanChange = (memberId, newPlan) => {
    updateMemberPlan(memberId, newPlan);
    setEditingMember(null);
    alert(`Updated ${memberId} subscription plan to ${newPlan}. Persisted in localStorage.`);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-7 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Platform Members Directory
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage active platform members, subscription assignments, and care teams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            2,540 Total Members Registered
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#091724] p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
          >
            <option value="All Plans">All Plans</option>
            <option value="Essential">Essential (₹2,999/yr)</option>
            <option value="Advanced">Advanced (₹5,999/yr)</option>
            <option value="Premium">Premium (₹9,999/yr)</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-white dark:bg-[#091724] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-bold text-slate-500">
                <th className="py-4 px-6">Member</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Subscription Plan</th>
                <th className="py-4 px-4">Assigned Clinician</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-[13px]">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80'}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-[11px] text-slate-400">ID: {member.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    <p>{member.email}</p>
                    <p className="text-[11px] text-slate-400">{member.mobile}</p>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      member.plan === 'Premium'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                        : member.plan === 'Advanced'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300'
                    }`}>
                      {member.plan}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-700 dark:text-slate-200 font-medium">
                    Dr. Ananya Rao
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      Active
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => setEditingMember(member)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs cursor-pointer"
                    >
                      Change Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Change Plan Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Update Plan for {editingMember.name}
            </h3>
            <div className="space-y-2">
              {['Essential', 'Advanced', 'Premium'].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePlanChange(editingMember.id, p)}
                  className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                    editingMember.plan === p
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {p} Plan {p === 'Advanced' && '(₹5,999/yr)'} {p === 'Premium' && '(₹9,999/yr)'} {p === 'Essential' && '(₹2,999/yr)'}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setEditingMember(null)}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
