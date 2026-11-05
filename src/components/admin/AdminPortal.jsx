import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopHeader from './AdminTopHeader';
import AdminOverview from './AdminOverview';
import AdminMembersView from './AdminMembersView';
import AdminSubscriptionsView from './AdminSubscriptionsView';
import AdminPaymentsView from './AdminPaymentsView';
import AdminAppointmentsView from './AdminAppointmentsView';
import AdminCliniciansView from './AdminCliniciansView';
import AdminReportsView from './AdminReportsView';
import { useHealthData } from '../../context/HealthContext';

export default function AdminPortal({ 
  isDark, 
  toggleDarkMode, 
  onNavigateHome, 
  onSwitchToDoctor,
  onSwitchToMember 
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'members', 'clinicians', 'appointments', 'subscriptions', 'payments', 'reports', 'settings'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { adminUser } = useHealthData();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07131D] text-slate-800 dark:text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-purple-100 selection:text-purple-900 transition-colors duration-300">
      
      {/* 1. Admin Sidebar matching Image 2 */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onSwitchToMember={onSwitchToMember}
        onSwitchToDoctor={onSwitchToDoctor}
        onNavigateHome={onNavigateHome}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header matching Image 2 */}
        <AdminTopHeader
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          onSwitchToDoctor={onSwitchToDoctor}
          onSwitchToMember={onSwitchToMember}
        />

        {/* Dynamic Views */}
        <main className="flex-1 overflow-y-auto">
          
          {/* OVERVIEW (Image 2 exact match) */}
          {activeTab === 'overview' && (
            <AdminOverview onSelectTab={setActiveTab} />
          )}

          {/* MEMBERS DIRECTORY */}
          {activeTab === 'members' && (
            <AdminMembersView />
          )}

          {/* CLINICIANS NETWORK */}
          {activeTab === 'clinicians' && (
            <AdminCliniciansView />
          )}

          {/* APPOINTMENTS SCHEDULE */}
          {activeTab === 'appointments' && (
            <AdminAppointmentsView />
          )}

          {/* SUBSCRIPTIONS & PRICING (Image 1 exact match) */}
          {activeTab === 'subscriptions' && (
            <AdminSubscriptionsView />
          )}

          {/* PAYMENTS & BILLING */}
          {activeTab === 'payments' && (
            <AdminPaymentsView />
          )}

          {/* REPORTS & ANALYTICS */}
          {activeTab === 'reports' && (
            <AdminReportsView />
          )}

          {/* SETTINGS */}
          {activeTab === 'settings' && (
            <div className="p-6 sm:p-8 lg:p-10 max-w-4xl mx-auto space-y-6 animate-fadeIn">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Settings & Credentials</h1>
              <div className="bg-white dark:bg-[#091724] rounded-3xl p-6 border border-slate-100 dark:border-slate-800 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Administrator Name</label>
                  <input type="text" readOnly value={adminUser.name} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1">Administrator Email</label>
                  <input type="email" readOnly value={adminUser.email} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm" />
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-600">HIPAA & GDPR Security Shield Active</span>
                  <span className="text-xs font-mono text-slate-400">Longevita Core v2.4</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
