import React, { createContext, useContext, useState, useEffect } from 'react';

const HealthContext = createContext(null);

const STORAGE_KEY = 'longevita_health_platform_v6';

const initialData = {
  member: { id: '', name: '', email: '', mobile: '', initials: '', avatar: '', role: '', plan: '', renewsDate: '' },
  doctor: { id: '', name: '', degrees: '', role: '', initials: '', department: '', hospital: '', rating: '', totalPatients: '', isAvailable: false },
  adminUser: { name: '', role: '', email: '', initials: '' },
  adminStats: { totalMembers: '', totalMembersGrowth: '', activeSubscriptions: '', activeSubscriptionsGrowth: '', revenue: '', revenueGrowth: '', appointments: '', appointmentsGrowth: '' },
  memberGrowthHistory: [],
  subscriptionsByPlan: [],
  plans: [],
  paymentsList: [],
  cliniciansList: [],
  healthScore: { status: '', score: '', description: '' },
  healthMetrics: {
    weight: { key: 'weight', label: 'Weight', value: '', unit: 'kg', displayValue: '', delta: '', deltaType: '', status: '', color: '#10B981', gradientId: 'grad-weight', history: { '1M': { labels: [], data: [] }, '3M': { labels: [], data: [] }, '6M': { labels: [], data: [] }, '1Y': { labels: [], data: [] }, All: { labels: [], data: [] } } },
    bmi: { key: 'bmi', label: 'BMI', value: '', unit: '', displayValue: '', status: '', color: '#3B82F6', gradientId: 'grad-bmi', history: { '1M': { labels: [], data: [] }, '3M': { labels: [], data: [] }, '6M': { labels: [], data: [] }, '1Y': { labels: [], data: [] }, All: { labels: [], data: [] } } },
    bodyFat: { key: 'bodyFat', label: 'Body Fat', value: '', unit: '%', displayValue: '', status: '', color: '#F97316', gradientId: 'grad-bodyfat', history: { '1M': { labels: [], data: [] }, '3M': { labels: [], data: [] }, '6M': { labels: [], data: [] }, '1Y': { labels: [], data: [] }, All: { labels: [], data: [] } } },
    bloodPressure: { key: 'bloodPressure', label: 'Blood Pressure', value: '', unit: 'mmHg', displayValue: '', status: '', color: '#EF4444', gradientId: 'grad-bp', history: { '1M': { labels: [], data: [] }, '3M': { labels: [], data: [] }, '6M': { labels: [], data: [] }, '1Y': { labels: [], data: [] }, All: { labels: [], data: [] } } },
    restingHeartRate: { key: 'restingHeartRate', label: 'Resting Heart Rate', value: '', unit: 'bpm', displayValue: '', status: '', color: '#8B5CF6', gradientId: 'grad-rhr', history: { '1M': { labels: [], data: [] }, '3M': { labels: [], data: [] }, '6M': { labels: [], data: [] }, '1Y': { labels: [], data: [] }, All: { labels: [], data: [] } } },
    sleepDuration: { key: 'sleepDuration', label: 'Sleep Duration', value: '', unit: 'hrs', displayValue: '', status: '', color: '#06B6D4', gradientId: 'grad-sleep', history: { '1M': { labels: [], data: [] }, '3M': { labels: [], data: [] }, '6M': { labels: [], data: [] }, '1Y': { labels: [], data: [] }, All: { labels: [], data: [] } } },
  },
  healthMarkers: {
    heartRate: { name: 'Heart Rate', value: '', unit: 'bpm', status: '', statusType: '' },
    bloodPressure: { name: 'Blood Pressure', value: '', unit: '', status: '', statusType: '' },
    bmi: { name: 'BMI', value: '', unit: '', status: '', statusType: '' },
    vitaminD: { name: 'Vitamin D', value: '', unit: 'ng/mL', status: '', statusType: '' },
    weight: { name: 'Weight', value: '', unit: 'kg', status: '', statusType: '' },
    cholesterol: { name: 'Cholesterol', value: '', unit: 'mg/dL', status: '', statusType: '' },
  },
  appointments: [],
  labReports: [],
  assignedMembers: [],
  followUps: [],
  nextSteps: [],
  careTeamMessages: [],
};

