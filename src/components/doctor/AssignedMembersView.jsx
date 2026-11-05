import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  Heart,
  Droplets,
  Activity,
  ArrowUpRight,
  Shield,
  Stethoscope
} from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function AssignedMembersView({ 
  onOpenChart, 
  onScheduleFollowUp,
  recordsFocus = false 
}) {
  const { assignedMembers } = useHealthData();
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('All');
  const [planFilter, setPlanFilter] = useState('All');

  // Filter members based on search and filters
  const filteredMembers = assignedMembers.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.riskReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.allergies.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRisk = 
      riskFilter === 'All' || 
      m.riskTier.toLowerCase() === riskFilter.toLowerCase();

    const matchesPlan = 
      planFilter === 'All' || 
      m.plan.toLowerCase() === planFilter.toLowerCase();

    return matchesSearch && matchesRisk && matchesPlan;
  });

  const countByRisk = (tier) => assignedMembers.filter(m => m.riskTier.toLowerCase() === tier.toLowerCase()).length;

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {recordsFocus ? 'Patient Medical Records & EHR' : 'Assigned Members Roster'}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
              {assignedMembers.length} Active Patients
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {recordsFocus 
              ? 'Access electronic health charts, comprehensive lab history, and clinical documentation for your assigned cohort.' 
              : 'Complete longevity patient cohort with real-time biomarker triage, vitals summaries, and record access.'}
          </p>
        </div>

        {recordsFocus && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              HIPAA & EHR Compliant
            </span>
          </div>
        )}
      </div>

      {/* 2. Search & Risk Filter Toolbar */}
      <div className="bg-white dark:bg-[#091724] p-4 sm:p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, risk factor, allergy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>

          {/* Plan Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Plan:</span>
            {['All', 'Premium', 'Executive'].map((plan) => (
              <button
                key={plan}
                type="button"
                onClick={() => setPlanFilter(plan)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  planFilter === plan
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {plan}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Triage Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Risk Triage:
          </span>

          <button
            type="button"
            onClick={() => setRiskFilter('All')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              riskFilter === 'All'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Members ({assignedMembers.length})
          </button>

          <button
            type="button"
            onClick={() => setRiskFilter('Attention Needed')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              riskFilter === 'Attention Needed'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Attention Needed ({countByRisk('Attention Needed')})
          </button>

          <button
            type="button"
            onClick={() => setRiskFilter('Moderate Risk')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              riskFilter === 'Moderate Risk'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 hover:bg-orange-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            Moderate Risk ({countByRisk('Moderate Risk')})
          </button>

          <button
            type="button"
            onClick={() => setRiskFilter('Optimal')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              riskFilter === 'Optimal'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Optimal Longevity ({countByRisk('Optimal')})
          </button>
        </div>
      </div>

      {/* 3. Patient List Cards */}
      <div className="space-y-5">
        {filteredMembers.length === 0 ? (
          <div className="bg-white dark:bg-[#091724] rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No patients match your search criteria</h3>
            <p className="text-xs text-slate-400 mt-1">Try resetting the filter or search with another term.</p>
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setRiskFilter('All'); setPlanFilter('All'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredMembers.map((patient) => {
            const isAttention = patient.riskTier === 'Attention Needed';
            const isModerate = patient.riskTier === 'Moderate Risk';

            return (
              <div 
                key={patient.id}
                className={`bg-white dark:bg-[#091724] rounded-3xl p-6 border transition-all shadow-xs hover:shadow-md ${
                  isAttention
                    ? 'border-amber-200 dark:border-amber-900/60 hover:border-amber-300'
                    : isModerate
                    ? 'border-orange-200 dark:border-orange-900/50 hover:border-orange-300'
                    : 'border-slate-100 dark:border-slate-800 hover:border-teal-500/30'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Left Column: Demographics & Risk Factor */}
                  <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 shadow-xs ${
                      isAttention 
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200' 
                        : isModerate
                        ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200'
                        : 'bg-teal-600 text-white'
                    }`}>
                      {patient.initials}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                          {patient.name}
                        </h3>

                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          isAttention
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : isModerate
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {patient.riskTier}
                        </span>

                        <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {patient.plan} Plan
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                        <span>{patient.gender}, {patient.age} yrs</span>
                        <span>•</span>
                        <span>Blood: <strong className="text-slate-700 dark:text-slate-300">{patient.bloodGroup}</strong></span>
                        <span>•</span>
                        <span>Allergies: <strong className={patient.allergies !== 'None reported' ? 'text-rose-600' : 'text-slate-700 dark:text-slate-300'}>{patient.allergies}</strong></span>
                      </div>

                      {/* Clinical Risk Reason Note */}
                      <div className="pt-1">
                        <p className={`text-xs font-semibold flex items-center gap-1.5 ${
                          isAttention 
                            ? 'text-amber-700 dark:text-amber-300' 
                            : isModerate 
                            ? 'text-orange-700 dark:text-orange-300' 
                            : 'text-emerald-700 dark:text-emerald-400'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            isAttention ? 'bg-amber-500' : isModerate ? 'bg-orange-500' : 'bg-emerald-500'
                          }`} />
                          {patient.riskReason}
                        </p>
                      </div>

                      {/* Contact details */}
                      <div className="flex items-center gap-4 text-[11.5px] text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {patient.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          {patient.mobile}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Column: Live Vitals Strip */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 flex items-center gap-4 sm:gap-6 justify-between lg:justify-start">
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] uppercase font-bold text-slate-400">BP</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">{patient.vitalSummary.bp}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Heart Rate</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">{patient.vitalSummary.hr}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] uppercase font-bold text-slate-400">BMI</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5">{patient.vitalSummary.bmi}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Vitamin D</p>
                      <p className={`text-xs sm:text-sm font-bold mt-0.5 ${
                        parseFloat(patient.vitalSummary.vitaminD) < 30 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600'
                      }`}>
                        {patient.vitalSummary.vitaminD}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Actions & EHR Launch */}
                  <div className="flex sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onOpenChart(patient)}
                      className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{recordsFocus ? 'Open Medical Chart' : 'View Full Chart'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onScheduleFollowUp && onScheduleFollowUp(patient)}
                      className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Schedule Follow-up</span>
                    </button>
                  </div>

                </div>

                {/* Footer Bar: Next consultation & Notes indicator */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 flex-wrap gap-2">
                  <div className="flex items-center gap-4">
                    <span>Last Consult: <strong className="text-slate-700 dark:text-slate-300">{patient.lastConsultation}</strong></span>
                    <span>•</span>
                    <span>Next Consult: <strong className="text-teal-600 dark:text-teal-400 font-semibold">{patient.nextConsultation}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {patient.notes?.length || 0} Clinical Documentation Notes
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
