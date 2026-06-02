import express from 'express';
import { dbAll, dbGet, dbRun } from '../db/database.js';
import { authenticateToken, requireAdmin } from './auth.js';

const router = express.Router();

// GET /animals - Query/Filter animals
router.get('/', async (req, res) => {
  const { species, gender, vaccination_status, age_min, age_max, search, status } = req.query;
  
  let query = 'SELECT * FROM animals WHERE 1=1';
  const params = [];

  if (species) {
    query += ' AND species = ?';
    params.push(species);
  }
  if (gender) {
    query += ' AND gender = ?';
    params.push(gender);
  }
  if (vaccination_status) {
    query += ' AND vaccination_status = ?';
    params.push(vaccination_status);
  }
  if (age_min) {
    query += ' AND age >= ?';
    params.push(parseInt(age_min));
  }
  if (age_max) {
    query += ' AND age <= ?';
    params.push(parseInt(age_max));
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  } else {
    // By default, let's allow returning both available and adopted, or filter inside front
  }
  if (search) {
    query += ' AND (name LIKE ? OR breed LIKE ? OR health_notes LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam, searchParam);
  }

  query += ' ORDER BY id DESC';

  try {
    const animals = await dbAll(query, params);
    res.json(animals);
  } catch (err) {
    res.status(500).json({ error: 'Veriler çekilirken hata oluştu: ' + err.message });
  }
});

// GET /animals/stats - Shelter Statistics (Admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalAnimals = await dbGet('SELECT COUNT(*) as count FROM animals');
    const adoptedAnimals = await dbGet('SELECT COUNT(*) as count FROM animals WHERE status = "adopted"');
    const availableAnimals = await dbGet('SELECT COUNT(*) as count FROM animals WHERE status = "available"');
    const pendingAdoptions = await dbGet('SELECT COUNT(*) as count FROM adoption_requests WHERE status = "pending"');
    const totalUsers = await dbGet('SELECT COUNT(*) as count FROM users WHERE role = "user"');

    // Species breakdown
    const speciesBreakdown = await dbAll(
      'SELECT species, COUNT(*) as count FROM animals GROUP BY species'
    );

    res.json({
      totalAnimals: totalAnimals.count,
      adoptedAnimals: adoptedAnimals.count,
      availableAnimals: availableAnimals.count,
      pendingAdoptions: pendingAdoptions.count,
      totalUsers: totalUsers.count,
      speciesBreakdown
    });
  } catch (err) {
    res.status(500).json({ error: 'İstatistikler çekilirken hata oluştu: ' + err.message });
  }
});

// GET /animals/:id - Detailed view, health logs and updates
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const animal = await dbGet('SELECT * FROM animals WHERE id = ?', [id]);
    if (!animal) {
      return res.status(404).json({ error: 'Hayvan bulunamadı.' });
    }

    const healthLogs = await dbAll(
      'SELECT * FROM health_logs WHERE animal_id = ? ORDER BY created_at DESC',
      [id]
    );

    const reports = await dbAll(
      `SELECT r.*, u.name as user_name 
       FROM animal_reports r 
       JOIN users u ON r.user_id = u.id 
       WHERE r.animal_id = ? 
       ORDER BY r.created_at DESC`,
      [id]
    );

    res.json({ animal, healthLogs, reports });
  } catch (err) {
    res.status(500).json({ error: 'Detaylar çekilirken hata oluştu: ' + err.message });
  }
});

// POST /animals - Add Animal (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  const { name, species, breed, age, gender, vaccination_status, health_notes, image_url } = req.body;

  if (!name || !species) {
    return res.status(400).json({ error: 'Hayvan adı ve türü zorunludur.' });
  }

  const defaultImage = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600';

  try {
    const result = await dbRun(
      `INSERT INTO animals (name, species, breed, age, gender, vaccination_status, health_notes, status, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, "available", ?)`,
      [
        name,
        species,
        breed || '',
        age ? parseInt(age) : 0,
        gender || 'Belirsiz',
        vaccination_status || 'Yok',
        health_notes || '',
        image_url || defaultImage
      ]
    );

    res.status(201).json({
      message: 'Hayvan kaydı başarıyla eklendi.',
      animalId: result.lastID
    });
  } catch (err) {
    res.status(500).json({ error: 'Hayvan eklenirken hata oluştu: ' + err.message });
  }
});

// PUT /animals/:id - Update Animal (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, species, breed, age, gender, vaccination_status, health_notes, image_url, status } = req.body;

  if (!name || !species) {
    return res.status(400).json({ error: 'Hayvan adı ve türü zorunludur.' });
  }

  try {
    const existing = await dbGet('SELECT * FROM animals WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Hayvan bulunamadı.' });
    }

    await dbRun(
      `UPDATE animals 
       SET name = ?, species = ?, breed = ?, age = ?, gender = ?, vaccination_status = ?, health_notes = ?, image_url = ?, status = ?
       WHERE id = ?`,
      [
        name,
        species,
        breed,
        parseInt(age) || 0,
        gender,
        vaccination_status,
        health_notes,
        image_url || existing.image_url,
        status || existing.status,
        id
      ]
    );

    res.json({ message: 'Hayvan kaydı başarıyla güncellendi.' });
  } catch (err) {
    res.status(500).json({ error: 'Güncelleme sırasında hata oluştu: ' + err.message });
  }
});

// DELETE /animals/:id - Delete Animal (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbRun('DELETE FROM animals WHERE id = ?', [id]);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Hayvan bulunamadı.' });
    }
    res.json({ message: 'Hayvan kaydı silindi.' });
  } catch (err) {
    res.status(500).json({ error: 'Silme işlemi sırasında hata oluştu: ' + err.message });
  }
});

// POST /animals/:id/health-logs - Add Health Note (Admin only)
router.post('/:id/health-logs', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  if (!note) {
    return res.status(400).json({ error: 'Sağlık/bakım notu boş olamaz.' });
  }

  try {
    const animal = await dbGet('SELECT * FROM animals WHERE id = ?', [id]);
    if (!animal) {
      return res.status(404).json({ error: 'Hayvan bulunamadı.' });
    }

    await dbRun(
      'INSERT INTO health_logs (animal_id, note, recorded_by) VALUES (?, ?, ?)',
      [id, note, req.user.name]
    );

    res.status(201).json({ message: 'Sağlık/bakım notu başarıyla eklendi.' });
  } catch (err) {
    res.status(500).json({ error: 'Not eklenirken hata oluştu: ' + err.message });
  }
});

export default router;
