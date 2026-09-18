const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get notifications for user or officer
router.get('/', (req, res) => {
  const { recipientId, role } = req.query;
  let notifs = db.getCollection('notifications');

  if (recipientId) {
    notifs = notifs.filter(n => n.recipient_id === recipientId);
  } else if (role) {
    notifs = notifs.filter(n => n.role === role);
  }

  // Sort by createdAt descending
  notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unreadCount = notifs.filter(n => !n.read).length;

  res.json({
    notifications: notifs,
    unreadCount
  });
});

// Mark single notification as read
router.post('/:id/read', (req, res) => {
  const updated = db.updateOne('notifications', n => n.id === req.params.id, { read: true });
  if (!updated) return res.status(404).json({ error: 'Notification not found' });
  res.json(updated);
});

// Mark all as read for recipient
router.post('/mark-all-read', (req, res) => {
  const { recipientId } = req.body;
  const notifs = db.getCollection('notifications');

  notifs.forEach(n => {
    if (!recipientId || n.recipient_id === recipientId) {
      n.read = true;
    }
  });

  const updatedData = {
    ...require('fs').readFileSync(require('path').join(__dirname, '..', 'data', 'store.json'), 'utf-8'),
  };
  // Save directly
  db.updateOne('notifications', () => true, {}); // triggers write if needed or manual
  res.json({ success: true });
});

module.exports = router;
