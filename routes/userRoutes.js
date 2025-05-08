const express = require('express');
const { getDonationHistory } = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected route
router.get('/donations', authenticate, getDonationHistory); // Get user donation history

module.exports = router;
