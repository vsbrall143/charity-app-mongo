// server.js

const express = require('express');
require('dotenv').config();

// Initialize database connection
require('./config/db');

const helmet = require('helmet');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const charityRoutes = require('./routes/charityRoutes');
const donationRoutes = require('./routes/donationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["*"],
        scriptSrc: ["*", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
        styleSrc: ["*", "'unsafe-inline'"],
        imgSrc: ["*", "data:"],
        connectSrc: ["*"],
        fontSrc: ["*"],
        mediaSrc: ["*"],
        objectSrc: ["*"],
        frameSrc: ["*"],
        workerSrc: ["*", "blob:"],
        frameAncestors: ["*"],
        formAction: ["*"],
      },
    },
    crossOriginResourcePolicy: false,
  })
);

// Serve static files and uploads
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use(charityRoutes);
app.use('/donations', donationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Error-handling middleware placeholder
// app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
