import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  try {
    // 1. Get the token from the cookies
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token found' });
    }

    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    //  check decoded value 
    if (!decoded) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
    // 3. Attach user info to the request object
    req.user = decoded;

    // 4. Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized, role failed' });
    }
    next();
  }
}

