import React, { useState } from 'react';
import { Calendar, Clock, Video, UserCheck, Search, Plus } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function AdminAppointmentsView() {
  const { appointments, assignedMembers, bookAppointment } = useHealthData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);

  const [docName, setDocName] = useState('Dr. Ananya Rao');
  const [specialty, setSpecialty] = useState('Preventive Longevity Consultation');
  const [date, setDate] = useState('18 Nov 2024');
  const [time, setTime] = useState('11:00 AM');
  const [type, setType] = useState('Video Consultation');

  const handleBook = (e) => {
    e.preventDefault();
    bookAppointment({
      doctor: docName,
      specialty,
      date,
      time,
      type,
    });
    setShowBookModal(false);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-7 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Consultations & Telehealth Schedule
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Platform-wide doctor bookings, telehealth channels, and clinician assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowBookModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-[#0A1C2A] dark:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ Schedule Consultation</span>
        </button>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {appointments.map((appt) => (
          <div
            key={appt.id}
            className="bg-white dark:bg-[#091724] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4 hover:border-blue-500/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {appt.type}
                </span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white mt-2">
                  {appt.specialty}
                </h3>
                <p className="text-xs text-slate-400">Clinician: {appt.doctor}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" /> Date:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{appt.date}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5 text-blue-600" /> Time:
                </span>
                <span className="font-bold text-slate-900 dark:text-white">{appt.time}</span>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                Confirmed
              </span>
              <button
                type="button"
                onClick={() => alert(`Launching telehealth room for ${appt.doctor}...`)}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                Join Telehealth Room →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Book Consultation Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-4 shadow-2xl border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Schedule New Consultation
            </h3>

            <form onSubmit={handleBook} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Clinician</label>
                <select
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="Dr. Ananya Rao">Dr. Ananya Rao (Preventive Longevity)</option>
                  <option value="Dr. Vikram Malhotra">Dr. Vikram Malhotra (Cardiometabolic)</option>
                  <option value="Dr. Priya Desai">Dr. Priya Desai (Endocrinology)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Consultation Title</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Date</label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Time</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Format</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                >
                  <option value="Video Consultation">Video Consultation (Telehealth)</option>
                  <option value="In-Clinic Checkup">In-Clinic Checkup</option>
                  <option value="Biomarker Review">Biomarker Review</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-xs"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
