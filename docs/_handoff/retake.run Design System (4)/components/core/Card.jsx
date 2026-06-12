import React from 'react';

/**
 * retake.run — Card
 * Cream surface on cream page with a warm hairline + soft shadow.
 * `tone="dark"` flips to a graphite surface for dark sections.
 */
export function Card({
  children,
  tone = 'light',
  elevation = 1,
  pad = 'var(--space-3)',
  radius = 'var(--radius-16)',
  interactive = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const shadows = { 0: 'none', 1: 'var(--shadow-100)', 2: 'var(--shadow-200)', 3: 'var(--shadow-300)' };

  const tones = {
    light: { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-soft)' },
    sunken:{ background: 'var(--surface-sunken)', color: 'var(--text-body)', border: '1px solid var(--border-strong)' },
    dark:  { background: 'var(--surface-ink-2)', color: 'var(--text-on-dark)', border: '1px solid var(--border-on-dark)' },
  };
  const t = tones[tone] || tones.light;

  return (
    <div
      onMouseEnter={() => interactive && setHover(true)}
      onMouseLeave={() => interactive && setHover(false)}
      style={{
        borderRadius: radius,
        padding: pad,
        boxShadow: hover ? 'var(--shadow-200)' : shadows[elevation],
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default',
        ...t,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
