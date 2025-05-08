// require('dotenv').config();

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     dialect: process.env.DB_DIALECT,
//     host: process.env.DB_HOST,
//   }
// );

// sequelize
//   .authenticate()
//   .then(() => console.log('Database connected successfully!'))
//   .catch((err) => console.error('Error connecting to the database:', err));

// module.exports = sequelize;



 

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('chatapp', 'root', 'Xmachin@123', {
// dialect: 'mysql',
// host: 'localhost'
// });

// module.exports = sequelize;

 


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
