// controllers/userController.js
const User = require('../models/User');
const Charity = require('../models/Charity');
const Order = require('../models/Order');

// Get logged-in user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error retrieving user profile:', err);
    res.status(500).json({ error: 'Error retrieving user profile', details: err.message });
  }
};

// Update logged-in user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updated = await User.findOneAndUpdate(
      { id: req.user.id },
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'Profile updated successfully', user: updated });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Error updating profile', details: err.message });
  }
};

// Get logged-in charity profile
exports.getCharityProfile = async (req, res) => {
  try {
    const charity = await Charity.findOne({ id: req.user.id }).select('-password');
    if (!charity) {
      return res.status(404).json({ error: 'Charity not found' });
    }
    res.status(200).json({ charity });
  } catch (err) {
    console.error('Error retrieving charity profile:', err);
    res.status(500).json({ error: 'Error retrieving charity profile', details: err.message });
  }
};

// Update logged-in charity profile
exports.updateCharityProfile = async (req, res) => {
  try {
    const { name, email, mission } = req.body;
    const updated = await Charity.findOneAndUpdate(
      { id: req.user.id },
      { name, email, mission },
      { new: true, runValidators: true }
    ).select('-password');
    if (!updated) {
      return res.status(404).json({ error: 'Charity not found' });
    }
    res.status(200).json({ message: 'Charity updated successfully', charity: updated });
  } catch (err) {
    console.error('Error updating charity profile:', err);
    res.status(500).json({ error: 'Error updating charity profile', details: err.message });
  }
};

// Get donation history for logged-in user
exports.getDonationHistory = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('charityId', 'name')
      .sort({ createdAt: -1 });
    const history = orders.map(o => ({
      charityName: o.charityId?.name || 'Unknown Charity',
      date: o.createdAt,
      amount: o.amount,
      status: o.status
    }));
    res.status(200).json({ history });
  } catch (err) {
    console.error('Error retrieving donation history:', err);
    res.status(500).json({ error: 'Error retrieving donation history', details: err.message });
  }
};
