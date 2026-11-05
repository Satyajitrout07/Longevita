import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight, TrendingUp } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function AdminOverview({ onSelectTab }) {
  const { 
    adminStats, 
    memberGrowthHistory, 
    subscriptionsByPlan 
  } = useHealthData();

  const [timeframe, setTimeframe] = useState('Last 30 days');

  // SVG Bar Chart dimensions for Member Growth
  const barChartWidth = 520;
  const barChartHeight = 220;
  const paddingX = 45;
  const paddingY = 30;
  const maxBarValue = 1500;
  const usableBarWidth = barChartWidth - paddingX * 2;
  const usableBarHeight = barChartHeight - paddingY * 2;
  const barWidth = 24;

  // Donut chart math for Subscriptions by Plan
  const donutSize = 180;
  const center = donutSize / 2;
  const radius = 65;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  // Calculate stroke dasharrays for the 3 donut slices
  let accumulatedPercent = 0;
  const slices = subscriptionsByPlan.map((plan) => {
    const strokeDasharray = `${(plan.percent / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += plan.percent;
    return {
      ...plan,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* 1. Header with Title & Timeframe Selector matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Platform insights and key metrics
          </p>
        </div>

        {/* Timeframe Dropdown matching Image 2 */}
        <div className="relative self-start sm:self-center">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="Last 30 days">Last 30 days</option>
            <option value="Last 7 days">Last 7 days</option>
            <option value="This Quarter">This Quarter</option>
            <option value="This Year">This Year</option>
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 2. 4 KPI Cards matching Image 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Members */}
        <div 
          onClick={() => onSelectTab && onSelectTab('members')}
          className="bg-white dark:bg-[#091724] p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-400">Total Members</p>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {adminStats.totalMembers}
            </h3>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <span>↑</span>
              <span>{adminStats.totalMembersGrowth}</span>
            </p>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div 
          onClick={() => onSelectTab && onSelectTab('subscriptions')}
          className="bg-white dark:bg-[#091724] p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-400">Active Subscriptions</p>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {adminStats.activeSubscriptions}
            </h3>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <span>↑</span>
              <span>{adminStats.activeSubscriptionsGrowth}</span>
            </p>
          </div>
        </div>

        {/* Revenue */}
        <div 
          onClick={() => onSelectTab && onSelectTab('payments')}
          className="bg-white dark:bg-[#091724] p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-400">Revenue</p>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {adminStats.revenue}
            </h3>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <span>↑</span>
              <span>{adminStats.revenueGrowth}</span>
            </p>
          </div>
        </div>

        {/* Appointments */}
        <div 
          onClick={() => onSelectTab && onSelectTab('appointments')}
          className="bg-white dark:bg-[#091724] p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <p className="text-xs font-semibold text-slate-400">Appointments</p>
          <div className="mt-3">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {adminStats.appointments}
            </h3>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <span>↑</span>
              <span>{adminStats.appointmentsGrowth}</span>
            </p>
          </div>
        </div>

      </div>

      {/* 3. Two Column Analytical Charts matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        
        {/* Left Chart: Member Growth Bar Chart */}
        <div className="bg-white dark:bg-[#091724] p-6 sm:p-7 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Member Growth
          </h3>

          <div className="pt-2">
            <svg viewBox={`0 0 ${barChartWidth} ${barChartHeight}`} className="w-full h-64 overflow-visible">
              <defs>
                <linearGradient id="adminBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.45" />
                </linearGradient>
              </defs>

              {/* Horizontal Grid lines matching Image 2 */}
              {[1500, 1000, 500, 0].map((val) => {
                const normY = val / maxBarValue;
                const y = barChartHeight - paddingY - normY * usableBarHeight;
                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={barChartWidth - 10}
                      y2={y}
                      stroke="#F1F5F9"
                      className="dark:stroke-slate-800"
                    />
                    <text
                      x={paddingX - 10}
                      y={y + 4}
                      textAnchor="end"
                      fontSize="10.5"
                      fill="#94A3B8"
                    >
                      {val.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Bars for each month */}
              {memberGrowthHistory.map((item, idx) => {
                const x = paddingX + (idx / (memberGrowthHistory.length - 1)) * usableBarWidth - barWidth / 2;
                const normY = item.value / maxBarValue;
                const h = normY * usableBarHeight;
                const y = barChartHeight - paddingY - h;

                return (
                  <g key={item.month} className="group">
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={h}
                      rx="6"
                      fill="url(#adminBarGrad)"
                      className="transition-all duration-300 hover:opacity-80"
                    />
                    {/* Month label on X Axis */}
                    <text
                      x={x + barWidth / 2}
                      y={barChartHeight - 8}
                      textAnchor="middle"
                      fontSize="11"
                      fill="#94A3B8"
                      fontWeight="500"
                    >
                      {item.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Chart: Subscriptions by Plan Donut Chart */}
        <div className="bg-white dark:bg-[#091724] p-6 sm:p-7 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Subscriptions by Plan
          </h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-4">
            
            {/* SVG Donut Circle */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg viewBox={`0 0 ${donutSize} ${donutSize}`} className="w-full h-full -rotate-90">
                {slices.map((slice) => (
                  <circle
                    key={slice.name}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={slice.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={slice.strokeDasharray}
                    strokeDashoffset={slice.strokeDashoffset}
                    className="transition-all duration-500 hover:opacity-90"
                  />
                ))}
              </svg>

              {/* Central Hole */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">1,980</span>
                <span className="text-[11px] text-slate-400 font-semibold">Subscribers</span>
              </div>
            </div>

            {/* Legend matching Image 2 */}
            <div className="space-y-3.5 w-full sm:w-auto">
              {subscriptionsByPlan.map((plan) => (
                <div key={plan.name} className="flex items-center justify-between sm:justify-start gap-4">
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: plan.color }}
                    />
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {plan.name}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white">
                    {plan.percent}%
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
