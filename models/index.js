// models/index.js
const mongoose = require('mongoose');

const User = require('./User');
const Charity = require('./Charity');
const Project = require('./Project');
const Order = require('./Order');
const Admin = require('./Admin');

// -- Set up virtual relationships for population --

// Charity -> Projects
Charity.schema.virtual('projects', {
  ref: 'Project',
  localField: 'id',       // Charity.id
  foreignField: 'charityId', // Project.charityId
});

// Charity -> Orders
Charity.schema.virtual('charityOrders', {
  ref: 'Order',
  localField: 'id',         // Charity.id
  foreignField: 'charityId', // Order.charityId
});

// User -> Orders
User.schema.virtual('userOrders', {
  ref: 'Order',
  localField: 'id',      // User.id
  foreignField: 'userId', // Order.userId
});

// Project belongsTo Charity (no virtual needed if using direct ref in schema)
// Order belongsTo User & Charity (no virtual needed if using direct refs in schema)

// Enable virtual fields to be included in `toObject` and `toJSON`
[User, Charity, Project, Order].forEach(model => {
  model.schema.set('toObject', { virtuals: true });
  model.schema.set('toJSON',   { virtuals: true });
});

module.exports = { User, Charity, Project, Order, Admin };
