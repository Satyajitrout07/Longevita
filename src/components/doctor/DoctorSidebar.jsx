import React from 'react';
import { 
  Users, 
  Calendar, 
  FileSpreadsheet, 
  FileText, 
  ShieldCheck, 
  MessageSquare, 
  BookOpen, 
  LogOut, 
  X,
  Stethoscope,
  ArrowLeftRight,
  ShieldAlert
} from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function DoctorSidebar({ 
  activeTab, 
  onSelectTab, 
  isMobileOpen, 
  onCloseMobile, 
  onSwitchToMember,
  onSwitchToAdmin,
  onNavigateHome 
}) {
  const { doctor, assignedMembers, unreadMessagesCount } = useHealthData();

  // Navigation items matching Image 3 precisely
  const navItems = [
    { id: 'patients', label: 'My Patients', icon: Users, badge: assignedMembers.length },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'reports', label: 'Lab Reports', icon: FileSpreadsheet },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'careplans', label: 'Care Plans', icon: ShieldCheck },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'resources', label: 'Resources', icon: BookOpen },
  ];

  const content = (
    <div className="h-full flex flex-col justify-between py-6 px-4 bg-white dark:bg-[#091724] border-r border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div>
        {/* Brand Header matching Screenshot */}
        <div className="flex items-center justify-between px-3 mb-8">
          <div 
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 relative flex items-center justify-center">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 transform group-hover:scale-105 transition-transform duration-200">
                <path d="M17 31C16 23 9.5 13 4 8C7.5 7.5 15.5 12 17.5 20C18.5 25 18 29 17 31Z" fill="#0F5B54" />
                <path d="M18 27C19.5 18 24.5 9 32 5C30.5 12 26 22 20 28C19 29 18 28 18 27Z" fill="#10B981" />
              </svg>
            </div>
            <span className="text-[22px] font-bold tracking-tight text-[#0A1C2A] dark:text-white">
              Longevita
            </span>
          </div>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-[14px] font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#E8F1FC] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#2563EB] dark:text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    isActive 
                      ? 'bg-[#2563EB] text-white' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switchers & Bottom Links */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 px-1 space-y-1.5">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">
          Role Switcher
        </div>

        {onSwitchToMember && (
          <button
            type="button"
            onClick={onSwitchToMember}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-all cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-teal-600" />
            <span>Member View (Priya)</span>
          </button>
        )}

        {onSwitchToAdmin && (
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12.5px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
            <span>Admin Dashboard</span>
          </button>
        )}

        <button
          type="button"
          onClick={onNavigateHome}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit to Website</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-fadeIn" 
            onClick={onCloseMobile} 
          />
          <div className="relative w-72 h-full z-10 animate-slideRight">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
