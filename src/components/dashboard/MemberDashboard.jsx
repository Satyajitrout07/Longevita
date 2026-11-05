import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import DashboardOverview from './DashboardOverview';
import HealthMetricsView from './HealthMetricsView';
import LabReportsView from './LabReportsView';
import BookAppointmentModal from './BookAppointmentModal';
import LogMarkerModal from './LogMarkerModal';
import { useHealthData } from '../../context/HealthContext';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Download, 
  Upload, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Award, 
  Plus,
  Trash2,
  TrendingUp,
  Shield,
  Activity
} from 'lucide-react';

export default function MemberDashboard({ 
  isDark, 
  toggleDarkMode, 
  onNavigateHome,
  onSwitchToDoctor,
  onSwitchToAdmin 
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');

  const { 
    member, 
    healthMarkers, 
    appointments, 
    cancelAppointment, 
    labReports, 
    addLabReport, 
    careTeamMessages, 
    sendCareMessage,
    markMessagesRead
  } = useHealthData();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendCareMessage(chatInput);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07131D] text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-teal-100 selection:text-teal-900 transition-colors duration-300">
      
      {/* 1. Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'messages') markMessagesRead();
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onNavigateHome={onNavigateHome}
        onSwitchToDoctor={onSwitchToDoctor}
        onSwitchToAdmin={onSwitchToAdmin}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <TopHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          onNavigateHome={onNavigateHome}
          onSwitchToDoctor={onSwitchToDoctor}
          onSwitchToAdmin={onSwitchToAdmin}
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto">
          {/* Main Dashboard View */}
          {activeTab === 'dashboard' && (
            <DashboardOverview
              onOpenBookModal={() => setIsBookModalOpen(true)}
              onOpenLogModal={() => setIsLogModalOpen(true)}
              onSelectTab={setActiveTab}
            />
          )}

          {/* Health Metrics View (Matches reference image for Health Records / Insights) */}
          {(activeTab === 'records' || activeTab === 'insights') && (
            <HealthMetricsView />
          )}

          {/* Lab Reports View (Matches reference image for Lab Reports) */}
          {activeTab === 'reports' && (
            <LabReportsView />
          )}

          {/* Appointments View */}
          {activeTab === 'appointments' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-6xl mx-auto space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#0A1C2A] dark:text-white">Scheduled Appointments</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage your consultations and checkups with the care team</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Schedule Consultation</span>
                </button>
              </div>

              {appointments.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700">
                  <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-300 font-medium">No upcoming consultations booked.</p>
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(true)}
                    className="mt-4 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
                  >
                    Book Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((appt) => (
                    <div 
                      key={appt.id} 
                      className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-xs space-y-4"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                            {appt.status}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2">{appt.doctor}</h3>
                          <p className="text-xs text-slate-400">{appt.specialty}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => cancelAppointment(appt.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                          title="Cancel appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-teal-600" />
                          <span>{appt.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-teal-600" />
                          <span>{appt.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Plan View (Image 1 Plan Integration) */}
          {activeTab === 'plan' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-5xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold text-[#0A1C2A] dark:text-white">Longevity Health Membership</h1>
              <div className="bg-gradient-to-br from-teal-900 to-[#0A1C2A] text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
                <div className="relative z-10 max-w-xl space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 border border-teal-600/40 text-xs font-bold text-teal-200">
                    <Award className="w-3.5 h-3.5" />
                    Tier: {member.plan} Plan
                  </div>
                  <h2 className="text-3xl font-extrabold tracking-tight">Personalised Preventive Care</h2>
                  <p className="text-sm text-teal-100/90 leading-relaxed">
                    Full ongoing genomic, metabolic, and cardiovascular surveillance supervised by Dr. Ananya Rao with priority direct messaging and quarterly 40-biomarker analysis.
                  </p>
                  <div className="pt-4 flex items-center gap-4 text-xs font-mono">
                    <span className="bg-teal-950/60 px-3 py-1.5 rounded-lg border border-teal-700">Member ID: {member.id}</span>
                    <span className="bg-teal-950/60 px-3 py-1.5 rounded-lg border border-teal-700">Billing: ₹9,999 / year</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages View */}
          {activeTab === 'messages' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-6 flex flex-col h-[750px]">
              <div>
                <h1 className="text-2xl font-bold text-[#0A1C2A] dark:text-white">Care Team Direct Channel</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Directly communicate with Dr. Ananya Rao and clinical coordinators</p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {careTeamMessages.map((msg) => {
                  const isMe = msg.sender === member.name;
                  return (
                    <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {msg.avatar || 'MD'}
                        </div>
                      )}
                      <div className={`max-w-md p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isMe 
                          ? 'bg-[#0A1C2A] text-white rounded-br-xs' 
                          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-xs shadow-xs'
                      }`}>
                        <div className="flex items-center justify-between gap-4 mb-1">
                          <span className="text-[11px] font-bold opacity-75">{msg.sender}</span>
                          <span className="text-[10px] opacity-60">{msg.time}</span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Ask your care team a question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="p-3 rounded-xl bg-[#0A1C2A] dark:bg-teal-500 text-white dark:text-[#06131D] hover:bg-[#142C3E] cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-6">
              <h1 className="text-2xl font-bold text-[#0A1C2A] dark:text-white">Account & Preferences</h1>
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 space-y-6 shadow-xs">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Member Profile</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
                      <input type="text" readOnly value={member.name} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 text-slate-800 dark:text-slate-200" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 block mb-1">Email</label>
                      <input type="email" readOnly value={member.email} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 text-slate-800 dark:text-slate-200" />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Theme & Display</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Dark Mode</p>
                      <p className="text-xs text-slate-400">Switch between light and high-contrast dark themes</p>
                    </div>
                    <button
                      type="button"
                      onClick={toggleDarkMode}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Modals */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
      />

      <LogMarkerModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />

    </div>
  );
}
