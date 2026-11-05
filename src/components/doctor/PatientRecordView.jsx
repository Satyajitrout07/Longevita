import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  FileText, 
  Calendar, 
  Activity, 
  Heart, 
  Scale, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Plus,
  Send,
  Droplets,
  Video
} from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function PatientRecordView({ patient, onBack, onOpenChartModal }) {
  const { labReports, doctorReviewLabReport, addClinicalNote, appointments, cancelAppointment } = useHealthData();
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedMetric, setSelectedMetric] = useState('Weight');
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 6 months');
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');

  if (!patient) return null;

  // Tabs matching Image 4
  const tabs = ['Overview', 'Health Records', 'Lab Reports', 'Appointments', 'Care Plan', 'Notes'];

  // Trend data points based on metric
  const trendDataMap = {
    Weight: {
      unit: 'kg',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [61.2, 66.0, 60.1, 58.0, 54.2, 56.5],
      minY: 45,
      maxY: 85,
      yLabels: [80, 70, 60, 50],
    },
    'Blood Pressure': {
      unit: 'mmHg',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [126, 124, 122, 120, 118, 118],
      minY: 90,
      maxY: 150,
      yLabels: [140, 130, 120, 110],
    },
    'Heart Rate': {
      unit: 'bpm',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [76, 75, 74, 73, 72, 72],
      minY: 60,
      maxY: 90,
      yLabels: [85, 80, 75, 70],
    },
    'Body Fat': {
      unit: '%',
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [26.0, 25.8, 25.2, 24.8, 24.2, 24.0],
      minY: 18,
      maxY: 30,
      yLabels: [28, 26, 24, 22],
    },
  };

  const currentTrend = trendDataMap[selectedMetric] || trendDataMap.Weight;

  // Chart SVG coordinates computation
  const svgWidth = 520;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 25;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const points = currentTrend.data.map((val, idx) => {
    const x = paddingX + (idx / (currentTrend.data.length - 1)) * usableWidth;
    const normY = (val - currentTrend.minY) / (currentTrend.maxY - currentTrend.minY);
    const y = svgHeight - paddingY - normY * usableHeight;
    return { x, y, val, month: currentTrend.months[idx] };
  });

  const linePathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaPathD = `${linePathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  const handleCreateNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addClinicalNote(patient.id, newNoteText);
    setNewNoteText('');
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Patients</span>
        </button>
      </div>

      {/* Patient Header Card matching Image 4 */}
      <div className="bg-white dark:bg-[#091724] rounded-3xl p-6 sm:p-7 border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Patient Demographic Profile */}
        <div className="flex items-center gap-4 sm:gap-5">
          <img
            src={patient.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'}
            alt={patient.name}
            className="w-16 h-16 sm:w-18 sm:h-18 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {patient.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              {patient.age} years • {patient.gender}
            </p>
          </div>
        </div>

        {/* Actions Dropdown Button matching Image 4 */}
        <div className="relative self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            <span>Actions</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {actionsMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 py-2 z-40 animate-fadeIn">
              <button
                type="button"
                onClick={() => {
                  setActionsMenuOpen(false);
                  if (onOpenChartModal) onOpenChartModal(patient);
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-left"
              >
                Open Full EHR Chart
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionsMenuOpen(false);
                  alert(`Video consultation launched with ${patient.name}.`);
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-left"
              >
                Start Telehealth Call
              </button>
              <button
                type="button"
                onClick={() => {
                  setActionsMenuOpen(false);
                  setActiveTab('Notes');
                }}
                className="w-full px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-left"
              >
                Add Clinical Note
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Tabs Row matching Image 4 */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-200/80 dark:border-slate-800 overflow-x-auto text-xs sm:text-sm font-semibold">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW (Image 4 exact design) */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          
          {/* Top Key Metrics + Trends (Left 2 cols) & Recent Lab Results (Right 1 col) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Left 2 Columns: Key Metrics (Latest) & Trends */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Key Metrics (Latest) matching Image 4 */}
              <div className="space-y-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Key Metrics (Latest)
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
                  {/* Weight Card */}
                  <div className="bg-white dark:bg-[#091724] p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                    <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {patient.vitalSummary.weight}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Weight</p>
                  </div>

                  {/* Blood Pressure Card */}
                  <div className="bg-white dark:bg-[#091724] p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                    <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {patient.vitalSummary.bp}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Blood Pressure</p>
                  </div>

                  {/* Heart Rate Card with Red highlight */}
                  <div className="bg-white dark:bg-[#091724] p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                    <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {patient.vitalSummary.hr}
                    </p>
                    <p className="text-xs font-semibold text-rose-500 mt-1">Heart Rate</p>
                  </div>

                  {/* Body Fat Card */}
                  <div className="bg-white dark:bg-[#091724] p-4 sm:p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
                    <p className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {patient.vitalSummary.bodyFat || '24%'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Body Fat</p>
                  </div>
                </div>
              </div>

              {/* Trends Section matching Image 4 */}
              <div className="bg-white dark:bg-[#091724] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
                
                {/* Trends Header + Metric & Timeframe Dropdowns */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Trends
                  </h3>

                  <div className="flex items-center gap-2.5">
                    {/* Metric Select */}
                    <div className="relative">
                      <select
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className="appearance-none pl-3.5 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        <option value="Weight">Weight</option>
                        <option value="Blood Pressure">Blood Pressure</option>
                        <option value="Heart Rate">Heart Rate</option>
                        <option value="Body Fat">Body Fat</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* Timeframe Select */}
                    <div className="relative">
                      <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value)}
                        className="appearance-none pl-3.5 pr-8 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold cursor-pointer shadow-xs"
                      >
                        <option value="Last 6 months">Last 6 months</option>
                        <option value="Last 3 months">Last 3 months</option>
                        <option value="1 Year">1 Year</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* SVG Line Chart matching Image 4 curve */}
                <div className="pt-2">
                  <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-52 overflow-visible">
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines & Y Axis labels */}
                    {currentTrend.yLabels.map((val) => {
                      const normY = (val - currentTrend.minY) / (currentTrend.maxY - currentTrend.minY);
                      const y = svgHeight - paddingY - normY * usableHeight;
                      return (
                        <g key={val}>
                          <line
                            x1={paddingX}
                            y1={y}
                            x2={svgWidth - paddingX}
                            y2={y}
                            stroke="#E2E8F0"
                            strokeDasharray="3 3"
                            className="dark:stroke-slate-800"
                          />
                          <text
                            x={paddingX - 10}
                            y={y + 4}
                            textAnchor="end"
                            fontSize="10.5"
                            fill="#94A3B8"
                          >
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {/* Gradient fill under curve */}
                    <path d={areaPathD} fill="url(#trendGradient)" />

                    {/* Smooth curve line */}
                    <path
                      d={linePathD}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Data Points matching dots in Image 4 */}
                    {points.map((pt, i) => (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill="#2563EB"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        {/* Month labels along X Axis */}
                        <text
                          x={pt.x}
                          y={svgHeight - 4}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#94A3B8"
                          fontWeight="500"
                        >
                          {pt.month}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

              </div>

            </div>

            {/* Right 1 Column: Recent Lab Results matching Image 4 */}
            <div className="bg-white dark:bg-[#091724] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  Recent Lab Results
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('Lab Reports')}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {/* Lab Results Rows */}
              <div className="space-y-3.5 pt-1">
                {(patient.recentLabs || [
                  { name: 'Vitamin D', value: '28 ng/mL', status: 'Low', statusType: 'low', icon: 'orange' },
                  { name: 'HbA1c', value: '5.4%', status: 'Normal', statusType: 'normal', icon: 'green' },
                  { name: 'Total Cholesterol', value: '182 mg/dL', status: 'Normal', statusType: 'normal', icon: 'green' },
                  { name: 'TSH', value: '2.1 µIU/mL', status: 'Normal', statusType: 'normal', icon: 'green' },
                ]).map((lab, idx) => {
                  const isLow = lab.status === 'Low' || lab.statusType === 'low';
                  const isWarning = lab.statusType === 'warning';
                  const isOrange = isLow || isWarning || lab.icon === 'orange';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          isOrange 
                            ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400' 
                            : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {lab.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            {lab.value}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        isOrange
                          ? 'bg-[#FFF7ED] dark:bg-amber-950 text-[#EA580C] dark:text-amber-300'
                          : 'bg-[#EBFDF5] dark:bg-emerald-950 text-[#10B981] dark:text-emerald-300'
                      }`}>
                        {lab.status}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 2: HEALTH RECORDS */}
      {activeTab === 'Health Records' && (
        <div className="bg-white dark:bg-[#091724] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Comprehensive Biomarker Health Records
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400 font-bold uppercase">Blood Pressure</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{patient.vitalSummary.bp}</p>
              <p className="text-[11px] text-emerald-600 mt-1">Normal target (&lt; 120/80)</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400 font-bold uppercase">Resting Heart Rate</p>
              <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">{patient.vitalSummary.hr}</p>
              <p className="text-[11px] text-emerald-600 mt-1">Optimal resting recovery</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400 font-bold uppercase">25-OH Vitamin D</p>
              <p className="text-xl font-extrabold text-amber-600 mt-1">{patient.vitalSummary.vitaminD || '28 ng/mL'}</p>
              <p className="text-[11px] text-amber-600 mt-1">Sub-optimal (&gt; 30 target)</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LAB REPORTS */}
      {activeTab === 'Lab Reports' && (
        <div className="bg-white dark:bg-[#091724] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Diagnostic Laboratory Panels</h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
              4 Panels on Record
            </span>
          </div>

          <div className="space-y-3">
            {labReports.map((rep) => (
              <div key={rep.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${rep.status === 'Reviewed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rep.title}</h4>
                    <span className="text-xs text-slate-400 font-mono">({rep.date})</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 italic">"{rep.findings}"</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    rep.status === 'Reviewed'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {rep.status}
                  </span>
                  {rep.status !== 'Reviewed' && (
                    <button
                      type="button"
                      onClick={() => {
                        doctorReviewLabReport(rep.id, 'Verified and approved by Dr. Ananya Rao.', 'Reviewed');
                        alert(`Report marked Reviewed. Updated in Member Portal.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: APPOINTMENTS */}
      {activeTab === 'Appointments' && (
        <div className="bg-white dark:bg-[#091724] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Scheduled Clinical Consultations</h2>
          <div className="space-y-3">
            {appointments.map((appt) => (
              <div key={appt.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{appt.specialty}</h4>
                  <p className="text-xs text-slate-400">{appt.date} at {appt.time} • {appt.type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => alert(`Starting video consultation session with ${patient.name}...`)}
                  className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Start Telehealth</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: CARE PLAN */}
      {activeTab === 'Care Plan' && (
        <div className="bg-white dark:bg-[#091724] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-5">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personalised Longevity Care Protocol</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-teal-800 dark:text-teal-300">Supplement Protocol</h4>
              <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-200 list-disc list-inside">
                <li>Vitamin D3 + K2: 2,000 IU with morning meal</li>
                <li>Omega-3 Fatty Acids (EPA/DHA): 1,000 mg daily</li>
                <li>Magnesium Glycinate: 300 mg before sleep</li>
              </ul>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-blue-800 dark:text-blue-300">Exercise & Nutrition</h4>
              <ul className="text-xs space-y-1 text-slate-700 dark:text-slate-200 list-disc list-inside">
                <li>Zone-2 Aerobic Cardio: 150 minutes/week</li>
                <li>Resistance training: 3 sessions/week focusing on compound movements</li>
                <li>Low-glycemic Mediterranean dietary framework</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: NOTES */}
      {activeTab === 'Notes' && (
        <div className="bg-white dark:bg-[#091724] rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Physician Consultation Notes</h2>
            <p className="text-xs text-slate-500">Document clinical findings and therapeutic adjustments</p>
          </div>

          {/* New note input form */}
          <form onSubmit={handleCreateNote} className="space-y-3">
            <textarea
              required
              rows={3}
              placeholder={`Write clinical note for ${patient.name}...`}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Clinical Note</span>
            </button>
          </form>

          {/* Chronological Notes list */}
          <div className="space-y-3 pt-2">
            {(patient.notes && patient.notes.length > 0 ? patient.notes : [
              {
                id: 'note-default',
                date: '12 Nov 2024',
                author: 'Dr. Ananya Rao',
                content: 'Comprehensive health consultation completed. Biomarkers verified, dietary and vitamin D3 regimen established.',
              }
            ]).map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white">{note.author}</span>
                  <span className="text-slate-400 font-mono">{note.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
