import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, Award, Users, BarChart3, Plus, 
  Trash2, Edit, Save, BookOpen, Stethoscope, ClipboardCheck, Clipboard
} from 'lucide-react';
import Modal from '../components/Modal';

export default function AdminDashboard({ user, token }) {
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'animals', 'reports'
  
  // Modals & Forms State
  const [isAddAnimalOpen, setIsAddAnimalOpen] = useState(false);
  const [isHealthLogOpen, setIsHealthLogOpen] = useState(false);
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);

  // New Animal Form
  const [animalForm, setAnimalForm] = useState({
    name: '', species: 'Köpek', breed: '', age: '', gender: 'Erkek', 
    vaccination_status: 'Yok', health_notes: '', image_url: ''
  });

  // Health Note Form
  const [healthNote, setHealthNote] = useState('');

  // Adoption request resolution
  const [adminNotes, setAdminNotes] = useState({});

  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // 1. Fetch Stats
      const statsRes = await fetch('http://localhost:5000/api/v1/animals/stats', { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // 2. Fetch Requests
      const reqRes = await fetch('http://localhost:5000/api/v1/adoptions', { headers });
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setRequests(reqData);
      }

      // 3. Fetch Animals
      const animRes = await fetch('http://localhost:5000/api/v1/animals');
      if (animRes.ok) {
        const animData = await animRes.json();
        setAnimals(animData);
      }

      // 4. Fetch Adopter Reports
      const repRes = await fetch('http://localhost:5000/api/v1/adoptions/reports', { headers });
      if (repRes.ok) {
        const repData = await repRes.json();
        setReports(repData);
      }

    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Resolve Request
  const handleResolveRequest = async (requestId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/adoptions/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          admin_note: adminNotes[requestId] || ''
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      showMsg('success', data.message);
      fetchData();
    } catch (err) {
      showMsg('error', err.message);
    }
  };

  // Add Animal
  const handleAddAnimalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/animals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(animalForm)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      showMsg('success', data.message);
      setIsAddAnimalOpen(false);
      setAnimalForm({
        name: '', species: 'Köpek', breed: '', age: '', gender: 'Erkek', 
        vaccination_status: 'Yok', health_notes: '', image_url: ''
      });
      fetchData();
    } catch (err) {
      showMsg('error', err.message);
    }
  };

  // Add Health Note
  const handleAddHealthLogSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/v1/animals/${selectedAnimalId}/health-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note: healthNote })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      showMsg('success', data.message);
      setIsHealthLogOpen(false);
      setHealthNote('');
      fetchData();
    } catch (err) {
      showMsg('error', err.message);
    }
  };

  // Delete Animal
  const handleDeleteAnimal = async (id) => {
    if (!window.confirm('Bu hayvan kaydını tamamen silmek istediğinize emin misiniz? (İlişkili tüm başvurular silinecektir)')) return;
    try {
      const response = await fetch(`http://localhost:5000/api/v1/animals/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      showMsg('success', data.message);
      fetchData();
    } catch (err) {
      showMsg('error', err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge badge-success">Onaylandı</span>;
      case 'rejected':
        return <span className="badge badge-danger">Reddedildi</span>;
      default:
        return <span className="badge badge-warning">İncelemede</span>;
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Barınak Yönetici Paneli</h1>
          <p style={{ color: 'var(--text-muted)' }}>Operasyonel süreçleri, talepleri ve canlı kayıtlarını buradan yönetin.</p>
        </div>
      </div>

      {/* Global Message Banner */}
      {message.text && (
        <div className="animate-fade-in" style={{
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          color: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          gap: '0.5rem',
          fontSize: '0.9rem',
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldAlert size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Statistics Row */}
      {stats && (
        <div className="grid grid-cols-4" style={{ gap: '1.25rem', marginBottom: '2.5rem' }}>
          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Award size={24} />
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, display: 'block' }}>{stats.totalAnimals}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Toplam Kayıtlı Can</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <ClipboardCheck size={24} />
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, display: 'block' }}>{stats.adoptedAnimals}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sahiplendirilen</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <BarChart3 size={24} />
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, display: 'block' }}>{stats.pendingAdoptions}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bekleyen Talep</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--secondary)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
              <Users size={24} />
            </div>
            <div>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, display: 'block' }}>{stats.totalUsers}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kayıtlı Sahiplenici</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: '1.5rem', gap: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('requests')} 
          style={{
            paddingBottom: '0.75rem',
            fontWeight: 700,
            color: activeTab === 'requests' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'requests' ? '3px solid var(--primary)' : '3px solid transparent',
            transition: 'all var(--transition-fast)'
          }}
        >
          Sahiplenme Talepleri ({requests.filter(r => r.status === 'pending').length})
        </button>

        <button 
          onClick={() => setActiveTab('animals')} 
          style={{
            paddingBottom: '0.75rem',
            fontWeight: 700,
            color: activeTab === 'animals' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'animals' ? '3px solid var(--primary)' : '3px solid transparent',
            transition: 'all var(--transition-fast)'
          }}
        >
          Canlı Kayıtları ({animals.length})
        </button>

        <button 
          onClick={() => setActiveTab('reports')} 
          style={{
            paddingBottom: '0.75rem',
            fontWeight: 700,
            color: activeTab === 'reports' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'reports' ? '3px solid var(--primary)' : '3px solid transparent',
            transition: 'all var(--transition-fast)'
          }}
        >
          Sahiplenici Güncellemeleri ({reports.length})
        </button>
      </div>

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', transition: 'background-color var(--transition-normal)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Gelen Başvurular</h3>
          {requests.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Hiç başvuru bulunmamaktadır.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {requests.map(req => (
                <div key={req.id} style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <img src={req.animal_image} alt={req.animal_name} style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                        {req.user_name} ➔ {req.animal_name} ({req.animal_species})
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        E-posta: {req.user_email} | Başvuru Tarihi: {new Date(req.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      {getStatusBadge(req.status)}
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    <b>Açıklama:</b> {req.request_note}
                  </p>

                  {req.status === 'pending' ? (
                    <div style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <input 
                          type="text" 
                          placeholder="Yönetici değerlendirme notu ekleyin..." 
                          className="form-input" 
                          style={{ fontSize: '0.85rem' }}
                          value={adminNotes[req.id] || ''}
                          onChange={(e) => setAdminNotes({ ...adminNotes, [req.id]: e.target.value })}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button 
                          onClick={() => handleResolveRequest(req.id, 'rejected')} 
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                        >
                          Reddet
                        </button>
                        <button 
                          onClick={() => handleResolveRequest(req.id, 'approved')} 
                          className="btn btn-primary btn-sm"
                        >
                          Onayla
                        </button>
                      </div>
                    </div>
                  ) : (
                    req.admin_note && (
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}>
                        <b>İnceleme Notu:</b> {req.admin_note}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Animals Tab */}
      {activeTab === 'animals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setIsAddAnimalOpen(true)} className="btn btn-primary btn-sm">
              <Plus size={16} />
              <span>Yeni Hayvan Kaydı Ekle</span>
            </button>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', transition: 'background-color var(--transition-normal)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Barınaktaki Canlılar</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Görsel</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Adı</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Tür/Irk</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Yaş/Cinsiyet</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Aşı Durumu</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Durum</th>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {animals.map(animal => (
                    <tr key={animal.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem' }}>
                        <img src={animal.image_url} alt={animal.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      </td>
                      <td style={{ padding: '0.5rem', fontWeight: 700 }}>{animal.name}</td>
                      <td style={{ padding: '0.5rem' }}>{animal.species} ({animal.breed})</td>
                      <td style={{ padding: '0.5rem' }}>{animal.age} Yaş / {animal.gender}</td>
                      <td style={{ padding: '0.5rem' }}>{animal.vaccination_status}</td>
                      <td style={{ padding: '0.5rem' }}>
                        {animal.status === 'available' ? (
                          <span className="badge badge-success">Yuva Arıyor</span>
                        ) : (
                          <span className="badge badge-info">Sahiplendirildi</span>
                        )}
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                          <button 
                            onClick={() => { setSelectedAnimalId(animal.id); setIsHealthLogOpen(true); }}
                            className="btn btn-outline" 
                            style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                            title="Sağlık Günlüğü Ekle"
                          >
                            <Stethoscope size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteAnimal(animal.id)}
                            className="btn btn-outline" 
                            style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                            title="Sil"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', transition: 'background-color var(--transition-normal)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Sahiplenicilerden Gelen Güncellemeler</h3>
          {reports.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Hiç geri bildirim raporu bulunmamaktadır.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {reports.map(rep => (
                <div key={rep.id} style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-primary)'
                }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <img src={rep.animal_image} alt={rep.animal_name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                        {rep.user_name} ➔ {rep.animal_name} ({rep.animal_species})
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Bildirim Tarihi: {new Date(rep.created_at).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <div style={{ marginLeft: 'auto' }}>
                      <span className={`badge ${rep.health_status === 'healthy' ? 'badge-success' : 'badge-warning'}`}>
                        Sağlık Durumu: {rep.health_status === 'healthy' ? 'Sağlıklı' : 'Hekim Gerekebilir'}
                      </span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <b>Kullanıcı Notu:</b> {rep.report_text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Animal Modal */}
      <Modal isOpen={isAddAnimalOpen} onClose={() => setIsAddAnimalOpen(false)} title="Yeni Hayvan Kaydı Ekle">
        <form onSubmit={handleAddAnimalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Hayvan Adı</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                value={animalForm.name} 
                onChange={(e) => setAnimalForm({ ...animalForm, name: e.target.value })}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Tür</label>
              <select 
                className="form-input" 
                value={animalForm.species} 
                onChange={(e) => setAnimalForm({ ...animalForm, species: e.target.value })}
              >
                <option value="Köpek">Köpek</option>
                <option value="Kedi">Kedi</option>
                <option value="Kuş">Kuş</option>
                <option value="Tavşan">Tavşan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Irk / Cins</label>
              <input 
                type="text" 
                placeholder="Örn: Kangal, Van Kedisi" 
                className="form-input" 
                value={animalForm.breed} 
                onChange={(e) => setAnimalForm({ ...animalForm, breed: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '0.5rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Yaş</label>
                <input 
                  type="number" 
                  min="0" 
                  className="form-input" 
                  value={animalForm.age} 
                  onChange={(e) => setAnimalForm({ ...animalForm, age: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Cinsiyet</label>
                <select 
                  className="form-input" 
                  value={animalForm.gender} 
                  onChange={(e) => setAnimalForm({ ...animalForm, gender: e.target.value })}
                >
                  <option value="Erkek">Erkek</option>
                  <option value="Dişi">Dişi</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Aşı Durumu</label>
            <select 
              className="form-input" 
              value={animalForm.vaccination_status} 
              onChange={(e) => setAnimalForm({ ...animalForm, vaccination_status: e.target.value })}
            >
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="Kısmi">Kısmi (Eksikler Var)</option>
              <option value="Yok">Aşısı Yok</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Görsel Bağlantısı (URL)</label>
            <input 
              type="url" 
              placeholder="https://unsplash.com/..." 
              className="form-input" 
              value={animalForm.image_url} 
              onChange={(e) => setAnimalForm({ ...animalForm, image_url: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Hayati / Sağlık Notları</label>
            <textarea 
              className="form-input" 
              rows="3" 
              placeholder="Sağlık geçmişi veya genel davranış özellikleri..." 
              value={animalForm.health_notes} 
              onChange={(e) => setAnimalForm({ ...animalForm, health_notes: e.target.value })}
              style={{ resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsAddAnimalOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>Vazgeç</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>Kaydet</button>
          </div>
        </form>
      </Modal>

      {/* Add Health Log Modal */}
      <Modal isOpen={isHealthLogOpen} onClose={() => setIsHealthLogOpen(false)} title="Sağlık / Bakım Notu Ekle">
        <form onSubmit={handleAddHealthLogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Veteriner Notu</label>
            <textarea 
              className="form-input" 
              rows="4" 
              placeholder="Uygulanan tedavi, aşı yenileme, ilaç takviyesi veya bakım önerileri yazın..." 
              required 
              value={healthNote} 
              onChange={(e) => setHealthNote(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={() => setIsHealthLogOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>İptal</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>Günlüğe Ekle</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
