const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Generate realistic Application ID: KAUS-2026-XXXX
function generateAppId() {
  const randNum = Math.floor(1000 + Math.random() * 9000);
  return `KAUS-2026-${randNum}`;
}

// Beneficiary Submit Application
router.post('/apply', (req, res) => {
  const {
    userId,
    schemeOrOppType,
    targetId,
    targetTitle,
    targetOrg,
    documentsSubmitted = [],
    declarationAccepted
  } = req.body;

  if (!userId || !targetId) {
    return res.status(400).json({ error: 'User ID and Target ID are required' });
  }

  const user = db.findById('users', userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const appId = generateAppId();
  const now = new Date().toISOString();

  const newApp = {
    id: appId,
    beneficiary_id: user.id,
    beneficiary_name: user.name,
    beneficiary_phone: user.phone,
    scheme_or_opp_type: schemeOrOppType || 'OPPORTUNITY',
    target_id: targetId,
    target_title: targetTitle || 'Livelihood Opportunity',
    target_org: targetOrg || 'PM-AJAY Partner Organization',
    district: user.district || 'Ahilyanagar',
    taluka: user.taluka || 'Sangamner',
    status: 'Submitted',
    status_notes: 'Application received. Pending assignment to District Welfare Officer.',
    applied_date: now,
    updated_date: now,
    assigned_officer_id: 'off-001',
    assigned_officer_name: 'Rajesh Deshmukh (DWO)',
    documents_submitted: documentsSubmitted.length > 0 ? documentsSubmitted : [
      { type: 'caste_cert', fileName: 'caste_certificate.pdf', verified: true, officer_note: 'Verified from state database' },
      { type: 'education_cert', fileName: 'education_marksheet.pdf', verified: false, officer_note: 'Pending verification' }
    ],
    timeline: [
      {
        status: 'Submitted',
        timestamp: now,
        actor: `${user.name} (Applicant)`,
        note: 'Application successfully submitted through Kaushalya Setu digital portal.'
      },
      {
        status: 'Under Verification',
        timestamp: new Date(Date.now() + 5000).toISOString(),
        actor: 'System Automated Workflow',
        note: `Assigned to ${user.district} District Welfare Officer for document scrutiny.`
      }
    ]
  };

  db.insertOne('applications', newApp);

  // Notify Beneficiary
  db.insertOne('notifications', {
    id: `notif-${Date.now()}`,
    recipient_id: user.id,
    role: 'beneficiary',
    title: 'Application Submitted',
    title_mr: 'अर्ज यशस्वीरीत्या सादर केला',
    title_hi: 'आवेदन सफलतापूर्वक जमा किया गया',
    message: `Your application ${appId} for "${newApp.target_title}" has been submitted and assigned for verification.`,
    message_mr: `तुमचा अर्ज ${appId} ("${newApp.target_title}") यशस्वीरित्या सादर झाला असून पडताळणीसाठी पाठवण्यात आला आहे.`,
    message_hi: `आपका आवेदन ${appId} ("${newApp.target_title}") जमा कर दिया गया है और सत्यापन के लिए भेजा गया है।`,
    type: 'APPLICATION_SUBMITTED',
    reference_id: appId,
    read: false,
    createdAt: now
  });

  // Notify Officer
  db.insertOne('notifications', {
    id: `notif-${Date.now() + 1}`,
    recipient_id: 'off-001',
    role: 'officer',
    title: 'New Application in Queue',
    title_mr: 'रांगेत नवीन अर्ज प्राप्त झाला',
    title_hi: 'कतार में नया आवेदन प्राप्त हुआ',
    message: `New application ${appId} submitted by ${user.name} (${user.district}) for ${newApp.target_title}.`,
    message_mr: `${user.name} (${user.district}) यांच्याकडून नवीन अर्ज ${appId} प्राप्त झाला आहे.`,
    message_hi: `${user.name} (${user.district}) द्वारा नया आवेदन ${appId} जमा किया गया है।`,
    type: 'OFFICER_QUEUE_NEW',
    reference_id: appId,
    read: false,
    createdAt: now
  });

  return res.status(201).json(newApp);
});

// My Applications (for Beneficiary)
router.get('/my/:userId', (req, res) => {
  const apps = db.find('applications', a => a.beneficiary_id === req.params.userId);
  res.json(apps);
});

// Track Application by ID
router.get('/track/:id', (req, res) => {
  const app = db.findById('applications', req.params.id);
  if (!app) return res.status(404).json({ error: 'Application ID not found' });
  res.json(app);
});

// Officer Application Queue
router.get('/officer-queue', (req, res) => {
  const { status, district, q } = req.query;
  let apps = db.getCollection('applications');

  if (status && status !== 'ALL') {
    apps = apps.filter(a => a.status.toLowerCase() === status.toLowerCase());
  }

  if (district) {
    apps = apps.filter(a => a.district.toLowerCase() === district.toLowerCase());
  }

  if (q) {
    const query = q.toLowerCase();
    apps = apps.filter(a =>
      a.id.toLowerCase().includes(query) ||
      a.beneficiary_name.toLowerCase().includes(query) ||
      a.target_title.toLowerCase().includes(query)
    );
  }

  res.json(apps);
});

// Officer: Verify a Document
router.post('/:id/verify-doc', (req, res) => {
  const { docType, verified, officerNote, officerName } = req.body;
  const app = db.findById('applications', req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });

  const now = new Date().toISOString();
  const docs = app.documents_submitted || [];
  const docIndex = docs.findIndex(d => d.type === docType);

  if (docIndex !== -1) {
    docs[docIndex].verified = verified;
    docs[docIndex].officer_note = officerNote || (verified ? 'Verified by Officer' : 'Requires re-upload');
  }

  const timelineEntry = {
    status: app.status,
    timestamp: now,
    actor: officerName || 'District Welfare Officer',
    note: `Document [${docType}] was marked as ${verified ? 'VERIFIED' : 'CORRECTION NEEDED'}: ${officerNote || ''}`
  };

  const updated = db.updateOne('applications', a => a.id === req.params.id, {
    documents_submitted: docs,
    updated_date: now,
    timeline: [...(app.timeline || []), timelineEntry]
  });

  return res.json(updated);
});

