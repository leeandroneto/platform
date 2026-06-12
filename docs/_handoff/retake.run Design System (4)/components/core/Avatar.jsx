import React from 'react';

/**
 * retake.run — Avatar
 * Round athlete/coach avatar. Photo or initials fallback. Optional
 * status ring (terracotta) and online dot.
 */
export function Avatar({
  src = null,
  name = '',
  size = 40,
  ring = false,
  status = null, // 'online' | 'paused' | null
  style = {},
  ...rest
}) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const statusColors = { online: 'var(--green)', paused: 'var(--amber)', risk: 'var(--red)' };

  return (
    <span style={{ position: 'relative', display: 'inline-flex', flex: 'none', ...style }} {...rest}>
      <span style={{
        width: size, height: size, borderRadius: 'var(--radius-pill)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--azul-300)',
        color: 'var(--grafite-ink)',
        font: `700 ${Math.round(size * 0.38)}px/1 var(--font-display)`,
        letterSpacing: '0.02em',
        boxShadow: ring ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--terracota)' : 'none',
      }}>
        {src
          ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initials}
      </span>
      {status && (
        <span style={{
          position: 'absolute', right: -1, bottom: -1,
          width: Math.max(8, size * 0.26), height: Math.max(8, size * 0.26),
          borderRadius: 999, background: statusColors[status] || 'var(--cinza-mineral)',
          border: '2px solid var(--surface-card)',
        }} />
      )}
    </span>
  );
}
