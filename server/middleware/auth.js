const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'foodbridge_super_secret_jwt_key_2026';
    const decoded = jwt.verify(token, secret);
    
    // Find user in database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }

    req.user = {
      _id: user._id || user.id,
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationName: user.organizationName,
      isVerified: user.isVerified
    };

    next();
  } catch (err) {
    console.error('Auth verification failed:', err.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user ? req.user.role : 'guest'}' does not have permission to access this resource`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};