// Officer: Update Status (Approve, Reject, Request Docs, etc.)
router.post('/:id/update-status', (req, res) => {
  const { status, statusNotes, officerName } = req.body;
  const app = db.findById('applications', req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });

  const now = new Date().toISOString();
  const timelineEntry = {
    status,
    timestamp: now,
    actor: officerName || 'District Welfare Officer',
    note: statusNotes || `Application status updated to '${status}'.`
  };

  const updated = db.updateOne('applications', a => a.id === req.params.id, {
    status,
    status_notes: statusNotes || app.status_notes,
    updated_date: now,
    timeline: [...(app.timeline || []), timelineEntry]
  });

  // Notify Beneficiary of status update
  const statusTranslations = {
    Approved: { en: "Approved", mr: "मंजूर करण्यात आला", hi: "स्वीकृत किया गया" },
    Rejected: { en: "Rejected", mr: "नाकारण्यात आला", hi: "अस्वीकृत किया गया" },
    "Documents Required": { en: "Additional Documents Required", mr: "अतिरिक्त कागदपत्रांची आवश्यकता", hi: "अतिरिक्त दस्तावेजों की आवश्यकता" },
    "Under Verification": { en: "Under Verification", mr: "पडताळणी सुरू आहे", hi: "सत्यापन प्रक्रिया जारी है" }
  };

  const trans = statusTranslations[status] || { en: status, mr: status, hi: status };

  db.insertOne('notifications', {
    id: `notif-${Date.now()}`,
    recipient_id: app.beneficiary_id,
    role: 'beneficiary',
    title: `Application Status: ${status}`,
    title_mr: `अर्जाची स्थिती: ${trans.mr}`,
    title_hi: `आवेदन की स्थिति: ${trans.hi}`,
    message: `Your application ${app.id} has been marked as '${status}'. Note: ${statusNotes || 'No notes'}`,
    message_mr: `तुमचा अर्ज ${app.id} आता '${trans.mr}' स्थितीत आहे. शेरा: ${statusNotes || 'कोणताही शेरा नाही'}`,
    message_hi: `आपका आवेदन ${app.id} अब '${trans.hi}' स्थिति में है। विवरण: ${statusNotes || 'कोई विवरण नहीं'}`,
    type: 'APPLICATION_STATUS_CHANGE',
    reference_id: app.id,
    read: false,
    createdAt: now
  });

  return res.json(updated);
});

module.exports = router;
