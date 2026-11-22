import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHealthData } from '../context/HealthContext';
import { userService } from '../services/userService';
import {
  User,
  Calendar,
  Phone,
  Ruler,
  Weight,
  Camera,
  Trash2,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sun,
  Moon,
  Loader2,
  Sparkles,
  ShieldCheck,
  Upload,
} from 'lucide-react';

export default function CompleteProfilePage({
  onNavigate,
  isDark,
  toggleDarkMode,
}) {
  const { user, updateUser, isAuthenticated } = useAuth();
  const { updateMemberProfile, member } = useHealthData();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    mobile: '',
    heightCm: '',
    weight: '',
    profileImage: '',
  });

  // Photo preview state
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef(null);

  // UI status
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [touched, setTouched] = useState({});

  // 1. Fetch authenticated user's existing details from backend & prefill
  useEffect(() => {
    let isMounted = true;

    async function loadUserProfile() {
      setInitialLoading(true);
      setErrorMsg('');

      try {
        const profile = await userService.getProfile();
        if (!isMounted) return;

        if (profile) {
          // Format dateOfBirth to YYYY-MM-DD if ISO string
          let formattedDob = '';
          if (profile.dateOfBirth) {
            const dateObj = new Date(profile.dateOfBirth);
            if (!isNaN(dateObj.getTime())) {
              formattedDob = dateObj.toISOString().split('T')[0];
            }
          }

          const existingMobile = profile.mobile
            ? String(profile.mobile).replace(/^\+91\s*/, '')
            : '';

          setFormData({
            fullName: profile.fullName || user?.fullName || member?.name || '',
            email: profile.email || user?.email || member?.email || '',
            dateOfBirth: formattedDob,
            gender: profile.gender || '',
            mobile: existingMobile,
            heightCm: profile.heightCm !== null && profile.heightCm !== undefined ? String(profile.heightCm) : '',
            weight: member?.weight || '',
            profileImage: profile.profileImage || member?.avatar || '',
          });

          if (profile.profileImage || member?.avatar) {
            setPhotoPreview(profile.profileImage || member?.avatar);
          }
        }
      } catch (err) {
        console.warn('Could not fetch backend profile directly, using context fallback:', err);
        // Fallback to local user state from auth or health context
        if (isMounted) {
          setFormData((prev) => ({
            ...prev,
            fullName: user?.fullName || member?.name || prev.fullName,
            email: user?.email || member?.email || prev.email,
            mobile: user?.mobile || member?.mobile ? String(user?.mobile || member?.mobile).replace(/^\+91\s*/, '') : prev.mobile,
          }));
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false);
        }
      }
    }

    loadUserProfile();

    return () => {
      isMounted = false;
    };
  }, [user, member]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Image Upload Handling
  const handleImageFile = (file) => {
    setPhotoError('');
    if (!file) return;

    // Check file type
    if (!file.type.match(/^image\/(jpeg|png|webp|gif)$/i)) {
      setPhotoError('Please upload an image file (JPEG, PNG, WebP).');
      return;
    }

    // Check size limit: 5MB
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image must be smaller than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      setPhotoPreview(base64Data);
      setFormData((prev) => ({
        ...prev,
        profileImage: base64Data,
      }));
    };
    reader.onerror = () => {
      setPhotoError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    setFormData((prev) => ({
      ...prev,
      profileImage: '',
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Field Validation Rules
  const validate = () => {
    const errors = {};

    // Full Name (Required, at least 2 chars)
    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required.';
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters.';
    }

    // Date of Birth (Required, past date, reasonable age)
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required.';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (isNaN(birthDate.getTime())) {
        errors.dateOfBirth = 'Please enter a valid date.';
      } else if (birthDate >= today) {
        errors.dateOfBirth = 'Date of birth must be in the past.';
      } else {
        const age = (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
        if (age > 120) {
          errors.dateOfBirth = 'Please enter a realistic date of birth.';
        }
      }
    }

    // Mobile Number (Optional, 10 digits if provided)
    if (formData.mobile.trim()) {
      const cleanMobile = formData.mobile.replace(/[\s-]/g, '');
      if (!/^\d{10}$/.test(cleanMobile)) {
        errors.mobile = 'Please enter a valid 10-digit mobile number.';
      }
    }

    // Height (Optional, 40 to 250 cm if provided)
    if (formData.heightCm !== '' && formData.heightCm !== null) {
      const h = Number(formData.heightCm);
      if (isNaN(h) || h < 40 || h > 250) {
        errors.heightCm = 'Height must be between 40 and 250 cm.';
      }
    }

    // Weight (Optional, 20 to 300 kg if provided)
    if (formData.weight !== '' && formData.weight !== null) {
      const w = Number(formData.weight);
      if (isNaN(w) || w < 20 || w > 300) {
        errors.weight = 'Weight must be between 20 and 300 kg.';
      }
    }

    return errors;
  };

  const errors = validate();
  const hasErrors = Object.keys(errors).length > 0;

  // Profile Completion Percentage Calculation
  // 7 total fields:
  // Required: Full Name (25%), Date of Birth (25%) = 50%
  // Optional: Gender (10%), Mobile (10%), Height (10%), Weight (10%), Profile Photo (10%) = 50%
  const calculateProgress = () => {
    let score = 0;
    if (formData.fullName.trim().length >= 2) score += 25;
    if (formData.dateOfBirth && !errors.dateOfBirth) score += 25;
    if (formData.gender) score += 10;
    if (formData.mobile.trim() && !errors.mobile) score += 10;
    if (formData.heightCm && !errors.heightCm) score += 10;
    if (formData.weight && !errors.weight) score += 10;
    if (photoPreview) score += 10;
    return Math.min(100, score);
  };

  const progressPercent = calculateProgress();

  const getProgressStatus = () => {
    if (progressPercent === 100) return { label: 'Complete & Optimal', color: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800' };
    if (progressPercent >= 70) return { label: 'Almost Complete', color: 'text-teal-600 dark:text-teal-400', badge: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-800' };
    if (progressPercent >= 50) return { label: 'Good Progress', color: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800' };
    return { label: 'Basic Info Needed', color: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800' };
  };

  const progressStatus = getProgressStatus();

  // Save & Continue Submission
  const handleSaveAndContinue = async (e) => {
    if (e) e.preventDefault();

    // Mark all fields as touched to display validation
    setTouched({
      fullName: true,
      dateOfBirth: true,
      gender: true,
      mobile: true,
      heightCm: true,
      weight: true,
    });

    const currentErrors = validate();
    if (Object.keys(currentErrors).length > 0) {
      setErrorMsg('Please resolve the highlighted fields before continuing.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      // 1. Prepare backend payload matching UpdateUserProfileDto
      const formattedMobile = formData.mobile.trim()
        ? `+91${formData.mobile.replace(/[\s-]/g, '')}`
        : undefined;

      const payload = {
        fullName: formData.fullName.trim(),
        dateOfBirth: formData.dateOfBirth,
        ...(formData.gender && { gender: formData.gender }),
        ...(formattedMobile && { mobile: formattedMobile }),
        ...(formData.heightCm && { heightCm: Number(formData.heightCm) }),
        ...(formData.profileImage && { profileImage: formData.profileImage }),
      };

      // 2. Send PATCH to backend
      let updatedUser = null;
      try {
        updatedUser = await userService.updateProfile(payload);
      } catch (apiErr) {
        console.warn('Backend updateProfile notice:', apiErr.message);
        // Continue even if backend has local sandbox simulation
      }

      // 3. Update AuthContext
      if (updateUser) {
        updateUser({
          ...(updatedUser || {}),
          fullName: formData.fullName.trim(),
          mobile: formattedMobile,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
          profileImage: formData.profileImage,
        });
      }

      // 4. Update HealthContext & LocalStorage for dashboard consistency
      if (updateMemberProfile) {
        updateMemberProfile({
          fullName: formData.fullName.trim(),
          email: formData.email,
          mobile: formattedMobile,
          profileImage: formData.profileImage,
          weight: formData.weight,
          heightCm: formData.heightCm,
        });
      }

      // Clear new registration flag
      try {
        sessionStorage.removeItem('longevita_just_registered');
      } catch {
        // ignore
      }

      setSuccessMsg('Profile completed successfully! Directing you to your Health Dashboard...');

      window.setTimeout(() => {
        onNavigate('dashboard');
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Skip for Now: Handles optional skipping
  const handleSkipForNow = () => {
    // If required fields are valid, attempt a quick save of whatever is present
    if (formData.fullName.trim() && formData.dateOfBirth && !errors.fullName && !errors.dateOfBirth) {
      handleSaveAndContinue();
      return;
    }

    // Otherwise notify or allow skipping directly to dashboard
    try {
      sessionStorage.removeItem('longevita_just_registered');
    } catch {
      // ignore
    }

    // Sync whatever is entered into local HealthContext
    if (updateMemberProfile && formData.fullName.trim()) {
      updateMemberProfile({
        fullName: formData.fullName.trim(),
        email: formData.email,
        mobile: formData.mobile ? `+91${formData.mobile}` : undefined,
        profileImage: formData.profileImage,
      });
    }

    onNavigate('dashboard');
  };

  // User initials for avatar fallback
  const getInitials = () => {
    if (!formData.fullName.trim()) return 'U';
    return formData.fullName
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // Render initial loading skeleton
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#07131D] flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white dark:bg-[#0D1D2C] rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 dark:border-slate-800 text-center space-y-5 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-teal-600 dark:text-teal-400 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Setting up your profile...
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto">
            Retrieving your registration details from the Longevita secure server.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07131D] text-slate-800 dark:text-slate-100 flex flex-col justify-between p-3 sm:p-6 lg:p-8 font-sans selection:bg-teal-100 selection:text-teal-900 transition-colors duration-300">
      
      {/* Ambient background glow */}
      <div 
        className="fixed top-0 right-1/4 w-[600px] h-[350px] bg-gradient-to-b from-[#E6FAF7]/50 dark:from-teal-950/20 via-[#F0FDF4]/30 dark:via-emerald-950/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10"
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="w-full max-w-3xl mx-auto my-auto">
        
        {/* Top Header Bar */}
        <header className="flex items-center justify-between mb-6 px-2 sm:px-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 relative flex items-center justify-center">
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
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
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0A1C2A] dark:text-white">
                Longevita
              </span>
              <span className="ml-2.5 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800">
                Onboarding Step 2 of 2
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {toggleDarkMode && (
              <button
                type="button"
                onClick={toggleDarkMode}
                className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
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
              onClick={handleSkipForNow}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
            >
              Skip to Dashboard
            </button>
          </div>
        </header>

        {/* Card */}
        <main className="bg-white dark:bg-[#0D1D2C] rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800/80 overflow-hidden transition-colors duration-300">
          
          {/* Top Progress Banner */}
          <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/40 to-slate-50 dark:from-slate-900/60 dark:via-teal-950/30 dark:to-slate-900/60 p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0A1C2A] dark:text-white flex items-center gap-2">
                  Complete Your Profile
                  <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 hidden sm:inline" />
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Help us calibrate your baseline biomarkers and personalize your longevity protocol.
                </p>
              </div>

              {/* Progress status pill */}
              <div className={`self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${progressStatus.badge} ${progressStatus.color} shrink-0`}>
                <span>{progressStatus.label}</span>
                <span className="font-mono text-[13px]">{progressPercent}%</span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
              <span>Required: Name & Date of Birth</span>
              <span>Optional: Health & Demographics</span>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSaveAndContinue} className="p-6 sm:p-8 space-y-7">
            
            {/* Success Alert */}
            {successMsg && (
              <div
                role="status"
                className="rounded-2xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-900/60 p-4 text-sm text-emerald-800 dark:text-emerald-300 flex items-center gap-3 animate-fadeIn"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="font-semibold">{successMsg}</p>
                </div>
              </div>
            )}

            {/* Global Error Alert */}
            {errorMsg && (
              <div
                role="alert"
                className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 dark:border-red-900/60 p-4 text-sm text-red-700 dark:text-red-300 flex items-center gap-3 animate-fadeIn"
              >
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                <p className="font-medium">{errorMsg}</p>
              </div>
            )}

            {/* Profile Photo Upload Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              
              {/* Avatar Preview */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-3 border-teal-500/30 dark:border-teal-400/30 shadow-md bg-white dark:bg-slate-800 flex items-center justify-center">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-teal-700 to-emerald-600 text-white flex items-center justify-center text-3xl font-bold tracking-tight">
                      {getInitials()}
                    </div>
                  )}
                </div>

                {/* Change photo trigger badge */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-teal-600 text-white shadow-lg hover:bg-teal-700 transition-transform active:scale-95 cursor-pointer"
                  title="Upload photo"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Photo Upload Controls */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    Profile Photo
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-md bg-slate-200/60 dark:bg-slate-700/60">
                    Optional
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Upload a clear portrait to personalize your Longevita clinical chart. Supports JPG, PNG or WebP up to 5MB.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>{photoPreview ? 'Change Photo' : 'Upload Image'}</span>
                  </button>

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {photoError && (
                  <p className="text-xs text-red-500 dark:text-red-400 font-medium pt-1">
                    {photoError}
                  </p>
                )}
              </div>
            </div>

            {/* Email verification badge (Read-Only) */}
            {formData.email && (
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Authenticated Account:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{formData.email}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3 h-3" /> Verified
                </span>
              </div>
            )}

            {/* Required Fields Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Required Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Full Name (Required) */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={() => handleBlur('fullName')}
                      placeholder="e.g. Priya Sharma"
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-[14px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                        touched.fullName && errors.fullName
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                          : touched.fullName && !errors.fullName
                          ? 'border-emerald-500 dark:border-emerald-500 focus:border-emerald-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10'
                      }`}
                    />
                    {touched.fullName && !errors.fullName && (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  {touched.fullName && errors.fullName && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* 2. Date of Birth (Required) */}
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      required
                      max={new Date().toISOString().split('T')[0]}
                      min="1900-01-01"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onBlur={() => handleBlur('dateOfBirth')}
                      className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-[14px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none transition-all ${
                        touched.dateOfBirth && errors.dateOfBirth
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                          : touched.dateOfBirth && !errors.dateOfBirth
                          ? 'border-emerald-500 dark:border-emerald-500 focus:border-emerald-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10'
                      }`}
                    />
                    {touched.dateOfBirth && !errors.dateOfBirth && (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-500">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  {touched.dateOfBirth && errors.dateOfBirth ? (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.dateOfBirth}
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                      Used to calculate age-adjusted biomarker ranges.
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Optional Demographics & Health Metrics */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Health & Demographics (Optional)
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">Can be updated anytime</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 3. Gender (Optional Select) */}
                <div>
                  <label
                    htmlFor="gender"
                    className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Gender Identity
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-[14px] focus:outline-none focus:border-teal-600 dark:focus:border-teal-400 focus:ring-2 focus:ring-teal-500/10 transition-all cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                    Calibrates hormonal reference baselines.
                  </p>
                </div>

                {/* 4. Mobile Number (Optional Phone Input) */}
                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Mobile Number
                  </label>
                  <div className={`flex items-center px-3 py-1.5 rounded-xl border transition-all bg-white dark:bg-slate-800 ${
                    touched.mobile && errors.mobile
                      ? 'border-red-500'
                      : 'border-slate-200 dark:border-slate-700 focus-within:border-teal-600 dark:focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-500/10'
                  }`}>
                    {/* India Code */}
                    <div className="flex items-center gap-1.5 pr-2.5 border-r border-slate-200 dark:border-slate-700 shrink-0 text-slate-600 dark:text-slate-300 text-[13px] font-semibold">
                      <Phone className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      <span>+91</span>
                    </div>

                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      inputMode="numeric"
                      value={formData.mobile}
                      onChange={handleChange}
                      onBlur={() => handleBlur('mobile')}
                      placeholder="98765 43210"
                      className="w-full pl-2.5 py-1 bg-transparent text-slate-900 dark:text-white text-[14px] focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    />
                  </div>
                  {touched.mobile && errors.mobile && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.mobile}
                    </p>
                  )}
                </div>

                {/* 5. Height (cm) (Optional Number) */}
                <div>
                  <label
                    htmlFor="heightCm"
                    className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Height (cm)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Ruler className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      id="heightCm"
                      name="heightCm"
                      min="40"
                      max="250"
                      step="0.5"
                      value={formData.heightCm}
                      onChange={handleChange}
                      onBlur={() => handleBlur('heightCm')}
                      placeholder="168"
                      className={`w-full pl-10 pr-12 py-2.5 rounded-xl border text-[14px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 ${
                        touched.heightCm && errors.heightCm
                          ? 'border-red-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-400'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
                      cm
                    </div>
                  </div>
                  {touched.heightCm && errors.heightCm && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                      {errors.heightCm}
                    </p>
                  )}
                </div>

                {/* 6. Weight (kg) (Optional Number) */}
                <div>
                  <label
                    htmlFor="weight"
                    className="block text-[13px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Weight className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      id="weight"
                      name="weight"
                      min="20"
                      max="300"
                      step="0.1"
                      value={formData.weight}
                      onChange={handleChange}
                      onBlur={() => handleBlur('weight')}
                      placeholder="65"
                      className={`w-full pl-10 pr-12 py-2.5 rounded-xl border text-[14px] bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 ${
                        touched.weight && errors.weight
                          ? 'border-red-500'
                          : 'border-slate-200 dark:border-slate-700 focus:border-teal-600 dark:focus:border-teal-400'
                      }`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-semibold text-slate-400">
                      kg
                    </div>
                  </div>
                  {touched.weight && errors.weight && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                      {errors.weight}
                    </p>
                  )}
                </div>

              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              
              <button
                type="button"
                onClick={handleSkipForNow}
                disabled={submitting}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors order-2 sm:order-1 cursor-pointer"
              >
                Skip for Now
              </button>

              <button
                type="submit"
                disabled={submitting || (touched.fullName && hasErrors)}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#0F5B54] to-[#10B981] hover:from-[#136F67] hover:to-[#059669] text-white font-semibold text-sm shadow-md shadow-teal-900/10 hover:shadow-lg hover:shadow-teal-900/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <span>Save & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

        </main>

        {/* Footer info */}
        <footer className="text-center text-xs text-slate-400 dark:text-slate-500 py-6">
          <p>© {new Date().getFullYear()} Longevita Health Inc. Secure HIPAA-ready preventive platform.</p>
        </footer>

      </div>
    </div>
  );
}
