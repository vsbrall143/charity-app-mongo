// controllers/charityController.js
const Charity = require('../models/Charity');
const Project = require('../models/Project');
const { Types } = require('mongoose');
const multer = require('multer');
const path = require('path');

require('dotenv').config();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname)}`)
});
exports.uploadMiddleware = multer({ storage }).single('image');

// Approve Charity
exports.approveCharity = async (req, res) => {
  try {
    const { charityId } = req.params;
    const charity = await Charity.findOneAndUpdate(
      { id: charityId },
      { approve: 1 },
      { new: true }
    );
    if (!charity) return res.status(404).json({ message: 'Charity not found' });
    res.json({ message: 'Charity approved successfully', charity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to approve charity', details: err.message });
  }
};

// Delete Project
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await Project.deleteOne({ id: projectId });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete project', details: err.message });
  }
};

// List Unapproved Charities
exports.getUnapprovedCharities = async (_req, res) => {
  try {
    const charities = await Charity.find({ approve: 0 });
    res.json(charities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch unapproved charities', details: err.message });
  }
};

// List Projects by Charity
exports.getAllProjects = async (req, res) => {
  try {
    const { charityId } = req.params;
    const projects = await Project.find({ charityId });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
};

// List/Filter Charities
exports.getAllCharities = async (req, res) => {
  try {
    const { search, location, category, approve } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (location) filter.location = { $in: location.split(',') };
    if (category) filter.category = { $in: category.split(',') };
    if (approve) filter.approve = { $in: approve.split(',').map(Number) };
    const charities = await Charity.find(filter);
    res.json(charities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching charities', details: err.message });
  }
};

// Register Charity (alternate endpoint)
exports.registerCharity = async (req, res) => {
  try {
    const { name, mission, category, location, registrationNumber } = req.body;
    const charity = await Charity.create({ name, mission, category, location, registrationNumber });
    res.status(201).json({ message: 'Charity registered successfully', charity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error registering charity', details: err.message });
  }
};

// Get Charity Profile with Projects
exports.getCharityProfile = async (req, res) => {
  try {
    const { charityId } = req.params;
    const charity = await Charity.findOne({ id: charityId }).populate('projects');
    if (!charity) return res.status(404).json({ error: 'Charity not found' });
    res.json({ charity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error retrieving charity profile', details: err.message });
  }
};

// Add Project
exports.addProject = async (req, res) => {
  try {
    const { title, description, target, current } = req.body;
    if (!title || !description || !target) {
      return res.status(400).json({ error: 'Title, description, and target are required' });
    }
    const charityId = req.user.id;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const project = await Project.create({ title, description, charityId, imageUrl, target, current });
    res.status(201).json({ message: 'Project added successfully', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error adding project', details: err.message });
  }
};
