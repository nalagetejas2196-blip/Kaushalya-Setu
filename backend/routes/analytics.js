const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/district', (req, res) => {
  const users = db.getCollection('users');
  const applications = db.getCollection('applications');
  const opportunities = db.getCollection('opportunities');
  const trainings = db.getCollection('trainings');

  const beneficiaries = users.filter(u => u.role === 'beneficiary');

  // Status breakdown
  const statusCounts = {
    Submitted: applications.filter(a => a.status === 'Submitted').length,
    'Under Verification': applications.filter(a => a.status === 'Under Verification').length,
    'Documents Required': applications.filter(a => a.status === 'Documents Required').length,
    Approved: applications.filter(a => a.status === 'Approved').length,
    Rejected: applications.filter(a => a.status === 'Rejected').length
  };

  // Taluka / District distribution
  const districtDistribution = [
    { name: 'Sangamner', beneficiaries: 142, applications: 84 },
    { name: 'Rahata', beneficiaries: 98, applications: 62 },
    { name: 'Kopargaon', beneficiaries: 76, applications: 45 },
    { name: 'Shrirampur', beneficiaries: 85, applications: 51 },
    { name: 'Nevasa', beneficiaries: 64, applications: 38 },
    { name: 'Akole', beneficiaries: 53, applications: 29 }
  ];

  // Top Skills vs Skill Gaps
  const skillGapAnalytics = [
    { skill: 'Solar PV Mounting', identified: 45, demandGap: 88 },
    { skill: 'Pump Troubleshooting', identified: 120, demandGap: 30 },
    { skill: 'Electrical Safety', identified: 58, demandGap: 72 },
    { skill: 'Drone Operations', identified: 22, demandGap: 95 },
    { skill: 'Industrial Sewing', identified: 82, demandGap: 40 },
    { skill: 'Digital Data Entry', identified: 94, demandGap: 50 }
  ];

  // Language & A11y usage stats
  const accessibilityStats = {
    languageDistribution: [
      { name: 'Marathi (मराठी)', value: 68 },
      { name: 'Hindi (हिंदी)', value: 22 },
      { name: 'English', value: 10 }
    ],
    featuresUsage: [
      { feature: 'Voice Assistant ("Kaushalya Sahayak")', users: 184 },
      { feature: 'Large Font / A+ Mode', users: 112 },
      { feature: 'High Contrast Mode', users: 74 },
      { feature: 'Audio Guidance Prompts', users: 145 }
    ]
  };

  res.json({
    kpis: {
      totalBeneficiaries: beneficiaries.length + 518, // aggregate demo district baseline
      totalApplications: applications.length + 309,
      pendingVerification: statusCounts['Under Verification'] + statusCounts['Submitted'] + 42,
      approvedLivelihoods: statusCounts['Approved'] + 185,
      activeTrainingBatches: trainings.length + 8,
      localOpportunitiesAvailable: opportunities.length + 24
    },
    statusBreakdown: Object.keys(statusCounts).map(k => ({ status: k, count: statusCounts[k] })),
    districtDistribution,
    skillGapAnalytics,
    accessibilityStats,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
