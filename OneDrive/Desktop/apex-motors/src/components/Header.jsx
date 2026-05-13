import React from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '28px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 100,
      background: 'linear-gradient(to bottom, rgba(8,8,12,0.8) 0%, transparent 100%)',
    }}>
      <Link to="/" style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '22px',
        letterSpacing: '8px',
        color: '#ffffff',
        textDecoration: 'none',
      }}>
        APEX MOTORS
      </Link>
      <nav style={{ display: 'flex', gap: '32px' }}>
        {['Models', 'Heritage', 'Contact'].map((item) => (
          <a key={item} href="#" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = '#ffffff'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
          >
            {item}
          </a>
        ))}
      </nav>
    </header>
  );
}
