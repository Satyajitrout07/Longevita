import React, { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Camera, CheckCircle2, Loader2, Pencil, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

const emptyProfile = {
  fullName: '',
  email: '',
  mobile: '',
  dateOfBirth: '',
  gender: '',
  heightCm: '',
  profileImage: '',
  role: '',
  status: '',
};

function unwrapProfile(value) {
  return value?.profile || value?.user || value || {};
}

function normalizeProfile(value) {
  const source = unwrapProfile(value);
  const date = source.dateOfBirth ? new Date(source.dateOfBirth) : null;
  return {
    ...emptyProfile,
    ...source,
    fullName: source.fullName || source.name || '',
    email: source.email || '',
    mobile: source.mobile || '',
    dateOfBirth: date && !Number.isNaN(date.getTime()) ? date.toISOString().slice(0, 10) : '',
    gender: source.gender || '',
    heightCm: source.heightCm ?? '',
    profileImage: source.profileImage || source.avatar || '',
    role: source.role || '',
    status: source.accountStatus || source.status || (source.isActive === true ? 'Active' : source.isActive === false ? 'Inactive' : ''),
  };
}

function displayValue(value) {
  return value !== null && value !== undefined && String(value).trim() ? value : 'Not provided';
}

export default function MyProfileView({ onBack }) {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(() => normalizeProfile(user));
  const [form, setForm] = useState(() => normalizeProfile(user));
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validation, setValidation] = useState({});
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await userService.getProfile();
        if (!active) return;
        const loaded = normalizeProfile({ ...user, ...unwrapProfile(response) });
        setProfile(loaded);
        setForm(loaded);
      } catch (requestError) {
        if (active) setError(requestError.message || 'We could not load your profile.');
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProfile();
    return () => { active = false; };
  }, [retryKey]);

  const validate = () => {
    const next = {};
    if (String(form.fullName || '').trim().length < 2) next.fullName = 'Enter a full name with at least 2 characters.';
    const mobileDigits = String(form.mobile || '').replace(/\D/g, '');
    if (form.mobile && (mobileDigits.length < 7 || mobileDigits.length > 15)) next.mobile = 'Enter a valid mobile number.';
    if (form.dateOfBirth) {
      const date = new Date(form.dateOfBirth);
      if (Number.isNaN(date.getTime()) || date >= new Date()) next.dateOfBirth = 'Enter a valid date in the past.';
    }
    if (form.heightCm !== '' && (!Number.isFinite(Number(form.heightCm)) || Number(form.heightCm) < 40 || Number(form.heightCm) > 250)) {
      next.heightCm = 'Height must be between 40 and 250 cm.';
    }
    return next;
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setValidation((current) => ({ ...current, [name]: '' }));
    setError('');
    setSuccess('');
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('The image must be smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, profileImage: String(reader.result || '') }));
    reader.onerror = () => setError('We could not read that image. Please try another one.');
    reader.readAsDataURL(file);
  };

  const cancelEdit = () => {
    setForm(profile);
    setEditing(false);
    setValidation({});
    setError('');
    setSuccess('');
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    if (saving) return;
    const nextValidation = validate();
    setValidation(nextValidation);
    if (Object.values(nextValidation).some(Boolean)) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        fullName: String(form.fullName).trim(),
        mobile: form.mobile,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        heightCm: form.heightCm === '' ? '' : Number(form.heightCm),
        profileImage: form.profileImage,
      };
      const response = await userService.updateProfile(payload);
      const saved = normalizeProfile({ ...profile, ...payload, ...unwrapProfile(response), email: profile.email });
      setProfile(saved);
      setForm(saved);
      updateUser?.({
        fullName: saved.fullName,
        email: saved.email,
        mobile: saved.mobile,
        dateOfBirth: saved.dateOfBirth,
        gender: saved.gender,
        heightCm: saved.heightCm,
        profileImage: saved.profileImage,
        role: saved.role,
        status: saved.status,
      });
      setEditing(false);
      setSuccess('Profile updated successfully.');
    } catch (requestError) {
      setError(requestError.message || 'We could not save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initials = profile.fullName.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
  const status = profile.status || (profile.isActive === true ? 'Active' : profile.isActive === false ? 'Inactive' : '');

  return (
    <section className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-7 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-slate-400 mb-2">Dashboard / My Profile</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1C2A] dark:text-white tracking-tight">My Profile</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your personal information</p>
        </div>
        <button type="button" onClick={onBack} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      {error && <div role="alert" className="flex items-center justify-between gap-4 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 px-4 py-3 text-sm text-rose-700 dark:text-rose-300"><span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</span>{!editing && <button type="button" onClick={() => setRetryKey((value) => value + 1)} className="font-bold underline underline-offset-2">Retry</button>}</div>}
      {success && <div role="status" className="flex items-center gap-2 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"><CheckCircle2 className="w-4 h-4" />{success}</div>}

      {loading ? (
        <div role="status" className="flex min-h-64 items-center justify-center gap-3 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#091724] text-slate-500 dark:text-slate-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading your profile...</div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#091724] p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 text-2xl font-bold overflow-hidden shrink-0">{profile.profileImage ? <img src={profile.profileImage} alt={profile.fullName ? `${profile.fullName} profile` : 'Profile'} className="w-full h-full object-cover" /> : initials || <User className="w-8 h-8" />}</div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">{displayValue(profile.fullName)}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 break-all">{displayValue(profile.email)}</p>
              <div className="flex flex-wrap gap-2 mt-3"><span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 text-xs font-semibold">{displayValue(profile.role)}</span><span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">{displayValue(status)}</span></div>
            </div>
            {!editing && <button type="button" onClick={() => { setForm(profile); setEditing(true); setError(''); setSuccess(''); }} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition-colors"><Pencil className="w-4 h-4" /> Edit Profile</button>}
          </div>

          <div className="bg-white dark:bg-[#091724] p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs">
            <div className="mb-6"><h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2><p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your account details and profile information</p></div>
            {editing ? (
              <form onSubmit={saveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name<input name="fullName" value={form.fullName} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/30" />{validation.fullName && <span className="block mt-1 text-xs text-rose-500">{validation.fullName}</span>}</label>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Email<input value={form.email} readOnly aria-readonly="true" className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/70 px-3.5 py-2.5 text-sm text-slate-500 dark:text-slate-400" /></label>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Mobile Number<input name="mobile" type="tel" value={form.mobile} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/30" />{validation.mobile && <span className="block mt-1 text-xs text-rose-500">{validation.mobile}</span>}</label>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth<input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/30" />{validation.dateOfBirth && <span className="block mt-1 text-xs text-rose-500">{validation.dateOfBirth}</span>}</label>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Gender<select name="gender" value={form.gender} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/30"><option value="">Select gender</option><option value="Female">Female</option><option value="Male">Male</option><option value="Non-binary">Non-binary</option><option value="Prefer not to say">Prefer not to say</option></select></label>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Height (cm)<input name="heightCm" type="number" min="40" max="250" value={form.heightCm} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-teal-500/30" />{validation.heightCm && <span className="block mt-1 text-xs text-rose-500">{validation.heightCm}</span>}</label>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-slate-100 dark:border-slate-800 pt-5">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">{form.profileImage ? <img src={form.profileImage} alt="Profile preview" className="w-full h-full object-cover" /> : initials || <User className="w-6 h-6" />}</div>
                  <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-semibold text-teal-700 dark:text-teal-300 hover:text-teal-800"><Camera className="w-4 h-4" /> Change profile photo<input type="file" accept="image/*" onChange={handlePhoto} className="sr-only" /></label><span className="text-xs text-slate-400">Image files up to 5 MB</span>
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2"><button type="button" onClick={cancelEdit} disabled={saving} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50">Cancel</button><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold disabled:opacity-60">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{saving ? 'Saving...' : 'Save Changes'}</button></div>
              </form>
            ) : (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {[
                  ['Full Name', profile.fullName], ['Email', profile.email], ['Mobile Number', profile.mobile],
                  ['Date of Birth', profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : ''],
                  ['Gender', profile.gender], ['Height (cm)', profile.heightCm], ['Profile Photo', profile.profileImage ? 'Added' : ''],
                ].map(([label, value]) => <div key={label} className="py-4 border-b border-slate-100 dark:border-slate-800"><dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1.5 text-sm font-medium text-slate-900 dark:text-slate-100 break-words">{displayValue(value)}</dd></div>)}
              </dl>
            )}
          </div>
        </>
      )}
    </section>
  );
}
