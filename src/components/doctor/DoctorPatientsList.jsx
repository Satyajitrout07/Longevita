import React, { useState } from 'react';
import { Search, ChevronDown, MoreHorizontal, User, Calendar, FileText, ArrowUpRight } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function DoctorPatientsList({ onSelectPatient }) {
  const { assignedMembers } = useHealthData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Patients');
  const [sortBy, setSortBy] = useState('Recent');
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Filter and sort patients
  const filteredPatients = assignedMembers.filter((patient) => {
    const matchesSearch = 
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.keyConcerns?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      statusFilter === 'All Patients' ||
      (statusFilter === 'Active' && patient.status === 'Active') ||
      (statusFilter === 'Follow-up' && patient.status === 'Follow-up');

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'Name (A-Z)') return a.name.localeCompare(b.name);
    if (sortBy === 'Age') return a.age - b.age;
    return 0; // Default recent order
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-7 animate-fadeIn">
      
      {/* 1. Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          My Patients
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View and manage your assigned patients
        </p>
      </div>

      {/* 2. Search & Filter Bar matching Image 3 */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
          />
        </div>

        {/* Filter & Sort Dropdowns */}
        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs"
            >
              <option value="All Patients">All Patients</option>
              <option value="Active">Active Only</option>
              <option value="Follow-up">Follow-up Needed</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-xs"
            >
              <option value="Recent">Sort by: Recent</option>
              <option value="Name (A-Z)">Sort by: Name (A-Z)</option>
              <option value="Age">Sort by: Age</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* 3. Patients Table matching Image 3 */}
      <div className="bg-white dark:bg-[#091724] rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 dark:text-slate-400">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-4">Age</th>
                <th className="py-4 px-4">Last Visit</th>
                <th className="py-4 px-6">Key Concerns</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-[13.5px]">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    No patients match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const isActive = patient.status === 'Active';
                  return (
                    <tr
                      key={patient.id}
                      onClick={() => onSelectPatient(patient)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      {/* Name with circular avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={patient.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&q=80'}
                            alt={patient.name}
                            className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200 dark:ring-slate-700"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {patient.name}
                            </span>
                            <span className="block text-[11px] text-slate-400 sm:hidden">
                              Age: {patient.age} • {patient.lastVisit}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Age */}
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {patient.age}
                      </td>

                      {/* Last Visit */}
                      <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                        {patient.lastVisit}
                      </td>

                      {/* Key Concerns */}
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300 font-medium">
                        {patient.keyConcerns || 'Routine Preventive Care'}
                      </td>

                      {/* Status Pill */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          isActive
                            ? 'bg-[#EBFDF5] dark:bg-emerald-950/60 text-[#10B981] dark:text-emerald-400'
                            : 'bg-[#FFF7ED] dark:bg-amber-950/60 text-[#F97316] dark:text-amber-400'
                        }`}>
                          {patient.status}
                        </span>
                      </td>

                      {/* Actions Menu */}
                      <td className="py-4 px-6 text-right relative">
                        <div className="inline-block" onClick={(e) => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => setActiveMenuId(activeMenuId === patient.id ? null : patient.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="Actions"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>

                          {activeMenuId === patient.id && (
                            <div className="absolute right-6 mt-1 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-30 text-left animate-fadeIn">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onSelectPatient(patient);
                                }}
                                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-between"
                              >
                                <span>View Patient Record</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Prescription order dispatched for ${patient.name}.`);
                                }}
                                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                              >
                                Order Lab Panel
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
