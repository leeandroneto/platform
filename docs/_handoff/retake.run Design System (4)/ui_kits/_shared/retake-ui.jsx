/* retake.run — shared UI primitives for the UI kits.
   Self-contained (no _ds_bundle.js dependency) so kits render & iterate
   in any preview and can be copied out as standalone HTML. Mirrors the
   authored design-system components in /components. Attaches to window.RT.
   Icons: Lucide (loaded via CDN in index.html). */

;(function () {
const { useState, useId, useLayoutEffect, useEffect } = React;

/* ---- Icon (Lucide, rendered as React-owned SVG) ------------ */
function Icon({ name, size = 20, color = 'currentColor', strokeWidth = 2, style = {} }) {
  const pascal = String(name).split('-').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join('');
  const L = window.lucide || {};
  const node = L[pascal] || (L.icons && L.icons[pascal]);
  const children = node ? node[2] : [];
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
    style: { display: 'inline-flex', flex: 'none', ...style },
  }, children.map((c, i) => React.createElement(c[0], { key: i, ...c[1] })));
}
/* kept for back-compat; no longer needed (icons render inline) */
function useLucide() {}

/* ---- Button ------------------------------------------------- */
function Button({ children, variant = 'primary', size = 'md', pill = false, arrow = false, iconLeft = null, disabled = false, onClick, style = {}, ...rest }) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const sizes = {
    sm: { padding: '0 14px', height: 34, font: '600 13px/1 var(--font-body)', gap: 7 },
    md: { padding: '0 20px', height: 44, font: '600 15px/1 var(--font-body)', gap: 9 },
    lg: { padding: '0 28px', height: 54, font: '700 17px/1 var(--font-body)', gap: 11 },
  };
  const s = sizes[size] || sizes.md;
  const pal = {
    primary: { base: { background: 'var(--terracota)', color: 'var(--creme)', border: '2px solid transparent' }, hover: { background: 'var(--terracota-600)' } },
    secondary: { base: { background: 'transparent', color: 'var(--grafite)', border: '2px solid var(--grafite)' }, hover: { background: 'rgba(29,29,27,0.06)' } },
    ghost: { base: { background: 'transparent', color: 'var(--text-body)', border: '2px solid transparent' }, hover: { background: 'var(--creme-200)' } },
    inverse: { base: { background: 'var(--creme)', color: 'var(--grafite-ink)', border: '2px solid transparent' }, hover: { background: '#fff' } },
    text: { base: { background: 'transparent', color: 'var(--terracota)', border: '2px solid transparent' }, hover: { color: 'var(--terracota-600)' } },
  }[variant] || {};
  return (
    <button type="button" disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
        height: s.height, padding: variant === 'text' ? '0 4px' : s.padding, font: s.font,
        textTransform: 'uppercase', letterSpacing: '0.04em',
        borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-8)',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, whiteSpace: 'nowrap',
        transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        transform: press && !disabled ? 'scale(0.98)' : 'scale(1)',
        ...pal.base, ...(hover && !disabled ? pal.hover : {}), ...style,
      }} {...rest}>
      {iconLeft}<span>{children}</span>{arrow && <span style={{ fontSize: '1.15em', marginLeft: 2 }}>→</span>}
    </button>
  );
}

/* ---- Badge -------------------------------------------------- */
function Badge({ children, tone = 'neutral', variant = 'soft', dot = false, pill = true, style = {} }) {
  const tones = {
    neutral: { c: 'var(--grafite)', bg: 'var(--creme-200)', line: 'var(--creme-300)' },
    accent: { c: 'var(--terracota-600)', bg: 'var(--terracota-100)', line: 'var(--terracota-300)' },
    ocean: { c: 'var(--azul-700)', bg: 'var(--azul-100)', line: 'var(--azul-300)' },
    success: { c: '#3C6E47', bg: 'var(--green-100)', line: '#Bcd6bf' },
    warning: { c: '#9A6E1E', bg: 'var(--amber-100)', line: '#E6CE94' },
    danger: { c: 'var(--red)', bg: 'var(--red-100)', line: '#E6B6a9' },
  };
  const t = tones[tone] || tones.neutral;
  const v = { soft: { color: t.c, background: t.bg, border: '1px solid transparent' }, solid: { color: 'var(--creme)', background: t.c, border: '1px solid transparent' }, outline: { color: t.c, background: 'transparent', border: `1px solid ${t.line}` } }[variant];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', font: '600 12px/1.3 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-4)', whiteSpace: 'nowrap', ...v, ...style }}>
      {dot && <span style={{ width: 7, height: 7, borderRadius: 999, background: variant === 'solid' ? 'var(--creme)' : t.c, flex: 'none' }} />}
      {children}
    </span>
  );
}

