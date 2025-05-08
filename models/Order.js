const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OrderSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  userId: {
    type: String,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  charityId: {
    type: String,
    ref: 'Charity',
    required: [true, 'Charity ID is required']
  },
  paymentId: {
    type: String
  },
  orderId: {
    type: String
  },
  status: {
    type: String
  },
  amount: {
    type: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);
