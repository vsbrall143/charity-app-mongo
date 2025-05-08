// controllers/orderController.js
const Order = require('../models/Order');
const Charity = require('../models/Charity');
const User = require('../models/User');
const Project = require('../models/Project');
const Razorpay = require('razorpay');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

// Setup SendInBlue client
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.API_KEY;

// Update transaction status and send emails
exports.updateTransactionStatus = async (req, res) => {
  try {
    const { order_id, payment_id } = req.body;
    const { projectid, charityid, amount } = req.params;
    const userId = req.user.id;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const order = await Order.findOne({ orderId: order_id, charityId: charityid });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentId = payment_id || null;
    order.status = 'SUCCESSFUL';
    order.amount = Number(amount);
    await order.save();

    const project = await Project.findOne({ id: projectid });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    project.current += Number(amount);
    await project.save();

    const user = await User.findOne({ id: userId });
    const charity = await Charity.findOne({ id: charityid });
    if (!user || !charity) {
      return res.status(404).json({ success: false, message: 'User or Charity not found' });
    }

    await sendDonationEmail(user.email, user.name, amount, charity.name, project.title);
    await sendCharityEmail(charity.email, charity.name, user.name, amount, project.title);

    return res.status(202).json({ success: true, message: 'Transaction successful & email sent' });
  } catch (err) {
    console.error('Error updating transaction status:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// Send email to donor
async function sendDonationEmail(userEmail, userName, amount, charityName, projectTitle) {
  try {
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = { email: 'vsbrall143@gmail.com', name: 'Charitify' };
    await tranEmailApi.sendTransacEmail({
      sender,
      to: [{ email: userEmail }],
      subject: 'Thank You for Your Donation!',
      textContent: `Dear ${userName},\n\nThank you for your generous donation of ₹${amount} to ${charityName} for the project "${projectTitle}".\n\nBest Regards,\nCharitify Team`,
      htmlContent: `<p>Dear ${userName},</p><p>Thank you for your generous donation of <strong>₹${amount}</strong> to <strong>${charityName}</strong> for the project "<strong>${projectTitle}</strong>".</p><p>Best Regards,<br>Charitify Team</p>`
    });
  } catch (err) {
    console.error('Error sending donation email:', err);
  }
}

// Send email to charity
async function sendCharityEmail(charityEmail, charityName, donorName, amount, projectTitle) {
  try {
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = { email: 'vsbrall143@gmail.com', name: 'Charitify' };
    await tranEmailApi.sendTransacEmail({
      sender,
      to: [{ email: charityEmail }],
      subject: 'New Donation Received!',
      textContent: `Dear ${charityName},\n\nYou have received a donation of ₹${amount} from ${donorName} for your project "${projectTitle}".\n\nBest Regards,\nCharitify Team`,
      htmlContent: `<p>Dear ${charityName},</p><p>You have received a donation of <strong>₹${amount}</strong> from <strong>${donorName}</strong> for your project "<strong>${projectTitle}</strong>".</p><p>Best Regards,<br>Charitify Team</p>`
    });
  } catch (err) {
    console.error('Error sending charity email:', err);
  }
}

// Initiate donation order
exports.donation = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const { amount, charityid } = req.params;
    if (!charityid) return res.status(400).json({ error: 'Charity ID is required' });

    const charity = await Charity.findOne({ id: charityid });
    if (!charity) return res.status(404).json({ error: 'Charity not found' });

    rzp.orders.create({ amount, currency: 'INR' }, async (err, order) => {
      if (err) return res.status(500).json({ error: 'Error creating Razorpay order' });

      const user = await User.findOne({ id: req.user.id });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const newOrder = await Order.create({
        orderId: order.id,
        status: 'PENDING',
        userId: user.id,
        charityId: charity.id
      });

      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    console.error('Error in donation:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get donation history for a user
exports.charityHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).populate('orderCharity', 'name').sort({ createdAt: -1 });
    const formatted = orders.map(o => ({ charityName: o.orderCharity?.name || 'Unknown', date: o.createdAt, amount: o.amount, status: o.status }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching donation history:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Get all donation history
exports.allcharityHistory = async (_req, res) => {
  try {
    const orders = await Order.find().populate('orderCharity', 'name').sort({ createdAt: -1 });
    const formatted = orders.map(o => ({ charityName: o.orderCharity?.name || 'Unknown', date: o.createdAt, amount: o.amount, status: o.status }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching all donation history:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
