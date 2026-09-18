const express = require('express');
const router = express.Router();
const db = require('../config/db');

// List opportunities (Jobs, Apprenticeships, Entrepreneurship)
router.get('/', (req, res) => {
  const { type, max_distance, district, q } = req.query;
  let opps = db.getCollection('opportunities');

  if (type) {
    opps = opps.filter(o => o.opportunity_type.toLowerCase() === type.toLowerCase());
  }

  if (max_distance) {
    const distLimit = Number(max_distance);
    opps = opps.filter(o => o.distance_km <= distLimit);
  }

  if (district) {
    opps = opps.filter(o => o.district.toLowerCase() === district.toLowerCase());
  }

  if (q) {
    const query = q.toLowerCase();
    opps = opps.filter(o =>
      o.title.toLowerCase().includes(query) ||
      (o.title_mr && o.title_mr.includes(query)) ||
      (o.title_hi && o.title_hi.includes(query)) ||
      o.organization.toLowerCase().includes(query)
    );
  }

  res.json(opps);
});

// Single Opportunity
router.get('/:id', (req, res) => {
  const opp = db.findById('opportunities', req.params.id);
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' });
  res.json(opp);
});

// List Training Centers & Programs
router.get('/trainings/list', (req, res) => {
  const { district, q } = req.query;
  let trainings = db.getCollection('trainings');

  if (district) {
    trainings = trainings.filter(t => t.district.toLowerCase() === district.toLowerCase());
  }

  if (q) {
    const query = q.toLowerCase();
    trainings = trainings.filter(t =>
      t.title.toLowerCase().includes(query) ||
      (t.title_mr && t.title_mr.includes(query)) ||
      t.provider.toLowerCase().includes(query)
    );
  }

  res.json(trainings);
});

module.exports = router;
