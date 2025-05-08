const express = require('express');
const { getAllUsers, approveCharity } = require('../controllers/adminController');
const { authenticate } = require('../middlewares/authMiddleware');
const { checkAdmin } = require('../middlewares/adminMiddleware');

const router = express.Router();

// Admin routes
router.get('/users', authenticate, checkAdmin, getAllUsers); // Get all users
router.put('/charities/:charityId/approve', authenticate, checkAdmin, approveCharity); // Approve a charity

module.exports = router;
