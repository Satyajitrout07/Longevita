import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AuthPage from './components/AuthPage';
import MemberDashboard from './components/dashboard/MemberDashboard';
import DoctorPortal from './components/doctor/DoctorPortal';
import AdminPortal from './components/admin/AdminPortal';
import { HealthDataProvider } from './context/HealthContext';

export default function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.toLowerCase();
    if (hash === '#admin' || hash === '#admin-dashboard') return 'admin';
    if (hash === '#doctor' || hash === '#doctor-portal') return 'doctor';
    if (hash === '#dashboard') return 'dashboard';
    if (hash === '#login') return 'login';
    if (hash === '#signup' || hash === '#get-started') return 'signup';
    return 'landing';
  });

  // Dark mode state with localStorage persistence and system preference fallback
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('longevita_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('longevita_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('longevita_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin' || hash === '#admin-dashboard') setCurrentView('admin');
      else if (hash === '#doctor' || hash === '#doctor-portal') setCurrentView('doctor');
      else if (hash === '#dashboard') setCurrentView('dashboard');
      else if (hash === '#login') setCurrentView('login');
      else if (hash === '#signup' || hash === '#get-started') setCurrentView('signup');
      else if (hash === '#home' || hash === '') setCurrentView('landing');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view) => {
    setCurrentView(view);
    if (view === 'admin') {
      window.location.hash = '#admin';
    } else if (view === 'doctor') {
      window.location.hash = '#doctor';
    } else if (view === 'dashboard') {
      window.location.hash = '#dashboard';
    } else if (view === 'login') {
      window.location.hash = '#login';
    } else if (view === 'signup') {
      window.location.hash = '#signup';
    } else {
      window.location.hash = '#home';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <HealthDataProvider>
      {currentView === 'admin' ? (
        <AdminPortal
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          onNavigateHome={() => navigate('landing')}
          onSwitchToDoctor={() => navigate('doctor')}
          onSwitchToMember={() => navigate('dashboard')}
        />
      ) : currentView === 'doctor' ? (
        <DoctorPortal
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          onNavigateHome={() => navigate('landing')}
          onSwitchToMember={() => navigate('dashboard')}
          onSwitchToAdmin={() => navigate('admin')}
        />
      ) : currentView === 'dashboard' ? (
        <MemberDashboard 
          isDark={isDark} 
          toggleDarkMode={toggleDarkMode} 
          onNavigateHome={() => navigate('landing')}
          onSwitchToDoctor={() => navigate('doctor')}
          onSwitchToAdmin={() => navigate('admin')}
        />
      ) : currentView === 'signup' || currentView === 'login' ? (
        <AuthPage 
          key={currentView} 
          initialMode={currentView} 
          onNavigate={navigate} 
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <div className="relative min-h-screen bg-white dark:bg-[#07131D] text-slate-800 dark:text-slate-100 flex flex-col justify-between selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-900/60 dark:selection:text-teal-100 transition-colors duration-300">
          {/* Top subtle organic ambient glow */}
          <div 
            className="absolute top-0 right-1/4 w-[700px] h-[400px] bg-gradient-to-b from-[#E6FAF7]/60 dark:from-teal-950/30 via-[#F0FDF4]/30 dark:via-emerald-950/20 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          <div>
            <Navbar 
              onNavigate={navigate} 
              isDark={isDark} 
              toggleDarkMode={toggleDarkMode} 
            />
            <main>
              <Hero onNavigate={navigate} />
            </main>
          </div>

          {/* Subtle minimalistic footer */}
          <footer className="w-full py-6 border-t border-slate-100/80 dark:border-slate-800/80 text-center text-xs text-slate-400 dark:text-slate-500 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>© {new Date().getFullYear()} Longevita Health Inc. All rights reserved.</p>
              <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400 flex-wrap justify-center">
                <button 
                  type="button"
                  onClick={() => navigate('dashboard')} 
                  className="font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                >
                  Member Dashboard
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('doctor')} 
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Doctor Portal (Dr. Rao)
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('admin')} 
                  className="font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                >
                  Admin Dashboard (Overview)
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('login')} 
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button 
                  type="button"
                  onClick={() => navigate('signup')} 
                  className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </HealthDataProvider>
  );
}
