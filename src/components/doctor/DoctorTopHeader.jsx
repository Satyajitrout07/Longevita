import React from 'react';
import { Bell, Sun, Moon, ArrowLeftRight, Menu, ShieldAlert } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function DoctorTopHeader({ 
  onToggleMobileMenu, 
  isDark, 
  toggleDarkMode,
  onSwitchToMember,
  onSwitchToAdmin 
}) {
  const { doctor, pendingLabReportsCount } = useHealthData();

  return (
    <header className="h-20 bg-white/90 dark:bg-[#091724]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300">
      
      {/* Left: Mobile Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right Controls: Notifications, Role Switchers, Dark mode, Doctor Profile */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        
        {/* Switch to Member Portal */}
        {onSwitchToMember && (
          <button
            type="button"
            onClick={onSwitchToMember}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-200/80 dark:border-teal-800 hover:bg-teal-100 transition-all cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Member View</span>
          </button>
        )}

        {/* Switch to Admin Dashboard */}
        {onSwitchToAdmin && (
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
            <span>Admin View</span>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingLabReportsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>
        </div>

        {/* Doctor Avatar matching Screenshot */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-100 dark:border-slate-800">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80"
            alt={doctor.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500/20"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
              {doctor.name}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
              Doctor
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}
