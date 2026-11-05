import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  User, 
  Filter, 
  FileText, 
  Video, 
  Activity, 
  X,
  Send,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function FollowUpsView({ 
  onOpenChart, 
  initialPatient = null,
  isModalOpen = false,
  onCloseModal 
}) {
  const { 
    followUps, 
    assignedMembers, 
    toggleFollowUpStatus, 
    scheduleFollowUp 
  } = useHealthData();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'completed', 'urgent'
  const [showScheduleModal, setShowScheduleModal] = useState(isModalOpen);

  // Form state for scheduling new follow-up
  const [selectedPatientId, setSelectedPatientId] = useState(
    initialPatient ? initialPatient.id : (assignedMembers[0]?.id || 'pat-1')
  );
  const [taskDescription, setTaskDescription] = useState('');
  const [followUpType, setFollowUpType] = useState('Lab Review');
  const [priority, setPriority] = useState('Urgent');
  const [dueDate, setDueDate] = useState('15 Nov 2024');

  // Filter logic
  const filteredFollowUps = followUps.filter((item) => {
    if (activeTab === 'pending') return !item.completed;
    if (activeTab === 'completed') return item.completed;
    if (activeTab === 'urgent') return item.priority === 'Urgent' && !item.completed;
    return true;
  });

  const pendingCount = followUps.filter(f => !f.completed).length;
  const completedCount = followUps.filter(f => f.completed).length;
  const urgentCount = followUps.filter(f => f.priority === 'Urgent' && !f.completed).length;

  const handleSubmitNewFollowUp = (e) => {
    e.preventDefault();
    if (!taskDescription.trim()) return;

    const patient = assignedMembers.find(m => m.id === selectedPatientId) || assignedMembers[0];

    scheduleFollowUp({
      patientId: patient.id,
      patientName: patient.name,
      task: taskDescription.trim(),
      dueDate: dueDate || '20 Nov 2024',
      priority,
      type: followUpType,
    });

    setTaskDescription('');
    setShowScheduleModal(false);
    if (onCloseModal) onCloseModal();
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* 1. Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Clinical Follow-ups & Care Orders
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              {pendingCount} Pending Actions
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage biomarker follow-ups, diagnostic lab reviews, and protocol consultations for your patient cohort.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowScheduleModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Schedule Follow-up</span>
        </button>
      </div>

      {/* 2. Stats & Filter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-200'
              : 'bg-white dark:bg-[#091724] border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Pending Action</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{pendingCount}</span>
            <span className="text-xs text-slate-400">Tasks requiring completion</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('urgent')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'urgent'
              ? 'bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-200'
              : 'bg-white dark:bg-[#091724] border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Urgent Priority</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{urgentCount}</span>
            <span className="text-xs text-slate-400">Biomarker risk actions</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('completed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-200'
              : 'bg-white dark:bg-[#091724] border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Completed</p>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{completedCount}</span>
            <span className="text-xs text-slate-400">Clinical orders fulfilled</span>
          </div>
        </div>
      </div>

      {/* Filter Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          All ({followUps.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Pending ({pendingCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('urgent')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'urgent'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Urgent ({urgentCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* 3. Follow-up Items List */}
      <div className="space-y-4">
        {filteredFollowUps.length === 0 ? (
          <div className="bg-white dark:bg-[#091724] rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">All clinical follow-ups in this filter are cleared</h3>
            <p className="text-xs text-slate-400 mt-1">Great job! You have addressed all high-priority tasks in this section.</p>
          </div>
        ) : (
          filteredFollowUps.map((item) => {
            const patient = assignedMembers.find(m => m.id === item.patientId || m.name === item.patientName) || assignedMembers[0];
            const isUrgent = item.priority === 'Urgent';
            const isMedium = item.priority === 'Medium';

            return (
              <div 
                key={item.id}
                className={`bg-white dark:bg-[#091724] rounded-3xl p-5 border transition-all shadow-xs hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.completed 
                    ? 'opacity-65 border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40' 
                    : isUrgent
                    ? 'border-rose-200 dark:border-rose-950/70 hover:border-rose-300'
                    : 'border-slate-100 dark:border-slate-800 hover:border-teal-500/30'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  
                  {/* Completion toggle button */}
                  <button
                    type="button"
                    onClick={() => toggleFollowUpStatus(item.id)}
                    className="mt-0.5 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer shrink-0"
                    title={item.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-teal-600" />
                    )}
                  </button>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span 
                        onClick={() => onOpenChart(patient)}
                        className="text-sm font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer underline decoration-dotted transition-colors"
                      >
                        {item.patientName}
                      </span>

                      <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-bold ${
                        isUrgent
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : isMedium
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {item.priority}
                      </span>

                      <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                        {item.type || 'Clinical Check'}
                      </span>
                    </div>

                    <p className={`text-sm ${
                      item.completed 
                        ? 'line-through text-slate-400' 
                        : 'text-slate-800 dark:text-slate-200 font-medium'
                    }`}>
                      {item.task}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        Target Due Date: <strong className="text-slate-700 dark:text-slate-300">{item.dueDate}</strong>
                      </span>
                      {patient.riskTier && (
                        <span>• Risk Tier: <strong className="text-slate-600 dark:text-slate-300">{patient.riskTier}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onOpenChart(patient)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Open Chart
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleFollowUpStatus(item.id)}
                    className={`px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                      item.completed
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {item.completed ? 'Re-open' : 'Mark Done'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Schedule Follow-up Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg p-6 sm:p-7 relative">
            <button
              type="button"
              onClick={() => {
                setShowScheduleModal(false);
                if (onCloseModal) onCloseModal();
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-teal-600" />
                Schedule Clinical Follow-up
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Assign a protocol reminder, biomarker review, or patient consult task.
              </p>
            </div>

            <form onSubmit={handleSubmitNewFollowUp} className="space-y-4">
              {/* Patient Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  {assignedMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.plan} Plan - {m.riskTier})
                    </option>
                  ))}
                </select>
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Follow-up Action / Protocol Order
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Evaluate 25-OH Vitamin D levels & confirm compliance with 2000 IU D3 supplementation..."
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Type & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Order Type
                  </label>
                  <select
                    value={followUpType}
                    onChange={(e) => setFollowUpType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Lab Review">Lab Review</option>
                    <option value="Video Check-in">Video Check-in</option>
                    <option value="Biomarker Check">Biomarker Check</option>
                    <option value="Protocol Dispatch">Protocol Dispatch</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Urgent">Urgent Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
              </div>

              {/* Target Due Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Target Due Date
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 15 Nov 2024"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Assign Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
