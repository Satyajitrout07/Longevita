import React from 'react';
import { Stethoscope, Star, CheckCircle, Clock } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function AdminCliniciansView() {
  const { cliniciansList, toggleClinicianStatus } = useHealthData();

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-7 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Clinicians & Physician Network
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor physician caseloads, consultation availability, and patient ratings.
        </p>
      </div>

      {/* Clinicians Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cliniciansList.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-[#091724] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-5"
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center">
                {doc.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button
                type="button"
                onClick={() => toggleClinicianStatus(doc.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  doc.availability === 'Available'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {doc.availability}
              </button>
            </div>

            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">{doc.name}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{doc.specialty}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-slate-400">Assigned Cohort</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{doc.patientsCount} Patients</p>
              </div>
              <div>
                <p className="text-slate-400">Doctor Rating</p>
                <p className="text-base font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{doc.rating} / 5.0</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleClinicianStatus(doc.id)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
            >
              Toggle Availability Status
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
