import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { db, UserDoc } from '../config/db.js';
import { AuthenticatedRequest, generateToken } from '../middleware/auth.js';

function sanitizeUser(user: UserDoc) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...safeUser } = user;
  return safeUser;
}

export const register = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, password, confirmPassword, college, course, city, phone } = req.body;

    if (!name || !email || !password || !college || !course || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: full name, email, password, college, course, and city.'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    const existingUser = db.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: UserDoc = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      college: college.trim(),
      course: course.trim(),
      city: city.trim(),
      role: 'student',
      phone: phone ? phone.trim() : undefined,
      createdAt: new Date().toISOString()
    };

    db.createUser(newUser);
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully! Welcome to BookLoop.',
      token,
      user: sanitizeUser(newUser)
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while processing registration.'
    });
  }
};

export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login.'
    });
  }
};

export const getMe = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not logged in.'
    });
  }
  return res.status(200).json({
    success: true,
    user: sanitizeUser(req.user)
  });
};

export const updateProfile = (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const { name, college, course, city, phone, bio } = req.body;
  const updated = db.updateUser(req.user.id, {
    ...(name && { name: name.trim() }),
    ...(college && { college: college.trim() }),
    ...(course && { course: course.trim() }),
    ...(city && { city: city.trim() }),
    ...(phone !== undefined && { phone: phone.trim() }),
    ...(bio !== undefined && { bio: bio.trim() })
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully.',
    user: sanitizeUser(updated)
  });
};
