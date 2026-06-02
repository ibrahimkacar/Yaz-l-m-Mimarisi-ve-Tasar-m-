import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, ShieldAlert, Award, Calendar, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    adopted: 0
  });

  useEffect(() => {
    // Fetch animal list to compute stats dynamically for home visitors
    fetch('http://localhost:5000/api/v1/animals')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const available = data.filter(a => a.status === 'available').length;
          const adopted = data.filter(a => a.status === 'adopted').length;
          setStats({
            total: data.length,
            available,
            adopted
          });
        }
      })
      .catch(err => console.error('Stats fetch error:', err));
  }, []);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      {/* Hero Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        alignItems: 'center',
        gap: '2rem',
        padding: '4rem 0',
        minHeight: '75vh'
      }} className="container">
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary-hover)',
            padding: '0.35rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '1.5rem'
          }}>
            <Heart size={14} fill="var(--primary-hover)" />
            <span>Sıcak Bir Yuva Arayan Canlar</span>
          </div>

          <h1 style={{ fontSize: '3.5rem', lineHeight: '1.15', marginBottom: '1.5rem' }}>
            Onlara Yeni Bir <br />
            <span className="text-gradient">Gelecek Bağışlayın</span>
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem', maxWidth: '580px' }}>
            PatiHaven, barınağımızdaki dostlarımızın bakım süreçlerini, aşı takvimlerini ve sahiplendirme operasyonlarını şeffaf bir şekilde yöneten yenilikçi bir yazılım platformudur. Siz de bugün bir hayat değiştirebilirsiniz.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/search" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <Compass size={20} />
              <span>Dostlarımızı İnceleyin</span>
            </Link>
            <Link to="/login" className="btn btn-outline" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
              <span>Bize Katılın</span>
            </Link>
          </div>
        </div>

        <div className="hide-on-mobile" style={{ position: 'relative', height: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=800" 
            alt="Happy pets" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            right: '20px',
            backgroundColor: 'var(--glass-bg)',
            border: '1px solid var(--glass-border)',
            backdropFilter: 'var(--glass-blur)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <Award size={36} color="var(--primary)" />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>%100 Güvenli Süreç</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Veteriner hekim onaylı aşı ve sağlık raporlama sistemi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Statistics Section */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', padding: '4rem 0', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', transition: 'background-color var(--transition-normal)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Barınağımızın Güncel Durumu</h2>
            <p style={{ color: 'var(--text-muted)' }}>Gerçek zamanlı olarak güncellenen veri istatistiklerimiz</p>
          </div>

          <div className="grid grid-cols-3" style={{ textAlign: 'center', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>
                {stats.total}
              </span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Toplam Kayıtlı Dostumuz</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Sistemimizde kayıt altına alınmış tüm türlerden canlı sayısı.</p>
            </div>

            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--secondary)' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--secondary)', display: 'block', marginBottom: '0.5rem' }}>
                {stats.available}
              </span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Yuva Bekleyen Canlar</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Şu anda barınağımızda bulunup sahiplenilmeyi bekleyenler.</p>
            </div>

            <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--success)' }}>
              <span style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--success)', display: 'block', marginBottom: '0.5rem' }}>
                {stats.adopted}
              </span>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Sıcak Yuvasına Kavuşanlar</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Talepleri onaylanarak yeni aileleriyle buluşan mutlu dostlarımız.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="container" style={{ padding: '5rem 0 2rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Nasıl Çalışıyoruz?</h2>
          <p style={{ color: 'var(--text-muted)' }}>4 Adımda güvenli ve bilinçli sahiplendirme adımları</p>
        </div>

        <div className="grid grid-cols-4" style={{ gap: '2rem' }}>
          <div style={{ padding: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.25rem' }}>1</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Profil Keşfedin</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Arama panelimizi kullanarak yaş, cins, aşı durumu gibi kriterlere göre inceleyin.</p>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.25rem' }}>2</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Talep Gönderin</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sisteme kaydolarak istediğiniz hayvan için detaylı bir sahiplenme talebi iletin.</p>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.25rem' }}>3</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Değerlendirme</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Barınak yetkililerimiz koşullarınızı değerlendirip talebi onaylar veya geri dönüş yapar.</p>
          </div>

          <div style={{ padding: '1rem' }}>
            <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifySelf: 'start', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1.25rem' }}>4</div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Takip & Bildirim</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sahiplendikten sonra düzenli durum güncellemeleri girerek barınağı bilgilendirin.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
