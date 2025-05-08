const express = require('express');
const { donation, updateTransactionStatus ,charityHistory,allcharityHistory} = require('../controllers/donationController');
const { authenticate } = require('../middlewares/authMiddleware');
const Charity = require('../models/Charity');

const router = express.Router();

// Protected routes
router.get('/donation/:amount/:projectid/:charityid', authenticate, donation); // Make a donation
router.post('/updateTransactionStatus/:amount/:projectid/:charityid', authenticate, updateTransactionStatus); // Get donations by charity ID
router.get('/history',authenticate,charityHistory);
router.get('/allhistory',authenticate,allcharityHistory);

module.exports = router;
