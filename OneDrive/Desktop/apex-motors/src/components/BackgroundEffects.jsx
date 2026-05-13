import React from 'react';

export function BackgroundEffects() {
  return (
    <>
      {/* Dynamic background using CSS variables set by pages */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--bg-gradient, #08080c)',
          transition: 'background 1.5s ease',
          zIndex: 0,
        }}
      />

      {/* Noise overlay for texture */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
        backgroundSize: '200px',
        opacity: 0.4,
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Glow orb behind car */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'var(--glow-color, transparent)',
        filter: 'blur(80px)',
        pointerEvents: 'none',
        transition: 'background 1.5s ease',
        zIndex: 1,
      }} />
    </>
  );
}
