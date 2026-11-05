import React, { useState } from 'react';
import DoctorSidebar from './DoctorSidebar';
import DoctorTopHeader from './DoctorTopHeader';
import DoctorPatientsList from './DoctorPatientsList';
import PatientRecordView from './PatientRecordView';
import PatientChartModal from './PatientChartModal';
import { useHealthData } from '../../context/HealthContext';
import { 
  Calendar, 
  Clock, 
  Video, 
  Send, 
  MessageSquare, 
  User, 
  CheckCircle, 
  ShieldCheck,
  Stethoscope,
  Plus,
  FileText,
  FileSpreadsheet,
  BookOpen
} from 'lucide-react';

export default function DoctorPortal({ 
  isDark, 
  toggleDarkMode, 
  onNavigateHome, 
  onSwitchToMember,
  onSwitchToAdmin 
}) {
  const [activeTab, setActiveTab] = useState('patients'); // 'patients', 'appointments', 'reports', 'notes', 'careplans', 'messages', 'resources'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedRecordPatient, setSelectedRecordPatient] = useState(null);
  
  // Patient Chart Modal state
  const [modalPatient, setModalPatient] = useState(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  // Chat input state
  const [chatInput, setChatInput] = useState('');

  const { 
    doctor, 
    assignedMembers, 
    appointments, 
    labReports,
    doctorReviewLabReport,
    careTeamMessages, 
    doctorSendMessage 
  } = useHealthData();

  const handleOpenChartModal = (patient) => {
    setModalPatient(patient);
    setIsChartModalOpen(true);
  };

  const handleSelectPatientForRecord = (patient) => {
    setSelectedRecordPatient(patient);
    setActiveTab('patients');
  };

  const handleSendDoctorMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    doctorSendMessage(chatInput.trim());
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07131D] text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-teal-100 selection:text-teal-900 transition-colors duration-300">
      
      {/* 1. Physician Sidebar matching Image 3 */}
      <DoctorSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'patients') setSelectedRecordPatient(null);
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onSwitchToMember={onSwitchToMember}
        onSwitchToAdmin={onSwitchToAdmin}
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header matching Image 3 & 4 */}
        <DoctorTopHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          onSwitchToMember={onSwitchToMember}
          onSwitchToAdmin={onSwitchToAdmin}
        />

        {/* Dynamic Views */}
        <main className="flex-1 overflow-y-auto">
          
          {/* TAB: MY PATIENTS / PATIENT RECORD (Images 3 & 4) */}
          {activeTab === 'patients' && (
            selectedRecordPatient ? (
              <PatientRecordView
                patient={selectedRecordPatient}
                onBack={() => setSelectedRecordPatient(null)}
                onOpenChartModal={handleOpenChartModal}
              />
            ) : (
              <DoctorPatientsList
                onSelectPatient={handleSelectPatientForRecord}
              />
            )
          )}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Appointments & Consultations
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage upcoming longevity consultations, telehealth sessions, and follow-ups.
                  </p>
                </div>
                <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {appointments.length} Consultations Booked
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {appointments.map((appt) => {
                  const patient = assignedMembers.find(m => m.id === 'pat-1') || assignedMembers[0];
                  return (
                    <div 
                      key={appt.id}
                      className="bg-white dark:bg-[#091724] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4 hover:border-blue-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={patient.avatar}
                            alt={patient.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                              {patient.name}
                            </h3>
                            <p className="text-xs text-slate-400">
                              Age {patient.age} • {patient.plan} Plan
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          {appt.type || 'Video Call'}
                        </span>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Calendar className="w-4 h-4 text-blue-600" /> Date:
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">{appt.date}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-4 h-4 text-blue-600" /> Time:
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">{appt.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => alert(`Launching encrypted telehealth session with ${patient.name}...`)}
                          className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Start Video Consultation</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectPatientForRecord(patient)}
                          className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs cursor-pointer"
                        >
                          Record
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: LAB REPORTS */}
          {activeTab === 'reports' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                    Diagnostic Lab Reports
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Review and sign off on laboratory biomarker panels submitted across your patient cohort.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {labReports.map((rep) => (
                  <div 
                    key={rep.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#091724] border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${rep.status === 'Reviewed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">{rep.title}</h3>
                        <span className="text-xs text-slate-400 font-mono">({rep.date})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 italic">"{rep.findings}"</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        rep.status === 'Reviewed'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {rep.status}
                      </span>
                      {rep.status !== 'Reviewed' && (
                        <button
                          type="button"
                          onClick={() => {
                            doctorReviewLabReport(rep.id, 'Verified and approved by Dr. Ananya Rao.', 'Reviewed');
                            alert(`Report "${rep.title}" marked as Reviewed and updated in Member Portal.`);
                          }}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          Approve & Sign
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: NOTES */}
          {activeTab === 'notes' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6 animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Clinical Documentation Notes
              </h1>
              <div className="space-y-4">
                {assignedMembers.flatMap(m => (m.notes || []).map(n => ({ ...n, patientName: m.name, patientAvatar: m.avatar }))).map((note) => (
                  <div key={note.id} className="bg-white dark:bg-[#091724] p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={note.patientAvatar} alt={note.patientName} className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{note.patientName}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{note.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CARE PLANS */}
          {activeTab === 'careplans' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6 animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Longevity Protocols & Care Plans
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white dark:bg-[#091724] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Priya Sharma — Metabolic Optimization</h3>
                  <p className="text-xs text-slate-500">2000 IU D3 + K2 daily, 150 min zone-2 cardio/week, fasting glucose monitoring.</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">Active Protocol</span>
                </div>
                <div className="bg-white dark:bg-[#091724] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Rahul Mehta — Cardiovascular Protection</h3>
                  <p className="text-xs text-slate-500">Ambulatory BP logging, magnesium taurate 400mg, stress reduction biofeedback.</p>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">Under Review</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6 animate-fadeIn">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Patient Messaging & Clinical Advice
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Secure asynchronous care channel with Priya Sharma.
                </p>
              </div>

              <div className="bg-white dark:bg-[#091724] rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col h-[600px] overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={assignedMembers[0].avatar} alt="Priya" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Priya Sharma</h4>
                      <p className="text-xs text-emerald-600 font-medium">Active Member • Premium Plan</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4">
                  {careTeamMessages.map((msg) => {
                    const isDoctor = msg.sender === doctor.name || msg.avatar === doctor.initials;
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${isDoctor ? 'ml-auto flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isDoctor ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                        }`}>
                          {msg.avatar}
                        </div>
                        <div>
                          <div className={`p-4 rounded-2xl text-xs sm:text-sm ${
                            isDoctor
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none'
                          }`}>
                            <p>{msg.text}</p>
                          </div>
                          <p className={`text-[10px] text-slate-400 mt-1 ${isDoctor ? 'text-right' : ''}`}>
                            {msg.sender} • {msg.time}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendDoctorMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#091724] flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Write clinical recommendation or answer..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 cursor-pointer shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: RESOURCES */}
          {activeTab === 'resources' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6 animate-fadeIn">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Clinical Longevity References
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#091724] border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">ApoB vs LDL-C Longevity Guidelines</h4>
                  <p className="text-xs text-slate-400 mt-1">Preventive cardiology target levels for arterial health and plaque regression.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#091724] border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Continuous Glucose Monitoring (CGM) Ranges</h4>
                  <p className="text-xs text-slate-400 mt-1">Time-in-range (&gt; 90%) and post-prandial glycemic excursion criteria.</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Patient EHR Modal */}
      <PatientChartModal
        patient={modalPatient}
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
      />

    </div>
  );
}
