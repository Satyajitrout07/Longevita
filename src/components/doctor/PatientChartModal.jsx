import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  User, 
  Plus, 
  Calendar,
  Send,
  Droplets,
  Heart,
  Scale
} from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function PatientChartModal({ patient, isOpen, onClose, onScheduleFollowUp }) {
  const { 
    addClinicalNote, 
    labReports, 
    doctorReviewLabReport, 
    doctor 
  } = useHealthData();

  const [activeTab, setActiveTab] = useState('vitals'); // 'vitals', 'notes', 'labs'
  const [newNote, setNewNote] = useState('');
  const [reviewNote, setReviewNote] = useState('');

  if (!isOpen || !patient) return null;

  // Filter lab reports for this patient
  const patientReports = labReports.filter(r => r.patientId === patient.id || patient.id === 'pat-1');

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addClinicalNote(patient.id, newNote);
    setNewNote('');
  };

  const handleReviewReport = (reportId) => {
    doctorReviewLabReport(reportId, reviewNote || 'Verified and approved by Dr. Ananya Rao.', 'Reviewed');
    alert('Report marked as Reviewed. Status updated in Member Portal.');
    setReviewNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden relative">
        
        {/* Header Bar */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {patient.initials}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {patient.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  patient.riskTier === 'Optimal'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {patient.riskTier}
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {patient.plan} Plan
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {patient.gender}, {patient.age} yrs • Blood Group: <strong className="text-slate-700 dark:text-slate-300">{patient.bloodGroup}</strong> • Allergies: <strong className="text-rose-600">{patient.allergies}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-6 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('vitals')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'vitals'
                ? 'text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Clinical Vitals & Biomarkers
            {activeTab === 'vitals' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'notes'
                ? 'text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Consultation Notes ({patient.notes?.length || 0})
            {activeTab === 'notes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('labs')}
            className={`pb-3 relative transition-colors ${
              activeTab === 'labs'
                ? 'text-teal-600 dark:text-teal-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            Diagnostic Lab Panels ({patientReports.length})
            {activeTab === 'labs' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 dark:bg-teal-400 rounded-full" />}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. Clinical Vitals Tab */}
          {activeTab === 'vitals' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                  <span className="text-xs text-slate-400 block mb-1">Blood Pressure</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{patient.vitalSummary.bp} mmHg</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">● In Target</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                  <span className="text-xs text-slate-400 block mb-1">Resting Heart Rate</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{patient.vitalSummary.hr}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">● Normal</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
                  <span className="text-xs text-slate-400 block mb-1">BMI & Weight</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{patient.vitalSummary.bmi} ({patient.vitalSummary.weight})</span>
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">● Normal</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
                  <span className="text-xs text-amber-700 dark:text-amber-400 block mb-1">25-OH Vitamin D</span>
                  <span className="text-lg font-bold text-amber-900 dark:text-amber-200">{patient.vitalSummary.vitaminD}</span>
                  <span className="text-[11px] text-amber-700 dark:text-amber-300 font-bold block mt-0.5">▲ Below Target (&lt; 30)</span>
                </div>
              </div>

              {/* Physician Observation Card */}
              <div className="p-5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50">
                <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-1">
                  Longevity Physician Assessment
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  Patient exhibits excellent cardiovascular recovery, resting heart rate, and BMI control. Primary intervention focus is optimizing micronutrient status (25-OH Vitamin D) to support cellular senescence defense and bone turnover.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-400">Next Scheduled Consultation: <strong className="text-slate-700 dark:text-slate-200">{patient.nextConsultation}</strong></p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onScheduleFollowUp) onScheduleFollowUp(patient);
                  }}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  Schedule Follow-up Task
                </button>
              </div>
            </div>
          )}

          {/* 2. Clinical Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    Add Clinical Consultation Note
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Signed by: {doctor.name}</span>
                </div>
                <textarea
                  rows="3"
                  required
                  placeholder="Record diagnosis, protocol alterations, lifestyle instructions, or lab orders..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                ></textarea>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0A1C2A] dark:bg-teal-500 text-white dark:text-[#06131D] text-xs font-bold hover:bg-[#142C3E] shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save to Clinical Record</span>
                  </button>
                </div>
              </form>

              {/* Notes Timeline */}
              <div className="space-y-3">
                {patient.notes && patient.notes.length > 0 ? (
                  patient.notes.map((note) => (
                    <div key={note.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-2xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-teal-700 dark:text-teal-400">{note.author}</span>
                        <span className="text-slate-400">{note.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No previous notes recorded.</p>
                )}
              </div>
            </div>
          )}

          {/* 3. Diagnostic Labs Tab */}
          {activeTab === 'labs' && (
            <div className="space-y-4">
              {patientReports.map((report) => (
                <div key={report.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-2xs flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{report.category}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          report.status === 'Reviewed' 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {report.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{report.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{report.findings}</p>
                    </div>

                    {report.status === 'Pending Review' ? (
                      <button
                        type="button"
                        onClick={() => handleReviewReport(report.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                      >
                        Sign & Mark Reviewed
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-semibold shrink-0 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Signed by Dr. Rao</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
