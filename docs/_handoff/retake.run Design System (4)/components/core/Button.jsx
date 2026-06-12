import React from 'react';

/**
 * retake.run — Button
 * Athletic, decisive. Primary = solid terracotta. Secondary = graphite
 * outline. Ghost = quiet. Hover steps darker; press shrinks slightly.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  arrow = false,
  iconLeft = null,
  disabled = false,
  onClick,
  type = 'button',
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const sizes = {
    sm: { padding: '0 14px', height: 34, font: '600 13px/1 var(--font-body)', gap: 7 },
    md: { padding: '0 20px', height: 44, font: '600 15px/1 var(--font-body)', gap: 9 },
    lg: { padding: '0 28px', height: 54, font: '700 17px/1 var(--font-body)', gap: 11 },
  };
  const s = sizes[size] || sizes.md;

  const palettes = {
    primary: {
      base: { background: 'var(--terracota)', color: 'var(--creme)', border: '2px solid transparent' },
      hover: { background: 'var(--terracota-600)' },
    },
    secondary: {
      base: { background: 'transparent', color: 'var(--grafite)', border: '2px solid var(--grafite)' },
      hover: { background: 'rgba(29,29,27,0.06)' },
    },
    ghost: {
      base: { background: 'transparent', color: 'var(--text-body)', border: '2px solid transparent' },
      hover: { background: 'var(--creme-200)' },
    },
    inverse: {
      base: { background: 'var(--creme)', color: 'var(--grafite-ink)', border: '2px solid transparent' },
      hover: { background: '#fff' },
    },
    text: {
      base: { background: 'transparent', color: 'var(--terracota)', border: '2px solid transparent', padding: '0 4px' },
      hover: { color: 'var(--terracota-600)' },
    },
  };
  const p = palettes[variant] || palettes.primary;

  const styled = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: variant === 'text' ? palettes.text.base.padding : s.padding,
    font: s.font,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
    borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-8)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
    transform: press && !disabled ? 'scale(0.98)' : 'scale(1)',
    whiteSpace: 'nowrap',
    ...p.base,
    ...(hover && !disabled ? p.hover : {}),
    ...style,
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={styled}
      {...rest}
    >
      {iconLeft}
      <span>{children}</span>
      {arrow && <span style={{ fontSize: '1.15em', marginLeft: 2 }}>→</span>}
    </button>
  );
}
