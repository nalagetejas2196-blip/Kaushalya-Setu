const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { extractSkillsFromText } = require('../services/nlpSkillExtractor');

// Conversational AI Skill Extraction
router.post('/extract', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text input is required for conversational extraction' });
  }

  const extracted = extractSkillsFromText(text);
  return res.json({
    query: text,
    extractedSkills: extracted,
    count: extracted.length,
    timestamp: new Date().toISOString()
  });
});

// List NSQF-Aligned Occupations
router.get('/occupations', (req, res) => {
  const occupations = db.getCollection('occupations');
  res.json(occupations);
});

// Single Occupation Detail
router.get('/occupations/:id', (req, res) => {
  const occ = db.findById('occupations', req.params.id);
  if (!occ) return res.status(404).json({ error: 'Occupation not found' });
  res.json(occ);
});

// Skill Gap Analysis
router.post('/gap-analysis', (req, res) => {
  const { occupationId, userSkills = [] } = req.body;

  const occ = db.findById('occupations', occupationId);
  if (!occ) return res.status(404).json({ error: 'Target occupation not found' });

  const userSkillNames = userSkills.map(s => (typeof s === 'string' ? s : s.name).toLowerCase());
  const required = occ.required_skills || [];

  const matchedSkills = [];
  const missingSkills = [];

  for (const skill of required) {
    const isMatched = userSkillNames.some(uSkill =>
      uSkill.includes(skill.toLowerCase()) || skill.toLowerCase().includes(uSkill)
    );

    if (isMatched) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const matchPercentage = required.length > 0
    ? Math.round((matchedSkills.length / required.length) * 100)
    : 0;

  // Find recommended training
  const allTrainings = db.getCollection('trainings');
  const recommendedTraining = allTrainings.find(t => t.id === occ.suitable_training_id) || allTrainings[0];

  return res.json({
    occupation: occ,
    matchPercentage,
    matchedSkills,
    missingSkills,
    recommendedTraining,
    pathway: [
      { step: 1, title: "Current Skill Profile", status: "COMPLETED", detail: `${matchedSkills.length} of ${required.length} foundational skills present.` },
      { step: 2, title: "Bridge Missing Competencies", status: "IN_PROGRESS", detail: `Acquire: ${missingSkills.join(', ')}` },
      { step: 3, title: "PM-AJAY Sponsored Training", status: "UPCOMING", detail: `${recommendedTraining ? recommendedTraining.title : 'Local ITI Technical Training'}` },
      { step: 4, title: "NSQF Assessment & Certification", status: "UPCOMING", detail: `${occ.nsqf_level} National Skill Certificate.` },
      { step: 5, title: "Placement / Local Micro-Enterprise", status: "UPCOMING", detail: `Connect with local clusters & FPOs.` }
    ]
  });
});

// "What If?" Career Pathway Simulator (Compare 2 Occupations)
router.post('/simulate-pathway', (req, res) => {
  const { userSkills = [], occupationAId, occupationBId } = req.body;

  const occA = db.findById('occupations', occupationAId || 'occ-solar-tech');
  const occB = db.findById('occupations', occupationBId || 'occ-pump-tech');

  if (!occA || !occB) {
    return res.status(404).json({ error: 'One or both target occupations not found' });
  }

  const userSkillNames = userSkills.map(s => (typeof s === 'string' ? s : s.name).toLowerCase());

  const analyzeOcc = (occ) => {
    const required = occ.required_skills || [];
    const matched = required.filter(s =>
      userSkillNames.some(uSkill => uSkill.includes(s.toLowerCase()) || s.toLowerCase().includes(uSkill))
    );
    const missing = required.filter(s => !matched.includes(s));
    const matchPct = required.length > 0 ? Math.round((matched.length / required.length) * 100) : 0;
    const training = db.findById('trainings', occ.suitable_training_id);
    const opps = db.find('opportunities', o =>
      o.required_skills && o.required_skills.some(r => required.includes(r))
    );

    return {
      occupation: occ,
      matchPercentage: matchPct,
      matchedSkills: matched,
      missingSkills: missing,
      training,
      nearbyOpportunitiesCount: opps.length
    };
  };

  const simA = analyzeOcc(occA);
  const simB = analyzeOcc(occB);

  return res.json({
    pathwayA: simA,
    pathwayB: simB,
    recommendation: simA.matchPercentage >= simB.matchPercentage
      ? `Pathway A (${occA.title}) has a ${simA.matchPercentage}% baseline alignment with your current competencies.`
      : `Pathway B (${occB.title}) has a ${simB.matchPercentage}% baseline alignment with your current competencies.`
  });
});

module.exports = router;
