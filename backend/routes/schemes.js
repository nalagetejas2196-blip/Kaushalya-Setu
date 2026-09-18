const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { evaluateEligibility } = require('../services/eligibilityEngine');

// List schemes with optional search/filter
router.get('/', (req, res) => {
  const { category, tag, q } = req.query;
  let schemes = db.getCollection('schemes');

  if (tag) {
    schemes = schemes.filter(s => s.tags && s.tags.includes(tag));
  }

  if (q) {
    const query = q.toLowerCase();
    schemes = schemes.filter(s =>
      s.title.toLowerCase().includes(query) ||
      (s.title_mr && s.title_mr.includes(query)) ||
      (s.title_hi && s.title_hi.includes(query)) ||
      s.department.toLowerCase().includes(query) ||
      s.benefits.toLowerCase().includes(query)
    );
  }

  res.json(schemes);
});

// Single Scheme
router.get('/:id', (req, res) => {
  const scheme = db.findById('schemes', req.params.id);
  if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
  res.json(scheme);
});

// Check eligibility for a specific scheme
router.post('/:id/check-eligibility', (req, res) => {
  const scheme = db.findById('schemes', req.params.id);
  if (!scheme) return res.status(404).json({ error: 'Scheme not found' });

  const user = req.body.user || db.findById('users', req.body.userId) || {
    category: "SC",
    age: 22,
    annual_income: 72000,
    education: "12th Pass",
    documents: []
  };

  const result = evaluateEligibility(user, scheme);
  res.json(result);
});

// Check eligibility across all schemes for current user
router.post('/check-all', (req, res) => {
  const user = req.body.user || db.findById('users', req.body.userId) || {
    category: "SC",
    age: 22,
    annual_income: 72000,
    education: "12th Pass",
    documents: []
  };

  const schemes = db.getCollection('schemes');
  const results = schemes.map(scheme => ({
    scheme,
    evaluation: evaluateEligibility(user, scheme)
  }));

  // Sort: ELIGIBLE first, then REQUIRES_VERIFICATION, then NOT_MATCHED
  results.sort((a, b) => {
    const order = { ELIGIBLE: 1, REQUIRES_VERIFICATION: 2, NOT_MATCHED: 3 };
    return (order[a.evaluation.status] || 99) - (order[b.evaluation.status] || 99);
  });

  res.json(results);
});

module.exports = router;
