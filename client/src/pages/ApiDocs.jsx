import React, { useState } from 'react';
import { Terminal, Send, Lock, Key, CheckCircle, HelpCircle } from 'lucide-react';

export default function ApiDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/v1/external/animals');
  const [apiKey, setApiKey] = useState('patihaven_guest_key_2026');
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTestApi = async () => {
    setLoading(true);
    setError('');
    setApiResponse(null);

    try {
      const response = await fetch(`http://localhost:5000${selectedEndpoint}`, {
        method: 'GET',
        headers: {
          'x-api-key': apiKey
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'İstek başarısız oldu.');
      }

      setApiResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dış Sistem API Entegrasyonu</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Üçüncü parti sistemlerin barınağımızdaki hayvan ve kullanıcı verilerine erişmesini sağlayan açık REST API.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }} className="grid-cols-2">
        {/* Left Side: Documentation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', transition: 'background-color var(--transition-normal)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Key size={20} color="var(--primary)" />
              <span>Kimlik Doğrulama</span>
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              API istekleri güvenliğin sağlanması amacıyla bir API Anahtarı (API Key) gerektirmektedir. İsteklerinizin başlık (Header) kısmına <code>x-api-key</code> parametresini eklemeniz gerekmektedir.
            </p>
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-color)',
              fontSize: '0.85rem'
            }}>
              <b>Header Parametresi:</b><br />
              <code>x-api-key: patihaven_guest_key_2026</code>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', transition: 'background-color var(--transition-normal)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={20} color="var(--secondary)" />
              <span>Kullanılabilir Uç Noktalar (Endpoints)</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Endpoint 1 */}
              <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem', fontWeight: 800 }}>GET</span>
                  <code style={{ fontWeight: 700, fontSize: '0.9rem' }}>/api/v1/external/animals</code>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Barınaktaki tüm hayvanların kayıtlarını (isim, tür, aşı, yaş, cinsiyet, durum vb.) liste halinde döndürür.
                </p>
              </div>

              {/* Endpoint 2 */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem', fontWeight: 800 }}>GET</span>
                  <code style={{ fontWeight: 700, fontSize: '0.9rem' }}>/api/v1/external/users</code>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Sisteme üye olan kullanıcıların temel profillerini (isim, rol, katılım tarihi) güvenli sınırlar içinde listeler. (Parolalar kesinlikle dışarı aktarılmaz).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Tester Console */}
        <div>
          <div className="card" style={{
            padding: '1.5rem',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            position: 'sticky',
            top: '90px',
            transition: 'background-color var(--transition-normal)'
          }}>
            <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Send size={20} color="var(--primary)" />
              <span>Etkileşimli API Test Konsolu</span>
            </h3>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Uç Nokta Seçin</label>
              <select 
                className="form-input" 
                value={selectedEndpoint} 
                onChange={(e) => setSelectedEndpoint(e.target.value)}
              >
                <option value="/api/v1/external/animals">GET /api/v1/external/animals</option>
                <option value="/api/v1/external/users">GET /api/v1/external/users</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">x-api-key (Header Anahtarı)</label>
              <input 
                type="text" 
                className="form-input" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API Key değerini yazın..."
              />
            </div>

            <button 
              onClick={handleTestApi} 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'İstek Gönderiliyor...' : 'İsteği Gönder (Send Request)'}
            </button>

            {/* Code Box for Response */}
            <div style={{ marginTop: '0.5rem' }}>
              <span className="form-label">Sunucu Yanıtı (JSON Response)</span>
              <div style={{
                backgroundColor: '#0f172a',
                color: '#38bdf8',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                maxHeight: '300px',
                overflowY: 'auto',
                border: '1px solid #334155',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {loading && <span style={{ color: '#94a3b8' }}>İstek işleniyor...</span>}
                {error && <span style={{ color: '#ef4444' }}>❌ Hata: {error}</span>}
                {!loading && !error && !apiResponse && <span style={{ color: '#64748b' }}>Henüz bir istek gönderilmedi. Test etmek için yukarıdaki butona basın.</span>}
                {apiResponse && JSON.stringify(apiResponse, null, 2)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
