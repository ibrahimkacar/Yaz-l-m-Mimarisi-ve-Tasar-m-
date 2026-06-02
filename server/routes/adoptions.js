import express from 'express';
import { dbAll, dbGet, dbRun } from '../db/database.js';
import { authenticateToken, requireAdmin } from './auth.js';

const router = express.Router();

// POST /adoptions - Create an adoption request
router.post('/', authenticateToken, async (req, res) => {
  const { animal_id, request_note } = req.body;

  if (!animal_id) {
    return res.status(400).json({ error: 'Hayvan kimliği (animal_id) gereklidir.' });
  }

  try {
    // Check animal exists and is available
    const animal = await dbGet('SELECT * FROM animals WHERE id = ?', [animal_id]);
    if (!animal) {
      return res.status(404).json({ error: 'Hayvan bulunamadı.' });
    }
    if (animal.status !== 'available') {
      return res.status(400).json({ error: 'Bu hayvan zaten sahiplendirildi veya uygun değil.' });
    }

    // Check if user already has a pending request for this animal
    const existing = await dbGet(
      'SELECT * FROM adoption_requests WHERE user_id = ? AND animal_id = ? AND status = "pending"',
      [req.user.id, animal_id]
    );
    if (existing) {
      return res.status(400).json({ error: 'Bu hayvan için zaten açık bir sahiplenme talebiniz bulunuyor.' });
    }

    // Insert request
    await dbRun(
      'INSERT INTO adoption_requests (user_id, animal_id, status, request_note) VALUES (?, ?, "pending", ?)',
      [req.user.id, animal_id, request_note || '']
    );

    res.status(201).json({ message: 'Sahiplenme talebiniz başarıyla alındı. Yöneticiler tarafından incelenecektir.' });
  } catch (err) {
    res.status(500).json({ error: 'Talep oluşturulurken hata oluştu: ' + err.message });
  }
});

// GET /adoptions/my - Get current user's adoption requests (Adoption History page)
router.get('/my', authenticateToken, async (req, res) => {
  try {
    const requests = await dbAll(
      `SELECT r.*, a.name as animal_name, a.species as animal_species, a.breed as animal_breed, a.image_url as animal_image, a.status as animal_status
       FROM adoption_requests r
       JOIN animals a ON r.animal_id = a.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Talepleriniz çekilirken hata oluştu: ' + err.message });
  }
});

// GET /adoptions - List all adoption requests (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const requests = await dbAll(
      `SELECT r.*, a.name as animal_name, a.species as animal_species, a.image_url as animal_image, u.name as user_name, u.email as user_email
       FROM adoption_requests r
       JOIN animals a ON r.animal_id = a.id
       JOIN users u ON r.user_id = u.id
       ORDER BY 
         CASE WHEN r.status = 'pending' THEN 0 ELSE 1 END,
         r.created_at DESC`
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Talepler listelenirken hata oluştu: ' + err.message });
  }
});

// PUT /adoptions/:id - Approve or Reject request (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, admin_note } = req.body; // 'approved' or 'rejected'

  if (!status || !['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Geçersiz talep durumu. Sadece approved veya rejected olabilir.' });
  }

  try {
    const request = await dbGet('SELECT * FROM adoption_requests WHERE id = ?', [id]);
    if (!request) {
      return res.status(404).json({ error: 'Sahiplenme talebi bulunamadı.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'Bu talep daha önce sonuçlandırılmış.' });
    }

    // Start a sequential update
    if (status === 'approved') {
      // Check if animal is still available
      const animal = await dbGet('SELECT status FROM animals WHERE id = ?', [request.animal_id]);
      if (animal.status !== 'available') {
        return res.status(400).json({ error: 'Hayvan başka biri tarafından sahiplenilmiş olabilir.' });
      }

      // Update animal status to adopted
      await dbRun('UPDATE animals SET status = "adopted" WHERE id = ?', [request.animal_id]);
      
      // Auto-reject other pending requests for the same animal
      await dbRun(
        'UPDATE adoption_requests SET status = "rejected", admin_note = "Bu hayvan başka bir başvuru sahibi tarafından sahiplenildi." WHERE animal_id = ? AND id != ? AND status = "pending"',
        [request.animal_id, id]
      );
    }

    // Update the request itself
    await dbRun(
      'UPDATE adoption_requests SET status = ?, admin_note = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, admin_note || '', id]
    );

    res.json({ message: `Sahiplenme talebi başarıyla ${status === 'approved' ? 'onaylandı' : 'reddedildi'}.` });
  } catch (err) {
    res.status(500).json({ error: 'Güncelleme sırasında hata oluştu: ' + err.message });
  }
});

// POST /adoptions/reports - User reports update on adopted animal
router.post('/reports', authenticateToken, async (req, res) => {
  const { adoption_request_id, report_text, health_status } = req.body;

  if (!adoption_request_id || !report_text || !health_status) {
    return res.status(400).json({ error: 'Lütfen tüm alanları (talep kimliği, rapor metni, sağlık durumu) doldurun.' });
  }

  try {
    // Check if the request exists, is approved, and belongs to this user
    const request = await dbGet(
      'SELECT * FROM adoption_requests WHERE id = ? AND user_id = ? AND status = "approved"',
      [adoption_request_id, req.user.id]
    );

    if (!request) {
      return res.status(404).json({ error: 'Onaylanmış sahiplenme talebi bulunamadı. Rapor gönderemezsiniz.' });
    }

    await dbRun(
      'INSERT INTO animal_reports (adoption_request_id, user_id, animal_id, report_text, health_status) VALUES (?, ?, ?, ?, ?)',
      [adoption_request_id, req.user.id, request.animal_id, report_text, health_status]
    );

    res.status(201).json({ message: 'Raporunuz barınağa başarıyla iletildi. Hayvanın durumunu takip ettiğiniz için teşekkür ederiz!' });
  } catch (err) {
    res.status(500).json({ error: 'Rapor kaydedilirken hata oluştu: ' + err.message });
  }
});

// GET /adoptions/reports - View all adopter reports (Admin only)
router.get('/reports', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const reports = await dbAll(
      `SELECT r.*, a.name as animal_name, a.species as animal_species, a.image_url as animal_image, u.name as user_name, u.email as user_email
       FROM animal_reports r
       JOIN animals a ON r.animal_id = a.id
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Raporlar listelenirken hata oluştu: ' + err.message });
  }
});

export default router;
