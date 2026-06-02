import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Clipboard, Activity, Send, Clock, Home } from 'lucide-react';

export default function UserDashboard({ user, token }) {
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // New report form state
  const [selectedRequest, setSelectedRequest] = useState('');
  const [reportText, setReportText] = useState('');
  const [healthStatus, setHealthStatus] = useState('healthy');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const fetchUserData = async () => {
    try {
      // 1. Fetch user adoption history
      const reqRes = await fetch('http://localhost:5000/api/v1/adoptions/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const reqData = await reqRes.json();
      if (Array.isArray(reqData)) setRequests(reqData);

      // 2. Fetch all reports from this user
      // Note: We can filter on the client or fetch them. For simplicity, let's load them by listing animal reports
      // and checking if they belong to this user, or just fetch them from a generic list.
      // Wait, let's get reports from the server. Since there isn't a custom /my-reports, we can write an inline fetch
      // that queries animal_reports from the server for this user or filters.
      // Let's create an endpoint on backend or load them.
      // Actually, on the backend, when getting an animal's details we fetch reports, but we can also just fetch all reports
      // and filter by user name / user ID in client-side, which is fully compatible with our database schema.
      // Let's verify: `GET /api/v1/adoptions/reports` is admin-only. Can we fetch all reports? Let's check how to display them.
      // To bypass Admin check, we can build a simple endpoint or fetch user reports in frontend.
      // Wait! We can fetch it by querying the animal_reports table in a custom route, or we can filter it.
      // Let's check: in `adoptions.js` we didn't add a specific `GET /adoptions/my-reports` but we can fetch them
      // from `/adoptions/my` and then look at the animal details!
      // Even simpler: let's fetch all reports for each adopted animal, or since we know the requests, we can just load the reports
      // that belong to the user's approved requests. Let's make a fetch to server if needed.
      // Wait, is there a simple way to load the user's reports?
      // Yes, we can fetch `GET /api/v1/animals` and search for matching reports, or we can add a quick route if needed,
      // but client-side filtering of public animal reports is also easy!
      // Actually, let's add a quick fetch for reports. Let's assume we can fetch them, or let's create a route `/adoptions/reports/my`
      // on backend. Oh, we don't have that route. But wait! We can fetch reports by fetching `/api/v1/animals` detail for their adopted animal.
      // Or we can just display the reports submitted during the session, or list them.
      // Let's fetch public animal detail for their adopted pet! Since they know which animals they adopted, they can load details.
      // Let's write the code to retrieve the reports dynamically from the approved requests.
      
      const reportsTemp = [];
      const approvedRequests = reqData.filter(r => r.status === 'approved');
      for (const reqItem of approvedRequests) {
        const detailRes = await fetch(`http://localhost:5000/api/v1/animals/${reqItem.animal_id}`);
        if (detailRes.ok) {
          const details = await detailRes.json();
          // Filter reports belonging to this user
          const userReports = details.reports.filter(rep => rep.user_id === user.id);
          reportsTemp.push(...userReports);
        }
      }
      setReports(reportsTemp);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedRequest) {
      setFormError('Lütfen raporlamak istediğiniz sahiplenilmiş hayvanı seçin.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/v1/adoptions/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          adoption_request_id: parseInt(selectedRequest),
          report_text: reportText,
          health_status: healthStatus
        })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Rapor gönderilemedi.');
      }

      setFormSuccess('Durum raporunuz başarıyla barınağa iletildi.');
      setReportText('');
      setSelectedRequest('');
      
      // Refresh dashboard data
      fetchUserData();

    } catch (err) {
      setFormError(err.message);
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

  const approvedAdoptions = requests.filter(r => r.status === 'approved');

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Panel verileri yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Kullanıcı Kontrol Paneli</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sahiplenme taleplerinizi takip edin ve dostlarımızın durumunu barınağa bildirin.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '2rem'
      }} className="grid-cols-2">
        {/* Left Side: Requests History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', transition: 'background-color var(--transition-normal)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} color="var(--primary)" />
              <span>Sahiplenme Geçmişim (Talepler)</span>
            </h3>

            {requests.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
                Henüz yapılmış bir sahiplenme başvurunuz bulunmamaktadır.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {requests.map(req => (
                  <div key={req.id} style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)'
                  }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <img 
                        src={req.animal_image} 
                        alt={req.animal_name} 
                        style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{req.animal_name} ({req.animal_species})</h4>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Başvuru: {new Date(req.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      <div style={{ marginLeft: 'auto' }}>
                        {getStatusBadge(req.status)}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <b>Başvuru Notunuz:</b> {req.request_note}
                    </p>

                    {req.admin_note && (
                      <div style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-secondary)',
                        borderLeft: '3px solid var(--primary)',
                        fontSize: '0.825rem'
                      }}>
                        <b>Barınak Yanıtı:</b> {req.admin_note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User's Reports History */}
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', transition: 'background-color var(--transition-normal)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clipboard size={20} color="var(--secondary)" />
              <span>Gönderdiğim Durum Raporları</span>
            </h3>

            {reports.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
                Henüz gönderilmiş bir geri bildirim raporunuz bulunmamaktadır.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reports.map(rep => (
                  <div key={rep.id} style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-primary)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      <span><b>Tarih:</b> {new Date(rep.created_at).toLocaleString('tr-TR')}</span>
                      <span className={`badge ${rep.health_status === 'healthy' ? 'badge-success' : 'badge-warning'}`}>
                        Sağlık: {rep.health_status === 'healthy' ? 'Çok İyi' : 'Veteriner Gerekli'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{rep.report_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Submit Feedback Form */}
        <div>
          <div className="card" style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            position: 'sticky',
            top: '90px',
            transition: 'background-color var(--transition-normal)'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={20} color="var(--primary)" />
              <span>Yeni Durum Güncellemesi</span>
            </h3>

            {approvedAdoptions.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-primary)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem'
              }}>
                <Home size={32} style={{ margin: '0 auto 0.75rem auto', color: 'var(--text-muted)' }} />
                <p>Yeni durum bildirimi göndermek için onaylanmış bir sahiplenme kaydınızın olması gerekir.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {formError && (
                  <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.5rem', fontSize: '0.825rem' }}>
                    <ShieldAlert size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                {formSuccess && (
                  <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '0.5rem', fontSize: '0.825rem' }}>
                    <CheckCircle2 size={16} />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Sahiplenilen Hayvan</label>
                  <select 
                    className="form-input" 
                    value={selectedRequest} 
                    onChange={(e) => setSelectedRequest(e.target.value)}
                    required
                  >
                    <option value="">Hayvan Seçin...</option>
                    {approvedAdoptions.map(req => (
                      <option key={req.id} value={req.id}>
                        {req.animal_name} ({req.animal_breed})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Genel Sağlık Durumu</label>
                  <select 
                    className="form-input" 
                    value={healthStatus} 
                    onChange={(e) => setHealthStatus(e.target.value)}
                    required
                  >
                    <option value="healthy">Sağlıklı ve Keyifli</option>
                    <option value="recovering">İyileşme Sürecinde</option>
                    <option value="needs_vet">Veteriner Kontrolü Gerekiyor</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Açıklama / Not</label>
                  <textarea 
                    className="form-input" 
                    rows="5" 
                    placeholder="Dostumuzun evdeki ilk günleri, yeme-içme alışkanlığı veya sağlığı hakkında barınağa bilgi verin..." 
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    required
                    style={{ resize: 'none' }}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Raporu Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
