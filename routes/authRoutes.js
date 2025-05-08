const express = require('express');
const { register, login ,charitylogin,charityregister } = require('../controllers/authController');
const { getUserProfile, updateUserProfile,getCharityProfile, updateCharityProfile } = require('../controllers/userController');
 
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register); // User registration
router.post('/login', login); // User login

router.post('/charityregister', charityregister); // User registration
router.post('/charitylogin', charitylogin); // User login

// Protected routes
router.get('/profile', authenticate, getUserProfile); // Get user profile
router.put('/profile', authenticate, updateUserProfile); // Update user profile


router.get('/charityprofile', authenticate, getCharityProfile); // Get user profile
router.put('/charityprofile', authenticate, updateCharityProfile); // Update user profile

module.exports = router;
 