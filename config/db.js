 


// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URI;

// Mongoose connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // Additional options can be added here
};

// Connect to MongoDB
mongoose.connect(mongoURI, options)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = mongoose;
