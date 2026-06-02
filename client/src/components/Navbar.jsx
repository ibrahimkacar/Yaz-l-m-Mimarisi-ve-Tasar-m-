import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, User as UserIcon, Heart, Compass, FileText, Settings, Shield } from 'lucide-react';

export default function Navbar({ user, onLogout, theme, onToggleTheme }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="header-glass">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.4rem' }}>
          <Heart size={28} fill="var(--primary)" color="var(--primary)" />
          <span>Pati<span className="text-gradient">Haven</span></span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem', fontWeight: 600 }}>
            <Compass size={18} />
            <span>Hayvan Keşfet</span>
          </Link>
          
          <Link to="/api-docs" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem', fontWeight: 600 }}>
            <FileText size={18} />
            <span>Geliştirici API</span>
          </Link>

          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--secondary)' }}>
                  <Shield size={18} />
                  <span>Yönetici Paneli</span>
                </Link>
              ) : (
                <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.95rem', fontWeight: 600, color: 'var(--primary)' }}>
                  <UserIcon size={18} />
                  <span>Panelim</span>
                </Link>
              )}
            </>
          ) : null}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Theme Toggle */}
          <button 
            onClick={onToggleTheme} 
            className="btn btn-outline" 
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }}
            title={theme === 'dark' ? 'Aydınlık Mod' : 'Karanlık Mod'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.2 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{user.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {user.role === 'admin' ? 'Yönetici' : 'Sahiplenici'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Çıkış Yap">
                <LogOut size={16} />
                <span className="hide-on-mobile">Çıkış</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              <UserIcon size={16} />
              <span>Giriş / Kayıt</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
