import React, { createContext, useContext, useState, useEffect } from 'react';

const HealthContext = createContext(null);

const STORAGE_KEY = 'longevita_health_platform_v5';

const initialData = {
  // Member Profile (Priya Sharma)
  member: {
    id: 'pat-1',
    name: 'Priya Sharma',
    email: 'priya@gmail.com',
    mobile: '+91 98765 43210',
    initials: 'PS',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    role: 'Member',
    plan: 'Premium',
    renewsDate: '10 Jan 2025',
  },
  // Doctor Profile (Dr. Ananya Rao, MD)
  doctor: {
    id: 'doc-1',
    name: 'Dr. Ananya Rao',
    degrees: 'MBBS, MD (Internal Medicine)',
    role: 'Doctor',
    initials: 'AR',
    department: 'Preventive Longevity & Metabolic Care',
    hospital: 'Longevita Clinical Institute',
    rating: 4.9,
    totalPatients: 48,
    isAvailable: true,
  },
  // Admin Profile (Admin User)
  adminUser: {
    name: 'Admin User',
    role: 'Administrator',
    email: 'admin@longevita.com',
    initials: 'AU',
  },
  // Admin Platform Stats (Matching Image 2)
  adminStats: {
    totalMembers: '2,540',
    totalMembersGrowth: '12%',
    activeSubscriptions: '1,980',
    activeSubscriptionsGrowth: '8%',
    revenue: '₹29,85,000',
    revenueGrowth: '19%',
    appointments: '840',
    appointmentsGrowth: '10%',
  },
  // Admin Member Growth History (Matching Image 2 Bar Chart)
  memberGrowthHistory: [
    { month: 'Apr', value: 520 },
    { month: 'May', value: 780 },
    { month: 'Jun', value: 1040 },
    { month: 'Jul', value: 960 },
    { month: 'Aug', value: 1220 },
    { month: 'Sep', value: 1380 },
    { month: 'Oct', value: 1520 },
  ],
  // Admin Subscriptions by Plan (Matching Image 2 Donut Chart)
  subscriptionsByPlan: [
    { name: 'Essential', percent: 35, count: 693, color: '#3B82F6', price: '₹2,999 / year' },
    { name: 'Advanced', percent: 45, count: 891, color: '#06B6D4', price: '₹5,999 / year' },
    { name: 'Premium', percent: 20, count: 396, color: '#8B5CF6', price: '₹9,999 / year' },
  ],
  // Subscription Plans (Matching Image 1 Pricing Cards)
  plans: [
    {
      id: 'plan-essential',
      name: 'Essential',
      priceYearly: '₹2,999',
      priceMonthly: '₹299',
      period: '/ year',
      isPopular: false,
      features: [
        'Health assessment',
        'Basic lab panel',
        'Health dashboard',
        'Email support'
      ]
    },
    {
      id: 'plan-advanced',
      name: 'Advanced',
      priceYearly: '₹5,999',
      priceMonthly: '₹599',
      period: '/ year',
      isPopular: true,
      features: [
        'Extended lab panel',
        'Quarterly consultations',
        'Personalised insights',
        'Priority support'
      ]
    },
    {
      id: 'plan-premium',
      name: 'Premium',
      priceYearly: '₹9,999',
      priceMonthly: '₹999',
      period: '/ year',
      isPopular: false,
      features: [
        'Comprehensive lab panel',
        'More frequent consultations',
        'Personalised preventive plan',
        'Dedicated care team'
      ]
    }
  ],
  // Admin Payments List
  paymentsList: [
    { id: 'TXN-90241', member: 'Priya Sharma', plan: 'Premium', amount: '₹9,999', date: '12 Nov 2024', method: 'UPI (GPay)', status: 'Paid' },
    { id: 'TXN-90240', member: 'Rahul Mehta', plan: 'Advanced', amount: '₹5,999', date: '10 Nov 2024', method: 'Credit Card', status: 'Paid' },
    { id: 'TXN-90239', member: 'Neha Kapoor', plan: 'Advanced', amount: '₹5,999', date: '08 Nov 2024', method: 'NetBanking', status: 'Paid' },
    { id: 'TXN-90238', member: 'Amit Verma', plan: 'Essential', amount: '₹2,999', date: '05 Nov 2024', method: 'UPI (PhonePe)', status: 'Paid' },
    { id: 'TXN-90237', member: 'Sneha Iyer', plan: 'Advanced', amount: '₹5,999', date: '02 Nov 2024', method: 'Credit Card', status: 'Paid' },
    { id: 'TXN-90236', member: 'Rohan Verma', plan: 'Premium', amount: '₹9,999', date: '28 Oct 2024', method: 'Debit Card', status: 'Paid' },
    { id: 'TXN-90235', member: 'Aisha Khan', plan: 'Premium', amount: '₹9,999', date: '25 Oct 2024', method: 'UPI (Paytm)', status: 'Paid' },
  ],
  // Admin Clinicians List
  cliniciansList: [
    { id: 'doc-1', name: 'Dr. Ananya Rao', specialty: 'Preventive Medicine & Longevity', patientsCount: 48, rating: 4.9, status: 'Active', availability: 'Available' },
    { id: 'doc-2', name: 'Dr. Vikram Malhotra', specialty: 'Cardiometabolic Health', patientsCount: 36, rating: 4.8, status: 'Active', availability: 'In Clinic' },
    { id: 'doc-3', name: 'Dr. Priya Desai', specialty: 'Endocrinology & Longevity', patientsCount: 42, rating: 4.9, status: 'Active', availability: 'Available' },
  ],
  // Health Score for member
  healthScore: {
    status: 'Good',
    score: 86,
    description: 'Vital markers are within optimal preventive range.',
  },
  // Detailed 6 metrics from screenshot
  healthMetrics: {
    weight: {
      key: 'weight',
      label: 'Weight',
      value: '62.5',
      unit: 'kg',
      displayValue: '62.5 kg',
      delta: '↓ 1.2 kg',
      deltaType: 'down',
      status: 'Normal',
      color: '#10B981',
      gradientId: 'grad-weight',
      history: {
        '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [63.2, 62.9, 62.7, 62.5] },
        '3M': { labels: ['Apr', 'May', 'Jun'], data: [63.8, 63.1, 62.5] },
        '6M': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [61.2, 66.0, 60.1, 58.0, 54.2, 56.5] },
        '1Y': { labels: ['Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jun'], data: [65.4, 64.9, 64.5, 64.0, 63.3, 62.8, 62.5] },
        'All': { labels: ['2023', 'Q1 24', 'Q2 24', 'Q3 24'], data: [66.5, 64.8, 63.5, 62.5] },
      },
    },
    bmi: {
      key: 'bmi',
      label: 'BMI',
      value: '22.4',
      unit: '',
      displayValue: '22.4',
      status: 'Normal',
      color: '#3B82F6',
      gradientId: 'grad-bmi',
      history: {
        '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [22.6, 22.5, 22.4, 22.4] },
        '3M': { labels: ['Apr', 'May', 'Jun'], data: [22.8, 22.6, 22.4] },
        '6M': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [23.1, 22.9, 22.7, 22.6, 22.5, 22.4] },
        '1Y': { labels: ['Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jun'], data: [23.5, 23.3, 23.1, 23.0, 22.7, 22.5, 22.4] },
        'All': { labels: ['2023', 'Q1 24', 'Q2 24', 'Q3 24'], data: [23.8, 23.2, 22.7, 22.4] },
      },
    },
    bodyFat: {
      key: 'bodyFat',
      label: 'Body Fat',
      value: '24',
      unit: '%',
      displayValue: '24%',
      status: 'Normal',
      color: '#F97316',
      gradientId: 'grad-bodyfat',
      history: {
        '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [24.5, 24.3, 24.1, 24.0] },
        '3M': { labels: ['Apr', 'May', 'Jun'], data: [25.0, 24.5, 24.0] },
        '6M': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [26.0, 25.8, 25.2, 24.8, 24.2, 24.0] },
        '1Y': { labels: ['Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jun'], data: [26.2, 25.8, 25.4, 25.0, 24.7, 24.3, 24.0] },
        'All': { labels: ['2023', 'Q1 24', 'Q2 24', 'Q3 24'], data: [26.8, 25.5, 24.8, 24.0] },
      },
    },
    bloodPressure: {
      key: 'bloodPressure',
      label: 'Blood Pressure',
      value: '118 / 76',
      unit: 'mmHg',
      displayValue: '118 / 76 mmHg',
      status: 'Normal',
      color: '#EF4444',
      gradientId: 'grad-bp',
      history: {
        '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [120, 119, 118, 118] },
        '3M': { labels: ['Apr', 'May', 'Jun'], data: [122, 120, 118] },
        '6M': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [126, 124, 122, 120, 119, 118] },
        '1Y': { labels: ['Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jun'], data: [128, 126, 125, 123, 121, 119, 118] },
        'All': { labels: ['2023', 'Q1 24', 'Q2 24', 'Q3 24'], data: [130, 126, 121, 118] },
      },
    },
    restingHeartRate: {
      key: 'restingHeartRate',
      label: 'Resting Heart Rate',
      value: '72',
      unit: 'bpm',
      displayValue: '72 bpm',
      status: 'Normal',
      color: '#8B5CF6',
      gradientId: 'grad-rhr',
      history: {
        '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [74, 73, 72, 72] },
        '3M': { labels: ['Apr', 'May', 'Jun'], data: [75, 73, 72] },
        '6M': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [76, 75, 74, 73, 73, 72] },
        '1Y': { labels: ['Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jun'], data: [78, 77, 75, 74, 73, 72, 72] },
        'All': { labels: ['2023', 'Q1 24', 'Q2 24', 'Q3 24'], data: [80, 76, 73, 72] },
      },
    },
    sleepDuration: {
      key: 'sleepDuration',
      label: 'Sleep Duration',
      value: '7.2',
      unit: 'hrs',
      displayValue: '7.2 hrs',
      status: 'Good',
      color: '#06B6D4',
      gradientId: 'grad-sleep',
      history: {
        '1M': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], data: [6.8, 7.0, 7.1, 7.2] },
        '3M': { labels: ['Apr', 'May', 'Jun'], data: [6.9, 7.1, 7.2] },
        '6M': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'], data: [6.5, 6.7, 6.8, 7.0, 7.1, 7.2] },
        '1Y': { labels: ['Jul', 'Sep', 'Nov', 'Jan', 'Mar', 'May', 'Jun'], data: [6.4, 6.6, 6.7, 6.8, 7.0, 7.1, 7.2] },
        'All': { labels: ['2023', 'Q1 24', 'Q2 24', 'Q3 24'], data: [6.3, 6.8, 7.1, 7.2] },
      },
    },
  },
  // Overview markers
  healthMarkers: {
    heartRate: { name: 'Heart Rate', value: 72, unit: 'bpm', status: 'Normal', statusType: 'normal' },
    bloodPressure: { name: 'Blood Pressure', value: '118 / 76', unit: '', status: 'Normal', statusType: 'normal' },
    bmi: { name: 'BMI', value: 22.4, unit: '', status: 'Normal', statusType: 'normal' },
    vitaminD: { name: 'Vitamin D', value: 28, unit: 'ng/mL', status: 'Low', statusType: 'low' },
    weight: { name: 'Weight', value: 62.5, unit: 'kg', status: 'Normal', statusType: 'normal' },
    cholesterol: { name: 'Cholesterol', value: 182, unit: 'mg/dL', status: 'Normal', statusType: 'normal' },
  },
  appointments: [
    {
      id: 'apt-1',
      doctor: 'Dr. Ananya Rao',
      specialty: 'Preventive Longevity Consultation',
      date: '12 Nov 2024',
      time: '10:30 AM',
      status: 'Upcoming',
      type: 'Video Consultation',
    },
    {
      id: 'apt-2',
      doctor: 'Dr. Vikram Malhotra',
      specialty: 'Cardiovascular Risk Assessment',
      date: '28 Nov 2024',
      time: '02:00 PM',
      status: 'Upcoming',
      type: 'In-Clinic Checkup',
    },
  ],
  labReports: [
    {
      id: 'rep-1',
      title: 'Comprehensive Health Checkup',
      date: '10 Oct 2024',
      status: 'Reviewed',
      iconTheme: 'green',
      category: 'Blood Tests',
      doctor: 'Dr. Ananya Rao',
      findings: 'Complete blood count and organ markers optimal. No signs of systemic inflammation.',
      biomarkers: [
        { name: 'Hemoglobin', value: '13.8 g/dL', range: '12.0 - 15.5 g/dL', status: 'Normal' },
        { name: 'WBC Count', value: '6,400 /µL', range: '4,500 - 11,000 /µL', status: 'Normal' },
        { name: 'Platelets', value: '240,000 /µL', range: '150,000 - 450,000 /µL', status: 'Normal' },
        { name: 'ESR', value: '12 mm/hr', range: '0 - 20 mm/hr', status: 'Normal' },
      ],
    },
    {
      id: 'rep-2',
      title: 'Lipid Profile',
      date: '10 Oct 2024',
      status: 'Reviewed',
      iconTheme: 'green',
      category: 'Metabolic',
      doctor: 'Dr. Ananya Rao',
      findings: 'Cardiovascular risk score low. HDL/LDL ratio favorable.',
      biomarkers: [
        { name: 'Total Cholesterol', value: '182 mg/dL', range: '< 200 mg/dL', status: 'Normal' },
        { name: 'HDL (Good)', value: '62 mg/dL', range: '> 50 mg/dL', status: 'Normal' },
        { name: 'LDL (Bad)', value: '102 mg/dL', range: '< 100 mg/dL', status: 'Normal' },
        { name: 'Triglycerides', value: '110 mg/dL', range: '< 150 mg/dL', status: 'Normal' },
      ],
    },
    {
      id: 'rep-3',
      title: 'Thyroid Panel',
      date: '10 Oct 2024',
      status: 'Reviewed',
      iconTheme: 'green',
      category: 'Hormones',
      doctor: 'Dr. Ananya Rao',
      findings: 'Thyroid function euthyroid. TSH stable at 2.1 µIU/mL.',
      biomarkers: [
        { name: 'TSH', value: '2.1 µIU/mL', range: '0.4 - 4.0 µIU/mL', status: 'Normal' },
        { name: 'Free T3', value: '3.2 pg/mL', range: '2.3 - 4.2 pg/mL', status: 'Normal' },
        { name: 'Free T4', value: '1.2 ng/dL', range: '0.8 - 1.8 ng/dL', status: 'Normal' },
      ],
    },
    {
      id: 'rep-4',
      title: 'Vitamin D (25-OH)',
      date: '10 Oct 2024',
      status: 'Pending Review',
      iconTheme: 'orange',
      category: 'Vitamins',
      doctor: 'Dr. Ananya Rao',
      findings: 'Serum 25-hydroxy vitamin D sub-optimal (28 ng/mL). Recommendation: supplement with 2000 IU D3 daily.',
      biomarkers: [
        { name: '25-OH Vitamin D', value: '28 ng/mL', range: '30 - 100 ng/mL', status: 'Low' },
      ],
    },
    {
      id: 'rep-5',
      title: 'HbA1c (Diabetes Screening)',
      date: '10 Oct 2024',
      status: 'Reviewed',
      iconTheme: 'green',
      category: 'Metabolic',
      doctor: 'Dr. Ananya Rao',
      findings: 'Glycated hemoglobin indicates normal glycemic regulation over preceding 90 days.',
      biomarkers: [
        { name: 'HbA1c', value: '5.4%', range: '< 5.7%', status: 'Normal' },
        { name: 'Estimated Avg Glucose', value: '108 mg/dL', range: '< 117 mg/dL', status: 'Normal' },
      ],
    },
  ],
  // Assigned Members for Doctor Portal (Matching Image 3 & Image 4 precisely)
  assignedMembers: [
    {
      id: 'pat-1',
      name: 'Priya Sharma',
      age: 32,
      gender: 'Female',
      email: 'priya.sharma@gmail.com',
      mobile: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
      initials: 'PS',
      plan: 'Premium',
      bloodGroup: 'O+',
      allergies: 'Penicillin',
      status: 'Active',
      lastVisit: '12 Nov 2024',
      keyConcerns: 'Weight management',
      riskTier: 'Attention Needed',
      riskReason: 'Vitamin D Sub-Optimal (28 ng/mL)',
      vitalSummary: {
        weight: '62.5 kg',
        bp: '118 / 76',
        hr: '72 bpm',
        bodyFat: '24%',
        bmi: '22.4',
        vitaminD: '28 ng/mL',
      },
      recentLabs: [
        { name: 'Vitamin D', value: '28 ng/mL', status: 'Low', statusType: 'low', icon: 'orange' },
        { name: 'HbA1c', value: '5.4%', status: 'Normal', statusType: 'normal', icon: 'green' },
        { name: 'Total Cholesterol', value: '182 mg/dL', status: 'Normal', statusType: 'normal', icon: 'green' },
        { name: 'TSH', value: '2.1 µIU/mL', status: 'Normal', statusType: 'normal', icon: 'green' },
      ],
      trends: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        weight: [61.2, 66.0, 60.1, 58.0, 54.2, 56.5],
        bloodPressure: [124, 126, 122, 120, 118, 118],
        heartRate: [76, 75, 74, 73, 72, 72],
        bodyFat: [26.0, 25.8, 25.2, 24.8, 24.2, 24.0],
      },
      notes: [
        {
          id: 'note-1',
          date: '12 Nov 2024',
          author: 'Dr. Ananya Rao',
          content: 'Consultation conducted for weight management and body composition. Fasting insulin optimal. Prescribed 2000 IU D3 daily and zone-2 cardio regimen.',
        }
      ]
    },
    {
      id: 'pat-2',
      name: 'Rahul Mehta',
      age: 45,
      gender: 'Male',
      email: 'rahul.mehta@corp.in',
      mobile: '+91 98112 34567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
      initials: 'RM',
      plan: 'Executive',
      bloodGroup: 'B+',
      allergies: 'None reported',
      status: 'Active',
      lastVisit: '10 Nov 2024',
      keyConcerns: 'Blood pressure, Stress',
      riskTier: 'Attention Needed',
      riskReason: 'Elevated BP & Cortisol profile',
      vitalSummary: {
        weight: '84.5 kg',
        bp: '132 / 86',
        hr: '82 bpm',
        bodyFat: '28%',
        bmi: '27.4',
        vitaminD: '24 ng/mL',
      },
      recentLabs: [
        { name: 'Blood Pressure', value: '132 / 86', status: 'Elevated', statusType: 'warning', icon: 'orange' },
        { name: 'Fasting Glucose', value: '104 mg/dL', status: 'Borderline', statusType: 'warning', icon: 'orange' },
        { name: 'Serum Cortisol', value: '18.4 µg/dL', status: 'Normal', statusType: 'normal', icon: 'green' },
        { name: 'hs-CRP', value: '1.2 mg/L', status: 'Normal', statusType: 'normal', icon: 'green' },
      ],
      trends: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        weight: [86.5, 86.0, 85.5, 85.0, 84.8, 84.5],
        bloodPressure: [138, 136, 134, 132, 132, 132],
        heartRate: [85, 84, 83, 82, 82, 82],
        bodyFat: [29.0, 28.8, 28.5, 28.2, 28.0, 28.0],
      },
      notes: []
    },
    {
      id: 'pat-3',
      name: 'Neha Kapoor',
      age: 29,
      gender: 'Female',
      email: 'neha.kapoor@gmail.com',
      mobile: '+91 99234 56789',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
      initials: 'NK',
      plan: 'Advanced',
      bloodGroup: 'A+',
      allergies: 'Sulfa Drugs',
      status: 'Active',
      lastVisit: '8 Nov 2024',
      keyConcerns: 'PCOS, Nutrition',
      riskTier: 'Optimal',
      riskReason: 'Insulin sensitivity improving under low-GI protocol',
      vitalSummary: {
        weight: '58.0 kg',
        bp: '114 / 74',
        hr: '68 bpm',
        bodyFat: '23%',
        bmi: '21.5',
        vitaminD: '42 ng/mL',
      },
      recentLabs: [
        { name: 'LH / FSH Ratio', value: '1.2', status: 'Normal', statusType: 'normal', icon: 'green' },
        { name: 'Fasting Insulin', value: '6.5 µIU/mL', status: 'Optimal', statusType: 'normal', icon: 'green' },
        { name: 'HbA1c', value: '5.2%', status: 'Normal', statusType: 'normal', icon: 'green' },
        { name: 'Vitamin D', value: '42 ng/mL', status: 'Normal', statusType: 'normal', icon: 'green' },
      ],
      trends: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        weight: [61.0, 60.2, 59.5, 59.0, 58.4, 58.0],
        bloodPressure: [118, 116, 115, 114, 114, 114],
        heartRate: [72, 70, 70, 68, 68, 68],
        bodyFat: [25.0, 24.5, 24.0, 23.5, 23.2, 23.0],
      },
      notes: []
    },
    {
      id: 'pat-4',
      name: 'Amit Verma',
      age: 38,
      gender: 'Male',
      email: 'amit.verma@fintech.co',
      mobile: '+91 97345 67890',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
      initials: 'AV',
      plan: 'Essential',
      bloodGroup: 'AB+',
      allergies: 'None reported',
      status: 'Follow-up',
      lastVisit: '5 Nov 2024',
      keyConcerns: 'Diabetes risk',
      riskTier: 'Moderate Risk',
      riskReason: 'Borderline fasting blood glucose (108 mg/dL)',
      vitalSummary: {
        weight: '78.0 kg',
        bp: '126 / 82',
        hr: '76 bpm',
        bodyFat: '26%',
        bmi: '25.2',
        vitaminD: '32 ng/mL',
      },
      recentLabs: [
        { name: 'Fasting Glucose', value: '108 mg/dL', status: 'Borderline', statusType: 'warning', icon: 'orange' },
        { name: 'HbA1c', value: '5.8%', status: 'Elevated', statusType: 'warning', icon: 'orange' },
        { name: 'Lipid Profile', value: '195 mg/dL', status: 'Borderline', statusType: 'warning', icon: 'orange' },
        { name: 'Triglycerides', value: '160 mg/dL', status: 'Borderline', statusType: 'warning', icon: 'orange' },
      ],
      trends: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        weight: [80.5, 79.8, 79.0, 78.5, 78.2, 78.0],
        bloodPressure: [130, 128, 128, 126, 126, 126],
        heartRate: [79, 78, 77, 76, 76, 76],
        bodyFat: [27.5, 27.0, 26.8, 26.5, 26.2, 26.0],
      },
      notes: []
    },
    {
      id: 'pat-5',
      name: 'Sneha Iyer',
      age: 34,
      gender: 'Female',
      email: 'sneha.iyer@design.in',
      mobile: '+91 98456 78901',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      initials: 'SI',
      plan: 'Advanced',
      bloodGroup: 'O-',
      allergies: 'Aspirin',
      status: 'Active',
      lastVisit: '2 Nov 2024',
      keyConcerns: 'Thyroid, Fatigue',
      riskTier: 'Optimal',
      riskReason: 'TSH stabilized on 50mcg thyroxine, ferritin optimal',
      vitalSummary: {
        weight: '55.5 kg',
        bp: '112 / 70',
        hr: '65 bpm',
        bodyFat: '22%',
        bmi: '20.8',
        vitaminD: '48 ng/mL',
      },
      recentLabs: [
        { name: 'TSH', value: '1.9 µIU/mL', status: 'Optimal', statusType: 'normal', icon: 'green' },
        { name: 'Free T4', value: '1.3 ng/dL', status: 'Normal', statusType: 'normal', icon: 'green' },
        { name: 'Serum Ferritin', value: '65 ng/mL', status: 'Optimal', statusType: 'normal', icon: 'green' },
        { name: 'Vitamin B12', value: '620 pg/mL', status: 'Optimal', statusType: 'normal', icon: 'green' },
      ],
      trends: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        weight: [57.0, 56.5, 56.0, 55.8, 55.5, 55.5],
        bloodPressure: [116, 114, 112, 112, 112, 112],
        heartRate: [68, 67, 66, 65, 65, 65],
        bodyFat: [23.5, 23.0, 22.8, 22.5, 22.2, 22.0],
      },
      notes: []
    }
  ],
  // Clinical Follow-ups
  followUps: [
    {
      id: 'fu-1',
      patientId: 'pat-1',
      patientName: 'Priya Sharma',
      task: 'Review 25-OH Vitamin D assay & confirm supplementation tolerance',
      dueDate: '12 Nov 2024',
      priority: 'Urgent',
      type: 'Lab Review',
      completed: false,
    },
    {
      id: 'fu-2',
      patientId: 'pat-4',
      patientName: 'Amit Verma',
      task: 'Check fasting glucose & assess Mediterranean nutritional plan adherence',
      dueDate: '05 Nov 2024',
      priority: 'Urgent',
      type: 'Biomarker Check',
      completed: false,
    },
    {
      id: 'fu-3',
      patientId: 'pat-2',
      patientName: 'Rahul Mehta',
      task: 'Evaluate ambulatory blood pressure report & stress management logs',
      dueDate: '10 Nov 2024',
      priority: 'Medium',
      type: 'Video Check-in',
      completed: false,
    },
    {
      id: 'fu-4',
      patientId: 'pat-3',
      patientName: 'Neha Kapoor',
      task: 'Routine PCOS cycle nutrition & metabolic follow-up dispatch',
      dueDate: '18 Dec 2024',
      priority: 'Routine',
      type: 'Protocol Dispatch',
      completed: true,
    }
  ],
  nextSteps: [
    {
      id: 'step-1',
      title: 'Complete annual assessment',
      subtitle: 'Due in 10 days',
      icon: 'assessment',
      completed: false,
    },
    {
      id: 'step-2',
      title: 'Upload latest lab reports',
      subtitle: 'Enhance your insights',
      icon: 'upload',
      completed: false,
    },
  ],
  careTeamMessages: [
    {
      id: 'msg-1',
      sender: 'Dr. Ananya Rao',
      avatar: 'AR',
      text: 'Hi Priya, I reviewed your recent Vitamin D levels. A mild supplement of 2000 IU/day will easily bring this into optimal range.',
      time: 'Yesterday at 4:15 PM',
      isUnread: true,
    },
    {
      id: 'msg-2',
      sender: 'Care Coordinator Rhea',
      avatar: 'CR',
      text: 'Your video consultation for 12 Nov 2024 at 10:30 AM is confirmed. We look forward to seeing you!',
      time: '2 days ago',
      isUnread: true,
    },
  ],
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
          doctor: 'Dr. Ananya Rao',
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
