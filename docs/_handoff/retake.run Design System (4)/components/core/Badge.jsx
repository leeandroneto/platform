import React from 'react';

/**
 * retake.run — Badge / Tag
 * Small status or category label. Soft (tinted), solid, or outline.
 * Default pill shape (track flavor). Tones stay in brand temperature.
 */
export function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  dot = false,
  pill = true,
  style = {},
  ...rest
}) {
  const tones = {
    neutral:  { c: 'var(--grafite)',      bg: 'var(--creme-200)',     line: 'var(--creme-300)' },
    accent:   { c: 'var(--terracota-600)',bg: 'var(--terracota-100)', line: 'var(--terracota-300)' },
    ocean:    { c: 'var(--azul-700)',     bg: 'var(--azul-100)',      line: 'var(--azul-300)' },
    success:  { c: '#3C6E47',             bg: 'var(--green-100)',     line: '#Bcd6bf' },
    warning:  { c: '#9A6E1E',             bg: 'var(--amber-100)',     line: '#E6CE94' },
    danger:   { c: 'var(--red)',          bg: 'var(--red-100)',       line: '#E6B6a9' },
  };
  const t = tones[tone] || tones.neutral;

  const variants = {
    soft:    { color: t.c, background: t.bg, border: '1px solid transparent' },
    solid:   { color: 'var(--creme)', background: t.c, border: '1px solid transparent' },
    outline: { color: t.c, background: 'transparent', border: `1px solid ${t.line}` },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        font: '600 12px/1.3 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-4)',
        whiteSpace: 'nowrap',
        ...variants[variant],
        ...style,
      }}
      {...rest}
    >
      {dot && (
        <span style={{
          width: 7, height: 7, borderRadius: 999,
          background: variant === 'solid' ? 'var(--creme)' : t.c, flex: 'none',
        }} />
      )}
      {children}
    </span>
  );
}
