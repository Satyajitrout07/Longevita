import React, { useState } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar({ onNavigate, isDark, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#home', active: true },
    { name: 'Member Portal', href: '#dashboard', isDashboard: true },
    { name: 'Doctor Portal', href: '#doctor', isDoctor: true },
    { name: 'Admin Dashboard', href: '#admin', isAdmin: true },
    { name: 'How it works', href: '#how-it-works' },
    { name: 'Plans', href: '#plans' },
  ];

  return (
    <header className="relative z-50 w-full bg-white/80 dark:bg-[#07131D]/85 backdrop-blur-md border-b border-transparent dark:border-slate-800/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-24 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('landing'); }}
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-lg py-1"
        >
          <div className="w-9 h-9 relative flex items-center justify-center">
            {/* Dual Leaf Icon */}
            <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 transform group-hover:scale-105 transition-transform duration-200">
              {/* Left darker teal leaflet */}
              <path
                d="M17 31C16 23 9.5 13 4 8C7.5 7.5 15.5 12 17.5 20C18.5 25 18 29 17 31Z"
                fill="#0F5B54"
              />
              {/* Right vibrant emerald leaflet */}
              <path
                d="M18 27C19.5 18 24.5 9 32 5C30.5 12 26 22 20 28C19 29 18 28 18 27Z"
                fill="#10B981"
              />
            </svg>
          </div>
          <span className="text-[24px] font-bold tracking-[-0.03em] text-[#0A1C2A] dark:text-white transition-colors duration-200">
            Longevita
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                if (link.isAdmin) {
                  e.preventDefault();
                  onNavigate && onNavigate('admin');
                } else if (link.isDoctor) {
                  e.preventDefault();
                  onNavigate && onNavigate('doctor');
                } else if (link.isDashboard) {
                  e.preventDefault();
                  onNavigate && onNavigate('dashboard');
                } else if (link.name === 'Home') {
                  e.preventDefault();
                  onNavigate && onNavigate('landing');
                }
              }}
              className={`text-[14.5px] font-medium transition-colors duration-150 ${
                link.isAdmin
                  ? 'text-purple-700 dark:text-purple-300 font-bold hover:text-purple-800 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800'
                  : link.isDoctor
                  ? 'text-blue-700 dark:text-blue-300 font-bold hover:text-blue-800 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800'
                  : link.isDashboard 
                  ? 'text-teal-600 dark:text-teal-400 font-bold hover:text-teal-700'
                  : link.active
                  ? 'text-[#0A1C2A] dark:text-teal-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-[#0A1C2A] dark:hover:text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Action Buttons & Dark Mode Toggle */}
        <div className="hidden md:flex items-center gap-3.5">
          {/* Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 transform rotate-0 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transform rotate-0 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate && onNavigate('login')}
            className="px-6 py-2.5 text-[14.5px] font-semibold text-[#0A1C2A] dark:text-slate-100 bg-white dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 rounded-full transition-all duration-150 shadow-sm hover:shadow cursor-pointer"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('signup')}
            className="px-7 py-2.5 text-[14.5px] font-semibold text-white bg-[#0A1C2A] dark:bg-teal-500 dark:text-[#06131D] dark:hover:bg-teal-400 hover:bg-[#142C3E] rounded-full transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Hamburger & Dark Mode Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-[#0A1926]/95 backdrop-blur-xl px-6 py-6 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (link.isAdmin) {
                    e.preventDefault();
                    onNavigate && onNavigate('admin');
                  } else if (link.isDoctor) {
                    e.preventDefault();
                    onNavigate && onNavigate('doctor');
                  } else if (link.isDashboard) {
                    e.preventDefault();
                    onNavigate && onNavigate('dashboard');
                  } else if (link.name === 'Home') {
                    e.preventDefault();
                    onNavigate && onNavigate('landing');
                  }
                }}
                className={`text-[16px] font-medium py-1.5 ${
                  link.isAdmin
                    ? 'text-purple-700 dark:text-purple-300 font-bold'
                    : link.isDoctor
                    ? 'text-blue-700 dark:text-blue-300 font-bold'
                    : link.isDashboard
                    ? 'text-teal-600 dark:text-teal-400 font-bold'
                    : link.active ? 'text-[#0A1C2A] dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate && onNavigate('admin'); }}
              className="w-full text-center py-2.5 text-[14px] font-semibold text-purple-800 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 rounded-full"
            >
              Admin Dashboard (Overview)
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate && onNavigate('doctor'); }}
              className="w-full text-center py-2.5 text-[14px] font-semibold text-blue-800 dark:text-blue-200 bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 rounded-full"
            >
              Doctor Portal (Dr. Ananya Rao)
            </button>
            <button
              type="button"
              onClick={() => { setMobileMenuOpen(false); onNavigate && onNavigate('dashboard'); }}
              className="w-full text-center py-2.5 text-[14px] font-semibold text-teal-800 dark:text-teal-200 bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 rounded-full"
            >
              Member Dashboard (Priya Sharma)
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
