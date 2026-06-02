import React from 'react';
import { Calendar, Tag, ShieldCheck, Heart } from 'lucide-react';

export default function Card({ animal, onClickDetails }) {
  const getSpeciesEmoji = (species) => {
    switch (species.toLowerCase()) {
      case 'kedi': return '🐱';
      case 'köpek': return '🐶';
      case 'kuş': return '🦜';
      default: return '🐾';
    }
  };

  const getVaccinationBadge = (status) => {
    switch (status) {
      case 'Tamamlandı':
        return <span className="badge badge-success">Aşıları Tam</span>;
      case 'Kısmi':
        return <span className="badge badge-warning">Eksik Aşı</span>;
      default:
        return <span className="badge badge-danger">Aşısı Yok</span>;
    }
  };

  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Image & Badges Overlay */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
        <img 
          src={animal.image_url} 
          alt={animal.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          className="card-img"
        />
        
        {/* Availability Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }}>
          {animal.status === 'available' ? (
            <span className="badge badge-success" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Yuva Arıyor</span>
          ) : (
            <span className="badge badge-info" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Sahiplendirildi</span>
          )}
        </div>

        {/* Species Emoji Circle */}
        <div style={{
          position: 'absolute',
          bottom: '-15px',
          right: '15px',
          backgroundColor: 'var(--bg-secondary)',
          border: '2px solid var(--border-color)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          boxShadow: 'var(--card-shadow)',
          zIndex: 10
        }}>
          {getSpeciesEmoji(animal.species)}
        </div>
      </div>

      {/* Body Content */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{animal.name}</h4>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{animal.breed}</span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', margin: '0.5rem 0', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={14} />
            {animal.age} Yaşında
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Tag size={14} />
            {animal.gender}
          </span>
        </div>

        <div style={{ margin: '0.5rem 0 1rem 0' }}>
          {getVaccinationBadge(animal.vaccination_status)}
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={() => onClickDetails(animal.id)} 
            className="btn btn-outline" 
            style={{ width: '100%', fontSize: '0.85rem' }}
          >
            Detaylar & Sahiplen
          </button>
        </div>
      </div>
    </div>
  );
}
