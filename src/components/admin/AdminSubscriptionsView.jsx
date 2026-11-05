import React, { useState } from 'react';
import { Check, Sparkles, CreditCard, Users, TrendingUp } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function AdminSubscriptionsView() {
  const { plans, subscriptionsByPlan } = useHealthData();
  const [billingCycle, setBillingCycle] = useState('Yearly'); // 'Monthly' | 'Yearly'

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-10 animate-fadeIn">
      
      {/* 1. Header Section matching Image 1 */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Choose a plan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
          Personalised preventive care for every stage of life
        </p>

        {/* Monthly / Yearly Toggle matching Image 1 */}
        <div className="pt-3 flex items-center justify-center">
          <div className="inline-flex items-center p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setBillingCycle('Monthly')}
              className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                billingCycle === 'Monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setBillingCycle('Yearly')}
                className={`px-5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  billingCycle === 'Yearly'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Yearly
              </button>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#2563EB] text-white mr-1 shadow-xs">
                Save 20%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Three Pricing Plan Cards matching Image 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* Card 1: Essential Plan */}
        <div className="bg-white dark:bg-[#091724] rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Essential</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {billingCycle === 'Yearly' ? '₹2,999' : '₹299'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {billingCycle === 'Yearly' ? '/ year' : '/ month'}
                </span>
              </div>
            </div>

            {/* Checklist */}
            <ul className="space-y-3.5 pt-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Health assessment</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Basic lab panel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Health dashboard</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Email support</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => alert('Essential plan selected.')}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0A1C2A] dark:bg-slate-800 text-white font-bold text-sm hover:bg-[#142C3E] transition-colors cursor-pointer shadow-xs"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Card 2: Advanced Plan (Most Popular with highlight border) */}
        <div className="bg-white dark:bg-[#091724] rounded-3xl p-7 border-2 border-[#818CF8] dark:border-indigo-500 shadow-lg relative flex flex-col justify-between transition-all hover:shadow-xl">
          {/* Most Popular Pill */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
            <span className="px-3.5 py-1 rounded-full text-[11px] font-bold bg-[#6366F1] text-white shadow-xs uppercase tracking-wider">
              Most Popular
            </span>
          </div>

          <div className="space-y-5 pt-1">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Advanced</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {billingCycle === 'Yearly' ? '₹5,999' : '₹599'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {billingCycle === 'Yearly' ? '/ year' : '/ month'}
                </span>
              </div>
            </div>

            {/* Checklist */}
            <ul className="space-y-3.5 pt-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Extended lab panel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Quarterly consultations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Personalised insights</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Priority support</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => alert('Advanced plan selected.')}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0A1C2A] dark:bg-indigo-600 text-white font-bold text-sm hover:bg-[#142C3E] dark:hover:bg-indigo-700 transition-colors cursor-pointer shadow-md"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Card 3: Premium Plan */}
        <div className="bg-white dark:bg-[#091724] rounded-3xl p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-all hover:shadow-md">
          <div className="space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Premium</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                  {billingCycle === 'Yearly' ? '₹9,999' : '₹999'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {billingCycle === 'Yearly' ? '/ year' : '/ month'}
                </span>
              </div>
            </div>

            {/* Checklist */}
            <ul className="space-y-3.5 pt-2 text-xs sm:text-[13px] text-slate-600 dark:text-slate-300">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Comprehensive lab panel</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>More frequent consultations</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Personalised preventive plan</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                <span>Dedicated care team</span>
              </li>
            </ul>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={() => alert('Premium plan selected.')}
              className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-xs"
            >
              Get Started
            </button>
          </div>
        </div>

      </div>

      {/* 3. Admin Subscriptions Breakdown Table */}
      <div className="bg-white dark:bg-[#091724] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xs max-w-5xl mx-auto space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Active Subscription Distribution & Platform MRR
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {subscriptionsByPlan.map((p) => (
            <div key={p.name} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{p.name} Tier</span>
                <span className="text-xs font-extrabold text-blue-600">{p.percent}%</span>
              </div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{p.count} Active</p>
              <p className="text-xs text-slate-400 mt-0.5">Price: {p.price}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
