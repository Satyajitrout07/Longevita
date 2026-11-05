
import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  Award,
  MessageSquare,
  Heart,
  Activity,
  Scale,
  Droplets,
  ChevronDown,
  Plus,
  FileCheck,
  Upload,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

import { useHealthData } from '../../context/HealthContext';

export default function DashboardOverview({
  onOpenBookModal,
  onOpenLogModal,
  onSelectTab,
}) {
  // Safely read health context
  const healthData = useHealthData() || {};

  const {
    member = {},
    healthScore = {},
    healthMarkers = {},
    nextAppointment = null,
    unreadMessagesCount = 0,
    trends = {},
    nextSteps = [],
    toggleStepCompleted = () => {},
    addLabReport = () => {},
  } = healthData;

  const [activeTrend, setActiveTrend] = useState('Weight');
  const [trendRange, setTrendRange] = useState('Last 6 months');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const trendTabs = [
    'Weight',
    'BMI',
    'Blood Pressure',
    'Cholesterol',
    'Vitamin D',
  ];

  // Safe fallback for new members without health history
  const fallbackTrend = {
    months: [],
    data: [],
    unit: '',
    minY: 0,
    maxY: 100,
  };

  const currentTrend =
    trends?.[activeTrend] ||
    trends?.Weight ||
    fallbackTrend;

  const trendMonths = Array.isArray(currentTrend.months)
    ? currentTrend.months
    : [];

  const trendValues = Array.isArray(currentTrend.data)
    ? currentTrend.data
    : [];

  // Filter chart data
  let displayedMonths = trendMonths;
  let displayedData = trendValues;

  if (trendRange === 'Last 3 months') {
    displayedMonths = trendMonths.slice(-3);
    displayedData = trendValues.slice(-3);
  } else if (trendRange === 'Last 6 months') {
    displayedMonths = trendMonths.slice(-6);
    displayedData = trendValues.slice(-6);
  }

  const hasTrendData =
    displayedData.length > 0 &&
    displayedMonths.length === displayedData.length &&
    displayedData.every((value) =>
      Number.isFinite(Number(value))
    );

  // SVG chart configuration
  const svgWidth = 600;
  const svgHeight = 180;
  const paddingX = 40;
  const paddingY = 30;

  const numericData = hasTrendData
    ? displayedData.map(Number)
    : [];

  const dataMin = hasTrendData
    ? Math.min(...numericData)
    : 0;

  const dataMax = hasTrendData
    ? Math.max(...numericData)
    : 100;

  const minY = Number.isFinite(currentTrend.minY)
    ? currentTrend.minY
    : dataMin * 0.9;

  const calculatedMaxY = Number.isFinite(currentTrend.maxY)
    ? currentTrend.maxY
    : dataMax * 1.1;

  const maxY =
    calculatedMaxY === minY
      ? minY + 1
      : calculatedMaxY;

  const points = hasTrendData
    ? numericData.map((val, idx) => {
        const x =
          numericData.length === 1
            ? svgWidth / 2
            : paddingX +
              (idx / (numericData.length - 1)) *
                (svgWidth - paddingX * 2);

        const y =
          svgHeight -
          paddingY -
          ((val - minY) / (maxY - minY)) *
            (svgHeight - paddingY * 2);

        return {
          x,
          y,
          val,
          month: displayedMonths[idx],
        };
      })
    : [];

  const pathData = points.reduce((acc, pt, idx) => {
    return idx === 0
      ? `M ${pt.x} ${pt.y}`
      : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  return (
    <div className="p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">

      {/* 1. Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1C2A] dark:text-white tracking-[-0.02em] flex items-center gap-2">
            <span>
              Welcome back, {(member?.name || 'Member').split(' ')[0]}
            </span>
            <span className="inline-block animate-wave">👋</span>
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here's your health overview
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenLogModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-[13.5px] font-semibold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Log Biomarker</span>
          </button>

          <button
            type="button"
            onClick={onOpenBookModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1C2A] hover:bg-[#142C3E] dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-[#06131D] text-xs sm:text-[13.5px] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* 2. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

        {/* Health Score */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center gap-4 transition-all hover:shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] dark:bg-emerald-950/70 flex items-center justify-center text-[#16A34A] dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
              Health Score
            </span>

            <span className="text-lg font-bold text-[#0A1C2A] dark:text-white leading-tight">
              {healthScore?.status || 'Not available'}
            </span>
          </div>
        </div>

        {/* Next Appointment */}
        <div
          onClick={() => onSelectTab?.('appointments')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center gap-4 transition-all hover:shadow-sm cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#E0F2FE] dark:bg-sky-950/70 flex items-center justify-center text-[#0284C7] dark:text-sky-400 shrink-0">
            <Calendar className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="truncate">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
              Next Appointment
            </span>

            <span className="text-base font-bold text-[#0A1C2A] dark:text-white leading-tight block truncate group-hover:text-blue-600 dark:group-hover:text-teal-400 transition-colors">
              {nextAppointment
                ? nextAppointment.date
                : 'None Scheduled'}
            </span>

            <span className="text-[11.5px] text-slate-500 dark:text-slate-400 block truncate">
              {nextAppointment
                ? nextAppointment.doctor
                : 'Book your session'}
            </span>
          </div>
        </div>

        {/* Plan */}
        <div
          onClick={() => onSelectTab?.('plan')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center gap-4 transition-all hover:shadow-sm cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] dark:bg-purple-950/70 flex items-center justify-center text-[#7C3AED] dark:text-purple-400 shrink-0">
            <Award className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
              Plan
            </span>

            <span className="text-base font-bold text-[#0A1C2A] dark:text-white leading-tight block group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
              {member?.plan || 'Standard'}
            </span>

            <span className="text-[11.5px] text-slate-400 dark:text-slate-500 block">
              Renews on {member?.renewsDate || 'Not scheduled'}
            </span>
          </div>
        </div>

        {/* Unread Messages */}
        <div
          onClick={() => onSelectTab?.('messages')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center gap-4 transition-all hover:shadow-sm cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FFEDD5] dark:bg-amber-950/70 flex items-center justify-center text-[#EA580C] dark:text-amber-400 shrink-0 relative">
            <MessageSquare className="w-6 h-6 stroke-[2.2]" />

            {unreadMessagesCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 absolute -top-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-800" />
            )}
          </div>

          <div>
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
              Unread Messages
            </span>

            <span className="text-lg font-bold text-[#0A1C2A] dark:text-white leading-tight block group-hover:text-amber-600 transition-colors">
              {unreadMessagesCount}
            </span>

            <span className="text-[11.5px] text-slate-400 dark:text-slate-500 block">
              From your care team
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recent Health Markers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-[#0A1C2A] dark:text-white tracking-tight">
            Recent Health Markers
          </h2>

          <button
            type="button"
            onClick={() => onSelectTab?.('records')}
            className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-teal-400 hover:underline cursor-pointer"
          >
            View all
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">

          {/* Heart Rate */}
          <div
            onClick={onOpenLogModal}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center gap-4 cursor-pointer hover:border-teal-300 dark:hover:border-teal-500/40 transition-all group"
          >
            <div className="w-11 h-11 rounded-full bg-[#E6F8F3] dark:bg-emerald-950/80 flex items-center justify-center text-[#10B981] dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
                Heart Rate
              </span>

              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#0A1C2A] dark:text-white leading-tight">
                  {healthMarkers?.heartRate?.value ?? '--'}
                </span>

                <span className="text-xs text-slate-500 font-medium">
                  bpm
                </span>
              </div>

              <span className="text-xs font-semibold text-[#16A34A] dark:text-emerald-400 block mt-0.5">
                {healthMarkers?.heartRate?.status || 'Not available'}
              </span>
            </div>
          </div>

          {/* Blood Pressure */}
          <div
            onClick={onOpenLogModal}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center gap-4 cursor-pointer hover:border-teal-300 dark:hover:border-teal-500/40 transition-all group"
          >
            <div className="w-11 h-11 rounded-full bg-[#E6F8F3] dark:bg-emerald-950/80 flex items-center justify-center text-[#10B981] dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
                Blood Pressure
              </span>

              <span className="text-lg font-bold text-[#0A1C2A] dark:text-white leading-tight block">
                {healthMarkers?.bloodPressure?.value ?? '--'}
              </span>

              <span className="text-xs font-semibold text-[#16A34A] dark:text-emerald-400 block mt-0.5">
                {healthMarkers?.bloodPressure?.status || 'Not available'}
              </span>
            </div>
          </div>

          {/* BMI */}
          <div
            onClick={onOpenLogModal}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center gap-4 cursor-pointer hover:border-teal-300 dark:hover:border-teal-500/40 transition-all group"
          >
            <div className="w-11 h-11 rounded-full bg-[#E6F8F3] dark:bg-emerald-950/80 flex items-center justify-center text-[#10B981] dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
                BMI
              </span>

              <span className="text-lg font-bold text-[#0A1C2A] dark:text-white leading-tight block">
                {healthMarkers?.bmi?.value ?? '--'}
              </span>

              <span className="text-xs font-semibold text-[#16A34A] dark:text-emerald-400 block mt-0.5">
                {healthMarkers?.bmi?.status || 'Not available'}
              </span>
            </div>
          </div>

          {/* Vitamin D */}
          <div
            onClick={onOpenLogModal}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center gap-4 cursor-pointer hover:border-amber-300 dark:hover:border-amber-500/40 transition-all group"
          >
            <div className="w-11 h-11 rounded-full bg-[#FFF7ED] dark:bg-amber-950/80 flex items-center justify-center text-[#EA580C] dark:text-amber-400 shrink-0 group-hover:scale-105 transition-transform">
              <Droplets className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 block">
                Vitamin D
              </span>

              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-[#0A1C2A] dark:text-white leading-tight">
                  {healthMarkers?.vitaminD?.value ?? '--'}
                </span>

                <span className="text-xs text-slate-500 font-medium">
                  ng/mL
                </span>
              </div>

              <span className="text-xs font-bold text-[#EA580C] dark:text-amber-400 block mt-0.5">
                {healthMarkers?.vitaminD?.status || 'Not available'}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Health Trends & Next Step */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Health Trends Chart */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-6">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-[#0A1C2A] dark:text-white tracking-tight">
                Health Trends
              </h2>
            </div>

            {/* Time Filter */}
            <div className="relative inline-block">
              <select
                value={trendRange}
                onChange={(e) => setTrendRange(e.target.value)}
                className="appearance-none px-4 py-2 pr-8 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-[13px] font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer shadow-xs"
              >
                <option value="Last 3 months">Last 3 months</option>
                <option value="Last 6 months">Last 6 months</option>
                <option value="Last year">Last year</option>
              </select>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Metric Selector */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            {trendTabs.map((tab) => {
              const isActive = activeTrend === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTrend(tab);
                    setHoveredPoint(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-700 text-[#0A1C2A] dark:text-white shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* SVG Interactive Chart */}
          <div className="relative pt-2">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>
                {activeTrend}
                {currentTrend.unit ? ` (${currentTrend.unit})` : ''}
              </span>

              {hoveredPoint && (
                <span className="font-bold text-[#0284C7] dark:text-teal-400 animate-fadeIn">
                  {hoveredPoint.month}: {hoveredPoint.val} {currentTrend.unit}
                </span>
              )}
            </div>

            <div className="w-full overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-44 sm:h-52 overflow-visible"
              >
                {/* Horizontal Grid Lines */}
                <line
                  x1={paddingX}
                  y1={paddingY}
                  x2={svgWidth - paddingX}
                  y2={paddingY}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  className="text-slate-400"
                />

                <line
                  x1={paddingX}
                  y1={svgHeight / 2}
                  x2={svgWidth - paddingX}
                  y2={svgHeight / 2}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  className="text-slate-400"
                />

                <line
                  x1={paddingX}
                  y1={svgHeight - paddingY}
                  x2={svgWidth - paddingX}
                  y2={svgHeight - paddingY}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  className="text-slate-400"
                />

                {/* Y-axis Labels */}
                <text
                  x={paddingX - 12}
                  y={paddingY + 4}
                  fontSize="11"
                  fill="currentColor"
                  textAnchor="end"
                  className="text-slate-400 font-medium"
                >
                  {Math.round(maxY)}
                </text>

                <text
                  x={paddingX - 12}
                  y={svgHeight / 2 + 4}
                  fontSize="11"
                  fill="currentColor"
                  textAnchor="end"
                  className="text-slate-400 font-medium"
                >
                  {Math.round((maxY + minY) / 2)}
                </text>

                <text
                  x={paddingX - 12}
                  y={svgHeight - paddingY + 4}
                  fontSize="11"
                  fill="currentColor"
                  textAnchor="end"
                  className="text-slate-400 font-medium"
                >
                  {Math.round(minY)}
                </text>

                {/* Chart Data */}
                {hasTrendData ? (
                  <>
                    {/* Shaded Area */}
                    {points.length > 1 && (
                      <path
                        d={`${pathData} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`}
                        fill="url(#trend-gradient)"
                        opacity="0.25"
                      />
                    )}

                    {/* Trend Line */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data Points */}
                    {points.map((pt, idx) => (
                      <g key={`${pt.month}-${idx}`}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4.5"
                          fill="#0284C7"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="cursor-pointer transition-transform duration-150 hover:scale-150"
                          onMouseEnter={() => setHoveredPoint(pt)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />

                        <text
                          x={pt.x}
                          y={svgHeight - 8}
                          fontSize="11"
                          fill="currentColor"
                          textAnchor="middle"
                          className="text-slate-400 dark:text-slate-500 font-medium"
                        >
                          {pt.month}
                        </text>
                      </g>
                    ))}
                  </>
                ) : (
                  <text
                    x={svgWidth / 2}
                    y={svgHeight / 2}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="14"
                    className="text-slate-400"
                  >
                    No health trend data available
                  </text>
                )}

                <defs>
                  <linearGradient
                    id="trend-gradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#0284C7"
                      stopOpacity="0.6"
                    />
                    <stop
                      offset="100%"
                      stopColor="#0284C7"
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>
        </div>

        {/* Your Next Step */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-[#F0FDF4] dark:bg-emerald-950/25 border border-[#DCFCE7] dark:border-emerald-900/40 flex flex-col justify-between">

          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#166534] dark:text-emerald-300 tracking-tight mb-5">
              Your next step
            </h2>

            <div className="space-y-4">

              {/* Step 1 */}
              <div
                onClick={() => toggleStepCompleted('step-1')}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-3 cursor-pointer group hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      nextSteps?.[0]?.completed
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600'
                        : 'bg-[#E0F2FE] dark:bg-sky-950/80 text-[#0284C7]'
                    }`}
                  >
                    {nextSteps?.[0]?.completed ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <FileCheck className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <h3
                      className={`text-xs sm:text-[13.5px] font-bold leading-tight ${
                        nextSteps?.[0]?.completed
                          ? 'line-through text-slate-400'
                          : 'text-[#0A1C2A] dark:text-white'
                      }`}
                    >
                      Complete annual assessment
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {nextSteps?.[0]?.completed
                        ? 'Completed'
                        : 'Due in 10 days'}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Step 2 */}
              <div
                onClick={() => {
                  const title = window.prompt(
                    'Enter Lab Test Name to upload (e.g., HbA1c & Fasting Glucose):',
                    'Comprehensive Hormone Panel'
                  );

                  if (title) {
                    addLabReport({
                      title,
                      category: 'Endocrine Panel',
                    });

                    window.alert(
                      `Report "${title}" uploaded and queued for review by Dr. Ananya Rao.`
                    );
                  }
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-3 cursor-pointer group hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] dark:bg-purple-950/80 text-[#7C3AED] flex items-center justify-center shrink-0">
                    <Upload className="w-5 h-5" />
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-[13.5px] font-bold text-[#0A1C2A] dark:text-white leading-tight">
                      Upload latest lab reports
                    </h3>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Enhance your insights
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </div>

            </div>
          </div>

          {/* Motivational Tip */}
          <div className="pt-6 border-t border-emerald-100 dark:border-emerald-900/30 flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300 font-medium mt-6">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              Preventive adherence score is in top 10% of members.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
