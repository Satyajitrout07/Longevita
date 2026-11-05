import React, { useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  AlertTriangle, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Video, 
  ArrowRight, 
  TrendingUp,
  Activity,
  Droplets,
  Heart,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Filter
} from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function DoctorOverview({ 
  onOpenChart, 
  onScheduleFollowUp, 
  onSelectTab 
}) {
  const { 
    doctor, 
    assignedMembers, 
    appointments, 
    labReports, 
    doctorReviewLabReport, 
    pendingLabReportsCount 
  } = useHealthData();

  const [activeFilter, setActiveFilter] = useState('all');
  const [telehealthActive, setTelehealthActive] = useState(null);

  // Filter urgent attention members
  const urgentPatients = assignedMembers.filter(m => m.riskTier === 'Attention Needed');
  const pendingReports = labReports.filter(r => r.status === 'Pending Review');

  const handleStartCall = (patientName) => {
    setTelehealthActive(patientName);
    setTimeout(() => {
      setTelehealthActive(null);
      alert(`Telehealth room launched for ${patientName}. Encrypted WebRTC audio/video channel active.`);
    }, 1200);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* 1. Welcome & Clinical Status Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-teal-800 to-[#0A2E2B] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-radial from-teal-500/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/80 border border-teal-600/40 text-[11px] font-bold tracking-wider uppercase text-teal-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Longevita Preventive & Longevity Clinic
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {doctor.name}
          </h1>
          <p className="text-teal-100/90 text-sm max-w-xl">
            {doctor.degrees} • {doctor.specialty}. You have <strong className="text-white underline decoration-amber-400">{urgentPatients.length} patients</strong> with biomarker alerts requiring clinical protocol review today.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <div className="bg-teal-950/60 border border-teal-700/50 backdrop-blur-md rounded-2xl px-4 py-3 text-right">
            <p className="text-[11px] text-teal-300 uppercase font-semibold">Today's Schedule</p>
            <p className="text-lg font-bold text-white">{appointments.length} Consultations</p>
          </div>
          <button
            type="button"
            onClick={() => onSelectTab && onSelectTab('members')}
            className="px-5 py-3 rounded-2xl bg-white text-teal-900 font-bold text-xs sm:text-sm hover:bg-teal-50 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <span>Patient Roster</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Key Clinical Metrics (4 KPI Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Assigned Patients */}
        <div 
          onClick={() => onSelectTab && onSelectTab('members')}
          className="bg-white dark:bg-[#091724] p-5 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              Active Cohort
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {assignedMembers.length}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Assigned Longevity Members
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
            <span>View All Patients</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Consultations Scheduled */}
        <div 
          onClick={() => onSelectTab && onSelectTab('consultations')}
          className="bg-white dark:bg-[#091724] p-5 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              Today
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {appointments.length}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Today's Consultations
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
            <span>View Schedule</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Biomarker Alerts */}
        <div 
          onClick={() => onSelectTab && onSelectTab('members')}
          className="bg-white dark:bg-[#091724] p-5 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              Action Req.
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {urgentPatients.length}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Biomarker Risk Alerts
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            <span>Prioritize Triage</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Pending Lab Sign-offs */}
        <div 
          onClick={() => onSelectTab && onSelectTab('records')}
          className="bg-white dark:bg-[#091724] p-5 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              Diagnostics
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {pendingLabReportsCount}
            </h3>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Pending Lab Reviews
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
            <span>Review & Approve</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* 3. Two Column Layout: Urgent Biomarker Queue + Today's Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Urgent Attention Queue */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Urgent Biomarker Action Queue
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Patients with out-of-range clinical metrics requiring physician verification
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950 px-3 py-1 rounded-full">
              {urgentPatients.length} Priority Cases
            </span>
          </div>

          <div className="space-y-4">
            {urgentPatients.map((patient) => (
              <div 
                key={patient.id}
                className="bg-white dark:bg-[#091724] rounded-3xl p-5 border border-amber-200/60 dark:border-amber-900/40 shadow-xs hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold flex items-center justify-center shrink-0 text-base">
                    {patient.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {patient.name}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        {patient.riskTier}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({patient.gender}, {patient.age}y)
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      {patient.riskReason}
                    </p>

                    {/* Vitals summary badges */}
                    <div className="flex items-center gap-3 mt-3 flex-wrap text-[11.5px] text-slate-600 dark:text-slate-300">
                      <span className="bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                        BP: <strong className="text-slate-900 dark:text-white">{patient.vitalSummary.bp}</strong>
                      </span>
                      <span className="bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                        HR: <strong className="text-slate-900 dark:text-white">{patient.vitalSummary.hr}</strong>
                      </span>
                      <span className="bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                        Vit D: <strong className="text-amber-600 dark:text-amber-400">{patient.vitalSummary.vitaminD}</strong>
                      </span>
                      <span className="bg-slate-50 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-700">
                        BMI: <strong className="text-slate-900 dark:text-white">{patient.vitalSummary.bmi}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Patient actions */}
                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onOpenChart(patient)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer text-center"
                  >
                    Open Clinical Chart
                  </button>
                  <button
                    type="button"
                    onClick={() => onScheduleFollowUp && onScheduleFollowUp(patient)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer text-center"
                  >
                    + Follow-up Task
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Diagnostic Panels Awaiting Review */}
          <div className="mt-8 bg-white dark:bg-[#091724] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" />
                  Diagnostic Panels Awaiting Sign-off
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Reports uploaded by Longevita Diagnostics ready for physician interpretation
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                {pendingReports.length} Pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingReports.map((report) => (
                <div 
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                        {report.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {report.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {report.category} • {report.biomarkers?.length || 4} biomarkers analyzed
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 italic">
                      "{report.findings}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const priya = assignedMembers.find(m => m.id === 'pat-1');
                        if (priya) onOpenChart(priya);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      View Report
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        doctorReviewLabReport(report.id, 'Verified and approved by Dr. Ananya Rao.', 'Reviewed');
                        alert(`Report "${report.title}" approved and verified! Updated in Priya's Member Portal.`);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Approve & Sign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Today's Consultation Schedule */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Today's Consultations
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Scheduled telehealth & review sessions
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
            </span>
          </div>

          <div className="bg-white dark:bg-[#091724] rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
            {appointments.map((appt, idx) => {
              const matchedMember = assignedMembers.find(m => m.name.toLowerCase() === appt.doctor?.toLowerCase() || m.id === 'pat-1') || assignedMembers[0];
              const isConnecting = telehealthActive === (appt.doctor || 'Priya Sharma');

              return (
                <div 
                  key={appt.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                        {appt.time}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
                        {appt.doctor || 'Priya Sharma'}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {appt.specialty || 'Longevity & Metabolic Consultation'}
                      </p>
                    </div>
                    <span className="px-2 py-1 rounded-md text-[10.5px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                      {appt.type || 'Video Call'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                    <button
                      type="button"
                      disabled={isConnecting}
                      onClick={() => handleStartCall(appt.doctor || 'Priya Sharma')}
                      className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{isConnecting ? 'Connecting...' : 'Start Video Call'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenChart(matchedMember)}
                      className="py-2 px-3 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      Chart
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Quick Consultation Slot Adder */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => onSelectTab && onSelectTab('consultations')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                + View Full Consultation Calendar
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
