import express from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbGet, dbRun } from '../db/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'patihaven-super-secret-key-2026';

// Middleware to authenticate JWT
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Erişim engellendi. Token bulunamadı.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz veya süresi geçmiş token.' });
    }
    req.user = user;
    next();
  });
};

// Middleware to authenticate Admin
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(430).json({ error: 'Bu işlem için yönetici yetkisi gereklidir.' });
  }
  next();
};

// POST /register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Lütfen ad, e-posta ve şifre alanlarını doldurun.' });
  }

  try {
    // Check if user exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Bu e-posta adresi zaten kullanımda.' });
    }

    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(password, salt);

    // Save user
    const result = await dbRun(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'user']
    );

    const userId = result.lastID;
    const token = jwt.sign({ id: userId, email, role: 'user', name }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Kayıt başarıyla tamamlandı.',
      token,
      user: { id: userId, name, email, role: 'user' }
    });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası oluştu: ' + err.message });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Lütfen e-posta ve şifre alanlarını doldurun.' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: 'Hatalı e-posta adresi veya şifre.' });
    }

    const validPassword = await bcryptjs.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Hatalı e-posta adresi veya şifre.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Giriş başarılı.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası oluştu: ' + err.message });
  }
});

// GET /me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası oluştu.' });
  }
});

export default router;