export function HealthDataProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load platform data from localStorage:', e);
    }
    return initialData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save platform data to localStorage:', e);
    }
  }, [data]);

  // Recalculate health score
  const recalculateHealthScore = (markers) => {
    let score = 95;
    if (markers.vitaminD && markers.vitaminD.statusType === 'low') score -= 9;
    if (markers.bloodPressure && markers.bloodPressure.statusType === 'high') score -= 15;
    if (markers.heartRate && markers.heartRate.statusType === 'high') score -= 10;
    if (markers.bmi && markers.bmi.statusType !== 'normal') score -= 8;

    let status = 'Good';
    if (score >= 90) status = 'Optimal';
    else if (score >= 75) status = 'Good';
    else status = 'Needs Attention';

    return {
      status,
      score,
      description: status === 'Optimal' 
        ? 'All key longevity indicators are in peak range.' 
        : 'Action items identified to optimize metabolic and nutrient balance.',
    };
  };

  // Action: Add manual reading for metric
  const addManualReading = (metricKey, newValue, dateLabel = 'Today') => {
    setData((prev) => {
      const metric = prev.healthMetrics[metricKey];
      if (!metric) return prev;

      const numVal = parseFloat(newValue);
      const updatedMetric = {
        ...metric,
        value: newValue,
        displayValue: `${newValue}${metric.unit ? ' ' + metric.unit : ''}`,
        history: {
          ...metric.history,
          '1M': {
            labels: [...metric.history['1M'].labels.slice(1), dateLabel],
            data: [...metric.history['1M'].data.slice(1), numVal || metric.history['1M'].data[metric.history['1M'].data.length - 1]],
          },
        },
      };

      const updatedMetrics = {
        ...prev.healthMetrics,
        [metricKey]: updatedMetric,
      };

      const updatedMarkers = { ...prev.healthMarkers };
      if (metricKey === 'weight' && updatedMarkers.weight) updatedMarkers.weight.value = numVal || newValue;
      if (metricKey === 'bmi' && updatedMarkers.bmi) updatedMarkers.bmi.value = numVal || newValue;
      if (metricKey === 'restingHeartRate' && updatedMarkers.heartRate) updatedMarkers.heartRate.value = numVal || newValue;
      if (metricKey === 'bloodPressure' && updatedMarkers.bloodPressure) updatedMarkers.bloodPressure.value = newValue;

      const newHealthScore = recalculateHealthScore(updatedMarkers);

      return {
        ...prev,
        healthMetrics: updatedMetrics,
        healthMarkers: updatedMarkers,
        healthScore: newHealthScore,
      };
    });
  };

  // Action: Update single marker (overview)
  const updateMarker = (key, newValue, newStatus = 'Normal') => {
    setData((prev) => {
      const updatedMarkers = { ...prev.healthMarkers };
      if (key === 'bloodPressure') {
        updatedMarkers.bloodPressure = {
          ...updatedMarkers.bloodPressure,
          value: newValue,
          status: newStatus,
          statusType: newStatus.toLowerCase(),
        };
      } else {
        const numVal = parseFloat(newValue);
        updatedMarkers[key] = {
          ...updatedMarkers[key],
          value: numVal || newValue,
          status: newStatus,
          statusType: newStatus.toLowerCase(),
        };
      }

      const newHealthScore = recalculateHealthScore(updatedMarkers);
      return {
        ...prev,
        healthMarkers: updatedMarkers,
        healthScore: newHealthScore,
      };
    });
  };

  // Action: Book appointment
  const bookAppointment = (newAppt) => {
    setData((prev) => ({
      ...prev,
      appointments: [{ id: `apt-${Date.now()}`, status: 'Upcoming', ...newAppt }, ...prev.appointments],
    }));
  };

  // Action: Cancel appointment
  const cancelAppointment = (id) => {
    setData((prev) => ({
      ...prev,
      appointments: prev.appointments.filter((a) => a.id !== id),
    }));
  };

  // Action: Add lab report
  const addLabReport = (report) => {
    setData((prev) => ({
      ...prev,
      labReports: [
        {
          id: `rep-${Date.now()}`,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: 'Pending Review',
          iconTheme: 'orange',
          doctor: data.doctor.name,
          findings: 'Recently uploaded report waiting for care team validation.',
          biomarkers: [],
          ...report,
        },
        ...prev.labReports,
      ],
    }));
  };

  // Action: Update report status
  const updateReportStatus = (id, newStatus) => {
    setData((prev) => ({
      ...prev,
      labReports: prev.labReports.map((r) =>
        r.id === id ? { ...r, status: newStatus, iconTheme: newStatus === 'Reviewed' ? 'green' : 'orange' } : r
      ),
    }));
  };

  // Action: Doctor reviews lab report
  const doctorReviewLabReport = (reportId, doctorNotes, newStatus = 'Reviewed') => {
    setData((prev) => ({
      ...prev,
      labReports: prev.labReports.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            status: newStatus,
            iconTheme: newStatus === 'Reviewed' ? 'green' : 'orange',
            findings: doctorNotes || rep.findings,
          };
        }
        return rep;
      })
    }));
  };

  // Action: Doctor adds clinical note to patient chart
  const addClinicalNote = (patientId, content) => {
    if (!content.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      author: data.doctor.name,
      content: content.trim(),
    };

    setData((prev) => ({
      ...prev,
      assignedMembers: prev.assignedMembers.map((m) => {
        if (m.id === patientId) {
          return {
            ...m,
            notes: [newNote, ...(m.notes || [])],
          };
        }
        return m;
      })
    }));
  };

  // Action: Doctor schedules follow-up task
  const scheduleFollowUp = (followUpData) => {
    const newFu = {
      id: `fu-${Date.now()}`,
      completed: false,
      ...followUpData,
    };

    setData((prev) => ({
      ...prev,
      followUps: [newFu, ...prev.followUps],
    }));
  };

  // Action: Toggle follow-up completed
  const toggleFollowUpStatus = (id) => {
    setData((prev) => ({
      ...prev,
      followUps: prev.followUps.map((fu) =>
        fu.id === id ? { ...fu, completed: !fu.completed } : fu
      ),
    }));
  };

  // Action: Toggle doctor availability
  const toggleDoctorAvailability = () => {
    setData((prev) => ({
      ...prev,
      doctor: {
        ...prev.doctor,
        isAvailable: !prev.doctor.isAvailable,
      }
    }));
  };

  // Action: Toggle next step completed
  const toggleStepCompleted = (stepId) => {
    setData((prev) => ({
      ...prev,
      nextSteps: prev.nextSteps.map((s) =>
        s.id === stepId ? { ...s, completed: !s.completed } : s
      ),
    }));
  };

  // Action: Care team messaging
  const sendCareMessage = (text) => {
    if (!text.trim()) return;
    setData((prev) => ({
      ...prev,
      careTeamMessages: [
        ...prev.careTeamMessages,
        {
          id: `msg-${Date.now()}`,
          sender: prev.member.name,
          avatar: prev.member.initials,
          text,
          time: 'Just now',
          isUnread: false,
        },
      ],
    }));
  };

  const doctorSendMessage = (text) => {
    if (!text.trim()) return;
    setData((prev) => ({
      ...prev,
      careTeamMessages: [
        ...prev.careTeamMessages,
        {
          id: `msg-${Date.now()}`,
          sender: prev.doctor.name,
          avatar: prev.doctor.initials,
          text,
          time: 'Just now',
          isUnread: true,
        },
      ],
    }));
  };

  const markMessagesRead = () => {
    setData((prev) => ({
      ...prev,
      careTeamMessages: prev.careTeamMessages.map((m) => ({ ...m, isUnread: false })),
    }));
  };

  // Admin Actions
  const recordAdminPayment = (payment) => {
    setData((prev) => ({
      ...prev,
      paymentsList: [
        {
          id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
          date: 'Today',
          status: 'Paid',
          ...payment,
        },
        ...prev.paymentsList,
      ],
    }));
  };

  const updateMemberPlan = (memberId, newPlan) => {
    setData((prev) => ({
      ...prev,
      assignedMembers: prev.assignedMembers.map((m) =>
        m.id === memberId ? { ...m, plan: newPlan } : m
      ),
      member: prev.member.id === memberId ? { ...prev.member, plan: newPlan } : prev.member,
    }));
  };

  const toggleClinicianStatus = (id) => {
    setData((prev) => ({
      ...prev,
      cliniciansList: prev.cliniciansList.map((c) =>
        c.id === id ? { ...c, availability: c.availability === 'Available' ? 'In Clinic' : 'Available' } : c
      ),
    }));
  };

  // Action: Update member profile
  const updateMemberProfile = (profile) => {
    setData((prev) => {
      const name = profile.fullName || prev.member.name;
      const initials = name
        ? name
            .split(' ')
            .filter(Boolean)
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : prev.member.initials;

      const updatedMember = {
        ...prev.member,
        ...(profile.fullName && { name: profile.fullName }),
        ...(profile.email && { email: profile.email }),
        ...(profile.mobile && { mobile: profile.mobile }),
        ...(profile.profileImage && { avatar: profile.profileImage }),
        initials,
      };

      let updatedMetrics = { ...prev.healthMetrics };
      let updatedMarkers = { ...prev.healthMarkers };

      if (profile.weight !== undefined && profile.weight !== '') {
        const weightNum = parseFloat(profile.weight);
        if (!isNaN(weightNum)) {
          if (updatedMetrics.weight) {
            updatedMetrics.weight = {
              ...updatedMetrics.weight,
              value: String(weightNum),
              displayValue: `${weightNum} kg`,
            };
          }
          if (updatedMarkers.weight) {
            updatedMarkers.weight = {
              ...updatedMarkers.weight,
              value: weightNum,
            };
          }
        }
      }

      if (profile.heightCm !== undefined && profile.heightCm !== '') {
        const heightNum = parseFloat(profile.heightCm);
        const weightVal = parseFloat(profile.weight || (updatedMarkers.weight && updatedMarkers.weight.value) || 0);
        if (!isNaN(heightNum) && heightNum > 0 && !isNaN(weightVal) && weightVal > 0) {
          const heightM = heightNum / 100;
          const bmiVal = parseFloat((weightVal / (heightM * heightM)).toFixed(1));
          if (updatedMetrics.bmi) {
            updatedMetrics.bmi = {
              ...updatedMetrics.bmi,
              value: String(bmiVal),
              displayValue: String(bmiVal),
            };
          }
          if (updatedMarkers.bmi) {
            updatedMarkers.bmi = {
              ...updatedMarkers.bmi,
              value: bmiVal,
            };
          }
        }
      }

      return {
        ...prev,
        member: updatedMember,
        healthMetrics: updatedMetrics,
        healthMarkers: updatedMarkers,
      };
    });
  };

  const unreadMessagesCount = data.careTeamMessages.filter((m) => m.isUnread).length;
  const nextAppointment = data.appointments[0] || null;
  const pendingLabReportsCount = data.labReports.filter((r) => r.status === 'Pending Review').length;

  return (
    <HealthContext.Provider
      value={{
        ...data,
        unreadMessagesCount,
        nextAppointment,
        pendingLabReportsCount,
        addManualReading,
        updateMarker,
        updateMemberProfile,
        bookAppointment,
        cancelAppointment,
        addLabReport,
        updateReportStatus,
        toggleStepCompleted,
        sendCareMessage,
        doctorSendMessage,
        markMessagesRead,
        addClinicalNote,
        scheduleFollowUp,
        toggleFollowUpStatus,
        doctorReviewLabReport,
        toggleDoctorAvailability,
        recordAdminPayment,
        updateMemberPlan,
        toggleClinicianStatus,
      }}
    >
      {children}
    </HealthContext.Provider>
  );
}

export function useHealthData() {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
}
