import React, { useState } from 'react';
import { Plus, X, ArrowDown, ArrowUp, CheckCircle2 } from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function HealthMetricsView() {
  const { healthMetrics, addManualReading } = useHealthData();
  const [timeRange, setTimeRange] = useState('6M');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hoveredMetric, setHoveredMetric] = useState(null);

  // Modal State
  const [selectedMetric, setSelectedMetric] = useState('weight');
  const [readingValue, setReadingValue] = useState('');
  const [deltaValue, setDeltaValue] = useState('');
  const [readingStatus, setReadingStatus] = useState('Normal');
  const [submitted, setSubmitted] = useState(false);

  const timeRanges = ['1M', '3M', '6M', '1Y', 'All'];

  const handleOpenModal = (metricKey) => {
    setSelectedMetric(metricKey || 'weight');
    setReadingValue('');
    setDeltaValue('');
    setReadingStatus('Normal');
    setSubmitted(false);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!readingValue.trim()) return;

    addManualReading({
      metricKey: selectedMetric,
      value: readingValue.trim(),
      delta: deltaValue.trim() || undefined,
      status: readingStatus,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsModalOpen(false);
    }, 1000);
  };

  // Sparkline SVG generator
  const renderSparkline = (metric) => {
    const historyItem = metric.history[timeRange] || metric.history['6M'];
    const { labels, data } = historyItem;

    const width = 300;
    const height = 90;
    const paddingX = 15;
    const paddingY = 15;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min === 0 ? 1 : max - min;

    const points = data.map((val, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * (width - paddingX * 2);
      const y = height - paddingY - ((val - min) / range) * (height - paddingY * 2);
      return { x, y, val, label: labels[idx] };
    });

    const pathData = points.reduce((acc, pt, idx) => {
      return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
    }, '');

    const areaData = `${pathData} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
      <div className="relative pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
          <defs>
            <linearGradient id={metric.gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={metric.color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={metric.color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaData} fill={`url(#${metric.gradientId})`} />

          {/* Line Stroke */}
          <path
            d={pathData}
            fill="none"
            stroke={metric.color}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Dots */}
          {points.map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r="3.5"
              fill={metric.color}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="cursor-pointer hover:r-5 transition-all"
              onMouseEnter={() => setHoveredMetric({ key: metric.key, ...pt })}
              onMouseLeave={() => setHoveredMetric(null)}
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between items-center px-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1">
          {labels.map((label, idx) => (
            <span key={idx} className="truncate">{label}</span>
          ))}
        </div>
      </div>
    );
  };

  const metricList = [
    healthMetrics.weight,
    healthMetrics.bmi,
    healthMetrics.bodyFat,
    healthMetrics.bloodPressure,
    healthMetrics.restingHeartRate,
    healthMetrics.sleepDuration,
  ];

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-7">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1C2A] dark:text-white tracking-tight">
            Health Metrics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track your key health markers over time
          </p>
        </div>

        {/* Range Selector & Add Button */}
        <div className="flex items-center gap-3.5 flex-wrap">
          {/* Time Range Buttons Pill */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-2xs">
            {timeRanges.map((range) => {
              const isActive = timeRange === range;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-[#0A1C2A] dark:text-white shadow-xs font-bold'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {range}
                </button>
              );
            })}
          </div>

          {/* Add Manual Reading Button */}
          <button
            type="button"
            onClick={() => handleOpenModal('weight')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1C2A] hover:bg-[#142C3E] dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-[#06131D] text-xs sm:text-[13.5px] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Manual Reading</span>
          </button>
        </div>
      </div>

      {/* 6 Cards 3x2 Grid matching reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {metricList.map((metric) => (
          <div
            key={metric.key}
            onClick={() => handleOpenModal(metric.key)}
            className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-all cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13.5px] font-bold text-slate-900 dark:text-white">
                  {metric.label}
                </span>
                {hoveredMetric && hoveredMetric.key === metric.key && (
                  <span className="text-xs font-bold animate-fadeIn" style={{ color: metric.color }}>
                    {hoveredMetric.label}: {hoveredMetric.val} {metric.unit}
                  </span>
                )}
              </div>

              {/* Current Value & Delta / Status */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl sm:text-[27px] font-black text-[#0A1C2A] dark:text-white tracking-tight">
                  {metric.displayValue}
                </span>
              </div>

              <div className="mb-2">
                {metric.delta ? (
                  <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>{metric.delta.replace('↓', '').trim()}</span>
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {metric.status}
                  </span>
                )}
              </div>
            </div>

            {/* Sparkline Graph */}
            {renderSparkline(metric)}
          </div>
        ))}
      </div>

      {/* Add Manual Reading Interactive Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md p-6 sm:p-8 relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-10 text-center flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-3 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Reading Saved!</h3>
                <p className="text-xs text-slate-500">Metric and charts updated in real time.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Add Manual Reading
                </h2>
                <p className="text-xs text-slate-500 mb-5">
                  Update your biomarker records without static dummy data.
                </p>

                <form onSubmit={handleModalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Select Metric
                    </label>
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="weight">Weight (kg)</option>
                      <option value="bmi">BMI</option>
                      <option value="bodyFat">Body Fat (%)</option>
                      <option value="bloodPressure">Blood Pressure (mmHg)</option>
                      <option value="restingHeartRate">Resting Heart Rate (bpm)</option>
                      <option value="sleepDuration">Sleep Duration (hrs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      New Value
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 62.1 or 118 / 76"
                      value={readingValue}
                      onChange={(e) => setReadingValue(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  {selectedMetric === 'weight' && (
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                        Delta vs Last Month (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ↓ 0.4 kg"
                        value={deltaValue}
                        onChange={(e) => setDeltaValue(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                      Status Rating
                    </label>
                    <select
                      value={readingStatus}
                      onChange={(e) => setReadingStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Normal">Normal</option>
                      <option value="Optimal">Optimal</option>
                      <option value="Good">Good</option>
                      <option value="Attention Required">Attention Required</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#0A1C2A] dark:bg-teal-500 text-white dark:text-[#06131D] font-semibold text-sm hover:bg-[#142C3E] cursor-pointer shadow-md"
                    >
                      Save Reading
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
