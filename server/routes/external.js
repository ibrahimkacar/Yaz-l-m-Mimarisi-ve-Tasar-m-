import express from 'express';
import { dbAll } from '../db/database.js';

const router = express.Router();

// Middleware to check API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.api_key;
  if (!apiKey || apiKey !== 'patihaven_guest_key_2026') {
    return res.status(401).json({
      error: 'Yetkisiz erişim. Lütfen geçerli bir "x-api-key" başlığı (Header) veya "api_key" sorgu parametresi sağlayın. (Örn: patihaven_guest_key_2026)'
    });
  }
  next();
};

// GET /api/v1/external/animals - List animals with basic info for third parties
router.get('/animals', validateApiKey, async (req, res) => {
  try {
    const animals = await dbAll(
      'SELECT id, name, species, breed, age, gender, vaccination_status, status, image_url, created_at FROM animals'
    );
    res.json({
      success: true,
      count: animals.length,
      timestamp: new Date().toISOString(),
      data: animals
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Dış API sorgusu başarısız oldu: ' + err.message });
  }
});

// GET /api/v1/external/users - Expose minimal user profiles (public register view)
router.get('/users', validateApiKey, async (req, res) => {
  try {
    const users = await dbAll(
      'SELECT id, name, role, created_at FROM users'
    );
    res.json({
      success: true,
      count: users.length,
      timestamp: new Date().toISOString(),
      data: users
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Dış API sorgusu başarısız oldu: ' + err.message });
  }
});

export default router;
