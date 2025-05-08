// controllers/adminController.js
const User = require('../models/User');
const Charity = require('../models/Charity');
 

// Get all users (excluding passwords)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.status(200).json({ users });
  } catch (err) {
    console.error('Error retrieving users:', err);
    return res.status(500).json({ error: 'Error retrieving users', details: err.message });
  }
};

// Approve a charity by setting its 'approve' flag to 1
exports.approveCharity = async (req, res) => {
  try {
    const { charityId } = req.params;
    const charity = await Charity.findOneAndUpdate(
      { id: charityId },
      { approve: 1 },
      { new: true }
    );

    if (!charity) {
      return res.status(404).json({ error: 'Charity not found' });
    }

    return res.status(200).json({ message: 'Charity approved successfully', charity });
  } catch (err) {
    console.error('Error approving charity:', err);
    return res.status(500).json({ error: 'Error approving charity', details: err.message });
  }
};

// Generate an impact report for a charity
exports.getCharityReport = async (req, res) => {
  const { charityId } = req.params;

  try {
    const report = await reportService.generateImpactReport(charityId);
    return res.status(200).json({ report });
  } catch (err) {
    console.error('Error generating report:', err);
    return res.status(500).json({ error: 'Error generating report', details: err.message });
  }
};
