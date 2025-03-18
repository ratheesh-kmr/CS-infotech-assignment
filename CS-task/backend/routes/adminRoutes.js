const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { getAdminProfile } = require('../controllers/adminController');

// Route for fetching admin data
router.get('/profile', authenticateToken, getAdminProfile);

module.exports = router;
