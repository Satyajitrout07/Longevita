import React, { useState } from 'react';
import { X, Calendar, Clock, User, FileText, CheckCircle2 } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function BookAppointmentModal({ isOpen, onClose }) {
  const { bookAppointment } = useHealthData();
  const [doctor, setDoctor] = useState('Dr. Ananya Rao');
  const [specialty, setSpecialty] = useState('Preventive Medicine & Longevity');
  const [date, setDate] = useState('2024-11-20');
  const [time, setTime] = useState('11:00 AM');
  const [type, setType] = useState('Video Consultation');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const doctorsList = [
    { name: 'Dr. Ananya Rao', spec: 'Preventive Medicine & Longevity' },
    { name: 'Dr. Vikram Malhotra', spec: 'Cardiovascular Health Specialist' },
    { name: 'Dr. Neha Patel', spec: 'Functional Nutrition & Metabolic Health' },
  ];

  const timeSlots = ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM', '05:30 PM'];

  const handleDoctorChange = (docName) => {
    setDoctor(docName);
    const found = doctorsList.find(d => d.name === docName);
    if (found) setSpecialty(found.spec);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format date string
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    bookAppointment({
      doctor,
      specialty,
      date: formattedDate,
      time,
      type,
      notes: notes || 'Preventive check-in consultation.',
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Appointment Scheduled!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your consultation with {doctor} has been booked.
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
                Care Team Scheduling
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Book an Appointment
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Connect with our certified longevity doctors and specialists.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Doctor */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Select Specialist
                </label>
                <div className="relative">
                  <select
                    value={doctor}
                    onChange={(e) => handleDoctorChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {doctorsList.map((doc) => (
                      <option key={doc.name} value={doc.name}>
                        {doc.name} ({doc.spec})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Consultation Type */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('Video Consultation')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    type === 'Video Consultation'
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📹 Video Consultation
                </button>
                <button
                  type="button"
                  onClick={() => setType('In-Clinic Checkup')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    type === 'In-Clinic Checkup'
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  🏥 In-Clinic Checkup
                </button>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Time Slot
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {timeSlots.map((ts) => (
                      <option key={ts} value={ts}>{ts}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Consultation Focus / Symptoms (Optional)
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Follow-up on blood pressure and nutrition plan..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0A1C2A] dark:bg-teal-500 text-white dark:text-[#06131D] text-sm font-semibold hover:bg-[#142C3E] dark:hover:bg-teal-400 transition-all shadow-md cursor-pointer"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
