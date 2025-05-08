// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Charity = require('../models/Charity');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

// User Registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const user = await User.create({ name, email, password, role });
    const userObj = user.toObject();
    delete userObj.password;
    res.status(201).json({ message: 'User registered successfully', user: userObj });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Error registering user', details: err.message });
  }
};

// User Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Error logging in', details: err.message });
  }
};

// Charity Registration
exports.charityregister = async (req, res) => {
  try {
    const { name, email, password, mission, category, location, registrationNumber } = req.body;
    if (await Charity.findOne({ email })) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    const charity = await Charity.create({ name, email, password, mission, category, location, registrationNumber });
    const charityObj = charity.toObject();
    delete charityObj.password;
    res.status(201).json({ message: 'Charity registered successfully', charity: charityObj });
  } catch (err) {
    console.error('Error registering charity:', err);
    res.status(500).json({ error: 'Error registering charity', details: err.message });
  }
};

// Charity Login
exports.charitylogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const charity = await Charity.findOne({ email });
    if (!charity) {
      return res.status(404).json({ error: 'Charity not found' });
    }
    const valid = await bcrypt.compare(password, charity.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: charity.id, role: 'charity' }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Charity login successful', token });
  } catch (err) {
    console.error('Error logging in charity:', err);
    res.status(500).json({ error: 'Error logging in charity', details: err.message });
  }
};
