import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { ADMIN_CONFIG } from '../config/adminConfig.js';
import { isDbConnected } from '../config/db.js';
import { EnquiryModel } from '../models/Enquiry.js';
import { UserModel } from '../models/User.js';
import { AdminModel } from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, 'users.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

function readJsonFile(filePath, defaultData = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
      return defaultData;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[Storage] Error reading ${filePath}:`, err.message);
    return defaultData;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[Storage] Error writing ${filePath}:`, err.message);
    return false;
  }
}

// Initial sync between MongoDB Atlas and local cache
export async function syncStorageWithDatabase() {
  if (!isDbConnected()) {
    return;
  }

  try {
    // 1. Sync Admins
    const mongoAdmins = await AdminModel.find({}).lean();
    let localAdmins = readJsonFile(ADMIN_FILE, []);
    if (mongoAdmins && mongoAdmins.length > 0) {
      // Load from MongoDB to local
      const mappedAdmins = mongoAdmins.map((a) => ({
        id: a.id || a._id.toString(),
        name: a.name,
        email: a.email,
        passwordHash: a.passwordHash,
        plainPassword: a.plainPassword,
        role: a.role,
        labAccess: a.labAccess,
        updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : new Date().toISOString(),
      }));
      writeJsonFile(ADMIN_FILE, mappedAdmins);
    } else if (localAdmins && localAdmins.length > 0) {
      // Seed MongoDB with local admins
      for (const a of localAdmins) {
        await AdminModel.updateOne(
          { email: a.email.toLowerCase() },
          { $set: a },
          { upsert: true }
        );
      }
    }

    // 2. Sync Enquiries
    const mongoEnquiries = await EnquiryModel.find({}).sort({ createdAt: -1 }).lean();
    let localEnquiries = readJsonFile(ENQUIRIES_FILE, []);
    if (mongoEnquiries && mongoEnquiries.length > 0) {
      const mappedEnquiries = mongoEnquiries.map((e) => ({
        id: e.id || e._id.toString(),
        fullName: e.fullName || e.name || '',
        name: e.name || e.fullName || '',
        email: e.email,
        phone: e.phone || '',
        company: e.company || '',
        enquiryType: e.enquiryType || 'General Consultation',
        domain: e.domain || 'General Robotics',
        interest: e.interest || '',
        message: e.message || e.projectDetails || '',
        projectDetails: e.projectDetails || e.message || '',
        budget: e.budget || '',
        timeline: e.timeline || '',
        sourceTab: e.sourceTab || 'Contact Us',
        status: e.status || 'new',
        submittedAt: e.submittedAt || new Date().toISOString(),
        createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : new Date().toISOString(),
      }));
      writeJsonFile(ENQUIRIES_FILE, mappedEnquiries);
    } else if (localEnquiries && localEnquiries.length > 0) {
      for (const e of localEnquiries) {
        await EnquiryModel.updateOne(
          { id: e.id },
          { $set: e },
          { upsert: true }
        );
      }
    }

    // 3. Sync Users
    const mongoUsers = await UserModel.find({}).lean();
    let localUsers = readJsonFile(USERS_FILE, []);
    if (mongoUsers && mongoUsers.length > 0) {
      const mappedUsers = mongoUsers.map((u) => ({
        id: u.id || u._id.toString(),
        name: u.name,
        email: u.email,
        passwordHash: u.passwordHash,
        role: u.role || 'user',
        labAccess: u.labAccess || 'Level 3 Pro',
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
        lastLogin: u.lastLogin || null,
      }));
      writeJsonFile(USERS_FILE, mappedUsers);
    } else if (localUsers && localUsers.length > 0) {
      for (const u of localUsers) {
        await UserModel.updateOne(
          { email: u.email.toLowerCase() },
          { $set: u },
          { upsert: true }
        );
      }
    }

    console.log('[Storage] Bidirectional synchronization with MongoDB complete.');
  } catch (err) {
    console.warn('[Storage] Sync with MongoDB error:', err.message);
  }
}

