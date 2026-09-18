const express = require('express');
const router = express.Router();
const db = require('../config/db');

// 1-Click Demo Login
router.post('/demo-login', (req, res) => {
  const { role } = req.body;
  let targetEmail = 'demo.beneficiary@kaushalyasetu.local';

  if (role === 'officer') {
    targetEmail = 'demo.officer@kaushalyasetu.local';
  } else if (role === 'admin') {
    targetEmail = 'demo.admin@kaushalyasetu.local';
  }

  const user = db.findOne('users', u => u.email === targetEmail);
  if (!user) {
    return res.status(404).json({ error: 'Demo user not found' });
  }

  return res.json({
    token: `demo-token-${user.id}-${Date.now()}`,
    user
  });
});

// Standard Login with OTP / Password
router.post('/login', (req, res) => {
  const { identifier, otp, password } = req.body;

  if (!identifier) {
    return res.status(400).json({ error: 'Email or Mobile number is required' });
  }

  const user = db.findOne('users', u =>
    u.email === identifier || u.phone === identifier
  );

  if (!user) {
    return res.status(404).json({ error: 'User not registered with this mobile/email' });
  }

  // If OTP was provided, accept 123456 as valid demo OTP
  if (otp) {
    if (otp === '123456') {
      return res.json({
        token: `demo-token-${user.id}-${Date.now()}`,
        user
      });
    } else {
      return res.status(400).json({ error: 'Invalid OTP. For demonstration, use 123456' });
    }
  }

  // For officer/admin passwords
  return res.json({
    token: `demo-token-${user.id}-${Date.now()}`,
    user
  });
});

// Register New Beneficiary
router.post('/register', (req, res) => {
  const {
    name, phone, gender, age, category, state, district, taluka, village,
    education, employment_status, annual_income, preferred_language, preferred_radius_km
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and Phone number are required' });
  }

  const existing = db.findOne('users', u => u.phone === phone);
  if (existing) {
    return res.status(400).json({ error: 'Beneficiary with this phone number already exists' });
  }

  const newUser = {
    id: `ben-${Date.now().toString().slice(-4)}`,
    name,
    phone,
    role: 'beneficiary',
    email: `${phone}@kaushalyasetu.local`,
    gender: gender || 'Unspecified',
    age: Number(age) || 20,
    category: category || 'SC',
    state: state || 'Maharashtra',
    district: district || 'Ahilyanagar',
    taluka: taluka || 'Sangamner',
    village: village || 'Local',
    education: education || '10th Pass',
    employment_status: employment_status || 'Seeking Skill Training / Livelihood',
    annual_income: Number(annual_income) || 60000,
    preferred_language: preferred_language || 'mr',
    preferred_radius_km: Number(preferred_radius_km) || 25,
    skills: [],
    interests: [],
    profile_completion: 60,
    documents: []
  };

  db.insertOne('users', newUser);

  // Add welcome notification
  db.insertOne('notifications', {
    id: `notif-${Date.now()}`,
    recipient_id: newUser.id,
    role: 'beneficiary',
    title: 'Welcome to Kaushalya Setu',
    title_mr: 'कौशल्य सेतू पोर्टलवर आपले स्वागत आहे',
    title_hi: 'कौशल्य सेतु पोर्टल पर आपका स्वागत है',
    message: 'Profile created. Complete your conversational skill assessment to unlock recommended schemes & opportunities.',
    message_mr: 'आपले प्रोफाइल तयार झाले आहे. आपल्यासाठी योग्य योजना आणि नोकऱ्या पाहण्यासाठी कौशल्य शोध चाचणी पूर्ण करा.',
    message_hi: 'आपकी प्रोफ़ाइल बन गई है। अनुशंसित योजनाओं और अवसरों को देखने के लिए कौशल मूल्यांकन पूरा करें।',
    type: 'SYSTEM_WELCOME',
    reference_id: newUser.id,
    read: false,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({
    token: `demo-token-${newUser.id}-${Date.now()}`,
    user: newUser
  });
});

// Get profile
router.get('/profile/:id', (req, res) => {
  const user = db.findById('users', req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update profile / skills / documents
router.put('/profile/:id', (req, res) => {
  const updated = db.updateOne('users', u => u.id === req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'User not found' });
  res.json(updated);
});

module.exports = router;
