const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const authRoutes = require('./routes/auth');
const skillsRoutes = require('./routes/skills');
const schemesRoutes = require('./routes/schemes');
const opportunitiesRoutes = require('./routes/opportunities');
const applicationsRoutes = require('./routes/applications');
const notificationsRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Reset Demo Data
app.post('/api/reset-demo', (req, res) => {
  try {
    const data = db.resetDemoData();
    return res.json({
      success: true,
      message: 'Demo dataset reset to baseline state successfully.',
      counts: {
        users: (data.users || []).length,
        schemes: (data.schemes || []).length,
        opportunities: (data.opportunities || []).length,
        applications: (data.applications || []).length
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reset demo data: ' + err.message });
  }
});

// Health check & Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Kaushalya Setu REST API Server',
    version: '1.0.0',
    initiative: 'PM-AJAY / GIA Livelihood Navigator',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[Kaushalya Setu API Server] running on http://localhost:${PORT}`);
});
