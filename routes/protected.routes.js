const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// General route for any logged-in user
router.get('/profile', verifyToken, (req, res) => {
  res.json({ message: 'Profile data', user: req.user });
});

// Role-based routes
router.get('/customer-area', verifyToken, requireRole('customer'), (req, res) => {
  res.json({ message: 'Welcome Customer' });
});

router.get('/driver-area', verifyToken, requireRole('driver'), (req, res) => {
  res.json({ message: 'Welcome Driver' });
});

router.get('/restaurant-area', verifyToken, requireRole('restaurant'), (req, res) => {
  res.json({ message: 'Welcome Restaurant' });
});

router.get('/admin-area', verifyToken, requireRole('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

module.exports = router;
