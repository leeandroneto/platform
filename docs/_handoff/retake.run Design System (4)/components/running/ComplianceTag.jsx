import React from 'react';

/**
 * retake.run — ComplianceTag
 * The prescribed-vs-executed signal (§6.4). Green = done as prescribed,
 * amber = partial, red = missed, neutral = upcoming/prescribed.
 */
const MAP = {
  done:     { c: '#3C6E47', bg: 'var(--green-100)', label: 'Feito' },
  partial:  { c: '#9A6E1E', bg: 'var(--amber-100)', label: 'Parcial' },
  missed:   { c: 'var(--red)', bg: 'var(--red-100)', label: 'Perdido' },
  planned:  { c: 'var(--cinza-mineral)', bg: 'var(--creme-200)', label: 'Prescrito' },
};

export function ComplianceTag({ status = 'planned', label = null, showLabel = true, size = 'md', style = {}, ...rest }) {
  const m = MAP[status] || MAP.planned;
  const dot = size === 'sm' ? 8 : 10;
  if (!showLabel) {
    return <span title={m.label} style={{ width: dot, height: dot, borderRadius: 999, background: m.c, display: 'inline-block', flex: 'none', ...style }} {...rest} />;
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: size === 'sm' ? '3px 9px' : '4px 11px',
      borderRadius: 'var(--radius-pill)',
      background: m.bg, color: m.c,
      font: `700 ${size === 'sm' ? 11 : 12}px/1.2 var(--font-body)`,
      textTransform: 'uppercase', letterSpacing: '0.07em',
      ...style,
    }} {...rest}>
      <span style={{ width: dot, height: dot, borderRadius: 999, background: m.c, flex: 'none' }} />
      {label || m.label}
    </span>
  );
}
