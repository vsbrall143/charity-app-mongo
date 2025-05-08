const express = require('express');
const { sendDonationReceipt } = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protected routes
router.post('/receipt', authenticate, sendDonationReceipt); // Send donation receipt to user

module.exports = router;
