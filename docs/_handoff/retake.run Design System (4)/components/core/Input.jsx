import React from 'react';

/**
 * retake.run — Input
 * Text field with label, optional hint/error, and prefix/suffix.
 * Cream-50 surface, warm hairline, terracotta focus.
 */
export function Input({
  label = null,
  hint = null,
  error = null,
  prefix = null,
  suffix = null,
  id,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const reactId = React.useId();
  const inputId = id || reactId;
  const borderColor = error ? 'var(--red)' : focus ? 'var(--terracota)' : 'var(--border-strong)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label htmlFor={inputId} style={{
          font: '600 12px/1.2 var(--font-body)', textTransform: 'uppercase',
          letterSpacing: '0.1em', color: 'var(--text-muted)',
        }}>{label}</label>
      )}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'var(--surface-card)',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 'var(--radius-8)',
        padding: '0 14px', height: 46,
        boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
        transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
      }}>
        {prefix && <span style={{ color: 'var(--text-muted)', font: 'var(--body-sm)' }}>{prefix}</span>}
        <input
          id={inputId}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1, border: 'none', outline: 'none', background: 'transparent',
            font: 'var(--body)', color: 'var(--text-body)', minWidth: 0,
          }}
          {...rest}
        />
        {suffix && <span style={{ color: 'var(--text-muted)', font: 'var(--mono-sm)' }}>{suffix}</span>}
      </div>
      {(error || hint) && (
        <span style={{ font: 'var(--caption)', color: error ? 'var(--red)' : 'var(--text-muted)' }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}