// Initialize Admin Credentials if not set
export function initAdminStorage() {
  let adminData = readJsonFile(ADMIN_FILE, []);
  if (!Array.isArray(adminData) || adminData.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(ADMIN_CONFIG.defaultPassword, salt);
    const defaultAdmin = {
      id: 'adm_root',
      email: ADMIN_CONFIG.defaultEmail,
      passwordHash: hashedPassword,
      name: ADMIN_CONFIG.name,
      plainPassword: ADMIN_CONFIG.defaultPassword,
      role: ADMIN_CONFIG.role || 'Root Administrator',
      labAccess: ADMIN_CONFIG.labAccess || 'Full System Root',
      updatedAt: new Date().toISOString(),
    };
    adminData = [defaultAdmin];
    writeJsonFile(ADMIN_FILE, adminData);
    console.log('[Storage] Initialized default admin account:', ADMIN_CONFIG.defaultEmail);
  }
  return adminData;
}

export const Storage = {
  // Admin Operations
  getAdmins() {
    let admins = readJsonFile(ADMIN_FILE, []);
    if (!Array.isArray(admins) || admins.length === 0) {
      admins = initAdminStorage();
    }
    return admins;
  },

  getAdmin() {
    const admins = this.getAdmins();
    return admins[0] || null;
  },

  findAdminByEmail(email) {
    if (!email) return null;
    const admins = this.getAdmins();
    return admins.find((a) => a.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  findAdminById(id) {
    const admins = this.getAdmins();
    return admins.find((a) => a.id === id) || null;
  },

  createAdmin({ name, email, password, role, labAccess }) {
    const admins = this.getAdmins();
    const cleanEmail = email.toLowerCase().trim();

    if (admins.some((a) => a.email.toLowerCase() === cleanEmail)) {
      throw new Error('An admin with this email address already exists.');
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newAdmin = {
      id: 'adm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      plainPassword: password,
      role: role || 'Administrator',
      labAccess: labAccess || 'Full System Access',
      updatedAt: new Date().toISOString(),
    };

    admins.push(newAdmin);
    writeJsonFile(ADMIN_FILE, admins);

    // Asynchronously persist to MongoDB
    if (isDbConnected()) {
      AdminModel.create(newAdmin).catch((e) =>
        console.error('[Storage.createAdmin] MongoDB write error:', e.message)
      );
    }

    return newAdmin;
  },

  updateAdmin(id, updates) {
    const admins = this.getAdmins();
    const index = admins.findIndex((a) => a.id === id || a.email.toLowerCase() === (updates.email || '').toLowerCase().trim());
    if (index === -1) {
      throw new Error('Admin credential not found.');
    }

    const admin = admins[index];
    if (updates.name) admin.name = updates.name.trim();
    if (updates.email) admin.email = updates.email.toLowerCase().trim();
    if (updates.role) admin.role = updates.role;
    if (updates.labAccess) admin.labAccess = updates.labAccess;
    if (updates.password) {
      const salt = bcrypt.genSaltSync(10);
      admin.passwordHash = bcrypt.hashSync(updates.password, salt);
      admin.plainPassword = updates.password;
    }
    admin.updatedAt = new Date().toISOString();

    admins[index] = admin;
    writeJsonFile(ADMIN_FILE, admins);

    // Asynchronously persist to MongoDB
    if (isDbConnected()) {
      AdminModel.updateOne({ id: admin.id }, { $set: admin }).catch((e) =>
        console.error('[Storage.updateAdmin] MongoDB update error:', e.message)
      );
    }

    return admin;
  },

  deleteAdmin(id) {
    const admins = this.getAdmins();
    if (admins.length <= 1) {
      throw new Error('Cannot delete the only remaining admin account.');
    }

    const filtered = admins.filter((a) => a.id !== id && a.email.toLowerCase() !== id.toLowerCase());
    if (filtered.length === admins.length) {
      throw new Error('Admin credential not found.');
    }

    writeJsonFile(ADMIN_FILE, filtered);

    // Asynchronously delete from MongoDB
    if (isDbConnected()) {
      AdminModel.deleteOne({ $or: [{ id }, { email: id.toLowerCase() }] }).catch((e) =>
        console.error('[Storage.deleteAdmin] MongoDB delete error:', e.message)
      );
    }

    return true;
  },

  // Users Operations
  getUsers() {
    return readJsonFile(USERS_FILE, []);
  },

  findUserByEmail(email) {
    if (!email) return null;
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  findUserById(id) {
    const users = this.getUsers();
    return users.find((u) => u.id === id) || null;
  },

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...userData,
      email: userData.email.toLowerCase().trim(),
      role: 'user',
      labAccess: userData.labAccess || 'Level 3 Pro',
      createdAt: new Date().toISOString(),
      lastLogin: null,
    };
    users.push(newUser);
    writeJsonFile(USERS_FILE, users);

    // Asynchronously persist to MongoDB
    if (isDbConnected()) {
      UserModel.create(newUser).catch((e) =>
        console.error('[Storage.createUser] MongoDB write error:', e.message)
      );
    }

    return newUser;
  },

  updateUserLastLogin(userId) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index !== -1) {
      users[index].lastLogin = new Date().toISOString();
      writeJsonFile(USERS_FILE, users);

      if (isDbConnected()) {
        UserModel.updateOne({ id: userId }, { $set: { lastLogin: users[index].lastLogin } }).catch((e) =>
          console.error('[Storage.updateUserLastLogin] MongoDB error:', e.message)
        );
      }
    }
  },

  // Enquiries Operations
  getEnquiries() {
    const list = readJsonFile(ENQUIRIES_FILE, []);
    return list.map((e) => ({
      ...e,
      fullName: e.fullName || e.name || 'Anonymous Client',
      sourceTab: e.sourceTab || 'Contact Us',
      status: e.status || 'new',
      submittedAt: e.submittedAt || e.createdAt || new Date().toISOString(),
      createdAt: e.createdAt || e.submittedAt || new Date().toISOString(),
    }));
  },

  addEnquiry(enquiryData) {
    const enquiries = this.getEnquiries();
    const newEnquiry = {
      id: 'enq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...enquiryData,
      fullName: enquiryData.fullName || enquiryData.name || 'Anonymous Client',
      sourceTab: enquiryData.sourceTab || 'Contact Us',
      status: 'new', // 'new' | 'in-review' | 'resolved'
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    enquiries.unshift(newEnquiry); // newest first
    writeJsonFile(ENQUIRIES_FILE, enquiries);

    // Asynchronously persist to MongoDB
    if (isDbConnected()) {
      EnquiryModel.create(newEnquiry).catch((e) =>
        console.error('[Storage.addEnquiry] MongoDB write error:', e.message)
      );
    }

    return newEnquiry;
  },

  updateEnquiryStatus(id, status) {
    const enquiries = this.getEnquiries();
    const index = enquiries.findIndex((e) => e.id === id);
    if (index !== -1) {
      enquiries[index].status = status;
      enquiries[index].updatedAt = new Date().toISOString();
      writeJsonFile(ENQUIRIES_FILE, enquiries);

      if (isDbConnected()) {
        EnquiryModel.updateOne({ id }, { $set: { status, updatedAt: new Date() } }).catch((e) =>
          console.error('[Storage.updateEnquiryStatus] MongoDB error:', e.message)
        );
      }

      return enquiries[index];
    }
    return null;
  },

  deleteEnquiry(id) {
    const enquiries = this.getEnquiries();
    const filtered = enquiries.filter((e) => e.id !== id);
    writeJsonFile(ENQUIRIES_FILE, filtered);

    if (isDbConnected()) {
      EnquiryModel.deleteOne({ id }).catch((e) =>
        console.error('[Storage.deleteEnquiry] MongoDB error:', e.message)
      );
    }

    return filtered.length !== enquiries.length;
  },
};
