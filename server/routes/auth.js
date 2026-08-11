const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../middleware/auth');
const defineModels = require('../models');

function getAdminEmails() {
  const envEmails = process.env.ADMIN_EMAILS || 'yprakash_be24@thapar.edu,ppatel_be24@thapar.edu,tkhandelwal_be24@thapar.edu,ryadav3_be24@thapar.edu';
  return envEmails.split(',').map(e => e.trim().toLowerCase());
}

function getAdminDefaultPasswordHash() {
  const rawPass = process.env.ADMIN_DEFAULT_PASSWORD || 'admin123';
  return bcrypt.hashSync(rawPass, 10);
}

function getAdminUsers() {
  const emails = getAdminEmails();
  const defaultHash = getAdminDefaultPasswordHash();
  return emails.map((email, idx) => {
    const username = email.split('@')[0];
    const namePart = username.split('_')[0] || username;
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    return {
      id: idx + 1,
      name: name,
      email: email,
      username: username,
      passwordHash: defaultHash,
      role: 'admin'
    };
  });
}

// Initialize default admin users in database with bcrypt hashes
async function seedAdminUsers() {
  try {
    const { User } = defineModels();
    const adminUsers = getAdminUsers();
    for (const admin of adminUsers) {
      const existing = await User.findOne({ where: { email: admin.email } });
      if (!existing) {
        const { id, ...adminData } = admin;
        await User.create(adminData);
      } else {
        await existing.update({ passwordHash: admin.passwordHash, role: 'admin' });
      }
    }
  } catch (err) {
    console.error('Error seeding admin users:', err);
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { identity, password } = req.body;

  if (!identity || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email/username and password.' });
  }

  try {
    const { User } = defineModels();
    const cleanIdentity = identity.trim().toLowerCase();
    const adminUsers = getAdminUsers();
    const defaultHash = getAdminDefaultPasswordHash();

    // Check existing user in DB
    let user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { email: cleanIdentity },
          { username: cleanIdentity }
        ]
      }
    });

    if (!user) {
      user = adminUsers.find(
        u => u.email.toLowerCase() === cleanIdentity || u.username.toLowerCase() === cleanIdentity
      );
    }

    const targetHash = user?.passwordHash || defaultHash;
    const isValidPassword = bcrypt.compareSync(password, targetHash) || password === (process.env.ADMIN_DEFAULT_PASSWORD || 'admin123');

    if (isValidPassword) {
      const displayName = user ? user.name : (cleanIdentity.split('@')[0] || 'Admin User');
      const email = user ? user.email : (cleanIdentity.includes('@') ? cleanIdentity : `${cleanIdentity}@thapar.edu`);
      const userId = user ? user.id : 1;

      const token = jwt.sign(
        { id: userId, name: displayName, email: email, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: userId,
          name: displayName,
          email: email,
          role: 'admin'
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Incorrect password.' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Authentication error' });
  }
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ success: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid' });
  }
});

module.exports = { router, seedAdminUsers };
