const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authenticate = (req, res, next) => {
  const token = req.header('Authorization');
 
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  console.log(token);

  try {
    const decoded = jwt.verify(token,'8hy98h9yu89y98yn89y98y89');
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid tokennn' });
  }
};




 