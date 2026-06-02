import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Search as SearchIcon, Filter, Info, ShieldAlert, CheckCircle2, Heart, Clipboard, Stethoscope } from 'lucide-react';

export default function Search({ user, token }) {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Search & Filter State
  const [filters, setFilters] = useState({
    search: '',
    species: '',
    gender: '',
    vaccination_status: '',
    status: 'available' // Default to available
  });

  // Selected Animal Details State
  const [selectedAnimalId, setSelectedAnimalId] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Adoption Request Modal State
  const [isAdoptOpen, setIsAdoptOpen] = useState(false);
  const [requestNote, setRequestNote] = useState('');
  const [adoptError, setAdoptError] = useState('');
  const [adoptSuccess, setAdoptSuccess] = useState('');

  // Fetch animal records
  const fetchAnimals = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.species) params.append('species', filters.species);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.vaccination_status) params.append('vaccination_status', filters.vaccination_status);
    if (filters.status) params.append('status', filters.status);

    fetch(`http://localhost:5000/api/v1/animals?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setAnimals(data);
      })
      .catch(err => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAnimals();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  // Open Details Modal and fetch health logs & feedback
  const handleOpenDetails = (id) => {
    setSelectedAnimalId(id);
    setIsDetailOpen(true);
    fetch(`http://localhost:5000/api/v1/animals/${id}`)
      .then(res => res.json())
      .then(data => {
        setDetailData(data);
      })
      .catch(err => console.error('Error fetching details:', err));
  };

  const handleCloseDetails = () => {
    setIsDetailOpen(false);
    setDetailData(null);
    setSelectedAnimalId(null);
  };

  // Submit Adoption Request
  const handleAdoptSubmit = async (e) => {
    e.preventDefault();
    setAdoptError('');
    setAdoptSuccess('');

    if (!token) {
      setAdoptError('Sahiplenme talebi göndermek için lütfen giriş yapın.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/adoptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          animal_id: selectedAnimalId,
          request_note: requestNote
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Talep gönderilemedi.');
      }

      setAdoptSuccess(data.message);
      setRequestNote('');
      
      // Refresh details and search to see update if any
      fetchAnimals();
      setTimeout(() => {
        setIsAdoptOpen(false);
        setIsDetailOpen(false);
        setAdoptSuccess('');
      }, 2000);

    } catch (err) {
      setAdoptError(err.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Dostlarımızı Keşfedin</h1>
          <p style={{ color: 'var(--text-muted)' }}>Onlara sıcak bir yuva kazandırmak için filtreleri kullanın.</p>
        </div>
      </div>

      {/* Filter Card */}
      <div className="card" style={{
        padding: '1.5rem',
        backgroundColor: 'var(--bg-secondary)',
        marginBottom: '2rem',
        border: '1px solid var(--border-color)',
        transition: 'background-color var(--transition-normal)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontWeight: 700 }}>
          <Filter size={18} color="var(--primary)" />
          <span>Filtreleme Seçenekleri</span>
        </div>

        <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Arama Terimi</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <SearchIcon size={16} />
              </span>
              <input 
                type="text" 
                name="search" 
                placeholder="İsim veya cins ara..." 
                className="form-input" 
                style={{ paddingLeft: '2.25rem', fontSize: '0.875rem' }}
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Tür</label>
            <select name="species" className="form-input" style={{ fontSize: '0.875rem' }} value={filters.species} onChange={handleFilterChange}>
              <option value="">Tümü</option>
              <option value="Köpek">Köpek</option>
              <option value="Kedi">Kedi</option>
              <option value="Kuş">Kuş</option>
              <option value="Tavşan">Tavşan</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Aşı Durumu</label>
            <select name="vaccination_status" className="form-input" style={{ fontSize: '0.875rem' }} value={filters.vaccination_status} onChange={handleFilterChange}>
              <option value="">Tümü</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="Kısmi">Kısmi</option>
              <option value="Yok">Aşı Yok</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sahiplenme Durumu</label>
            <select name="status" className="form-input" style={{ fontSize: '0.875rem' }} value={filters.status} onChange={handleFilterChange}>
              <option value="available">Yuva Arıyor</option>
              <option value="adopted">Sahiplendirildi</option>
              <option value="">Tümü</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'var(--text-muted)' }}>Hayvan listesi yükleniyor...</p>
        </div>
      ) : animals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <Info size={48} style={{ margin: '0 auto 1rem auto', display: 'block', color: 'var(--primary)' }} />
          <h3>Aradığınız kriterlere uygun dostumuz bulunamadı.</h3>
          <p style={{ marginTop: '0.5rem' }}>Lütfen filtreleri temizleyerek veya farklı terimlerle aramayı deneyin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {animals.map(animal => (
            <Card 
              key={animal.id} 
              animal={animal} 
              onClickDetails={handleOpenDetails} 
            />
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal isOpen={isDetailOpen} onClose={handleCloseDetails} title={detailData ? `${detailData.animal.name} - Detaylı Bilgiler` : 'Yükleniyor...'}>
        {detailData ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <img 
              src={detailData.animal.image_url} 
              alt={detailData.animal.name} 
              style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
            />
            
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-info">{detailData.animal.species}</span>
                <span className="badge badge-success">{detailData.animal.gender}</span>
                <span className="badge badge-warning">{detailData.animal.age} Yaşında</span>
              </div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Genel Sağlık & Durum</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>{detailData.animal.health_notes || 'Detaylı bakım notu girilmemiştir.'}</p>
            </div>

            {/* Health Logs (Optional Feature 2) */}
            <div>
              <h4 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                <Stethoscope size={18} color="var(--primary)" />
                <span>Veteriner Sağlık Günlüğü</span>
              </h4>
              {detailData.healthLogs.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kayıtlı veteriner notu bulunmamaktadır.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {detailData.healthLogs.map(log => (
                    <div key={log.id} style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        <span><b>Kayıt:</b> {log.recorded_by}</span>
                        <span>{new Date(log.created_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)' }}>{log.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Adopter Reports History (Optional Feature 3) */}
            {detailData.reports.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  <Clipboard size={18} color="var(--secondary)" />
                  <span>Sahiplenici Güncellemeleri</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {detailData.reports.map(report => (
                    <div key={report.id} style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: 'var(--bg-primary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.875rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        <span><b>Sahiplenen:</b> {report.user_name}</span>
                        <span>{new Date(report.created_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)' }}>{report.report_text}</p>
                      <div style={{ marginTop: '0.25rem' }}>
                        <span className={`badge ${report.health_status === 'healthy' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                          Sağlık: {report.health_status === 'healthy' ? 'Sağlıklı' : 'Hekim Kontrolü Gerekli'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sahiplen Action Box */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              {detailData.animal.status === 'available' ? (
                <>
                  {user ? (
                    <button onClick={() => setIsAdoptOpen(true)} className="btn btn-primary" style={{ width: '100%' }}>
                      <Heart size={18} fill="white" />
                      <span>Bu Dostumuzu Sahiplenmek İstiyorum!</span>
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', backgroundColor: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        Sahiplenme talebinde bulunabilmek için giriş yapmalısınız.
                      </p>
                      <button onClick={() => navigate('/login')} className="btn btn-outline btn-sm">
                        Şimdi Giriş Yapın
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>
                  🎉 Bu dostumuz sıcak yuvasına kavuşmuş durumda.
                </div>
              )}
            </div>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Yükleniyor...</p>
        )}
      </Modal>

      {/* Adoption Request Form Modal */}
      <Modal isOpen={isAdoptOpen} onClose={() => setIsAdoptOpen(false)} title="Sahiplenme Başvurusu">
        <form onSubmit={handleAdoptSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {adoptError && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
              <ShieldAlert size={16} />
              <span>{adoptError}</span>
            </div>
          )}

          {adoptSuccess && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} />
              <span>{adoptSuccess}</span>
            </div>
          )}

          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Harika bir karar! Lütfen kendinizi ve barınma koşullarınızı kısaca özetleyin (Evcil hayvan tecrübeniz, bahçe durumu, gün içinde ayırabileceğiniz süre vb.).
          </p>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Başvuru Notunuz</label>
            <textarea 
              className="form-input" 
              rows="4" 
              placeholder="Notunuzu yazın..." 
              required
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsAdoptOpen(false)} className="btn btn-outline" style={{ flex: 1 }}>
              Vazgeç
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1.5 }}>
              Talebi Gönder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
