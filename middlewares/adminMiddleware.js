const User = require('../models/User');

exports.checkAdmin = async (req, res, next) => {
  try {
    // Ensure the user object is attached to the request
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    // Fetch the user from the database to verify their role
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user's role is 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin privileges required' });
    }

    // User is an admin; proceed to the next middleware or route
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};
