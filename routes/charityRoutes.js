const express = require('express');
const { 
  uploadMiddleware, 
  registerCharity, 
  getCharityProfile, 
  addProject, 
  getAllCharities, 
  getAllProjects, 
  deleteProject, 
  getUnapprovedCharities, 
  approveCharity 
} = require('../controllers/charityController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/unapprovedcharities', getUnapprovedCharities);
router.get('/allprojects/:charityid', getAllProjects);
router.get('/allcharities', getAllCharities);
router.post('/addproject', authenticate, uploadMiddleware, addProject);
router.delete('/deleteproject/:projectid', authenticate, deleteProject);
router.post('/approvecharity/:charityid', approveCharity);

// Serve uploaded images
router.use('/uploads', express.static('uploads'));

// Optionally restore these routes if needed:
// router.get('/:charityId', getCharityProfile);
// router.post('/register', authenticate, registerCharity);

module.exports = router;
