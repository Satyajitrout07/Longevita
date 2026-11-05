import React, { useState } from 'react';
import { Search, Bell, Menu, Sun, Moon, LogOut, ChevronDown, Check, Stethoscope, ShieldAlert } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function TopHeader({ 
  onToggleMobileMenu, 
  searchQuery, 
  onSearchChange,
  isDark, 
  toggleDarkMode, 
  onNavigateHome,
  onSwitchToDoctor,
  onSwitchToAdmin 
}) {
  const { member, unreadMessagesCount } = useHealthData();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="h-20 bg-white/90 dark:bg-[#091724]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300">
      
      {/* Left: Mobile Menu & Search Input */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Input matching screenshot */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs sm:text-[13.5px] placeholder:text-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions, Notifications, Profile */}
      <div className="flex items-center gap-3 sm:gap-4 ml-4">
        
        {/* Switch to Doctor View Button */}
        {onSwitchToDoctor && (
          <button
            type="button"
            onClick={onSwitchToDoctor}
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Doctor Portal</span>
          </button>
        )}

        {/* Switch to Admin Dashboard Button */}
        {onSwitchToAdmin && (
          <button
            type="button"
            onClick={onSwitchToAdmin}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-800 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Admin View</span>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle theme"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative focus:outline-none cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2 right-2 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-4 z-40 animate-fadeIn">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400">
                  {unreadMessagesCount} new
                </span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/50 text-slate-700 dark:text-slate-200">
                  <p className="font-semibold text-teal-800 dark:text-teal-300">Appointment Confirmed</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">12 Nov 2024 at 10:30 AM with Dr. Ananya Rao.</p>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-750 text-slate-700 dark:text-slate-200">
                  <p className="font-semibold">Lab Report Ready</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Comprehensive Metabolic Panel has been reviewed.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Info matching screenshot */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors focus:outline-none cursor-pointer"
          >
            {/* Green Initial Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#10B981] flex items-center justify-center text-white font-bold text-xs shadow-xs">
              {member.initials}
            </div>

            <div className="hidden sm:flex flex-col items-start text-left">
              <span className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                {member.name}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                {member.role}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-40 animate-fadeIn">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{member.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{member.email}</p>
              </div>

              <div className="py-1">
                {onSwitchToDoctor && (
                  <button
                    type="button"
                    onClick={() => { setProfileDropdownOpen(false); onSwitchToDoctor(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/60"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                    <span>Doctor Portal</span>
                  </button>
                )}

                {onSwitchToAdmin && (
                  <button
                    type="button"
                    onClick={() => { setProfileDropdownOpen(false); onSwitchToAdmin(); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/60"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => { setProfileDropdownOpen(false); toggleDarkMode(); }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/60"
                >
                  <span>Dark Mode</span>
                  <span>{isDark ? '☀️ On' : '🌙 Off'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setProfileDropdownOpen(false); onNavigateHome(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
