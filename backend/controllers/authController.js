import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ADMIN_CONFIG } from '../config/adminConfig.js';
import { Storage } from '../services/storage.js';

function generateInitials(name) {
  if (!name) return 'RG';
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'RG';
}

export const AuthController = {
  // Register New User
  async register(req, res) {
    try {
      const { fullName, email, password } = req.body;

      if (!fullName || !fullName.trim()) {
        return res.status(400).json({ error: 'Full name is required.' });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Valid email address is required.' });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const admin = await Storage.findAdminByEmailAsync(cleanEmail);

      // Check if email matches admin
      if (admin) {
        return res.status(400).json({ error: 'This email is reserved for system administration. Please sign in directly.' });
      }

      // Check if user already exists
      const existingUser = await Storage.findUserByEmailAsync(cleanEmail);
      if (existingUser) {
        return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
      }

      // Hash password
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(password, salt);

      // Create user
      const newUser = Storage.createUser({
        name: fullName.trim(),
        email: cleanEmail,
        passwordHash,
        labAccess: 'Level 3 Pro',
      });

      return res.status(201).json({
        message: 'Account registered successfully! Please sign in with your credentials.',
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      console.error('[AuthController.register] Error:', err);
      return res.status(500).json({ error: 'Internal server error during registration.' });
    }
  },

  // Login (User or Admin)
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Both email and password are required.' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const admin = await Storage.findAdminByEmailAsync(cleanEmail);

      // 1. Check if trying to log in as Admin
      if (admin) {
        const isAdminMatch = bcrypt.compareSync(password, admin.passwordHash);
        if (!isAdminMatch) {
          return res.status(401).json({ error: 'Invalid admin credentials.' });
        }

        const token = jwt.sign(
          { id: admin.id || 'admin_root', email: admin.email, role: 'admin', name: admin.name },
          ADMIN_CONFIG.jwtSecret,
          { expiresIn: ADMIN_CONFIG.jwtExpiresIn }
        );

        return res.json({
          message: 'Welcome back, Administrator!',
          token,
          user: {
            id: admin.id || 'admin_root',
            name: admin.name || 'Robogenesis Administrator',
            email: admin.email,
            role: 'admin',
            labAccess: admin.labAccess || 'Root Administrator',
            initials: generateInitials(admin.name),
          },
        });
      }

      // 2. Regular User Login: MUST BE REGISTERED FIRST
      const user = await Storage.findUserByEmailAsync(cleanEmail);
      if (!user) {
        // Enforce registration requirement
        return res.status(400).json({
          error: 'Account not found. You must register first before logging in!',
          needRegistration: true,
        });
      }

      // 3. Verify user password
      const isUserMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!isUserMatch) {
        return res.status(401).json({ error: 'Incorrect password. Please try again.' });
      }

      // Update last login
      Storage.updateUserLastLogin(user.id);

      const token = jwt.sign(
        { id: user.id, email: user.email, role: 'user', name: user.name },
        ADMIN_CONFIG.jwtSecret,
        { expiresIn: ADMIN_CONFIG.jwtExpiresIn }
      );

      return res.json({
        message: `Welcome back, ${user.name}!`,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          labAccess: user.labAccess,
          initials: generateInitials(user.name),
        },
      });
    } catch (err) {
      console.error('[AuthController.login] Error:', err);
      return res.status(500).json({ error: 'Internal server error during authentication.' });
    }
  },

  // Get current authenticated user profile
  async me(req, res) {
    try {
      if (req.user.role === 'admin') {
        const admin = Storage.getAdmin();
        return res.json({
          user: {
            id: 'admin_root',
            name: admin.name,
            email: admin.email,
            role: 'admin',
            labAccess: admin.labAccess,
            initials: 'AD',
          },
        });
      }

      const user = await Storage.findUserByIdAsync(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User profile not found.' });
      }

      return res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          labAccess: user.labAccess,
          initials: generateInitials(user.name),
        },
      });
    } catch (err) {
      return res.status(500).json({ error: 'Error retrieving profile.' });
    }
  },
};
