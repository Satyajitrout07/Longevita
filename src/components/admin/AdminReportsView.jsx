import React from 'react';
import { BarChart3, TrendingUp, Award, Droplets, ShieldCheck } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function AdminReportsView() {
  const { adminStats, memberGrowthHistory } = useHealthData();

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Executive Reports & Analytics
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Deep retention, biomarker screening volume, and clinical efficacy metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-[#091724] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Member Retention</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">94.2%</p>
          <p className="text-xs text-emerald-600 font-semibold">+3.1% YoY cohort retention</p>
        </div>

        <div className="bg-white dark:bg-[#091724] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Biomarker Optimization</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">78.5%</p>
          <p className="text-xs text-blue-600 font-semibold">Patients reaching optimal longevity zone in 6 months</p>
        </div>

        <div className="bg-white dark:bg-[#091724] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Recurring Revenue</p>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">₹2,48,750</p>
          <p className="text-xs text-purple-600 font-semibold">ARR projection: ₹29.85 Lakhs</p>
        </div>
      </div>

      {/* Top Prescribed Lab Panels */}
      <div className="bg-white dark:bg-[#091724] p-6 sm:p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Most Prescribed Longevity Diagnostic Panels
        </h3>
        <div className="space-y-3">
          {[
            { name: 'Comprehensive Metabolic & Lipid Panel', volume: '1,420 tests', percent: '85%' },
            { name: '25-Hydroxy Vitamin D & Calcium Assay', volume: '1,180 tests', percent: '72%' },
            { name: 'Glycated Hemoglobin (HbA1c) + Fasting Insulin', volume: '980 tests', percent: '64%' },
            { name: 'Ultra-Sensitive hs-CRP (Cardiovascular Inflammation)', volume: '760 tests', percent: '51%' },
          ].map((panel, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{panel.name}</p>
                <p className="text-[11px] text-slate-400">{panel.volume} conducted this year</p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-600">{panel.percent} of members</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
