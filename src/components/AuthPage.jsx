import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  EyeOff,
  ArrowLeft,
  Check,
  Sun,
  Moon,
} from 'lucide-react';
import authScenic from '../assets/auth-scenic.jpg';

export default function AuthPage({
  initialMode = 'signup',
  onNavigate,
  isDark,
  toggleDarkMode,
}) {
  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (mode === 'signup' && !agreedToTerms) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    if (mode === 'signup' && formData.password.length < 12) {
      setError('Password must contain at least 12 characters.');
      return;
    }

    setLoading(true);

    try {
      let user;

      if (mode === 'signup') {
        // Current backend DTO accepts fullName, email and password.
        // Mobile is not sent until the backend supports it.
        user = await register({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });
      } else {
        user = await login({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });
      }

      setSuccess(
        mode === 'signup'
          ? 'Account created successfully!'
          : 'Login successful!'
      );

      const role = String(user?.role || 'MEMBER').toUpperCase();

      window.setTimeout(() => {
        if (role === 'DOCTOR') {
          onNavigate('doctor');
        } else if (
          role === 'ADMIN' ||
          role === 'CLINIC_ADMIN' ||
          role === 'SUPER_ADMIN'
        ) {
          onNavigate('admin');
        } else {
          onNavigate('dashboard');
        }
      }, 400);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07131D] flex items-center justify-center p-3 sm:p-6 lg:p-10 font-sans selection:bg-teal-100 selection:text-teal-900 transition-colors duration-300">

      {/* Container Card */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#0D1D2C] rounded-3xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 min-h-[640px] transition-colors duration-300">

        {/* Left Side: Form Panel */}
        <div className="lg:col-span-6 p-7 sm:p-10 lg:p-12 flex flex-col justify-between">

          <div>
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-8">
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="flex items-center gap-2.5 group focus:outline-none"
              >
                <div className="w-9 h-9 relative flex items-center justify-center">
                  <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8 transform group-hover:scale-105 transition-transform duration-200"
                  >
                    <path
                      d="M17 31C16 23 9.5 13 4 8C7.5 7.5 15.5 12 17.5 20C18.5 25 18 29 17 31Z"
                      fill="#0F5B54"
                    />
                    <path
                      d="M18 27C19.5 18 24.5 9 32 5C30.5 12 26 22 20 28C19 29 18 28 18 27Z"
                      fill="#10B981"
                    />
                  </svg>
                </div>

                <span className="text-[23px] font-bold tracking-[-0.03em] text-[#0A1C2A] dark:text-white transition-colors duration-200">
                  Longevita
                </span>
              </button>

              <div className="flex items-center gap-2">
                {toggleDarkMode && (
                  <button
                    type="button"
                    onClick={toggleDarkMode}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Toggle dark mode"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {isDark ? (
                      <Sun className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Moon className="w-4 h-4 text-slate-700" />
                    )}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onNavigate('landing')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Home</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div className="mb-7">
              <h1 className="text-[28px] sm:text-[32px] font-bold text-[#0A1C2A] dark:text-white tracking-[-0.02em] leading-tight mb-2 transition-colors duration-200">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </h1>

              <p className="text-[14.5px] text-slate-500 dark:text-slate-400 font-normal transition-colors duration-200">
                {mode === 'signup'
                  ? 'Start your preventive health journey.'
                  : 'Continue your preventive health journey.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Error Message */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400"
                >
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div
                  role="status"
                  className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900 dark:text-emerald-400"
                >
                  {success}
                </div>
              )}

              {/* Full Name */}
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[13.5px] font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Full name
                  </label>

                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Priya Sharma"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white text-[14.5px] focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-[13.5px] font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                >
                  Email
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="priya@gmail.com"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white text-[14.5px] focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
              </div>

              {/* Mobile Number */}
              {mode === 'signup' && (
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-[13.5px] font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Mobile number
                  </label>

                  <div className="flex items-center px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-500/10 transition-all bg-white dark:bg-slate-800/90">

                    {/* India Flag */}
                    <div className="flex items-center gap-2 pr-3 border-r border-slate-200 dark:border-slate-700 shrink-0">
                      <svg
                        className="w-6 h-4 rounded-xs shadow-2xs overflow-hidden"
                        viewBox="0 0 900 600"
                        aria-label="India flag"
                      >
                        <path fill="#FF9933" d="M0 0h900v200H0z" />
                        <path fill="#FFFFFF" d="M0 200h900v200H0z" />
                        <path fill="#128807" d="M0 400h900v200H0z" />
                        <circle
                          cx="450"
                          cy="300"
                          r="80"
                          fill="none"
                          stroke="#000080"
                          strokeWidth="10"
                        />
                        <circle cx="450" cy="300" r="16" fill="#000080" />
                      </svg>

                      <span className="text-[14.5px] font-medium text-slate-700 dark:text-slate-200">
                        +91
                      </span>
                    </div>

                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      inputMode="tel"
                      autoComplete="tel-national"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="98765 43210"
                      className="w-full pl-3.5 py-0.5 bg-transparent text-slate-900 dark:text-white text-[14.5px] focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-[13.5px] font-medium text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>

                  {mode === 'login' && (
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset link sent to your email.');
                      }}
                      className="text-[13px] font-medium text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>

                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    autoComplete={
                      mode === 'signup' ? 'new-password' : 'current-password'
                    }
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white text-[14.5px] focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Remember Me */}
              {mode === 'signup' ? (
                <div className="flex items-start gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className={`mt-0.5 w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors ${
                      agreedToTerms
                        ? 'bg-[#0A1C2A] dark:bg-teal-500 text-white dark:text-[#06131D]'
                        : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                    aria-checked={agreedToTerms}
                    role="checkbox"
                  >
                    {agreedToTerms && (
                      <Check className="w-3 h-3 stroke-[3]" />
                    )}
                  </button>

                  <label
                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                    className="text-[12.5px] text-slate-600 dark:text-slate-400 cursor-pointer select-none leading-tight"
                  >
                    I agree to the{' '}
                    <a
                      href="#terms"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="#privacy"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              ) : (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors ${
                      rememberMe
                        ? 'bg-[#0A1C2A] dark:bg-teal-500 text-white dark:text-[#06131D]'
                        : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                    aria-checked={rememberMe}
                    role="checkbox"
                  >
                    {rememberMe && (
                      <Check className="w-3 h-3 stroke-[3]" />
                    )}
                  </button>

                  <span
                    onClick={() => setRememberMe(!rememberMe)}
                    className="text-[13px] text-slate-600 dark:text-slate-400 cursor-pointer select-none"
                  >
                    Remember me for 30 days
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || (mode === 'signup' && !agreedToTerms)}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0A1C2A] dark:bg-teal-500 dark:text-[#06131D] dark:hover:bg-teal-400 hover:bg-[#142C3E] text-white text-[15px] font-semibold transition-all duration-150 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading
                    ? 'Please wait...'
                    : mode === 'signup'
                      ? 'Create account'
                      : 'Log in'}
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Switcher */}
          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            {mode === 'signup' ? (
              <p className="text-[13.5px] text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccess('');
                    setMode('login');
                  }}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-1 focus:outline-none cursor-pointer"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p className="text-[13.5px] text-slate-600 dark:text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccess('');
                    setMode('signup');
                  }}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-1 focus:outline-none cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Scenic Hero Image */}
        <div className="lg:col-span-6 relative hidden lg:block overflow-hidden bg-slate-900">

          <img
            src={authScenic}
            alt="Woman sitting on rock overlooking lake and mountains"
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/40 pointer-events-none" />

          <div className="relative z-10 h-full p-10 xl:p-12 flex flex-col justify-between">

            <div>
              <h2 className="text-[34px] xl:text-[38px] font-extrabold text-[#0A1C2A] leading-[1.18] tracking-[-0.03em] max-w-sm">
                Proactive care <br />
                today for a <br />
                healthier tomorrow.
              </h2>
            </div>

            <div className="flex items-start gap-3 bg-black/30 backdrop-blur-md rounded-2xl px-5 py-4 border border-white/20 max-w-[320px]">
              <div className="text-white/90 text-2xl font-serif leading-none mt-0.5">
                “
              </div>

              <p className="text-[15px] font-medium text-white/95 leading-snug">
                Health is a journey <br />
                not a destination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}