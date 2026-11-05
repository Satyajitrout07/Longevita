import React from 'react';
import { Bell, Sun, Moon, ArrowLeftRight, Stethoscope, Menu } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function AdminTopHeader({ 
  onToggleMobileMenu, 
  isDark, 
  toggleDarkMode,
  onSwitchToDoctor,
  onSwitchToMember 
}) {
  const { adminUser } = useHealthData();

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

      {/* Right Controls matching Image 2 */}
      <div className="flex items-center gap-3 sm:gap-4 ml-auto">
        
        {/* Switch to Doctor */}
        {onSwitchToDoctor && (
          <button
            type="button"
            onClick={onSwitchToDoctor}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/80 border border-teal-200/80 dark:border-teal-800 hover:bg-teal-100 transition-all cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor View</span>
          </button>
        )}

        {/* Switch to Member */}
        {onSwitchToMember && (
          <button
            type="button"
            onClick={onSwitchToMember}
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Member View</span>
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

        {/* Bell Notifications */}
        <div className="relative">
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Profile matching Image 2 */}
        <div className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-slate-100 dark:border-slate-800">
          <div className="w-9 h-9 rounded-full bg-[#6366F1] text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {adminUser.initials || 'AU'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
              {adminUser.name}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium leading-tight">
              {adminUser.role}
            </p>
          </div>
        </div>

      </div>

    </header>
  );
}
