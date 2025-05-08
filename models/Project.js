const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProjectSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  charityId: {
    type: String,
    ref: 'Charity',
    required: [true, 'Charity ID is required']
  },
  imageUrl: {
    type: String
  },
  target: {
    type: Number,
    required: [true, 'Target amount is required']
  },
  current: {
    type: Number,
    required: [true, 'Current amount is required'],
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);
