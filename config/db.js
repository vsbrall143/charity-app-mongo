 


// config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection URI from environment variables
const mongoURI = "mongodb+srv://vsbrall143:W0W2B89XycbaI7Tv@server.gwe8o.mongodb.net/?retryWrites=true&w=majority&appName=server"

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
