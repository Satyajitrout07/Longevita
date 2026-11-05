import React, { useState } from 'react';
import { X, Activity, CheckCircle2 } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function LogMarkerModal({ isOpen, onClose, initialMetric = 'heartRate' }) {
  const { updateMarker, healthMarkers } = useHealthData();
  const [selectedMetric, setSelectedMetric] = useState(initialMetric);
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Normal');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const metricConfigs = {
    heartRate: {
      name: 'Heart Rate',
      unit: 'bpm',
      example: '72',
      evalStatus: (val) => {
        const v = parseFloat(val);
        if (v < 55) return 'Low';
        if (v > 95) return 'High';
        return 'Normal';
      },
    },
    bloodPressure: {
      name: 'Blood Pressure',
      unit: 'mmHg',
      example: '118/76',
      evalStatus: (val) => {
        const [sys, dia] = val.split('/').map(s => parseInt(s?.trim(), 10));
        if (sys >= 130 || dia >= 85) return 'High';
        if (sys < 90 || dia < 60) return 'Low';
        return 'Normal';
      },
    },
    bmi: {
      name: 'BMI',
      unit: '',
      example: '22.4',
      evalStatus: (val) => {
        const v = parseFloat(val);
        if (v < 18.5) return 'Low';
        if (v > 24.9) return 'High';
        return 'Normal';
      },
    },
    vitaminD: {
      name: 'Vitamin D',
      unit: 'ng/mL',
      example: '28',
      evalStatus: (val) => {
        const v = parseFloat(val);
        if (v < 30) return 'Low';
        if (v > 100) return 'High';
        return 'Normal';
      },
    },
    weight: {
      name: 'Weight',
      unit: 'kg',
      example: '56.5',
      evalStatus: () => 'Normal',
    },
    cholesterol: {
      name: 'Cholesterol',
      unit: 'mg/dL',
      example: '185',
      evalStatus: (val) => {
        const v = parseFloat(val);
        if (v > 200) return 'High';
        return 'Normal';
      },
    },
  };

  const handleValueChange = (newVal) => {
    setValue(newVal);
    const cfg = metricConfigs[selectedMetric];
    if (cfg && newVal.trim()) {
      setStatus(cfg.evalStatus(newVal));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    updateMarker(selectedMetric, value, status);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setValue('');
      onClose();
    }, 1000);
  };

  const currentCfg = metricConfigs[selectedMetric] || metricConfigs.heartRate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md p-6 sm:p-8 relative">
        
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
          <div className="py-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mb-3 animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Biomarker Recorded!
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {currentCfg.name} has been updated to {value} {currentCfg.unit} ({status}).
            </p>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
                Biomarker Tracking
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Log Health Marker
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Update your real metrics to keep your health score accurate.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Metric */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Choose Biomarker
                </label>
                <select
                  value={selectedMetric}
                  onChange={(e) => {
                    setSelectedMetric(e.target.value);
                    setValue('');
                    setStatus('Normal');
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="heartRate">Heart Rate (bpm)</option>
                  <option value="bloodPressure">Blood Pressure (mmHg, e.g. 118/76)</option>
                  <option value="bmi">BMI</option>
                  <option value="vitaminD">Vitamin D (ng/mL)</option>
                  <option value="weight">Weight (kg)</option>
                  <option value="cholesterol">Cholesterol (mg/dL)</option>
                </select>
              </div>

              {/* Value Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    New Reading {currentCfg.unit ? `(${currentCfg.unit})` : ''}
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    status === 'Normal' 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {status}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  placeholder={`e.g. ${currentCfg.example}`}
                  value={value}
                  onChange={(e) => handleValueChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-base font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0A1C2A] dark:bg-teal-500 text-white dark:text-[#06131D] text-sm font-semibold hover:bg-[#142C3E] dark:hover:bg-teal-400 transition-all shadow-md cursor-pointer"
                >
                  Save Biomarker Reading
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
