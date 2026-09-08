import bcrypt from 'bcryptjs';
import { Storage } from '../services/storage.js';

export const AdminController = {
  // 1. Get All Enquiries
  getEnquiries(req, res) {
    try {
      const enquiries = Storage.getEnquiries();
      return res.json({
        total: enquiries.length,
        enquiries,
      });
    } catch (err) {
      console.error('[AdminController.getEnquiries] Error:', err);
      return res.status(500).json({ error: 'Failed to retrieve enquiries.' });
    }
  },

  // Update Enquiry Status
  updateEnquiryStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['new', 'in-review', 'resolved'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be new, in-review, or resolved.' });
      }

      const updated = Storage.updateEnquiryStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Enquiry not found.' });
      }

      return res.json({ message: 'Status updated successfully.', enquiry: updated });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update enquiry status.' });
    }
  },

  // Delete Enquiry
  deleteEnquiry(req, res) {
    try {
      const { id } = req.params;
      const deleted = Storage.deleteEnquiry(id);
      if (!deleted) {
        return res.status(404).json({ error: 'Enquiry not found or already deleted.' });
      }
      return res.json({ message: 'Enquiry deleted successfully.' });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to delete enquiry.' });
    }
  },

  // 2. Get All Registered Users
  getUsers(req, res) {
    try {
      const users = Storage.getUsers();
      // Sanitize: strip out password hashes!
      const sanitizedUsers = users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        labAccess: u.labAccess,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
      }));

      return res.json({
        total: sanitizedUsers.length,
        users: sanitizedUsers,
      });
    } catch (err) {
      console.error('[AdminController.getUsers] Error:', err);
      return res.status(500).json({ error: 'Failed to retrieve registered users.' });
    }
  },

  // 3. Get All Admin Credentials
  getAdminCredentials(req, res) {
    try {
      const admins = Storage.getAdmins();
      const sanitized = admins.map((a) => ({
        id: a.id || 'adm_root',
        name: a.name,
        email: a.email,
        password: a.plainPassword || (a.email === 'admin@robogenesis.com' ? 'Admin@Robo2026!' : '••••••••'),
        role: a.role || 'Administrator',
        labAccess: a.labAccess || 'Full Access',
        updatedAt: a.updatedAt,
      }));

      return res.json({
        total: sanitized.length,
        admins: sanitized,
      });
    } catch (err) {
      console.error('[AdminController.getAdminCredentials] Error:', err);
      return res.status(500).json({ error: 'Failed to retrieve admin credentials list.' });
    }
  },

  // 4. Create New Admin Credential
  createAdminCredential(req, res) {
    try {
      const { name, email, password, role, labAccess } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Admin display name is required.' });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Admin email is required.' });
      }
      if (!password || password.length < 6) {
        return res.status(400).json({ error: 'Admin password must be at least 6 characters long.' });
      }

      const cleanEmail = email.toLowerCase().trim();

      // Check existing user or admin
      if (Storage.findAdminByEmail(cleanEmail)) {
        return res.status(400).json({ error: 'An admin account with this email already exists.' });
      }
      if (Storage.findUserByEmail(cleanEmail)) {
        return res.status(400).json({ error: 'This email is already registered as a standard user.' });
      }

      const newAdmin = Storage.createAdmin({
        name,
        email: cleanEmail,
        password,
        role: role || 'Administrator',
        labAccess: labAccess || 'Full Access',
      });

      return res.status(201).json({
        message: 'Admin credential created successfully!',
        admin: {
          id: newAdmin.id,
          name: newAdmin.name,
          email: newAdmin.email,
          password: newAdmin.plainPassword || password,
          role: newAdmin.role,
          updatedAt: newAdmin.updatedAt,
        },
      });
    } catch (err) {
      console.error('[AdminController.createAdminCredential] Error:', err);
      return res.status(500).json({ error: err.message || 'Failed to create admin credential.' });
    }
  },

  // 5. Update Admin Credential
  updateAdminCredential(req, res) {
    try {
      const { id } = req.params;
      const { name, email, password, role, labAccess } = req.body;

      const updates = {};
      if (name && name.trim()) updates.name = name.trim();
      if (email && email.trim()) updates.email = email.trim();
      if (role) updates.role = role;
      if (labAccess) updates.labAccess = labAccess;
      if (password && password.trim()) {
        if (password.length < 6) {
          return res.status(400).json({ error: 'Password must be at least 6 characters.' });
        }
        updates.password = password;
      }

      const updated = Storage.updateAdmin(id, updates);

      return res.json({
        message: 'Admin credential updated successfully!',
        admin: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          password: updated.plainPassword || password,
          role: updated.role,
          updatedAt: updated.updatedAt,
        },
      });
    } catch (err) {
      console.error('[AdminController.updateAdminCredential] Error:', err);
      return res.status(500).json({ error: err.message || 'Failed to update admin credential.' });
    }
  },

  // 6. Delete Admin Credential
  deleteAdminCredential(req, res) {
    try {
      const { id } = req.params;
      Storage.deleteAdmin(id);
      return res.json({ message: 'Admin credential deleted successfully.' });
    } catch (err) {
      console.error('[AdminController.deleteAdminCredential] Error:', err);
      return res.status(400).json({ error: err.message || 'Failed to delete admin credential.' });
    }
  },
};

