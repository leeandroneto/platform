import React from 'react';

/**
 * retake.run — Tabs
 * Underline tabs in display type. Active tab gets a terracotta underline.
 * `items`: [{ id, label, count? }]. Controlled via `value` + `onChange`.
 */
export function Tabs({ items = [], value, onChange, style = {} }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', borderBottom: '1px solid var(--border-soft)', ...style }}>
      {items.map((it) => {
        const active = it.id === value;
        return (
          <button
            key={it.id}
            onClick={() => onChange && onChange(it.id)}
            style={{
              appearance: 'none', border: 'none', background: 'transparent',
              cursor: 'pointer', padding: '0 0 12px', position: 'relative',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              font: '600 14px/1 var(--font-body)', textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: active ? 'var(--text-strong)' : 'var(--text-muted)',
              transition: 'color var(--dur) var(--ease-out)',
            }}
          >
            {it.label}
            {it.count != null && (
              <span style={{
                font: '700 11px/1 var(--font-mono)',
                color: active ? 'var(--terracota-600)' : 'var(--text-muted)',
                background: active ? 'var(--terracota-100)' : 'var(--creme-200)',
                borderRadius: 999, padding: '3px 7px',
              }}>{it.count}</span>
            )}
            <span style={{
              position: 'absolute', left: 0, right: 0, bottom: -1, height: 3,
              borderRadius: '3px 3px 0 0',
              background: active ? 'var(--terracota)' : 'transparent',
              transition: 'background var(--dur) var(--ease-out)',
            }} />
          </button>
        );
      })}
    </div>
  );
}
