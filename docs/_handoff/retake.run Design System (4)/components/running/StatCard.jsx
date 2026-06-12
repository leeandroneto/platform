import React from 'react';

/**
 * retake.run — StatCard
 * Dashboard metric tile: uppercase label, big mono value, optional
 * delta vs previous period. The workhorse of the coach dashboard.
 */
export function StatCard({
  label,
  value,
  unit = null,
  delta = null,        // number, e.g. +11 or -3
  deltaSuffix = '%',
  caption = null,
  accent = false,      // terracotta value
  tone = 'light',
  style = {},
  ...rest
}) {
  const up = typeof delta === 'number' && delta >= 0;
  const dark = tone === 'dark';
  const deltaColor = delta == null ? null : up ? 'var(--green)' : 'var(--red)';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8,
      padding: 'var(--space-3)',
      background: dark ? 'var(--surface-ink-2)' : 'var(--surface-card)',
      border: `1px solid ${dark ? 'var(--border-on-dark)' : 'var(--border-soft)'}`,
      borderRadius: 'var(--radius-16)',
      boxShadow: dark ? 'none' : 'var(--shadow-100)',
      ...style,
    }} {...rest}>
      <span style={{
        font: '600 12px/1.2 var(--font-body)', textTransform: 'uppercase',
        letterSpacing: '0.1em', color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)',
      }}>{label}</span>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{
          font: 'var(--metric-xl)', fontVariantNumeric: 'tabular-nums',
          color: accent ? 'var(--terracota)' : dark ? 'var(--text-on-dark)' : 'var(--text-strong)',
          lineHeight: 1,
        }}>{value}</span>
        {unit && <span style={{ font: 'var(--mono-sm)', color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)' }}>{unit}</span>}
      </div>

      {(delta != null || caption) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {delta != null && (
            <span style={{
              font: '700 13px/1 var(--font-mono)', color: deltaColor,
              display: 'inline-flex', alignItems: 'center', gap: 3,
            }}>
              <span>{up ? '▲' : '▼'}</span>{up ? '+' : ''}{delta}{deltaSuffix}
            </span>
          )}
          {caption && <span style={{ font: 'var(--caption)', color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)' }}>{caption}</span>}
        </div>
      )}
    </div>
  );
}
