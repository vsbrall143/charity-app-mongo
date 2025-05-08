// controllers/paymentController.js
const Order = require('../models/Order');

require('dotenv').config();

// Send donation receipt via email
exports.sendDonationReceipt = async (req, res) => {
  try {
    const { email, donationDetails } = req.body;
    await emailService.sendEmail({
      to: email,
      subject: 'Donation Receipt',
      text: `Thank you for your donation! Here are the details: ${JSON.stringify(donationDetails)}`
    });
    res.status(200).json({ message: 'Receipt sent successfully' });
  } catch (err) {
    console.error('Error sending donation receipt:', err);
    res.status(500).json({ error: 'Error sending receipt', details: err.message });
  }
};

// Process a donation: payment + record
exports.processDonation = async (req, res) => {
  try {
    const { amount, charityId } = req.body;
    const userId = req.user.id;

    // Process payment via external service
    const paymentResponse = await paymentService.processPayment(req.user, amount);
    if (!paymentResponse.success) {
      return res.status(400).json({ error: 'Payment failed', details: paymentResponse.error });
    }

    // Record donation as an Order
    const donation = await Order.create({
      amount,
      userId,
      charityId,
      status: 'SUCCESSFUL',
      paymentId: paymentResponse.paymentId
    });

    res.status(201).json({ message: 'Donation processed successfully', donation });
  } catch (err) {
    console.error('Error processing donation:', err);
    res.status(500).json({ error: 'Error processing donation', details: err.message });
  }
};