/* ---- Card --------------------------------------------------- */
function Card({ children, tone = 'light', elevation = 1, pad = 'var(--space-3)', radius = 'var(--radius-16)', interactive = false, onClick, style = {} }) {
  const [hover, setHover] = useState(false);
  const sh = { 0: 'none', 1: 'var(--shadow-100)', 2: 'var(--shadow-200)', 3: 'var(--shadow-300)' };
  const tones = {
    light: { background: 'var(--surface-card)', color: 'var(--text-body)', border: '1px solid var(--border-soft)' },
    sunken: { background: 'var(--surface-sunken)', color: 'var(--text-body)', border: '1px solid var(--border-strong)' },
    dark: { background: 'var(--surface-ink-2)', color: 'var(--text-on-dark)', border: '1px solid var(--border-on-dark)' },
  };
  return (
    <div onClick={onClick} onMouseEnter={() => interactive && setHover(true)} onMouseLeave={() => interactive && setHover(false)}
      style={{ borderRadius: radius, padding: pad, boxShadow: hover ? 'var(--shadow-200)' : sh[elevation], transform: hover ? 'translateY(-2px)' : 'none', transition: 'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)', cursor: interactive ? 'pointer' : 'default', ...(tones[tone] || tones.light), ...style }}>
      {children}
    </div>
  );
}

/* ---- Avatar ------------------------------------------------- */
function Avatar({ src = null, name = '', size = 40, ring = false, status = null, style = {} }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const sc = { online: 'var(--green)', paused: 'var(--amber)', risk: 'var(--red)' };
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flex: 'none', ...style }}>
      <span style={{ width: size, height: size, borderRadius: 'var(--radius-pill)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'var(--azul-300)', color: 'var(--grafite-ink)', font: `700 ${Math.round(size * 0.38)}px/1 var(--font-display)`, boxShadow: ring ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--terracota)' : 'none' }}>
        {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
      </span>
      {status && <span style={{ position: 'absolute', right: -1, bottom: -1, width: Math.max(8, size * 0.26), height: Math.max(8, size * 0.26), borderRadius: 999, background: sc[status] || 'var(--cinza-mineral)', border: '2px solid var(--surface-card)' }} />}
    </span>
  );
}

/* ---- Switch ------------------------------------------------- */
function Switch({ checked = false, onChange, disabled = false, size = 'md', style = {} }) {
  const d = size === 'sm' ? { w: 36, h: 20, k: 14 } : { w: 46, h: 26, k: 20 };
  const pad = (d.h - d.k) / 2;
  return (
    <button role="switch" aria-checked={checked} disabled={disabled} onClick={() => !disabled && onChange && onChange(!checked)}
      style={{ width: d.w, height: d.h, flex: 'none', borderRadius: 'var(--radius-pill)', border: 'none', padding: 0, cursor: disabled ? 'not-allowed' : 'pointer', background: checked ? 'var(--terracota)' : 'var(--creme-300)', opacity: disabled ? 0.5 : 1, position: 'relative', transition: 'background var(--dur) var(--ease-out)', ...style }}>
      <span style={{ position: 'absolute', top: pad, left: checked ? d.w - d.k - pad : pad, width: d.k, height: d.k, borderRadius: 999, background: 'var(--creme-50)', boxShadow: 'var(--shadow-100)', transition: 'left var(--dur) var(--ease-out)' }} />
    </button>
  );
}

