import React from 'react';
import { Heart, Code, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-secondary)',
      padding: '2rem 0',
      marginTop: 'auto',
      transition: 'background-color var(--transition-normal), border-color var(--transition-normal)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <Heart size={18} fill="var(--primary)" color="var(--primary)" />
          <span>PatiHaven © {new Date().getFullYear()}</span>
        </div>
        


        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
          <a href="#" className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <Code size={16} />
          </a>
          <a href="#" className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '50%' }}>
            <Globe size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}

