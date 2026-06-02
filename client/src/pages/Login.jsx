import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, CheckCircle2, User, Mail, Lock } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const endpoint = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password } 
      : formData;

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'İşlem başarısız oldu.');
      }

      setSuccess(data.message || 'Giriş başarılı!');
      
      // Store token & user details
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Notify parent app state
      setTimeout(() => {
        onLoginSuccess(data.user, data.token);
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }, 1000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '2rem 0'
    }}>
      <div className="card animate-scale-in" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '2.5rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        transition: 'background-color var(--transition-normal)'
      }}>
        {/* Tab Headers */}
        <div style={{ display: 'flex', borderBottom: '2px solid var(--border-color)', marginBottom: '2rem' }}>
          <button 
            type="button"
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              paddingBottom: '1rem',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: isLogin ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: isLogin ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            Giriş Yap
          </button>
          <button 
            type="button"
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            style={{
              flex: 1,
              paddingBottom: '1rem',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: !isLogin ? 'var(--primary)' : 'var(--text-muted)',
              borderBottom: !isLogin ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'all var(--transition-fast)'
            }}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Form Messages */}
        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            backgroundColor: 'rgba(16, 185, 129, 0.12)',
            color: 'var(--success)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group" style={{ position: 'relative' }}>
              <label className="form-label">Ad Soyad</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                  <User size={18} />
                </span>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Ad Soyad girin" 
                  className="form-input" 
                  value={formData.name}
                  onChange={handleInputChange}
                  style={{ paddingLeft: '2.5rem' }}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label">E-posta Adresi</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Mail size={18} />
              </span>
              <input 
                type="email" 
                name="email" 
                placeholder="E-posta girin" 
                className="form-input" 
                value={formData.email}
                onChange={handleInputChange}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ position: 'relative', marginBottom: '2rem' }}>
            <label className="form-label">Şifre</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={18} />
              </span>
              <input 
                type="password" 
                name="password" 
                placeholder="Şifre girin" 
                className="form-input" 
                value={formData.password}
                onChange={handleInputChange}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'İşlem yapılıyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>

        <p style={{
          fontSize: '0.825rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          marginTop: '1.5rem',
          lineHeight: '1.4'
        }}>
          Geliştirici testi için yönetici girişi:<br />
          <b>E-posta:</b> admin@patihaven.com | <b>Şifre:</b> admin123<br />
          Standart kullanıcı girişi:<br />
          <b>E-posta:</b> ahmet@patihaven.com | <b>Şifre:</b> user123
        </p>
      </div>
    </div>
  );
}