/* ---- Input -------------------------------------------------- */
function Input({ label = null, hint = null, error = null, prefix = null, suffix = null, style = {}, ...rest }) {
  const [focus, setFocus] = useState(false);
  const id = useId();
  const bc = error ? 'var(--red)' : focus ? 'var(--terracota)' : 'var(--border-strong)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label htmlFor={id} style={{ font: '600 12px/1.2 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{label}</label>}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-card)', border: `1.5px solid ${bc}`, borderRadius: 'var(--radius-8)', padding: '0 14px', height: 46, boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none', transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)' }}>
        {prefix && <span style={{ color: 'var(--text-muted)', font: 'var(--body-sm)' }}>{prefix}</span>}
        <input id={id} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', font: 'var(--body)', color: 'var(--text-body)', minWidth: 0 }} {...rest} />
        {suffix && <span style={{ color: 'var(--text-muted)', font: 'var(--mono-sm)' }}>{suffix}</span>}
      </div>
      {(error || hint) && <span style={{ font: 'var(--caption)', color: error ? 'var(--red)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </div>
  );
}

/* ---- Tabs --------------------------------------------------- */
function Tabs({ items = [], value, onChange, style = {} }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--space-3)', borderBottom: '1px solid var(--border-soft)', ...style }}>
      {items.map((it) => {
        const a = it.id === value;
        return (
          <button key={it.id} onClick={() => onChange && onChange(it.id)}
            style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', padding: '0 0 12px', position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 14px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em', color: a ? 'var(--text-strong)' : 'var(--text-muted)', transition: 'color var(--dur) var(--ease-out)' }}>
            {it.label}
            {it.count != null && <span style={{ font: '700 11px/1 var(--font-mono)', color: a ? 'var(--terracota-600)' : 'var(--text-muted)', background: a ? 'var(--terracota-100)' : 'var(--creme-200)', borderRadius: 999, padding: '3px 7px' }}>{it.count}</span>}
            <span style={{ position: 'absolute', left: 0, right: 0, bottom: -1, height: 3, borderRadius: '3px 3px 0 0', background: a ? 'var(--terracota)' : 'transparent', transition: 'background var(--dur) var(--ease-out)' }} />
          </button>
        );
      })}
    </div>
  );
}

/* ---- StatCard ----------------------------------------------- */
function StatCard({ label, value, unit = null, delta = null, deltaSuffix = '%', caption = null, accent = false, tone = 'light', style = {} }) {
  const up = typeof delta === 'number' && delta >= 0;
  const dark = tone === 'dark';
  const dc = delta == null ? null : up ? 'var(--green)' : 'var(--red)';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 'var(--space-3)', background: dark ? 'var(--surface-ink-2)' : 'var(--surface-card)', border: `1px solid ${dark ? 'var(--border-on-dark)' : 'var(--border-soft)'}`, borderRadius: 'var(--radius-16)', boxShadow: dark ? 'none' : 'var(--shadow-100)', ...style }}>
      <span style={{ font: '600 12px/1.2 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ font: 'var(--metric-xl)', fontVariantNumeric: 'tabular-nums', color: accent ? 'var(--terracota)' : dark ? 'var(--text-on-dark)' : 'var(--text-strong)', lineHeight: 1 }}>{value}</span>
        {unit && <span style={{ font: 'var(--mono-sm)', color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)' }}>{unit}</span>}
      </div>
      {(delta != null || caption) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {delta != null && <span style={{ font: '700 13px/1 var(--font-mono)', color: dc, display: 'inline-flex', alignItems: 'center', gap: 3 }}><span>{up ? '▲' : '▼'}</span>{up ? '+' : ''}{delta}{deltaSuffix}</span>}
          {caption && <span style={{ font: 'var(--caption)', color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)' }}>{caption}</span>}
        </div>
      )}
    </div>
  );
}

/* ---- ComplianceTag ------------------------------------------ */
const COMPLIANCE = {
  done: { c: '#3C6E47', bg: 'var(--green-100)', label: 'Feito' },
  partial: { c: '#9A6E1E', bg: 'var(--amber-100)', label: 'Parcial' },
  missed: { c: 'var(--red)', bg: 'var(--red-100)', label: 'Perdido' },
  planned: { c: 'var(--cinza-mineral)', bg: 'var(--creme-200)', label: 'Prescrito' },
};
function ComplianceTag({ status = 'planned', label = null, showLabel = true, size = 'md', style = {} }) {
  const m = COMPLIANCE[status] || COMPLIANCE.planned;
  const dot = size === 'sm' ? 8 : 10;
  if (!showLabel) return <span title={m.label} style={{ width: dot, height: dot, borderRadius: 999, background: m.c, display: 'inline-block', flex: 'none', ...style }} />;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: size === 'sm' ? '3px 9px' : '4px 11px', borderRadius: 'var(--radius-pill)', background: m.bg, color: m.c, font: `700 ${size === 'sm' ? 11 : 12}px/1.2 var(--font-body)`, textTransform: 'uppercase', letterSpacing: '0.07em', ...style }}>
      <span style={{ width: dot, height: dot, borderRadius: 999, background: m.c, flex: 'none' }} />{label || m.label}
    </span>
  );
}

Object.assign(window, { RT: { Icon, useLucide, Button, Badge, Card, Avatar, Switch, Input, Tabs, StatCard, ComplianceTag } });
})();
