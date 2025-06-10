// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: decoded.userId }; // ✅ Fix: use consistent `req.user.id`
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
