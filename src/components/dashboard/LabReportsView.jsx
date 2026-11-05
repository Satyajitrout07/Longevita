import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  X, 
  Download, 
  CheckCircle, 
  Clock, 
  Plus, 
  Eye, 
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { useHealthData } from '../../context/HealthContext';

export default function LabReportsView() {
  const { labReports, addLabReport, updateReportStatus, member } = useHealthData();
  const [activeCategory, setActiveCategory] = useState('All Reports');
  const [selectedReport, setSelectedReport] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Blood Tests');
  const [uploadStatus, setUploadStatus] = useState('Pending Review');
  const [uploadDoctor, setUploadDoctor] = useState('Dr. Ananya Rao');
  const [uploadFindings, setUploadFindings] = useState('');

  const categories = ['All Reports', 'Blood Tests', 'Hormones', 'Metabolic', 'Vitamins', 'Others'];

  // Filter reports
  const filteredReports = activeCategory === 'All Reports'
    ? labReports
    : labReports.filter(r => r.category === activeCategory);

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    addLabReport({
      title: uploadTitle.trim(),
      category: uploadCategory,
      status: uploadStatus,
      iconTheme: uploadStatus === 'Reviewed' ? 'green' : 'orange',
      doctor: uploadDoctor,
      findings: uploadFindings.trim() || 'New diagnostic test pending clinical interpretation.',
      biomarkers: [
        { name: 'Initial Finding', value: 'Recorded', range: 'Within Normal Limits', status: 'Normal' }
      ]
    });

    setUploadTitle('');
    setUploadFindings('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto space-y-7">
      
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A1C2A] dark:text-white tracking-tight">
            Lab Reports
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            All your laboratory reports in one place
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1C2A] hover:bg-[#142C3E] dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-[#06131D] text-xs sm:text-[13.5px] font-semibold transition-all shadow-sm hover:shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Lab Report</span>
        </button>
      </div>

      {/* Category Tabs matching screenshot */}
      <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-100 dark:border-slate-800 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`pb-3 relative transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-[#0A1C2A] dark:text-white font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <span>{cat}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-teal-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Reports List matching reference screenshot */}
      <div className="space-y-3.5">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/80">
            <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
              No reports found in {activeCategory}
            </h3>
            <p className="text-xs text-slate-400 mb-4">Upload a lab report or switch categories.</p>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold"
            >
              Upload Report
            </button>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isOrange = report.iconTheme === 'orange' || report.status === 'Pending Review';
            return (
              <div
                key={report.id}
                className="p-5 sm:p-5.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100/90 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-4 hover:shadow-sm hover:border-slate-200 dark:hover:border-slate-600 transition-all"
              >
                {/* Left: Document Icon & Info */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Rounded Document Icon */}
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    isOrange 
                      ? 'bg-[#FFF7ED] dark:bg-amber-950/80 text-[#EA580C] dark:text-amber-400' 
                      : 'bg-[#E6F8F3] dark:bg-emerald-950/80 text-[#10B981] dark:text-emerald-400'
                  }`}>
                    <FileText className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-[14.5px] sm:text-[15px] font-bold text-[#0A1C2A] dark:text-white leading-tight truncate">
                      {report.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 mt-1.5 text-xs">
                      <span className="text-slate-400 dark:text-slate-500 font-medium">
                        {report.date}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="text-blue-600 dark:text-teal-400 font-semibold hover:underline cursor-pointer"
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: Status Badge */}
                <div className="shrink-0">
                  {report.status === 'Reviewed' ? (
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[12px] font-bold bg-[#DCFCE7] dark:bg-emerald-950/80 text-[#16A34A] dark:text-emerald-300">
                      Reviewed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-[12px] font-bold bg-[#FFEDD5] dark:bg-amber-950/80 text-[#EA580C] dark:text-amber-300">
                      Pending Review
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Clinical Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto relative">
            
            <button
              type="button"
              onClick={() => setSelectedReport(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {selectedReport.category}
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  selectedReport.status === 'Reviewed'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {selectedReport.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-[#0A1C2A] dark:text-white">
                {selectedReport.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Reported Date: {selectedReport.date} | Patient: {member.name} | Verified by: {selectedReport.doctor || 'Dr. Ananya Rao'}
              </p>
            </div>

            {/* Biomarkers Table */}
            {selectedReport.biomarkers && selectedReport.biomarkers.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Clinical Biomarker Results
                </h4>
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800 text-[11px] uppercase">
                      <tr>
                        <th className="py-2.5 px-4">Test Marker</th>
                        <th className="py-2.5 px-4">Result</th>
                        <th className="py-2.5 px-4">Reference Range</th>
                        <th className="py-2.5 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedReport.biomarkers.map((bm, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100">{bm.name}</td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{bm.value}</td>
                          <td className="py-3 px-4 text-slate-500">{bm.range}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              bm.status === 'Normal' || bm.status === 'Optimal'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {bm.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Doctor's Clinical Findings */}
            <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900/60 mb-6">
              <h4 className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>Doctor's Clinical Notes</span>
              </h4>
              <p className="text-xs sm:text-sm text-teal-900 dark:text-teal-200 leading-relaxed">
                {selectedReport.findings || 'All values have been verified against optimal longevity intervals.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  const newStat = selectedReport.status === 'Reviewed' ? 'Pending Review' : 'Reviewed';
                  updateReportStatus(selectedReport.id, newStat);
                  setSelectedReport({ ...selectedReport, status: newStat });
                }}
                className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline cursor-pointer"
              >
                Mark as {selectedReport.status === 'Reviewed' ? 'Pending Review' : 'Reviewed'}
              </button>

              <button
                type="button"
                onClick={() => alert(`Downloading verified clinical PDF for "${selectedReport.title}"...`)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1C2A] dark:bg-teal-500 text-white dark:text-[#06131D] text-xs font-bold hover:bg-[#142C3E] cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Report PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Upload Lab Report Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md p-6 sm:p-8 relative">
            
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Upload Lab Report
            </h2>
            <p className="text-xs text-slate-500 mb-5">
              Add new diagnostic reports without static dummy data.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Report Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Iron Panel & Ferritin"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Blood Tests">Blood Tests</option>
                  <option value="Hormones">Hormones</option>
                  <option value="Metabolic">Metabolic</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Initial Status
                </label>
                <select
                  value={uploadStatus}
                  onChange={(e) => setUploadStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Reviewed">Reviewed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Clinical Summary / Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Fasting sample collected at City Diagnostics..."
                  value={uploadFindings}
                  onChange={(e) => setUploadFindings(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0A1C2A] dark:bg-teal-500 text-white dark:text-[#06131D] font-semibold text-sm hover:bg-[#142C3E] cursor-pointer shadow-md"
                >
                  Upload & Queue for Review
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
