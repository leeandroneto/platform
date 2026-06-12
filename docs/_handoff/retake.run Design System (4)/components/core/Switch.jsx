import React from 'react';

/**
 * retake.run — Switch
 * On/off toggle. Track fills terracotta when on; knob slides.
 */
export function Switch({ checked = false, onChange, disabled = false, size = 'md', style = {}, ...rest }) {
  const dims = size === 'sm' ? { w: 36, h: 20, k: 14 } : { w: 46, h: 26, k: 20 };
  const pad = (dims.h - dims.k) / 2;
  return (
    <button
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange && onChange(!checked)}
      style={{
        width: dims.w, height: dims.h, flex: 'none',
        borderRadius: 'var(--radius-pill)',
        border: 'none', padding: 0, cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? 'var(--terracota)' : 'var(--creme-300)',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
        transition: 'background var(--dur) var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      <span style={{
        position: 'absolute', top: pad,
        left: checked ? dims.w - dims.k - pad : pad,
        width: dims.k, height: dims.k, borderRadius: 999,
        background: 'var(--creme-50)', boxShadow: 'var(--shadow-100)',
        transition: 'left var(--dur) var(--ease-out)',
      }} />
    </button>
  );
}
