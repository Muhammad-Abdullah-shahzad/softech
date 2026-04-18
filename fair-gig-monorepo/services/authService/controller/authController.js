import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user provided username and password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Check if user exists 
    // (Uncomment this and the bcrypt check when you have actual users in DB)
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }

    // 3. Verify password
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }

    // MOCK LOGIN FOR DEMONSTRATION (Remove when DB is connected)
    if (email !== 'admin' || password !== 'password') {
      return res.status(401).json({ message: 'Invalid credentials. Use admin / password for demo.' });
    }
    const user = { _id: 'mock_user_id_123', username: 'admin' };

    // 4. Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' } // token valid for 1 day
    );

    // 5. Set JWT token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,     // Prevents client-side JS from reading the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (requires HTTPS)
      sameSite: 'strict', // Protect against CSRF
      maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    });

    // 6. Send success response
    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /api/auth/logout
export const logout = (req, res) => {
  // Clear the cookie by setting an expired date
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({ message: 'Logged out successfully' });
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    // req.user is populated by the protect middleware
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
