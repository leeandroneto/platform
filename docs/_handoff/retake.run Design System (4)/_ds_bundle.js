/* @ds-bundle: {"format":3,"namespace":"RetakeRunDesignSystem_1be28c","components":[{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Switch","sourcePath":"components/core/Switch.jsx"},{"name":"Tabs","sourcePath":"components/core/Tabs.jsx"},{"name":"ComplianceTag","sourcePath":"components/running/ComplianceTag.jsx"},{"name":"StatCard","sourcePath":"components/running/StatCard.jsx"}],"sourceHashes":{"components/core/Avatar.jsx":"808b7f6c9a6b","components/core/Badge.jsx":"8e763e606ad6","components/core/Button.jsx":"175e4a2f902d","components/core/Card.jsx":"94af2874ea93","components/core/Input.jsx":"dab8e2a88fdd","components/core/Switch.jsx":"95004c9893f8","components/core/Tabs.jsx":"8fca8e0963ae","components/running/ComplianceTag.jsx":"38f0dbbb31c6","components/running/StatCard.jsx":"b53b10d27bc4","ui_kits/_shared/retake-ui.jsx":"d5f05295e347","ui_kits/admin/AdminScreens.jsx":"c362c2cd58ba","ui_kits/admin/AdminScreens2.jsx":"b6a15fef17f6","ui_kits/admin/AdminShell.jsx":"75e260be4df3","ui_kits/athlete-app/AppScreens.jsx":"93ceadd51c5d","ui_kits/athlete-app/AppScreens2.jsx":"3f60b2118e6d","ui_kits/athlete-app/ios-frame.jsx":"be3343be4b51","ui_kits/dashboard/AppShell.jsx":"6cd6935d73eb","ui_kits/dashboard/ComissoesScreen.jsx":"d04bdbd55f16","ui_kits/dashboard/DashboardExtra.jsx":"f326105f672a","ui_kits/dashboard/SiteScreen.jsx":"d22770c919a8","ui_kits/dashboard/screens.jsx":"27057a6dccee"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.RetakeRunDesignSystem_1be28c = window.RetakeRunDesignSystem_1be28c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * retake.run — Avatar
 * Round athlete/coach avatar. Photo or initials fallback. Optional
 * status ring (terracotta) and online dot.
 */
function Avatar({
  src = null,
  name = '',
  size = 40,
  ring = false,
  status = null,
  // 'online' | 'paused' | null
  style = {},
  ...rest
}) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const statusColors = {
    online: 'var(--green)',
    paused: 'var(--amber)',
    risk: 'var(--red)'
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      position: 'relative',
      display: 'inline-flex',
      flex: 'none',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      borderRadius: 'var(--radius-pill)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'var(--azul-300)',
      color: 'var(--grafite-ink)',
      font: `700 ${Math.round(size * 0.38)}px/1 var(--font-display)`,
      letterSpacing: '0.02em',
      boxShadow: ring ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--terracota)' : 'none'
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials), status && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: -1,
      bottom: -1,
      width: Math.max(8, size * 0.26),
      height: Math.max(8, size * 0.26),
      borderRadius: 999,
      background: statusColors[status] || 'var(--cinza-mineral)',
      border: '2px solid var(--surface-card)'
    }
  }));
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * retake.run — Badge / Tag
 * Small status or category label. Soft (tinted), solid, or outline.
 * Default pill shape (track flavor). Tones stay in brand temperature.
 */
function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  dot = false,
  pill = true,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      c: 'var(--grafite)',
      bg: 'var(--creme-200)',
      line: 'var(--creme-300)'
    },
    accent: {
      c: 'var(--terracota-600)',
      bg: 'var(--terracota-100)',
      line: 'var(--terracota-300)'
    },
    ocean: {
      c: 'var(--azul-700)',
      bg: 'var(--azul-100)',
      line: 'var(--azul-300)'
    },
    success: {
      c: '#3C6E47',
      bg: 'var(--green-100)',
      line: '#Bcd6bf'
    },
    warning: {
      c: '#9A6E1E',
      bg: 'var(--amber-100)',
      line: '#E6CE94'
    },
    danger: {
      c: 'var(--red)',
      bg: 'var(--red-100)',
      line: '#E6B6a9'
    }
  };
  const t = tones[tone] || tones.neutral;
  const variants = {
    soft: {
      color: t.c,
      background: t.bg,
      border: '1px solid transparent'
    },
    solid: {
      color: 'var(--creme)',
      background: t.c,
      border: '1px solid transparent'
    },
    outline: {
      color: t.c,
      background: 'transparent',
      border: `1px solid ${t.line}`
    }
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
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
      ...style
    }
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: variant === 'solid' ? 'var(--creme)' : t.c,
      flex: 'none'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * retake.run — Button
 * Athletic, decisive. Primary = solid terracotta. Secondary = graphite
 * outline. Ghost = quiet. Hover steps darker; press shrinks slightly.
 */
function Button({
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
    sm: {
      padding: '0 14px',
      height: 34,
      font: '600 13px/1 var(--font-body)',
      gap: 7
    },
    md: {
      padding: '0 20px',
      height: 44,
      font: '600 15px/1 var(--font-body)',
      gap: 9
    },
    lg: {
      padding: '0 28px',
      height: 54,
      font: '700 17px/1 var(--font-body)',
      gap: 11
    }
  };
  const s = sizes[size] || sizes.md;
  const palettes = {
    primary: {
      base: {
        background: 'var(--terracota)',
        color: 'var(--creme)',
        border: '2px solid transparent'
      },
      hover: {
        background: 'var(--terracota-600)'
      }
    },
    secondary: {
      base: {
        background: 'transparent',
        color: 'var(--grafite)',
        border: '2px solid var(--grafite)'
      },
      hover: {
        background: 'rgba(29,29,27,0.06)'
      }
    },
    ghost: {
      base: {
        background: 'transparent',
        color: 'var(--text-body)',
        border: '2px solid transparent'
      },
      hover: {
        background: 'var(--creme-200)'
      }
    },
    inverse: {
      base: {
        background: 'var(--creme)',
        color: 'var(--grafite-ink)',
        border: '2px solid transparent'
      },
      hover: {
        background: '#fff'
      }
    },
    text: {
      base: {
        background: 'transparent',
        color: 'var(--terracota)',
        border: '2px solid transparent',
        padding: '0 4px'
      },
      hover: {
        color: 'var(--terracota-600)'
      }
    }
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
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPress(false);
    },
    onMouseDown: () => setPress(true),
    onMouseUp: () => setPress(false),
    style: styled
  }, rest), iconLeft, /*#__PURE__*/React.createElement("span", null, children), arrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '1.15em',
      marginLeft: 2
    }
  }, "\u2192"));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * retake.run — Card
 * Cream surface on cream page with a warm hairline + soft shadow.
 * `tone="dark"` flips to a graphite surface for dark sections.
 */
function Card({
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
  const shadows = {
    0: 'none',
    1: 'var(--shadow-100)',
    2: 'var(--shadow-200)',
    3: 'var(--shadow-300)'
  };
  const tones = {
    light: {
      background: 'var(--surface-card)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-soft)'
    },
    sunken: {
      background: 'var(--surface-sunken)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-strong)'
    },
    dark: {
      background: 'var(--surface-ink-2)',
      color: 'var(--text-on-dark)',
      border: '1px solid var(--border-on-dark)'
    }
  };
  const t = tones[tone] || tones.light;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => interactive && setHover(true),
    onMouseLeave: () => interactive && setHover(false),
    style: {
      borderRadius: radius,
      padding: pad,
      boxShadow: hover ? 'var(--shadow-200)' : shadows[elevation],
      transform: hover ? 'translateY(-2px)' : 'none',
      transition: 'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
      cursor: interactive ? 'pointer' : 'default',
      ...t,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * retake.run — Input
 * Text field with label, optional hint/error, and prefix/suffix.
 * Cream-50 surface, warm hairline, terracotta focus.
 */
function Input({
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
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      font: '600 12px/1.2 var(--font-body)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: 'var(--surface-card)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-8)',
      padding: '0 14px',
      height: 46,
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)'
    }
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      font: 'var(--body-sm)'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: 'var(--body)',
      color: 'var(--text-body)',
      minWidth: 0
    }
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      font: 'var(--mono-sm)'
    }
  }, suffix)), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--caption)',
      color: error ? 'var(--red)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * retake.run — Switch
 * On/off toggle. Track fills terracotta when on; knob slides.
 */
function Switch({
  checked = false,
  onChange,
  disabled = false,
  size = 'md',
  style = {},
  ...rest
}) {
  const dims = size === 'sm' ? {
    w: 36,
    h: 20,
    k: 14
  } : {
    w: 46,
    h: 26,
    k: 20
  };
  const pad = (dims.h - dims.k) / 2;
  return /*#__PURE__*/React.createElement("button", _extends({
    role: "switch",
    "aria-checked": checked,
    disabled: disabled,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: dims.w,
      height: dims.h,
      flex: 'none',
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      padding: 0,
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: checked ? 'var(--terracota)' : 'var(--creme-300)',
      opacity: disabled ? 0.5 : 1,
      position: 'relative',
      transition: 'background var(--dur) var(--ease-out)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: pad,
      left: checked ? dims.w - dims.k - pad : pad,
      width: dims.k,
      height: dims.k,
      borderRadius: 999,
      background: 'var(--creme-50)',
      boxShadow: 'var(--shadow-100)',
      transition: 'left var(--dur) var(--ease-out)'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Switch.jsx", error: String((e && e.message) || e) }); }

// components/core/Tabs.jsx
try { (() => {
/**
 * retake.run — Tabs
 * Underline tabs in display type. Active tab gets a terracotta underline.
 * `items`: [{ id, label, count? }]. Controlled via `value` + `onChange`.
 */
function Tabs({
  items = [],
  value,
  onChange,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      borderBottom: '1px solid var(--border-soft)',
      ...style
    }
  }, items.map(it => {
    const active = it.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => onChange && onChange(it.id),
      style: {
        appearance: 'none',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '0 0 12px',
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        font: '600 14px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: active ? 'var(--text-strong)' : 'var(--text-muted)',
        transition: 'color var(--dur) var(--ease-out)'
      }
    }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 11px/1 var(--font-mono)',
        color: active ? 'var(--terracota-600)' : 'var(--text-muted)',
        background: active ? 'var(--terracota-100)' : 'var(--creme-200)',
        borderRadius: 999,
        padding: '3px 7px'
      }
    }, it.count), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1,
        height: 3,
        borderRadius: '3px 3px 0 0',
        background: active ? 'var(--terracota)' : 'transparent',
        transition: 'background var(--dur) var(--ease-out)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/running/ComplianceTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * retake.run — ComplianceTag
 * The prescribed-vs-executed signal (§6.4). Green = done as prescribed,
 * amber = partial, red = missed, neutral = upcoming/prescribed.
 */
const MAP = {
  done: {
    c: '#3C6E47',
    bg: 'var(--green-100)',
    label: 'Feito'
  },
  partial: {
    c: '#9A6E1E',
    bg: 'var(--amber-100)',
    label: 'Parcial'
  },
  missed: {
    c: 'var(--red)',
    bg: 'var(--red-100)',
    label: 'Perdido'
  },
  planned: {
    c: 'var(--cinza-mineral)',
    bg: 'var(--creme-200)',
    label: 'Prescrito'
  }
};
function ComplianceTag({
  status = 'planned',
  label = null,
  showLabel = true,
  size = 'md',
  style = {},
  ...rest
}) {
  const m = MAP[status] || MAP.planned;
  const dot = size === 'sm' ? 8 : 10;
  if (!showLabel) {
    return /*#__PURE__*/React.createElement("span", _extends({
      title: m.label,
      style: {
        width: dot,
        height: dot,
        borderRadius: 999,
        background: m.c,
        display: 'inline-block',
        flex: 'none',
        ...style
      }
    }, rest));
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      padding: size === 'sm' ? '3px 9px' : '4px 11px',
      borderRadius: 'var(--radius-pill)',
      background: m.bg,
      color: m.c,
      font: `700 ${size === 'sm' ? 11 : 12}px/1.2 var(--font-body)`,
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: dot,
      height: dot,
      borderRadius: 999,
      background: m.c,
      flex: 'none'
    }
  }), label || m.label);
}
Object.assign(__ds_scope, { ComplianceTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/running/ComplianceTag.jsx", error: String((e && e.message) || e) }); }

// components/running/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * retake.run — StatCard
 * Dashboard metric tile: uppercase label, big mono value, optional
 * delta vs previous period. The workhorse of the coach dashboard.
 */
function StatCard({
  label,
  value,
  unit = null,
  delta = null,
  // number, e.g. +11 or -3
  deltaSuffix = '%',
  caption = null,
  accent = false,
  // terracotta value
  tone = 'light',
  style = {},
  ...rest
}) {
  const up = typeof delta === 'number' && delta >= 0;
  const dark = tone === 'dark';
  const deltaColor = delta == null ? null : up ? 'var(--green)' : 'var(--red)';
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 'var(--space-3)',
      background: dark ? 'var(--surface-ink-2)' : 'var(--surface-card)',
      border: `1px solid ${dark ? 'var(--border-on-dark)' : 'var(--border-soft)'}`,
      borderRadius: 'var(--radius-16)',
      boxShadow: dark ? 'none' : 'var(--shadow-100)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 12px/1.2 var(--font-body)',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--metric-xl)',
      fontVariantNumeric: 'tabular-nums',
      color: accent ? 'var(--terracota)' : dark ? 'var(--text-on-dark)' : 'var(--text-strong)',
      lineHeight: 1
    }
  }, value), unit && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--mono-sm)',
      color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
    }
  }, unit)), (delta != null || caption) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, delta != null && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 13px/1 var(--font-mono)',
      color: deltaColor,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", null, up ? '▲' : '▼'), up ? '+' : '', delta, deltaSuffix), caption && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--caption)',
      color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
    }
  }, caption)));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/running/StatCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/_shared/retake-ui.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* retake.run — shared UI primitives for the UI kits.
   Self-contained (no _ds_bundle.js dependency) so kits render & iterate
   in any preview and can be copied out as standalone HTML. Mirrors the
   authored design-system components in /components. Attaches to window.RT.
   Icons: Lucide (loaded via CDN in index.html). */

;
(function () {
  const {
    useState,
    useId,
    useLayoutEffect,
    useEffect
  } = React;

  /* ---- Icon (Lucide, rendered as React-owned SVG) ------------ */
  function Icon({
    name,
    size = 20,
    color = 'currentColor',
    strokeWidth = 2,
    style = {}
  }) {
    const pascal = String(name).split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    const L = window.lucide || {};
    const node = L[pascal] || L.icons && L.icons[pascal];
    const children = node ? node[2] : [];
    return React.createElement('svg', {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: color,
      strokeWidth,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style: {
        display: 'inline-flex',
        flex: 'none',
        ...style
      }
    }, children.map((c, i) => React.createElement(c[0], {
      key: i,
      ...c[1]
    })));
  }
  /* kept for back-compat; no longer needed (icons render inline) */
  function useLucide() {}

  /* ---- Button ------------------------------------------------- */
  function Button({
    children,
    variant = 'primary',
    size = 'md',
    pill = false,
    arrow = false,
    iconLeft = null,
    disabled = false,
    onClick,
    style = {},
    ...rest
  }) {
    const [hover, setHover] = useState(false);
    const [press, setPress] = useState(false);
    const sizes = {
      sm: {
        padding: '0 14px',
        height: 34,
        font: '600 13px/1 var(--font-body)',
        gap: 7
      },
      md: {
        padding: '0 20px',
        height: 44,
        font: '600 15px/1 var(--font-body)',
        gap: 9
      },
      lg: {
        padding: '0 28px',
        height: 54,
        font: '700 17px/1 var(--font-body)',
        gap: 11
      }
    };
    const s = sizes[size] || sizes.md;
    const pal = {
      primary: {
        base: {
          background: 'var(--terracota)',
          color: 'var(--creme)',
          border: '2px solid transparent'
        },
        hover: {
          background: 'var(--terracota-600)'
        }
      },
      secondary: {
        base: {
          background: 'transparent',
          color: 'var(--grafite)',
          border: '2px solid var(--grafite)'
        },
        hover: {
          background: 'rgba(29,29,27,0.06)'
        }
      },
      ghost: {
        base: {
          background: 'transparent',
          color: 'var(--text-body)',
          border: '2px solid transparent'
        },
        hover: {
          background: 'var(--creme-200)'
        }
      },
      inverse: {
        base: {
          background: 'var(--creme)',
          color: 'var(--grafite-ink)',
          border: '2px solid transparent'
        },
        hover: {
          background: '#fff'
        }
      },
      text: {
        base: {
          background: 'transparent',
          color: 'var(--terracota)',
          border: '2px solid transparent'
        },
        hover: {
          color: 'var(--terracota-600)'
        }
      }
    }[variant] || {};
    return /*#__PURE__*/React.createElement("button", _extends({
      type: "button",
      disabled: disabled,
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => {
        setHover(false);
        setPress(false);
      },
      onMouseDown: () => setPress(true),
      onMouseUp: () => setPress(false),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        height: s.height,
        padding: variant === 'text' ? '0 4px' : s.padding,
        font: s.font,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-8)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        whiteSpace: 'nowrap',
        transition: 'background var(--dur) var(--ease-out), color var(--dur) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        transform: press && !disabled ? 'scale(0.98)' : 'scale(1)',
        ...pal.base,
        ...(hover && !disabled ? pal.hover : {}),
        ...style
      }
    }, rest), iconLeft, /*#__PURE__*/React.createElement("span", null, children), arrow && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '1.15em',
        marginLeft: 2
      }
    }, "\u2192"));
  }

  /* ---- Badge -------------------------------------------------- */
  function Badge({
    children,
    tone = 'neutral',
    variant = 'soft',
    dot = false,
    pill = true,
    style = {}
  }) {
    const tones = {
      neutral: {
        c: 'var(--grafite)',
        bg: 'var(--creme-200)',
        line: 'var(--creme-300)'
      },
      accent: {
        c: 'var(--terracota-600)',
        bg: 'var(--terracota-100)',
        line: 'var(--terracota-300)'
      },
      ocean: {
        c: 'var(--azul-700)',
        bg: 'var(--azul-100)',
        line: 'var(--azul-300)'
      },
      success: {
        c: '#3C6E47',
        bg: 'var(--green-100)',
        line: '#Bcd6bf'
      },
      warning: {
        c: '#9A6E1E',
        bg: 'var(--amber-100)',
        line: '#E6CE94'
      },
      danger: {
        c: 'var(--red)',
        bg: 'var(--red-100)',
        line: '#E6B6a9'
      }
    };
    const t = tones[tone] || tones.neutral;
    const v = {
      soft: {
        color: t.c,
        background: t.bg,
        border: '1px solid transparent'
      },
      solid: {
        color: 'var(--creme)',
        background: t.c,
        border: '1px solid transparent'
      },
      outline: {
        color: t.c,
        background: 'transparent',
        border: `1px solid ${t.line}`
      }
    }[variant];
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 10px',
        font: '600 12px/1.3 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-4)',
        whiteSpace: 'nowrap',
        ...v,
        ...style
      }
    }, dot && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 999,
        background: variant === 'solid' ? 'var(--creme)' : t.c,
        flex: 'none'
      }
    }), children);
  }

  /* ---- Card --------------------------------------------------- */
  function Card({
    children,
    tone = 'light',
    elevation = 1,
    pad = 'var(--space-3)',
    radius = 'var(--radius-16)',
    interactive = false,
    onClick,
    style = {}
  }) {
    const [hover, setHover] = useState(false);
    const sh = {
      0: 'none',
      1: 'var(--shadow-100)',
      2: 'var(--shadow-200)',
      3: 'var(--shadow-300)'
    };
    const tones = {
      light: {
        background: 'var(--surface-card)',
        color: 'var(--text-body)',
        border: '1px solid var(--border-soft)'
      },
      sunken: {
        background: 'var(--surface-sunken)',
        color: 'var(--text-body)',
        border: '1px solid var(--border-strong)'
      },
      dark: {
        background: 'var(--surface-ink-2)',
        color: 'var(--text-on-dark)',
        border: '1px solid var(--border-on-dark)'
      }
    };
    return /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      onMouseEnter: () => interactive && setHover(true),
      onMouseLeave: () => interactive && setHover(false),
      style: {
        borderRadius: radius,
        padding: pad,
        boxShadow: hover ? 'var(--shadow-200)' : sh[elevation],
        transform: hover ? 'translateY(-2px)' : 'none',
        transition: 'transform var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)',
        cursor: interactive ? 'pointer' : 'default',
        ...(tones[tone] || tones.light),
        ...style
      }
    }, children);
  }

  /* ---- Avatar ------------------------------------------------- */
  function Avatar({
    src = null,
    name = '',
    size = 40,
    ring = false,
    status = null,
    style = {}
  }) {
    const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
    const sc = {
      online: 'var(--green)',
      paused: 'var(--amber)',
      risk: 'var(--red)'
    };
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-flex',
        flex: 'none',
        ...style
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: size,
        height: size,
        borderRadius: 'var(--radius-pill)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--azul-300)',
        color: 'var(--grafite-ink)',
        font: `700 ${Math.round(size * 0.38)}px/1 var(--font-display)`,
        boxShadow: ring ? '0 0 0 2px var(--surface-card), 0 0 0 4px var(--terracota)' : 'none'
      }
    }, src ? /*#__PURE__*/React.createElement("img", {
      src: src,
      alt: name,
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }
    }) : initials), status && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        right: -1,
        bottom: -1,
        width: Math.max(8, size * 0.26),
        height: Math.max(8, size * 0.26),
        borderRadius: 999,
        background: sc[status] || 'var(--cinza-mineral)',
        border: '2px solid var(--surface-card)'
      }
    }));
  }

  /* ---- Switch ------------------------------------------------- */
  function Switch({
    checked = false,
    onChange,
    disabled = false,
    size = 'md',
    style = {}
  }) {
    const d = size === 'sm' ? {
      w: 36,
      h: 20,
      k: 14
    } : {
      w: 46,
      h: 26,
      k: 20
    };
    const pad = (d.h - d.k) / 2;
    return /*#__PURE__*/React.createElement("button", {
      role: "switch",
      "aria-checked": checked,
      disabled: disabled,
      onClick: () => !disabled && onChange && onChange(!checked),
      style: {
        width: d.w,
        height: d.h,
        flex: 'none',
        borderRadius: 'var(--radius-pill)',
        border: 'none',
        padding: 0,
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: checked ? 'var(--terracota)' : 'var(--creme-300)',
        opacity: disabled ? 0.5 : 1,
        position: 'relative',
        transition: 'background var(--dur) var(--ease-out)',
        ...style
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: pad,
        left: checked ? d.w - d.k - pad : pad,
        width: d.k,
        height: d.k,
        borderRadius: 999,
        background: 'var(--creme-50)',
        boxShadow: 'var(--shadow-100)',
        transition: 'left var(--dur) var(--ease-out)'
      }
    }));
  }

  /* ---- Input -------------------------------------------------- */
  function Input({
    label = null,
    hint = null,
    error = null,
    prefix = null,
    suffix = null,
    style = {},
    ...rest
  }) {
    const [focus, setFocus] = useState(false);
    const id = useId();
    const bc = error ? 'var(--red)' : focus ? 'var(--terracota)' : 'var(--border-strong)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        ...style
      }
    }, label && /*#__PURE__*/React.createElement("label", {
      htmlFor: id,
      style: {
        font: '600 12px/1.2 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-muted)'
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--surface-card)',
        border: `1.5px solid ${bc}`,
        borderRadius: 'var(--radius-8)',
        padding: '0 14px',
        height: 46,
        boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
        transition: 'border-color var(--dur) var(--ease-out), box-shadow var(--dur) var(--ease-out)'
      }
    }, prefix && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        font: 'var(--body-sm)'
      }
    }, prefix), /*#__PURE__*/React.createElement("input", _extends({
      id: id,
      onFocus: () => setFocus(true),
      onBlur: () => setFocus(false),
      style: {
        flex: 1,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        font: 'var(--body)',
        color: 'var(--text-body)',
        minWidth: 0
      }
    }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        font: 'var(--mono-sm)'
      }
    }, suffix)), (error || hint) && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: error ? 'var(--red)' : 'var(--text-muted)'
      }
    }, error || hint));
  }

  /* ---- Tabs --------------------------------------------------- */
  function Tabs({
    items = [],
    value,
    onChange,
    style = {}
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 'var(--space-3)',
        borderBottom: '1px solid var(--border-soft)',
        ...style
      }
    }, items.map(it => {
      const a = it.id === value;
      return /*#__PURE__*/React.createElement("button", {
        key: it.id,
        onClick: () => onChange && onChange(it.id),
        style: {
          appearance: 'none',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          padding: '0 0 12px',
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          font: '600 14px/1 var(--font-body)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: a ? 'var(--text-strong)' : 'var(--text-muted)',
          transition: 'color var(--dur) var(--ease-out)'
        }
      }, it.label, it.count != null && /*#__PURE__*/React.createElement("span", {
        style: {
          font: '700 11px/1 var(--font-mono)',
          color: a ? 'var(--terracota-600)' : 'var(--text-muted)',
          background: a ? 'var(--terracota-100)' : 'var(--creme-200)',
          borderRadius: 999,
          padding: '3px 7px'
        }
      }, it.count), /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: -1,
          height: 3,
          borderRadius: '3px 3px 0 0',
          background: a ? 'var(--terracota)' : 'transparent',
          transition: 'background var(--dur) var(--ease-out)'
        }
      }));
    }));
  }

  /* ---- StatCard ----------------------------------------------- */
  function StatCard({
    label,
    value,
    unit = null,
    delta = null,
    deltaSuffix = '%',
    caption = null,
    accent = false,
    tone = 'light',
    style = {}
  }) {
    const up = typeof delta === 'number' && delta >= 0;
    const dark = tone === 'dark';
    const dc = delta == null ? null : up ? 'var(--green)' : 'var(--red)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 'var(--space-3)',
        background: dark ? 'var(--surface-ink-2)' : 'var(--surface-card)',
        border: `1px solid ${dark ? 'var(--border-on-dark)' : 'var(--border-soft)'}`,
        borderRadius: 'var(--radius-16)',
        boxShadow: dark ? 'none' : 'var(--shadow-100)',
        ...style
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 12px/1.2 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--metric-xl)',
        fontVariantNumeric: 'tabular-nums',
        color: accent ? 'var(--terracota)' : dark ? 'var(--text-on-dark)' : 'var(--text-strong)',
        lineHeight: 1
      }
    }, value), unit && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
      }
    }, unit)), (delta != null || caption) && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, delta != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 13px/1 var(--font-mono)',
        color: dc,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", null, up ? '▲' : '▼'), up ? '+' : '', delta, deltaSuffix), caption && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: dark ? 'var(--text-on-dark-muted)' : 'var(--text-muted)'
      }
    }, caption)));
  }

  /* ---- ComplianceTag ------------------------------------------ */
  const COMPLIANCE = {
    done: {
      c: '#3C6E47',
      bg: 'var(--green-100)',
      label: 'Feito'
    },
    partial: {
      c: '#9A6E1E',
      bg: 'var(--amber-100)',
      label: 'Parcial'
    },
    missed: {
      c: 'var(--red)',
      bg: 'var(--red-100)',
      label: 'Perdido'
    },
    planned: {
      c: 'var(--cinza-mineral)',
      bg: 'var(--creme-200)',
      label: 'Prescrito'
    }
  };
  function ComplianceTag({
    status = 'planned',
    label = null,
    showLabel = true,
    size = 'md',
    style = {}
  }) {
    const m = COMPLIANCE[status] || COMPLIANCE.planned;
    const dot = size === 'sm' ? 8 : 10;
    if (!showLabel) return /*#__PURE__*/React.createElement("span", {
      title: m.label,
      style: {
        width: dot,
        height: dot,
        borderRadius: 999,
        background: m.c,
        display: 'inline-block',
        flex: 'none',
        ...style
      }
    });
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: size === 'sm' ? '3px 9px' : '4px 11px',
        borderRadius: 'var(--radius-pill)',
        background: m.bg,
        color: m.c,
        font: `700 ${size === 'sm' ? 11 : 12}px/1.2 var(--font-body)`,
        textTransform: 'uppercase',
        letterSpacing: '0.07em',
        ...style
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: dot,
        height: dot,
        borderRadius: 999,
        background: m.c,
        flex: 'none'
      }
    }), label || m.label);
  }
  Object.assign(window, {
    RT: {
      Icon,
      useLucide,
      Button,
      Badge,
      Card,
      Avatar,
      Switch,
      Input,
      Tabs,
      StatCard,
      ComplianceTag
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/_shared/retake-ui.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminScreens.jsx
try { (() => {
/* Admin screens — part 1: Overview, Tenants, Approvals. Attaches to window.RTADM. */
;
(function () {
  const {
    Card,
    StatCard,
    Badge,
    Avatar,
    Button,
    Tabs,
    Input,
    Icon
  } = window.RT;
  const {
    useState
  } = React;
  const wrap = {
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 18
  };
  const rowHead = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
    flexWrap: 'wrap'
  };
  const th = {
    font: '600 11px/1.2 var(--font-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    textAlign: 'left',
    padding: '0 16px 10px',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: '14px 16px',
    borderTop: '1px solid var(--border-soft)',
    font: 'var(--body-sm)',
    color: 'var(--text-body)',
    verticalAlign: 'middle'
  };
  const mono = {
    font: '700 13px/1 var(--font-mono)',
    color: 'var(--text-strong)',
    fontVariantNumeric: 'tabular-nums'
  };
  function SectionTitle({
    children,
    n
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: rowHead
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--h2)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, children), n && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-muted)'
      }
    }, n));
  }

  /* ============================ OVERVIEW ============================ */
  function OverviewScreen() {
    const queue = [{
      icon: 'shield-check',
      label: 'Aprovações pendentes',
      n: 7,
      sub: '4 patrocinadores · 3 fornecedores',
      tone: 'accent',
      to: 'approvals'
    }, {
      icon: 'calendar-check',
      label: 'Eventos na fila',
      n: 12,
      sub: '9 sugeridos · 3 reivindicações',
      tone: 'ocean',
      to: 'events'
    }, {
      icon: 'shield-alert',
      label: 'Sinais de abuso',
      n: 5,
      sub: '3 sites ociosos · 2 denúncias',
      tone: 'warning',
      to: 'quality'
    }, {
      icon: 'wallet',
      label: 'Cobranças vencidas',
      n: 3,
      sub: 'R$ 1.737 em atraso',
      tone: 'danger',
      to: 'billing'
    }];
    const activity = [['shield-check', 'Pacefuel Nutrition aprovada como Patrocinador Nacional', 'há 12 min', 'accent'], ['building-2', 'Novo tenant: Movimento BH · plano Apoiador', 'há 1 h', 'ocean'], ['calendar-check', 'Evento "Night Run Salvador" publicado no calendário', 'há 2 h', 'neutral'], ['shield-alert', 'Site "retake.run/coralrun" marcado como ocioso (62 dias)', 'há 3 h', 'warning'], ['wallet', 'Fatura paga: Stride Wear · R$ 200', 'há 5 h', 'accent']];
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "MRR da rede",
      value: "9,4",
      unit: "mil R$",
      delta: 11,
      caption: "vs maio",
      accent: true
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Tenants ativos",
      value: "86",
      delta: 6,
      caption: "+5 no m\xEAs"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Sites publicados",
      value: "74",
      caption: "38 gr\xE1tis \xB7 36 pago"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Impress\xF5es/m\xEAs",
      value: "1,9",
      unit: "mi",
      delta: 14,
      caption: "faixa de marcas"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "GMV marketplace",
      value: "212",
      unit: "mil R$",
      delta: -3,
      caption: "loja dos clubes"
    })), /*#__PURE__*/React.createElement(SectionTitle, null, "Fila de trabalho"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12
      }
    }, queue.map(q => /*#__PURE__*/React.createElement(Card, {
      key: q.label,
      interactive: true,
      pad: "18px",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 'var(--radius-8)',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--creme-200)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: q.icon,
      size: 20,
      color: "var(--grafite)"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 30px/1 var(--font-display)',
        color: 'var(--text-strong)'
      }
    }, q.n)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, q.label), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)',
        marginTop: 2
      }
    }, q.sub)), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm",
      style: {
        alignSelf: 'flex-start',
        padding: 0
      }
    }, "Abrir fila \u2192")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 18,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 22px 12px',
        borderBottom: '1px solid var(--border-soft)',
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, "Atividade recente"), /*#__PURE__*/React.createElement("div", null, activity.map(([ic, txt, when, tone], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 22px',
        borderTop: i ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: tone,
      variant: "soft",
      style: {
        width: 30,
        height: 30,
        padding: 0,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 15
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, txt), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)',
        whiteSpace: 'nowrap'
      }
    }, when))))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 22px 12px',
        borderBottom: '1px solid var(--border-soft)',
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, "Top patrocinadores \xB7 receita"), [['Pacefuel Nutrition', 'Oficial · nutrição', 'R$ 1.200', 1], ['GPSRun Tech', 'Nacional', 'R$ 500', 0.42], ['Stride Wear', 'Estadual · 2 UF', 'R$ 200', 0.17], ['Z2 Suplementos', 'Estadual', 'R$ 100', 0.08]].map(([n, t, v, w], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        padding: '12px 22px',
        borderTop: i ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13.5px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: mono
    }, v)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        maxWidth: 120,
        height: 5,
        borderRadius: 999,
        background: 'var(--creme-200)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        height: '100%',
        width: w * 100 + '%',
        background: 'var(--terracota)'
      }
    }))))))));
  }

  /* ============================ TENANTS ============================ */
  function TenantsScreen() {
    const [tab, setTab] = useState('all');
    const rows = [{
      name: 'Acelera Run Club',
      city: 'Rio de Janeiro · RJ',
      plan: 'Membro',
      site: 'pago',
      status: 'active',
      ath: 1245,
      mrr: '59',
      last: 'hoje'
    }, {
      name: 'Pace Club',
      city: 'São Paulo · SP',
      plan: 'Membro',
      site: 'pago',
      status: 'active',
      ath: 980,
      mrr: '59',
      last: 'hoje'
    }, {
      name: 'Movimento BH',
      city: 'Belo Horizonte · MG',
      plan: 'Apoiador',
      site: 'pago',
      status: 'active',
      ath: 412,
      mrr: '29',
      last: 'ontem'
    }, {
      name: 'Equipe Maré',
      city: 'Rio de Janeiro · RJ',
      plan: 'Grátis',
      site: 'grátis',
      status: 'active',
      ath: 86,
      mrr: '0',
      last: '3 dias'
    }, {
      name: 'Curitiba Run',
      city: 'Curitiba · PR',
      plan: 'Grátis',
      site: 'grátis',
      status: 'idle',
      ath: 54,
      mrr: '0',
      last: '62 dias'
    }, {
      name: 'Coral Run',
      city: 'Recife · PE',
      plan: 'Grátis',
      site: 'grátis',
      status: 'idle',
      ath: 31,
      mrr: '0',
      last: '74 dias'
    }, {
      name: 'Sul Endurance',
      city: 'Porto Alegre · RS',
      plan: 'Apoiador',
      site: 'pago',
      status: 'suspended',
      ath: 220,
      mrr: '29',
      last: '12 dias'
    }];
    const filt = rows.filter(r => tab === 'all' || tab === 'paid' && r.site === 'pago' || tab === 'free' && r.site === 'grátis' || tab === 'idle' && r.status === 'idle');
    const stTone = {
      active: ['success', 'Ativo'],
      idle: ['warning', 'Ocioso'],
      suspended: ['danger', 'Suspenso']
    };
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("div", {
      style: rowHead
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'Todos',
        count: rows.length
      }, {
        id: 'paid',
        label: 'Pago'
      }, {
        id: 'free',
        label: 'Grátis'
      }, {
        id: 'idle',
        label: 'Ociosos',
        count: 2
      }]
    }), /*#__PURE__*/React.createElement(Input, {
      placeholder: "Buscar tenant",
      prefix: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 16
      }),
      style: {
        width: 260
      }
    })), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        paddingTop: 16
      }
    }, "Tenant"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        paddingTop: 16
      }
    }, "Plano \xB7 site"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        paddingTop: 16
      }
    }, "Atletas"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        paddingTop: 16
      }
    }, "MRR"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        paddingTop: 16
      }
    }, "\xDAltimo acesso"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        paddingTop: 16
      }
    }, "Status"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        paddingTop: 16,
        textAlign: 'right'
      }
    }, "A\xE7\xF5es"))), /*#__PURE__*/React.createElement("tbody", null, filt.map((r, i) => /*#__PURE__*/React.createElement("tr", {
      key: r.name
    }, /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.name,
      size: 36
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, r.city)))), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, r.plan), /*#__PURE__*/React.createElement(Badge, {
      tone: r.site === 'pago' ? 'accent' : 'neutral',
      variant: "soft",
      style: {
        marginTop: 4
      }
    }, r.site)), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        ...mono
      }
    }, r.ath.toLocaleString('pt-BR')), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        ...mono
      }
    }, r.mrr === '0' ? /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        font: 'var(--caption)'
      }
    }, "\u2014") : 'R$ ' + r.mrr), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: r.status === 'idle' ? 'var(--amber)' : 'var(--text-muted)'
      }
    }, r.last), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: stTone[r.status][0],
      variant: "soft",
      dot: true
    }, stTone[r.status][1])), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "external-link",
      size: 15
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "log-in",
      size: 15
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "more-horizontal",
      size: 15
    })))))))));
  }

  /* ============================ APPROVALS ============================ */
  function KycRow({
    ok,
    label
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        font: 'var(--caption)',
        color: ok ? 'var(--green)' : 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ok ? 'check-circle-2' : 'circle',
      size: 14,
      color: ok ? 'var(--green)' : 'var(--cinza-mineral)'
    }), label);
  }
  function ApprovalCard({
    a
  }) {
    const [done, setDone] = useState(null);
    return /*#__PURE__*/React.createElement(Card, {
      pad: "0",
      style: {
        opacity: done ? 0.55 : 1,
        transition: 'opacity var(--dur) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        padding: 20,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-12)',
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg,' + a.g[0] + ',' + a.g[1] + ')',
        font: '700 18px/1 var(--font-display)',
        color: 'var(--creme)'
      }
    }, a.abbr), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 16px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, a.name), /*#__PURE__*/React.createElement(Badge, {
      tone: a.kind === 'Fornecedor B2B' ? 'ocean' : 'accent',
      variant: "soft"
    }, a.kind)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)',
        margin: '4px 0 10px'
      }
    }, "CNPJ ", a.cnpj, " \xB7 ", a.cat, " \xB7 solicitado ", a.when), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-body)',
        marginBottom: 12
      }
    }, a.ask), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 18,
        flexWrap: 'wrap'
      }
    }, a.kyc.map(([ok, l]) => /*#__PURE__*/React.createElement(KycRow, {
      key: l,
      ok: ok,
      label: l
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 'none',
        minWidth: 150
      }
    }, done ? /*#__PURE__*/React.createElement(Badge, {
      tone: done === 'ok' ? 'success' : 'danger',
      variant: "soft",
      dot: true,
      style: {
        alignSelf: 'flex-end'
      }
    }, done === 'ok' ? 'Aprovado' : 'Rejeitado') : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => setDone('ok'),
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 15
      })
    }, "Aprovar"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => setDone('no')
    }, "Rejeitar"), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm"
    }, "Ver dossi\xEA")))));
  }
  function ApprovalsScreen() {
    const [tab, setTab] = useState('sponsors');
    const sponsors = [{
      name: 'Pacefuel Nutrition',
      abbr: 'PF',
      g: ['#1D1D1B', '#C25C2D'],
      kind: 'Patrocinador Nacional',
      cnpj: '12.345.678/0001-90',
      cat: 'Suplementação',
      when: 'hoje',
      ask: 'Cota Nacional R$ 500/mês + cupom RETAKE10 (-15%). Quer faixa de marcas na rede inteira e página de marca.',
      kyc: [[true, 'CNPJ ativo'], [true, 'E-commerce verificado'], [true, 'Cupom ≥ -10%'], [false, 'Pagamento antecipado (3 meses)']]
    }, {
      name: 'SulAmérica Saúde',
      abbr: 'SA',
      g: ['#4E8C5A', '#1D1D1B'],
      kind: 'Patrocinador Estadual',
      cnpj: '01.685.053/0001-56',
      cat: 'Saúde',
      when: 'ontem',
      ask: 'Cota Estadual SP + RJ (R$ 200/mês). Quer faixa de marcas nos dois estados. Sem venda ao corredor.',
      kyc: [[true, 'CNPJ ativo'], [true, 'Marca aprovada'], [false, 'Logo + descrição (7 dias)'], [false, 'Pagamento antecipado']]
    }, {
      name: 'Z2 Suplementos',
      abbr: 'Z2',
      g: ['#7FABB5', '#2A2A27'],
      kind: 'Cupom & Afiliado',
      cnpj: '22.111.000/0001-22',
      cat: 'Suplementação',
      when: 'há 2 dias',
      ask: 'Solicita entrada do cupom Z2RUN (-12%) na área de cupons da rede. Comissão 20% via programa de afiliados.',
      kyc: [[true, 'CNPJ ativo'], [false, 'E-commerce verificado'], [true, 'Cupom ≥ -10%']]
    }];
    const suppliers = [{
      name: 'Confecção Pace',
      abbr: 'CP',
      g: ['#C25C2D', '#1D1D1B'],
      kind: 'Fornecedor B2B',
      cnpj: '33.444.555/0001-66',
      cat: 'Uniformes',
      when: 'hoje',
      ask: 'Vitrine B2B R$ 99/mês. Confecção de uniformes sob demanda, entrega nacional.',
      kyc: [[true, 'CNPJ ativo'], [true, 'KYC concluído'], [true, 'Capacidade de entrega'], [false, 'Amostra recebida']]
    }, {
      name: 'TrackLab Equipamentos',
      abbr: 'TL',
      g: ['#1D1D1B', '#D96C3A'],
      kind: 'Fornecedor B2B',
      cnpj: '44.555.666/0001-77',
      cat: 'Equipamentos',
      when: 'há 3 dias',
      ask: 'Vitrine B2B R$ 99/mês. Equipamentos de pista sob orçamento.',
      kyc: [[true, 'CNPJ ativo'], [false, 'KYC concluído'], [true, 'Capacidade de entrega']]
    }];
    const list = tab === 'sponsors' ? sponsors : suppliers;
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-muted)',
        margin: 0,
        maxWidth: 720
      }
    }, "Toda entrada passa por curadoria \u2014 \xE9 o que mant\xE9m a rede valiosa para as marcas."), /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'sponsors',
        label: 'Patrocinadores & cupons',
        count: sponsors.length
      }, {
        id: 'suppliers',
        label: 'Fornecedores B2B',
        count: suppliers.length
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginTop: 4
      }
    }, list.map(a => /*#__PURE__*/React.createElement(ApprovalCard, {
      key: a.name,
      a: a
    }))));
  }
  Object.assign(window, {
    RTADM: {
      ...(window.RTADM || {}),
      OverviewScreen,
      TenantsScreen,
      ApprovalsScreen
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminScreens2.jsx
try { (() => {
/* Admin screens — part 2: Events moderation, Media, Billing, Quality. window.RTADM. */
;
(function () {
  const {
    Card,
    StatCard,
    Badge,
    Avatar,
    Button,
    Tabs,
    Input,
    Switch,
    Icon
  } = window.RT;
  const {
    useState
  } = React;
  const wrap = {
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 18
  };
  const rowHead = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
    flexWrap: 'wrap'
  };
  const th = {
    font: '600 11px/1.2 var(--font-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    textAlign: 'left',
    padding: '16px 16px 10px',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: '14px 16px',
    borderTop: '1px solid var(--border-soft)',
    font: 'var(--body-sm)',
    color: 'var(--text-body)',
    verticalAlign: 'middle'
  };
  const mono = {
    font: '700 13px/1 var(--font-mono)',
    color: 'var(--text-strong)',
    fontVariantNumeric: 'tabular-nums'
  };
  function SectionTitle({
    children,
    n
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: rowHead
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        font: 'var(--h2)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)',
        color: 'var(--text-strong)',
        margin: 0
      }
    }, children), n && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-muted)'
      }
    }, n));
  }

  /* ============================ EVENTS MODERATION ============================ */
  const SRC = {
    gerenciado: {
      tone: 'success',
      label: 'Gerenciado',
      icon: 'badge-check',
      note: 'organizador verificado'
    },
    importado: {
      tone: 'ocean',
      label: 'Curado / importado',
      icon: 'download',
      note: 'equipe retake'
    },
    sugerido: {
      tone: 'warning',
      label: 'Sugerido',
      icon: 'user',
      note: 'comunidade'
    }
  };
  function FlagLine({
    ok,
    warn,
    children
  }) {
    const c = warn ? 'var(--amber)' : ok ? 'var(--green)' : 'var(--red)';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        font: 'var(--caption)',
        color: c
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: warn ? 'alert-triangle' : ok ? 'check-circle-2' : 'x-circle',
      size: 14,
      color: c
    }), children);
  }
  function EventModCard({
    e
  }) {
    const [done, setDone] = useState(null);
    const s = SRC[e.src];
    return /*#__PURE__*/React.createElement(Card, {
      pad: "0",
      style: {
        opacity: done ? 0.55 : 1,
        transition: 'opacity var(--dur) var(--ease-out)',
        borderColor: e.dupe ? 'var(--amber)' : 'var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        padding: 20,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 'var(--radius-12)',
        background: 'var(--grafite-ink)',
        color: 'var(--creme)',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 24px/1 var(--font-display)'
      }
    }, e.d), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 9px/1 var(--font-mono)',
        color: 'var(--terracota-300)',
        letterSpacing: '0.1em',
        marginTop: 3
      }
    }, e.m)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 16px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, e.name), /*#__PURE__*/React.createElement(Badge, {
      tone: s.tone,
      variant: "soft"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      size: 11,
      style: {
        marginRight: 3
      }
    }), s.label), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, e.type, " \xB7 ", e.city)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)',
        marginBottom: 12
      }
    }, "Enviado por ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: 'var(--text-body)'
      }
    }, e.by), " \xB7 ", s.note, " \xB7 ", e.when), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '7px 18px',
        maxWidth: 560
      }
    }, /*#__PURE__*/React.createElement(FlagLine, {
      ok: e.domainOk,
      warn: !e.domainOk
    }, e.domainOk ? 'Link de inscrição em domínio confiável' : 'Link fora da whitelist — revisar'), /*#__PURE__*/React.createElement(FlagLine, {
      ok: e.cnpj
    }, e.cnpj ? 'CNPJ do organizador verificado' : 'Sem CNPJ — listar sem botão de inscrição'), /*#__PURE__*/React.createElement(FlagLine, {
      ok: !e.dupe,
      warn: e.dupe
    }, e.dupe ? 'Possível duplicata: "' + e.dupe + '"' : 'Sem duplicata detectada'), /*#__PURE__*/React.createElement(FlagLine, {
      ok: e.reports === 0,
      warn: e.reports > 0
    }, e.reports === 0 ? 'Nenhuma denúncia' : e.reports + ' denúncia(s) da comunidade'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        flex: 'none',
        minWidth: 150
      }
    }, done ? /*#__PURE__*/React.createElement(Badge, {
      tone: done === 'ok' ? 'success' : done === 'merge' ? 'ocean' : 'danger',
      variant: "soft",
      dot: true,
      style: {
        alignSelf: 'flex-end'
      }
    }, done === 'ok' ? 'Publicado' : done === 'merge' ? 'Fundido' : 'Rejeitado') : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => setDone('ok'),
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 15
      })
    }, "Publicar"), e.dupe && /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      onClick: () => setDone('merge'),
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "git-merge",
        size: 14
      })
    }, "Fundir"), e.src !== 'gerenciado' && /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "shield-check",
        size: 14
      })
    }, "Verificar org."), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm",
      onClick: () => setDone('no')
    }, "Rejeitar")))));
  }
  function EventsModScreen() {
    const [tab, setTab] = useState('queue');
    const queue = [{
      d: '12',
      m: 'JUL',
      name: 'Night Run Salvador',
      type: 'Prova de rua',
      city: 'Salvador · BA',
      src: 'sugerido',
      by: 'corredor anônimo',
      when: 'há 2 h',
      domainOk: true,
      cnpj: false,
      dupe: null,
      reports: 0
    }, {
      d: '20',
      m: 'JUL',
      name: 'Corrida da Orla 10K',
      type: 'Prova de rua',
      city: 'Rio · RJ',
      src: 'sugerido',
      by: 'Marina C.',
      when: 'há 5 h',
      domainOk: false,
      cnpj: false,
      dupe: 'Corrida da Orla — Leme ao Pontal',
      reports: 0
    }, {
      d: '03',
      m: 'AGO',
      name: 'Maratona do Sol',
      type: 'Prova de rua',
      city: 'Natal · RN',
      src: 'importado',
      by: 'equipe retake',
      when: 'ontem',
      domainOk: true,
      cnpj: true,
      dupe: null,
      reports: 0
    }, {
      d: '15',
      m: 'AGO',
      name: 'Trail da Pedra Grande',
      type: 'Trail',
      city: 'Atibaia · SP',
      src: 'sugerido',
      by: 'corredor anônimo',
      when: 'há 2 dias',
      domainOk: true,
      cnpj: false,
      dupe: null,
      reports: 2
    }];
    const claims = [{
      d: '14',
      m: 'JUN',
      name: 'Circuito Retake — Ibirapuera',
      type: 'Prova de rua',
      city: 'São Paulo · SP',
      src: 'gerenciado',
      by: 'Rio Run Series',
      when: 'há 1 h',
      domainOk: true,
      cnpj: true,
      dupe: null,
      reports: 0
    }];
    const list = tab === 'queue' ? queue : tab === 'claims' ? claims : [];
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-muted)',
        margin: 0,
        maxWidth: 720
      }
    }, "A retake nunca processa o pagamento \u2014 a inscri\xE7\xE3o \xE9 sempre no site oficial do organizador. Aqui voc\xEA decide o que ganha selo de confian\xE7a."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Na fila",
      value: "12",
      caption: "9 sugeridos \xB7 3 import."
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Reivindica\xE7\xF5es",
      value: "3",
      caption: "organizadores reivindicando",
      accent: true
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Publicados (m\xEAs)",
      value: "148",
      delta: 22,
      caption: "vs maio"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Den\xFAncias abertas",
      value: "2",
      caption: "auto-despublicado em 3"
    })), /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'queue',
        label: 'Fila de revisão',
        count: 12
      }, {
        id: 'claims',
        label: 'Reivindicações',
        count: 3
      }, {
        id: 'rules',
        label: 'Regras & whitelist'
      }]
    }), tab === 'rules' ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "22px"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
        marginBottom: 14
      }
    }, "Whitelist de inscri\xE7\xE3o"), ['ticketsports.com.br', 'brasilcorridas.com.br', 'centraldacorrida.com.br', 'minhasinscricoes.com.br', 'doity.com.br'].map(d => /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderTop: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-body)'
      }
    }, d), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      variant: "soft",
      dot: true
    }, "confi\xE1vel"))), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 14
      }),
      style: {
        marginTop: 14
      }
    }, "Adicionar dom\xEDnio")), /*#__PURE__*/React.createElement(Card, {
      pad: "22px"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
        marginBottom: 14
      }
    }, "Regras autom\xE1ticas"), [['Auto-publicar eventos de organizador verificado', true], ['Enfileirar sugestões da comunidade', true], ['Despublicar com 3+ denúncias', true], ['Esconder preço de evento não gerenciado', true], ['Expirar evento após a data', true], ['Marcar "desatualizado" sem edição em 4 meses', false]].map(([l, on]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '11px 0',
        borderTop: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, l), /*#__PURE__*/React.createElement(Switch, {
      checked: on,
      size: "sm",
      onChange: () => {}
    }))))) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, list.map((e, i) => /*#__PURE__*/React.createElement(EventModCard, {
      key: i,
      e: e
    }))));
  }

  /* ============================ MEDIA / FAIXA DE MARCAS ============================ */
  function MediaScreen() {
    const slots = [{
      pos: 1,
      brand: 'Pacefuel Nutrition',
      kind: 'Oficial · nutrição',
      tone: 'accent',
      fixed: true,
      imp: '482k',
      clk: '6,1k'
    }, {
      pos: 2,
      brand: 'SulAmérica Saúde',
      kind: 'Estadual · SP+RJ',
      tone: 'success',
      fixed: true,
      imp: '441k',
      clk: '2,3k'
    }, {
      pos: 3,
      brand: 'Stride Wear',
      kind: 'Estadual · rotativo',
      tone: 'neutral',
      fixed: false,
      imp: '388k',
      clk: '5,2k'
    }, {
      pos: 4,
      brand: 'GPSRun Tech',
      kind: 'Nacional · rotativo',
      tone: 'neutral',
      fixed: false,
      imp: '372k',
      clk: '4,8k'
    }, {
      pos: 5,
      brand: 'Z2 Suplementos',
      kind: 'Cupom · rotativo',
      tone: 'neutral',
      fixed: false,
      imp: '301k',
      clk: '3,9k'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-muted)',
        margin: 0,
        maxWidth: 720
      }
    }, "O que aparece na faixa, em quais sites, e quanto cada posi\xE7\xE3o rende."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Impress\xF5es/m\xEAs",
      value: "1,9",
      unit: "mi",
      delta: 14,
      caption: "rede inteira",
      accent: true
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Sites exibindo",
      value: "74",
      caption: "faixa ativa"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "CTR m\xE9dio",
      value: "1,3",
      unit: "%",
      delta: 4,
      caption: "cliques/impress\xF5es"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Cotas vendidas",
      value: "5",
      unit: "/ 6",
      caption: "1 vaga rotativa livre"
    })), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 22px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, "Posi\xE7\xF5es da faixa"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "arraste para reordenar \xB7 fixos no topo")), slots.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.pos,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 22px',
        borderTop: i ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "grip-vertical",
      size: 16,
      color: "var(--cinza-mineral)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 16px/1 var(--font-mono)',
        color: 'var(--text-muted)',
        width: 22
      }
    }, s.pos), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 14px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, s.brand), s.fixed && /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      variant: "outline"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 10,
      style: {
        marginRight: 3
      }
    }), "fixo")), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, s.kind)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: mono
    }, s.imp), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "impress\xF5es")), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right',
        width: 70
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: mono
    }, s.clk), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "cliques")), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "more-horizontal",
      size: 15
    }))))));
  }

  /* ============================ BILLING ============================ */
  function BillingScreen() {
    const [tab, setTab] = useState('all');
    const inv = [{
      who: 'Acelera Run Club',
      kind: 'Tenant · Membro',
      amt: '59',
      due: '05 jun',
      status: 'paid'
    }, {
      who: 'Pacefuel Nutrition',
      kind: 'Patrocinador Oficial',
      amt: '1.200',
      due: '05 jun',
      status: 'paid'
    }, {
      who: 'SulAmérica Saúde',
      kind: 'Estadual · 2 UF',
      amt: '200',
      due: '08 jun',
      status: 'open'
    }, {
      who: 'Stride Wear',
      kind: 'Patrocinador Estadual',
      amt: '100',
      due: '08 jun',
      status: 'paid'
    }, {
      who: 'Confecção Pace',
      kind: 'Vitrine B2B',
      amt: '99',
      due: '01 jun',
      status: 'overdue'
    }, {
      who: 'Sul Endurance',
      kind: 'Tenant · Apoiador',
      amt: '29',
      due: '28 mai',
      status: 'overdue'
    }, {
      who: 'TrackLab',
      kind: 'Vitrine B2B',
      amt: '99',
      due: '01 jun',
      status: 'overdue'
    }];
    const stTone = {
      paid: ['success', 'Pago'],
      open: ['warning', 'Em aberto'],
      overdue: ['danger', 'Vencido']
    };
    const filt = inv.filter(r => tab === 'all' || r.status === tab);
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-muted)',
        margin: 0,
        maxWidth: 720
      }
    }, "Cotas de patroc\xEDnio, planos dos tenants e comiss\xF5es \u2014 tudo o que a rede fatura."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Faturado (m\xEAs)",
      value: "9,4",
      unit: "mil R$",
      delta: 11,
      accent: true
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Recebido",
      value: "8,1",
      unit: "mil R$",
      caption: "86%"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Em aberto",
      value: "200",
      unit: "R$",
      caption: "1 fatura"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Vencido",
      value: "227",
      unit: "R$",
      caption: "3 faturas"
    })), /*#__PURE__*/React.createElement("div", {
      style: rowHead
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'Tudo',
        count: inv.length
      }, {
        id: 'open',
        label: 'Em aberto'
      }, {
        id: 'overdue',
        label: 'Vencidas',
        count: 3
      }, {
        id: 'paid',
        label: 'Pagas'
      }]
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm"
    }, "Exportar CSV")), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Cliente"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Origem"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Valor"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Vencimento"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Status"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }, "A\xE7\xF5es"))), /*#__PURE__*/React.createElement("tbody", null, filt.map((r, i) => /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        font: '600 14px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, r.who), /*#__PURE__*/React.createElement("td", {
      style: td
    }, r.kind), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        ...mono
      }
    }, "R$ ", r.amt), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: r.status === 'overdue' ? 'var(--red)' : 'var(--text-muted)'
      }
    }, r.due), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: stTone[r.status][0],
      variant: "soft",
      dot: true
    }, stTone[r.status][1])), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right',
        whiteSpace: 'nowrap'
      }
    }, r.status === 'overdue' ? /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Cobrar") : /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "receipt",
      size: 15
    })))))))));
  }

  /* ============================ QUALITY & ABUSE ============================ */
  function QualityScreen() {
    const idle = [{
      site: 'coralrun.retake.run',
      tenant: 'Coral Run',
      days: 74,
      leads: 0,
      action: 'arquivar'
    }, {
      site: 'curitibarun.retake.run',
      tenant: 'Curitiba Run',
      days: 62,
      leads: 1,
      action: 'avisar'
    }, {
      site: 'litoralpace.retake.run',
      tenant: 'Litoral Pace',
      days: 51,
      leads: 0,
      action: 'avisar'
    }];
    const verif = [{
      who: 'Equipe Nova SP',
      type: 'Novo site Essencial',
      checks: [[true, 'WhatsApp'], [false, 'Instagram'], [false, 'CREF']],
      when: 'hoje'
    }, {
      who: 'RunZone BH',
      type: 'Novo site Essencial',
      checks: [[true, 'WhatsApp'], [true, 'Instagram'], [false, 'CREF']],
      when: 'ontem'
    }];
    const reports = [{
      target: 'Trail da Pedra Grande',
      type: 'Evento',
      reason: 'Link suspeito de inscrição',
      n: 2
    }, {
      target: 'cupom FAKE50',
      type: 'Cupom',
      reason: 'Desconto não honrado na loja',
      n: 1
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-muted)',
        margin: 0,
        maxWidth: 720
      }
    }, "A qualidade da rede \xE9 o produto vendido \xE0s marcas \u2014 sites ociosos, den\xFAncias e verifica\xE7\xE3o de novos."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 22px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "moon",
      size: 16,
      color: "var(--amber)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, "Sites ociosos")), idle.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s.site,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 22px',
        borderTop: i ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-strong)'
      }
    }, s.site), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, s.tenant, " \xB7 ", s.leads, " leads \xB7 sem acesso h\xE1 ", s.days, " dias")), /*#__PURE__*/React.createElement(Button, {
      variant: s.action === 'arquivar' ? 'secondary' : 'ghost',
      size: "sm"
    }, s.action === 'arquivar' ? 'Arquivar' : 'Avisar')))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 22px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "flag",
      size: 16,
      color: "var(--red)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, "Den\xFAncias da comunidade")), reports.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 22px',
        borderTop: i ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "danger",
      variant: "soft",
      style: {
        width: 30,
        height: 30,
        padding: 0,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center'
      }
    }, r.n), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13.5px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, r.target, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "\xB7 ", r.type)), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, r.reason)), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Investigar"))))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 22px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user-check",
      size: 16,
      color: "var(--azul-700)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, "Verifica\xE7\xE3o anti-abuso do gr\xE1tis")), verif.map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '14px 22px',
        borderTop: i ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: v.who,
      size: 34
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, v.who), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, v.type, " \xB7 ", v.when)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 14
      }
    }, v.checks.map(([ok, l]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        font: 'var(--caption)',
        color: ok ? 'var(--green)' : 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ok ? 'check-circle-2' : 'circle',
      size: 14,
      color: ok ? 'var(--green)' : 'var(--cinza-mineral)'
    }), l))), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm"
    }, "Liberar")))));
  }
  Object.assign(window, {
    RTADM: {
      ...(window.RTADM || {}),
      EventsModScreen,
      MediaScreen,
      BillingScreen,
      QualityScreen
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminScreens2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/admin/AdminShell.jsx
try { (() => {
/* Admin console shell: dark staff sidebar + topbar. Attaches to window.RTADM. */
;
(function () {
  const {
    Avatar,
    Icon
  } = window.RT;
  const {
    useState
  } = React;
  function NavItem({
    item,
    active,
    onClick
  }) {
    const [hover, setHover] = useState(false);
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        borderRadius: 'var(--radius-8)',
        backgroundColor: active ? 'var(--terracota)' : hover ? 'rgba(241,236,226,0.08)' : 'transparent',
        color: active ? 'var(--creme)' : hover ? 'var(--creme)' : 'var(--text-on-dark-muted)',
        font: '500 14px/1 var(--font-body)',
        transition: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: item.icon,
      size: 18
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }, item.label), item.badge != null && item.badge > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 11px/1 var(--font-mono)',
        minWidth: 20,
        textAlign: 'center',
        padding: '3px 6px',
        borderRadius: 999,
        background: active ? 'rgba(13,13,12,0.25)' : 'var(--terracota)',
        color: 'var(--creme)'
      }
    }, item.badge));
  }
  const NAV = [{
    id: 'overview',
    label: 'Visão geral',
    icon: 'gauge'
  }, {
    id: 'tenants',
    label: 'Tenants',
    icon: 'building-2'
  }, {
    id: 'approvals',
    label: 'Aprovações',
    icon: 'shield-check',
    badge: 7
  }, {
    id: 'events',
    label: 'Moderação de eventos',
    icon: 'calendar-check',
    badge: 12
  }, {
    id: 'media',
    label: 'Faixa de marcas',
    icon: 'panel-top'
  }, {
    id: 'billing',
    label: 'Faturamento',
    icon: 'wallet'
  }, {
    id: 'quality',
    label: 'Qualidade & abuso',
    icon: 'shield-alert',
    badge: 5
  }];
  function Sidebar({
    active,
    onNav
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 256,
        flex: 'none',
        background: 'var(--grafite-ink)',
        borderRight: '1px solid var(--border-on-dark)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '22px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 10px 8px'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logo-full-cream.svg",
      alt: "RETAKE",
      style: {
        height: 22
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        alignSelf: 'flex-start',
        margin: '0 10px 18px',
        padding: '4px 10px',
        borderRadius: 999,
        background: 'rgba(217,108,58,0.16)',
        border: '1px solid var(--terracota)',
        font: '700 9.5px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: 'var(--terracota-300)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 11,
      color: "var(--terracota-300)"
    }), "Console interno"), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1
      }
    }, NAV.map(n => /*#__PURE__*/React.createElement(NavItem, {
      key: n.id,
      item: n,
      active: n.id === active,
      onClick: () => onNav(n.id)
    }))), /*#__PURE__*/React.createElement(NavItem, {
      item: {
        id: 'settings',
        label: 'Ajustes do console',
        icon: 'settings'
      },
      active: active === 'settings',
      onClick: () => onNav('settings')
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 14,
        padding: '12px 10px 0',
        borderTop: '1px solid var(--border-on-dark)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Ana Staff",
      size: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13px/1.2 var(--font-body)',
        color: 'var(--creme)'
      }
    }, "Ana Ribeiro"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "Opera\xE7\xF5es \xB7 retake"))));
  }
  function Topbar({
    title,
    subtitle,
    children
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        borderBottom: '1px solid var(--border-soft)',
        background: 'color-mix(in srgb, var(--creme-100) 86%, transparent)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 4
      }
    }, subtitle), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--h1)',
        margin: 0,
        whiteSpace: 'nowrap'
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '7px 14px',
        borderRadius: 999,
        background: 'var(--surface-card)',
        border: '1px solid var(--border-strong)',
        font: 'var(--body-sm)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "search",
      size: 15,
      color: "var(--text-muted)"
    }), "buscar na rede"), children));
  }
  Object.assign(window, {
    RTADM: {
      ...(window.RTADM || {}),
      Sidebar,
      Topbar,
      NAV
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/admin/AdminShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/athlete-app/AppScreens.jsx
try { (() => {
/* Athlete app screens. Attaches to window.RTA. Uses window.RT + Lucide. */
;
(function () {
  const {
    Button,
    Card,
    Badge,
    Avatar,
    ComplianceTag,
    Icon
  } = window.RT;
  const {
    useState
  } = React;
  const TOPPAD = 56;
  function Header({
    name
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: `${TOPPAD}px 20px 8px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        color: 'var(--text-muted)'
      }
    }, "Quarta \xB7 9 jun"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--h2)',
        fontSize: 26,
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)',
        color: 'var(--text-strong)',
        marginTop: 2
      }
    }, "Bom treino, ", name)), /*#__PURE__*/React.createElement(Avatar, {
      name: name,
      size: 44,
      status: "online"
    }));
  }

  /* week strip of compliance dots */
  function WeekStrip() {
    const week = [['Seg', 'done'], ['Ter', 'done'], ['Qua', 'planned'], ['Qui', 'planned'], ['Sex', 'planned'], ['Sáb', 'done'], ['Dom', 'missed']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7,1fr)',
        gap: 6,
        padding: '4px 20px 0'
      }
    }, week.map(([d, s], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        textAlign: 'center',
        padding: '9px 0',
        borderRadius: 'var(--radius-12)',
        background: i === 2 ? 'var(--terracota-100)' : 'transparent',
        border: i === 2 ? '1px solid var(--terracota-300)' : '1px solid transparent'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        fontSize: 11,
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        marginBottom: 7
      }
    }, d), /*#__PURE__*/React.createElement(ComplianceTag, {
      status: s,
      showLabel: false,
      style: {
        margin: '0 auto'
      }
    }))));
  }

  /* ============================ TODAY ============================ */
  function TodayScreen() {
    const [started, setStarted] = useState(false);
    const steps = [['Aquecimento', '15 min · Z1–Z2'], ['10×800m', 'ritmo 3:45/km · rec 200m'], ['Volta à calma', '10 min · Z1']];
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Header, {
      name: "Marina"
    }), /*#__PURE__*/React.createElement(WeekStrip, null), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 16px 0'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      tone: "dark",
      radius: "var(--radius-24)",
      pad: "0",
      elevation: 0,
      style: {
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 20px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        color: 'var(--terracota-300)'
      }
    }, "Treino do dia"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--h2)',
        color: 'var(--text-on-dark)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)',
        marginTop: 4
      }
    }, "Intervalado", /*#__PURE__*/React.createElement("br", null), "VO\u2082max")), /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      variant: "solid"
    }, "Build \xB7 S6")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 16,
        padding: '16px 20px 18px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        fontSize: 10,
        color: 'var(--text-on-dark-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap'
      }
    }, "Ritmo alvo"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--metric)',
        color: 'var(--text-on-dark)',
        marginTop: 3
      }
    }, "3:45 ", /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "/km"))), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        background: 'var(--border-on-dark)'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        fontSize: 10,
        color: 'var(--text-on-dark-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }
    }, "Volume"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--metric)',
        color: 'var(--text-on-dark)',
        marginTop: 3
      }
    }, "12,4 ", /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "km"))), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 1,
        background: 'var(--border-on-dark)'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        fontSize: 10,
        color: 'var(--text-on-dark-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }
    }, "Dura\xE7\xE3o"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--metric)',
        color: 'var(--text-on-dark)',
        marginTop: 3
      }
    }, "~58 ", /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "min")))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'var(--grafite-ink)',
        padding: '6px 8px'
      }
    }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 12px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 26,
        height: 26,
        borderRadius: 999,
        border: '1.5px solid var(--border-on-dark)',
        display: 'grid',
        placeItems: 'center',
        font: '700 12px/1 var(--font-mono)',
        color: 'var(--terracota-300)',
        flex: 'none'
      }
    }, i + 1), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-on-dark)'
      }
    }, s[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-on-dark-muted)'
      }
    }, s[1]))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: started ? 'inverse' : 'primary',
      size: "lg",
      pill: true,
      arrow: !started,
      onClick: () => setStarted(!started),
      style: {
        width: '100%'
      }
    }, started ? 'Treino em andamento' : 'Iniciar treino')))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 16px 0'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      interactive: true,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 46,
        height: 46,
        borderRadius: 'var(--radius-12)',
        background: 'var(--azul-100)',
        display: 'grid',
        placeItems: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "calendar",
      size: 22,
      color: "var(--azul-700)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 15px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, "Sunset Run \xB7 Ipanema"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "S\xE1bado, 23 mai \xB7 18:00 \xB7 grupo confirmado")), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 20,
      color: "var(--cinza-mineral)"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 16
      }
    }));
  }

  /* ============================ PERFORMANCE ============================ */
  function Bars() {
    const data = [60, 72, 55, 80, 68, 90, 48];
    const max = Math.max(...data);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        height: 120,
        padding: '0 4px'
      }
    }, data.map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: v / max * 104,
        borderRadius: 'var(--radius-4)',
        background: i === 5 ? 'var(--terracota)' : 'var(--azul-300)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        fontSize: 10,
        color: 'var(--text-muted)'
      }
    }, ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]))));
  }
  function PerformanceScreen() {
    const zones = [['Z1 Recuperação', 18, 'var(--azul-300)'], ['Z2 Base', 42, 'var(--azul-oceano)'], ['Z3 Tempo', 24, 'var(--amber)'], ['Z4 Limiar', 12, 'var(--terracota)'], ['Z5 VO₂max', 4, 'var(--red)']];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: `${TOPPAD}px 0 16px`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 20px 4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        color: 'var(--text-muted)'
      }
    }, "Esta semana"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--h2)',
        fontSize: 26,
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)',
        color: 'var(--text-strong)',
        marginTop: 2
      }
    }, "Desempenho")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 10,
        padding: '12px 16px 0'
      }
    }, [['Pace médio', '4:12', '/km'], ['Treinos', '6', 'de 7'], ['Volume', '48,7', 'km']].map((m, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      pad: "14px",
      radius: "var(--radius-16)"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, m[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--metric)',
        fontSize: 22,
        color: 'var(--text-strong)',
        marginTop: 6
      }
    }, m[1]), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--mono-sm)',
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, m[2])))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 16px 0'
      }
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0
      }
    }, "Volume di\xE1rio"), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "+8% vs anterior")), /*#__PURE__*/React.createElement(Bars, null))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 16px 0'
      }
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: '0 0 14px'
      }
    }, "Distribui\xE7\xE3o por zona"), zones.map((z, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: i < zones.length - 1 ? 12 : 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 86,
        font: 'var(--body-sm)',
        fontSize: 13,
        color: 'var(--text-body)',
        flex: 'none'
      }
    }, z[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 10,
        borderRadius: 999,
        background: 'var(--surface-sunken)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: z[1] + '%',
        height: '100%',
        background: z[2],
        borderRadius: 999
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 34,
        textAlign: 'right',
        font: 'var(--mono-sm)',
        color: 'var(--text-muted)',
        flex: 'none'
      }
    }, z[1], "%"))))));
  }

  /* ============================ TAB BAR ============================ */
  const TABS = [['today', 'Hoje', 'flame'], ['perf', 'Treinos', 'activity'], ['community', 'Comunidade', 'users'], ['shop', 'Loja', 'store'], ['profile', 'Perfil', 'user']];
  function TabBar({
    active,
    onNav
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        padding: '10px 8px 24px',
        background: 'color-mix(in srgb, var(--creme-50) 88%, transparent)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border-soft)',
        flex: 'none'
      }
    }, TABS.map(([id, label, icon]) => {
      const a = id === active;
      return /*#__PURE__*/React.createElement("button", {
        key: id,
        onClick: () => onNav(id),
        style: {
          flex: 1,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          padding: '4px 0'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: icon,
        size: 22,
        color: a ? 'var(--terracota)' : 'var(--cinza-mineral)'
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: '600 10px/1 var(--font-body)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: a ? 'var(--terracota)' : 'var(--cinza-mineral)'
        }
      }, label));
    }));
  }
  function StubScreen({
    label
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'grid',
        placeItems: 'center',
        padding: 40,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "hammer",
      size: 28,
      color: "var(--cinza-mineral)"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: 12,
        font: 'var(--body-sm)'
      }
    }, /*#__PURE__*/React.createElement("strong", null, label), /*#__PURE__*/React.createElement("br", null), "n\xE3o inclu\xEDdo neste kit.")));
  }

  /* ============================ COMMUNITY ============================ */
  function CommunityScreen() {
    const ranking = [['Marina Costa', '52,4 km', true], ['Diego Martins', '48,1 km', false], ['Camila Souza', '44,8 km', false], ['Bia Lima', '39,2 km', false]];
    const feed = [['Diego Martins', 'completou Longão 18 km', '4:38 /km · há 2h', 12], ['Camila Souza', 'bateu PR nos 5 km', '19:42 · há 5h', 31]];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: `${TOPPAD}px 0 16px`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 20px 4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        color: 'var(--text-muted)'
      }
    }, "Acelera Run Club"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--h2)',
        fontSize: 26,
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)',
        color: 'var(--text-strong)',
        marginTop: 2
      }
    }, "Comunidade")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 16px 0'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      tone: "dark",
      radius: "var(--radius-24)",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 64,
        height: 64,
        borderRadius: 999,
        background: 'var(--terracota)',
        display: 'grid',
        placeItems: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 30,
      color: "var(--creme)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--metric)',
        fontSize: 26,
        color: 'var(--text-on-dark)'
      }
    }, "14 dias"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "sequ\xEAncia de treinos \xB7 n\xEDvel Prata")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, ['award', 'zap', 'mountain'].map((b, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 34,
        height: 34,
        borderRadius: 999,
        background: 'var(--grafite-ink)',
        border: '1px solid var(--border-on-dark)',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: b,
      size: 16,
      color: "var(--terracota-300)"
    })))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 16px 0'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 18px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0
      }
    }, "Ranking \xB7 volume"), /*#__PURE__*/React.createElement(Badge, {
      tone: "ocean",
      variant: "soft"
    }, "Semana")), ranking.map(([name, km, me], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 18px',
        background: me ? 'var(--terracota-100)' : 'transparent',
        borderBottom: i < ranking.length - 1 ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 22,
        font: '700 15px/1 var(--font-mono)',
        color: i === 0 ? 'var(--terracota)' : 'var(--text-muted)',
        flex: 'none'
      }
    }, i + 1), /*#__PURE__*/React.createElement(Avatar, {
      name: name,
      size: 34
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, name, me ? ' (você)' : ''), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--metric)',
        fontSize: 15,
        color: 'var(--text-strong)'
      }
    }, km))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 16px 0',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, feed.map(([name, action, meta, kudos], i) => /*#__PURE__*/React.createElement(Card, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: name,
      size: 40,
      status: "online"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-strong)'
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        font: '600 14px/1.3 var(--font-body)'
      }
    }, name), " ", action), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, meta))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 18,
        paddingTop: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: 'var(--body-sm)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 16,
      color: "var(--terracota)"
    }), " ", kudos), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        font: 'var(--body-sm)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 16
    }), " Comentar"))))));
  }

  /* ============================ SHOP ============================ */
  function ShopScreen() {
    const items = [{
      name: 'Uniforme oficial',
      price: 189,
      c1: 'var(--terracota)',
      c2: 'var(--grafite)',
      sup: 'Clube'
    }, {
      name: 'Boné performance',
      price: 79,
      c1: 'var(--grafite)',
      c2: 'var(--grafite-700)',
      sup: 'Clube'
    }, {
      name: 'Gel de carboidrato',
      price: 22,
      c1: 'var(--azul-oceano)',
      c2: 'var(--azul-700)',
      sup: 'Pacefuel'
    }, {
      name: 'Kit suplementação 30d',
      price: 420,
      c1: 'var(--cinza-mineral)',
      c2: 'var(--grafite-600)',
      sup: 'Z2'
    }];
    const [step, setStep] = useState('list'); // list | checkout | done
    const [sel, setSel] = useState(null);
    const money = v => 'R$ ' + v.toFixed(2).replace('.', ',');

    /* ---------- checkout: resumo com split ---------- */
    if (step === 'checkout' && sel) {
      const marketplace = sel.sup !== 'Clube';
      const forn = sel.price * 0.8,
        clube = sel.price * 0.1,
        retake = sel.price * 0.1;
      return /*#__PURE__*/React.createElement("div", {
        style: {
          padding: `${TOPPAD}px 16px 16px`
        }
      }, /*#__PURE__*/React.createElement("button", {
        onClick: () => setStep('list'),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          font: '600 12px/1 var(--font-body)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          padding: '4px 0 14px'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "arrow-left",
        size: 15
      }), "Loja"), /*#__PURE__*/React.createElement("div", {
        style: {
          font: 'var(--h2)',
          fontSize: 24,
          textTransform: 'uppercase',
          letterSpacing: 'var(--track-display)',
          color: 'var(--text-strong)',
          marginBottom: 12
        }
      }, "Confirmar pedido"), /*#__PURE__*/React.createElement(Card, {
        pad: "0",
        style: {
          overflow: 'hidden',
          marginBottom: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: 80,
          background: `linear-gradient(135deg, ${sel.c1}, ${sel.c2})`,
          display: 'flex',
          alignItems: 'flex-end',
          padding: 12
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: "neutral",
        variant: "solid",
        style: {
          fontSize: 10
        }
      }, sel.sup)), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: 14,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          font: '600 15px/1.3 var(--font-body)',
          color: 'var(--text-strong)'
        }
      }, sel.name), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--metric)',
          fontSize: 18,
          color: 'var(--text-strong)'
        }
      }, money(sel.price)))), /*#__PURE__*/React.createElement(Card, {
        style: {
          marginBottom: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          font: '600 11px/1 var(--font-body)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: 'var(--text-muted)',
          marginBottom: 10
        }
      }, marketplace ? 'Para onde vai seu dinheiro' : 'Produto do clube'), marketplace ? /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }
      }, [[sel.sup + ' · entrega o produto', forn, 'var(--grafite)'], ['Seu clube · comissão', clube, 'var(--terracota)'], ['retake · plataforma', retake, 'var(--azul-oceano)']].map((r, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          font: 'var(--body-sm)',
          fontSize: 13
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 9,
          height: 9,
          borderRadius: 999,
          background: r[2],
          flex: 'none'
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          flex: 1,
          color: 'var(--text-body)'
        }
      }, r[0]), /*#__PURE__*/React.createElement("span", {
        style: {
          font: '700 12.5px/1 var(--font-mono)',
          color: 'var(--text-strong)'
        }
      }, money(r[1])))), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--caption)',
          fontSize: 11,
          color: 'var(--text-muted)',
          marginTop: 2
        }
      }, "Comprando aqui, voc\xEA apoia o seu clube sem pagar nada a mais.")) : /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--body-sm)',
          fontSize: 13,
          color: 'var(--text-muted)'
        }
      }, "Retirada no treino \xB7 pagamento direto ao clube.")), /*#__PURE__*/React.createElement(Button, {
        variant: "primary",
        size: "lg",
        pill: true,
        onClick: () => setStep('done'),
        style: {
          width: '100%'
        }
      }, "Pagar com Pix \xB7 demo"));
    }

    /* ---------- pedido confirmado ---------- */
    if (step === 'done' && sel) {
      const marketplace = sel.sup !== 'Clube';
      return /*#__PURE__*/React.createElement("div", {
        style: {
          padding: `${TOPPAD + 30}px 20px 16px`,
          textAlign: 'center'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 76,
          height: 76,
          borderRadius: 999,
          border: '3px solid var(--green)',
          display: 'inline-grid',
          placeItems: 'center',
          marginBottom: 16
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 34,
        color: "var(--green)"
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          font: 'var(--h2)',
          fontSize: 24,
          textTransform: 'uppercase',
          color: 'var(--text-strong)',
          marginBottom: 6
        }
      }, "Pedido #1048"), /*#__PURE__*/React.createElement("p", {
        style: {
          font: 'var(--body-sm)',
          color: 'var(--text-muted)',
          margin: '0 0 14px'
        }
      }, marketplace ? `Pagamento confirmado — fica retido até a entrega. ${sel.sup} já recebeu o pedido e prepara o envio.` : 'Combinado! Retire com o coach no próximo treino.'), marketplace && /*#__PURE__*/React.createElement(Card, {
        tone: "dark",
        pad: "14px",
        style: {
          marginBottom: 16,
          textAlign: 'left'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 9
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "heart-handshake",
        size: 18,
        color: "var(--terracota)"
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--body-sm)',
          fontSize: 13,
          color: 'var(--text-on-dark)'
        }
      }, "Seu clube ganhou ", /*#__PURE__*/React.createElement("strong", {
        style: {
          color: 'var(--terracota-300)'
        }
      }, money(sel.price * 0.1)), " com esta compra."))), /*#__PURE__*/React.createElement(Button, {
        variant: "secondary",
        onClick: () => {
          setStep('list');
          setSel(null);
        }
      }, "Voltar \xE0 loja"));
    }

    /* ---------- lista ---------- */
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: `${TOPPAD}px 0 16px`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 20px 4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        color: 'var(--text-muted)'
      }
    }, "Loja + Marketplace"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--h2)',
        fontSize: 26,
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)',
        color: 'var(--text-strong)',
        marginTop: 2
      }
    }, "Loja")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 16px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: 'var(--radius-24)',
        overflow: 'hidden',
        position: 'relative',
        height: 132
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: `url('../../assets/photo-run-banner.png') center/cover`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(13,13,12,0.82), rgba(13,13,12,0.2))'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        padding: 18
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      variant: "solid"
    }, "Drop \xB7 edi\xE7\xE3o Sunset"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--h3)',
        color: 'var(--creme)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)',
        marginTop: 10
      }
    }, "Cole\xE7\xE3o 2026"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--terracota-300)',
        marginTop: 2
      }
    }, "frete gr\xE1tis p/ membros")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        padding: '14px 16px 0'
      }
    }, items.map((it, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      pad: "0",
      interactive: true,
      style: {
        overflow: 'hidden'
      },
      onClick: () => {
        setSel(it);
        setStep('checkout');
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 96,
        background: `linear-gradient(135deg, ${it.c1}, ${it.c2})`,
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 8,
        left: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      variant: "solid",
      style: {
        fontSize: 10
      }
    }, it.sup))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 12px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)',
        minHeight: 36
      }
    }, it.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--metric)',
        fontSize: 17,
        color: 'var(--text-strong)'
      }
    }, money(it.price)), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 999,
        background: 'var(--terracota)',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "plus",
      size: 18,
      color: "var(--creme)"
    }))))))));
  }
  Object.assign(window, {
    RTA: {
      TodayScreen,
      PerformanceScreen,
      CommunityScreen,
      ShopScreen,
      TabBar,
      StubScreen
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/athlete-app/AppScreens.jsx", error: String((e && e.message) || e) }); }

// ui_kits/athlete-app/AppScreens2.jsx
try { (() => {
/* Athlete app — Onda 4 screens: guided execution (Today2), Profile + sub-screens
   (subscription, history, chat, notifications, anamnese, onboarding). window.RTA. */
;
(function () {
  const {
    Card,
    Badge,
    Avatar,
    Button,
    Switch,
    Icon,
    ComplianceTag
  } = window.RT;
  const {
    useState
  } = React;
  const col = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    background: 'var(--surface-page)'
  };
  const darkHead = {
    background: 'var(--grafite-ink)',
    color: 'var(--creme)',
    padding: '40px 20px 22px'
  };
  const body = {
    flex: 1,
    overflow: 'auto',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  };
  const eyebrow = {
    font: '600 11px/1 var(--font-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: 'var(--terracota-300)'
  };
  const cap = {
    font: 'var(--caption)',
    color: 'var(--text-muted)'
  };
  const strong = {
    font: '600 15px/1.25 var(--font-body)',
    color: 'var(--text-strong)'
  };
  function Sub({
    title,
    onBack,
    children
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: col
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...darkHead,
        padding: '40px 18px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onBack,
      style: {
        border: 'none',
        background: 'rgba(241,236,226,0.12)',
        width: 34,
        height: 34,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left",
      size: 18,
      color: "var(--creme)"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--h4)',
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--creme)'
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: body
    }, children));
  }

  /* ============================ GUIDED EXECUTION (TODAY 2) ============================ */
  function TodayScreen2() {
    const steps = [{
      t: 'Aquecimento',
      d: '15 min · Z1–Z2',
      dur: '15:00',
      kind: 'warm'
    }, {
      t: 'Tiro 1 · 800m',
      d: 'ritmo 3:45/km',
      dur: '3:00',
      kind: 'work'
    }, {
      t: 'Recuperação',
      d: 'trote 200m',
      dur: '1:30',
      kind: 'rec'
    }, {
      t: 'Tiro 2 · 800m',
      d: 'ritmo 3:45/km',
      dur: '3:00',
      kind: 'work'
    }, {
      t: 'Recuperação',
      d: 'trote 200m',
      dur: '1:30',
      kind: 'rec'
    }, {
      t: 'Volta à calma',
      d: '10 min · Z1',
      dur: '10:00',
      kind: 'cool'
    }];
    const [phase, setPhase] = useState('intro'); // intro | run | done
    const [cur, setCur] = useState(0);
    const [pse, setPse] = useState(0);
    const kindColor = {
      warm: 'var(--azul-oceano)',
      work: 'var(--terracota)',
      rec: 'var(--cinza-mineral)',
      cool: 'var(--azul-300)'
    };
    if (phase === 'done') return /*#__PURE__*/React.createElement("div", {
      style: col
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...darkHead,
        paddingTop: 44
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: eyebrow
    }, "Treino conclu\xEDdo"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 30px/1 var(--font-display)',
        textTransform: 'uppercase',
        color: 'var(--creme)',
        margin: '8px 0 4px'
      }
    }, "Mandou bem!"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "Intervalado 10\xD7800m \xB7 registrado")), /*#__PURE__*/React.createElement("div", {
      style: body
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 10
      }
    }, [['Distância', '11,4', 'km'], ['Tempo', '52', 'min'], ['Pace méd.', '4:34', '/km']].map(([l, v, u]) => /*#__PURE__*/React.createElement(Card, {
      key: l,
      pad: "14px",
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 22px/1 var(--font-mono)',
        color: 'var(--text-strong)'
      }
    }, v), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, l, " \xB7 ", u)))), /*#__PURE__*/React.createElement(Card, {
      pad: "18px",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: strong
    }, "Como foi o esfor\xE7o? (PSE)"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        justifyContent: 'space-between'
      }
    }, [...Array(10)].map((_, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setPse(i + 1),
      style: {
        flex: 1,
        height: 38,
        borderRadius: 'var(--radius-8)',
        border: '1.5px solid ' + (pse === i + 1 ? 'var(--terracota)' : 'var(--border-strong)'),
        background: pse === i + 1 ? 'var(--terracota)' : 'var(--creme-50)',
        color: pse === i + 1 ? 'var(--creme)' : 'var(--text-muted)',
        font: '700 13px/1 var(--font-mono)',
        cursor: 'pointer'
      }
    }, i + 1))), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: () => {
        setPhase('intro');
        setCur(0);
        setPse(0);
      }
    }, "Enviar para o treinador"))));
    if (phase === 'run') {
      const s = steps[cur];
      return /*#__PURE__*/React.createElement("div", {
        style: col
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          ...darkHead,
          paddingTop: 44,
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: eyebrow
      }, "Passo ", cur + 1, " de ", steps.length), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 14,
          textAlign: 'center'
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: s.kind === 'work' ? 'accent' : 'ocean',
        variant: "soft"
      }, s.kind === 'work' ? 'Forte' : s.kind === 'rec' ? 'Recuperação' : s.kind === 'warm' ? 'Aquecimento' : 'Calma'), /*#__PURE__*/React.createElement("div", {
        style: {
          font: '700 34px/1 var(--font-display)',
          textTransform: 'uppercase',
          color: 'var(--creme)'
        }
      }, s.t), /*#__PURE__*/React.createElement("div", {
        style: {
          font: 'var(--body)',
          color: 'var(--text-on-dark-muted)'
        }
      }, s.d), /*#__PURE__*/React.createElement("div", {
        style: {
          font: '700 72px/1 var(--font-mono)',
          color: kindColor[s.kind]
        }
      }, s.dur)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement(Button, {
        variant: "inverse",
        size: "lg",
        style: {
          flex: 1
        },
        onClick: () => cur + 1 < steps.length ? setCur(cur + 1) : setPhase('done'),
        arrow: true
      }, cur + 1 < steps.length ? 'Próximo' : 'Finalizar'), /*#__PURE__*/React.createElement("button", {
        onClick: () => setPhase('done'),
        style: {
          width: 54,
          borderRadius: 'var(--radius-8)',
          border: '2px solid var(--border-on-dark)',
          background: 'transparent',
          cursor: 'pointer',
          display: 'grid',
          placeItems: 'center'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "square",
        size: 20,
        color: "var(--creme)"
      })))));
    }
    return /*#__PURE__*/React.createElement("div", {
      style: col
    }, /*#__PURE__*/React.createElement("div", {
      style: darkHead
    }, /*#__PURE__*/React.createElement("span", {
      style: eyebrow
    }, "Treino do dia \xB7 Ter"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 28px/1 var(--font-display)',
        textTransform: 'uppercase',
        color: 'var(--creme)',
        margin: '8px 0 4px'
      }
    }, "Intervalado 10\xD7800m"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "Fase Pico \xB7 prescrito por Coach L\xE9o")), /*#__PURE__*/React.createElement("div", {
      style: body
    }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-12)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 36,
        borderRadius: 999,
        background: kindColor[s.kind],
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: strong
    }, s.t), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, s.d)), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 13px/1 var(--font-mono)',
        color: 'var(--text-muted)'
      }
    }, s.dur)))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        borderTop: '1px solid var(--border-soft)',
        background: 'var(--surface-card)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      style: {
        width: '100%'
      },
      onClick: () => {
        setPhase('run');
        setCur(0);
      },
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "play",
        size: 18
      })
    }, "Iniciar treino")));
  }

  /* ============================ PROFILE + SUB-SCREENS ============================ */
  function SubSubscription({
    onBack
  }) {
    return /*#__PURE__*/React.createElement(Sub, {
      title: "Minha assinatura",
      onBack: onBack
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "20px",
      tone: "dark",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      variant: "soft",
      style: {
        alignSelf: 'flex-start'
      }
    }, "Plano Performance"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 22px/1 var(--font-mono)',
        color: 'var(--creme)'
      }
    }, "R$ 289", /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-on-dark-muted)'
      }
    }, " /m\xEAs")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "Renova em 05 jul \xB7 cart\xE3o final 4242")), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, "Carteirinha do clube"), /*#__PURE__*/React.createElement(Card, {
      pad: "18px",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: 'var(--radius-12)',
        background: 'var(--grafite-ink)',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "qr-code",
      size: 28,
      color: "var(--creme)"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: strong
    }, "Marina Costa"), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, "Acelera Run Club \xB7 #1042"))), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, "Faturas"), [['Jun 2026', 'R$ 289'], ['Mai 2026', 'R$ 289']].map(([m, v]) => /*#__PURE__*/React.createElement("div", {
      key: m,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 14px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-12)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, m), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 13px/1 var(--font-mono)'
      }
    }, v), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      variant: "soft",
      dot: true
    }, "pago")))));
  }
  function SubHistory({
    onBack
  }) {
    const items = [['Hoje', 'Intervalado 10×800m', 'done'], ['Ontem', 'Longão 24km', 'done'], ['Dom', 'Folga', 'planned'], ['Sáb', 'Tempo run 8km', 'partial'], ['Sex', 'Regenerativo 6km', 'missed'], ['Qui', 'Base 10km', 'done']];
    return /*#__PURE__*/React.createElement(Sub, {
      title: "Hist\xF3rico",
      onBack: onBack
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 10
      }
    }, [['Sequência', '18', 'dias'], ['Volume mês', '128', 'km'], ['Adesão', '94', '%']].map(([l, v, u]) => /*#__PURE__*/React.createElement(Card, {
      key: l,
      pad: "12px",
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 20px/1 var(--font-mono)',
        color: 'var(--terracota)'
      }
    }, v), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, l)))), items.map(([d, t, s], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-12)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...cap,
        width: 42
      }
    }, d), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, t), /*#__PURE__*/React.createElement(ComplianceTag, {
      status: s,
      size: "sm"
    }))));
  }
  function SubChat({
    onBack
  }) {
    const msgs = [{
      me: false,
      t: 'Bom treino hoje! Mandou super bem no longão 💪',
      w: '08:12'
    }, {
      me: true,
      t: 'Valeu coach! Senti o joelho um pouco no fim',
      w: '08:30'
    }, {
      me: false,
      t: 'Vamos reduzir o volume de quinta então. Já ajustei seu treino.',
      w: '08:34'
    }, {
      me: true,
      t: 'Perfeito, obrigada!',
      w: '08:35'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: col
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...darkHead,
        padding: '40px 18px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onBack,
      style: {
        border: 'none',
        background: 'rgba(241,236,226,0.12)',
        width: 34,
        height: 34,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left",
      size: 18,
      color: "var(--creme)"
    })), /*#__PURE__*/React.createElement(Avatar, {
      name: "L\xE9o",
      size: 36,
      status: "online"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 15px/1.1 var(--font-body)',
        color: 'var(--creme)'
      }
    }, "Coach L\xE9o"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "online"))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, msgs.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        alignSelf: m.me ? 'flex-end' : 'flex-start',
        maxWidth: '78%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 14px',
        borderRadius: m.me ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
        background: m.me ? 'var(--terracota)' : 'var(--surface-card)',
        color: m.me ? 'var(--creme)' : 'var(--text-body)',
        border: m.me ? 'none' : '1px solid var(--border-soft)',
        font: 'var(--body-sm)'
      }
    }, m.t), /*#__PURE__*/React.createElement("div", {
      style: {
        ...cap,
        textAlign: m.me ? 'right' : 'left',
        marginTop: 3
      }
    }, m.w)))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 14,
        borderTop: '1px solid var(--border-soft)',
        background: 'var(--surface-card)',
        display: 'flex',
        gap: 10,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 42,
        borderRadius: 999,
        border: '1.5px solid var(--border-strong)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        color: 'var(--text-muted)',
        font: 'var(--body-sm)'
      }
    }, "Mensagem\u2026"), /*#__PURE__*/React.createElement("button", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 999,
        border: 'none',
        background: 'var(--terracota)',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 18,
      color: "var(--creme)"
    }))));
  }
  function SubNotifications({
    onBack
  }) {
    const n = [['activity', 'Novo treino prescrito para amanhã', 'há 1 h', 'accent'], ['calendar', 'Treinão de domingo confirmado · 6h Aterro', 'há 3 h', 'ocean'], ['trophy', 'Você subiu para 1º no ranking de volume!', 'ontem', 'accent'], ['credit-card', 'Pagamento de junho confirmado', 'há 2 dias', 'neutral']];
    return /*#__PURE__*/React.createElement(Sub, {
      title: "Notifica\xE7\xF5es",
      onBack: onBack
    }, n.map(([ic, t, w, tone], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 12,
        padding: '13px 14px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-12)'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: tone,
      variant: "soft",
      style: {
        width: 36,
        height: 36,
        padding: 0,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 17
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        ...cap,
        marginTop: 3
      }
    }, w)))));
  }
  function SubAnamnese({
    onBack
  }) {
    return /*#__PURE__*/React.createElement(Sub, {
      title: "Anamnese & sa\xFAde",
      onBack: onBack
    }, [['Objetivo', 'Sub 1h45 nos 21k'], ['Lesões', 'Tendinite joelho D (2023)'], ['Restrições', 'Nenhuma atual'], ['FC repouso', '52 bpm'], ['Disponibilidade', '5 dias/semana'], ['Experiência', '3 anos correndo']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
        padding: '13px 14px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-12)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: cap
    }, k), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-body)',
        textAlign: 'right'
      }
    }, v))), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "pencil",
        size: 15
      })
    }, "Atualizar respostas"));
  }
  function SubOnboarding({
    onBack
  }) {
    const [step, setStep] = useState(0);
    const total = 4;
    const next = () => step + 1 < total ? setStep(step + 1) : onBack();
    return /*#__PURE__*/React.createElement("div", {
      style: col
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...darkHead,
        paddingTop: 40
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        marginBottom: 16
      }
    }, [...Array(total)].map((_, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        flex: 1,
        height: 4,
        borderRadius: 999,
        background: i <= step ? 'var(--terracota)' : 'rgba(241,236,226,0.2)'
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: eyebrow
    }, "Passo ", step + 1, " de ", total), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 24px/1.05 var(--font-display)',
        textTransform: 'uppercase',
        color: 'var(--creme)',
        margin: '8px 0 0'
      }
    }, ['Bem-vindo à retake', 'Entre no seu clube', 'Conte sobre você', 'Tudo pronto!'][step])), /*#__PURE__*/React.createElement("div", {
      style: body
    }, step === 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body)',
        color: 'var(--text-body)'
      }
    }, "O app \xFAnico dos corredores da rede. Treino do dia, desempenho, loja e a sua comunidade \u2014 em um s\xF3 lugar."), /*#__PURE__*/React.createElement(Card, {
      pad: "16px",
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "smartphone",
      size: 22,
      color: "var(--terracota)"
    }), /*#__PURE__*/React.createElement("span", {
      style: cap
    }, "Use o mesmo login do seu clube ou crie sua conta com e-mail."))), step === 1 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: cap
    }, "C\xF3digo de convite do clube"), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 50,
        borderRadius: 'var(--radius-12)',
        border: '1.5px solid var(--border-strong)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        font: '700 22px/1 var(--font-mono)',
        letterSpacing: '0.3em',
        color: 'var(--text-strong)',
        background: 'var(--surface-card)'
      }
    }, "ACEL-42")), /*#__PURE__*/React.createElement(Card, {
      pad: "16px",
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Acelera",
      size: 40
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: strong
    }, "Acelera Run Club"), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, "Rio de Janeiro \xB7 1.245 atletas")), /*#__PURE__*/React.createElement(Icon, {
      name: "check-circle-2",
      size: 20,
      color: "var(--green)",
      style: {
        marginLeft: 'auto'
      }
    }))), step === 2 && /*#__PURE__*/React.createElement(React.Fragment, null, ['Qual seu objetivo?', 'Tem alguma lesão?', 'Quantos dias por semana?'].map((q, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: cap
    }, q), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 46,
        borderRadius: 'var(--radius-12)',
        border: '1.5px solid var(--border-strong)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        color: 'var(--text-muted)',
        font: 'var(--body-sm)',
        background: 'var(--surface-card)'
      }
    }, ['Sub 1h45 nos 21k', 'Tendinite no joelho', '5 dias'][i])))), step === 3 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 72,
        height: 72,
        borderRadius: 999,
        background: 'var(--green-100)',
        display: 'grid',
        placeItems: 'center',
        margin: '0 auto 16px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 34,
      color: "var(--green)"
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body)',
        color: 'var(--text-body)'
      }
    }, "Pronto, Marina! Seu treinador j\xE1 recebeu sua anamnese e vai prescrever seu primeiro treino."))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        borderTop: '1px solid var(--border-soft)',
        background: 'var(--surface-card)'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "lg",
      style: {
        width: '100%'
      },
      onClick: next,
      arrow: true
    }, step + 1 < total ? 'Continuar' : 'Começar a treinar')));
  }
  function ProfileScreen() {
    const [view, setView] = useState(null);
    if (view === 'sub') return /*#__PURE__*/React.createElement(SubSubscription, {
      onBack: () => setView(null)
    });
    if (view === 'hist') return /*#__PURE__*/React.createElement(SubHistory, {
      onBack: () => setView(null)
    });
    if (view === 'chat') return /*#__PURE__*/React.createElement(SubChat, {
      onBack: () => setView(null)
    });
    if (view === 'notif') return /*#__PURE__*/React.createElement(SubNotifications, {
      onBack: () => setView(null)
    });
    if (view === 'anam') return /*#__PURE__*/React.createElement(SubAnamnese, {
      onBack: () => setView(null)
    });
    if (view === 'onb') return /*#__PURE__*/React.createElement(SubOnboarding, {
      onBack: () => setView(null)
    });
    const menu = [['credit-card', 'Minha assinatura', 'Performance · R$ 289', 'sub'], ['history', 'Histórico de treinos', '18 dias de sequência', 'hist'], ['message-circle', 'Conversa com o treinador', '1 nova mensagem', 'chat'], ['bell', 'Notificações', '3 não lidas', 'notif'], ['clipboard-list', 'Anamnese & saúde', 'atualizada em mai', 'anam'], ['sparkles', 'Refazer onboarding', 'demo do fluxo de entrada', 'onb']];
    return /*#__PURE__*/React.createElement("div", {
      style: col
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...darkHead,
        paddingTop: 44
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Marina Costa",
      size: 60,
      ring: true
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 22px/1 var(--font-display)',
        textTransform: 'uppercase',
        color: 'var(--creme)'
      }
    }, "Marina Costa"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-on-dark-muted)',
        marginTop: 4
      }
    }, "Acelera Run Club \xB7 desde mar 2024"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: 10,
        marginTop: 18
      }
    }, [['5K', '22:14'], ['10K', '46:58'], ['21K', '1:48:30']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        background: 'rgba(241,236,226,0.08)',
        borderRadius: 'var(--radius-8)',
        padding: '10px 8px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 9px/1 var(--font-body)',
        letterSpacing: '0.1em',
        color: 'var(--terracota-300)'
      }
    }, "RECORDE ", k), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 15px/1.2 var(--font-mono)',
        color: 'var(--creme)',
        marginTop: 4
      }
    }, v))))), /*#__PURE__*/React.createElement("div", {
      style: body
    }, menu.map(([ic, t, s, v]) => /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: () => setView(v),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: '14px 16px',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-12)',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 20,
      color: "var(--terracota)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: strong
    }, t), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, s)), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 18,
      color: "var(--cinza-mineral)"
    }))), /*#__PURE__*/React.createElement("button", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '12px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "log-out",
      size: 16,
      color: "var(--text-muted)"
    }), "Sair")));
  }
  Object.assign(window, {
    RTA: {
      ...(window.RTA || {}),
      TodayScreen2,
      ProfileScreen
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/athlete-app/AppScreens2.jsx", error: String((e && e.message) || e) }); }

// ui_kits/athlete-app/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/athlete-app/ios-frame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/AppShell.jsx
try { (() => {
/* Dashboard shell: sidebar + topbar. Attaches to window.RTK. */
;
(function () {
  const {
    Avatar,
    Badge,
    Icon,
    Button
  } = window.RT;
  const {
    useState
  } = React;
  function NavItem({
    item,
    active,
    onClick
  }) {
    const [hover, setHover] = useState(false);
    return /*#__PURE__*/React.createElement("button", {
      onClick: onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        width: '100%',
        borderRadius: 'var(--radius-8)',
        backgroundColor: active ? 'var(--terracota)' : hover ? 'var(--creme-200)' : 'transparent',
        color: active ? 'var(--creme)' : 'var(--text-body)',
        font: '500 14px/1 var(--font-body)',
        transition: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: item.icon,
      size: 18
    }), item.label);
  }
  const NAV = [{
    id: 'overview',
    label: 'Visão geral',
    icon: 'layout-dashboard'
  }, {
    id: 'site',
    label: 'Meu site',
    icon: 'globe'
  }, {
    id: 'leads',
    label: 'Captação',
    icon: 'user-plus'
  }, {
    id: 'athletes',
    label: 'Atletas',
    icon: 'users'
  }, {
    id: 'training',
    label: 'Treinos',
    icon: 'activity'
  }, {
    id: 'agenda',
    label: 'Agenda',
    icon: 'calendar-clock'
  }, {
    id: 'finance',
    label: 'Financeiro',
    icon: 'wallet'
  }, {
    id: 'comissoes',
    label: 'Comissões',
    icon: 'percent'
  }, {
    id: 'community',
    label: 'Comunidade',
    icon: 'message-circle'
  }, {
    id: 'events',
    label: 'Eventos',
    icon: 'calendar'
  }, {
    id: 'marketplace',
    label: 'Marketplace',
    icon: 'store'
  }, {
    id: 'products',
    label: 'Produtos',
    icon: 'package'
  }];
  function Sidebar({
    active,
    onNav
  }) {
    return /*#__PURE__*/React.createElement("aside", {
      style: {
        width: 248,
        flex: 'none',
        background: 'var(--creme-50)',
        borderRight: '1px solid var(--border-soft)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '22px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 10px 22px'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logo-full.svg",
      alt: "RETAKE",
      style: {
        height: 22
      }
    })), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        flex: 1
      }
    }, NAV.map(n => /*#__PURE__*/React.createElement(NavItem, {
      key: n.id,
      item: n,
      active: n.id === active,
      onClick: () => onNav(n.id)
    }))), /*#__PURE__*/React.createElement(NavItem, {
      item: {
        id: 'settings',
        label: 'Configurações',
        icon: 'settings'
      },
      active: active === 'settings',
      onClick: () => onNav('settings')
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 14,
        padding: '12px 10px 0',
        borderTop: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: "Time Acelera",
      size: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, "Acelera Run Club"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "Plano Performance"))));
  }
  function Topbar({
    title,
    subtitle,
    children
  }) {
    return /*#__PURE__*/React.createElement("header", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        borderBottom: '1px solid var(--border-soft)',
        background: 'color-mix(in srgb, var(--creme-100) 86%, transparent)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 4
      }
    }, subtitle), /*#__PURE__*/React.createElement("h1", {
      style: {
        font: 'var(--h1)',
        margin: 0,
        whiteSpace: 'nowrap'
      }
    }, title)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        width: 42,
        height: 42,
        borderRadius: 'var(--radius-pill)',
        border: '1px solid var(--border-strong)',
        background: 'var(--surface-card)',
        cursor: 'pointer',
        display: 'grid',
        placeItems: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "bell",
      size: 19,
      color: "var(--text-body)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 9,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 999,
        background: 'var(--terracota)',
        border: '2px solid var(--surface-card)'
      }
    })), children));
  }
  Object.assign(window, {
    RTK: {
      ...(window.RTK || {}),
      Sidebar,
      Topbar,
      NAV
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/ComissoesScreen.jsx
try { (() => {
/* Dashboard — tela "Comissões": o que a loja do clube paga à assessoria (split 3 vias).
   Attaches to window.RTK. */
;
(function () {
  const {
    Card,
    StatCard,
    Badge,
    Button,
    Icon
  } = window.RT;
  function SplitBar({
    parts
  }) {
    /* parts: [{label, value, color}] */
    const total = parts.reduce((s, p) => s + p.value, 0);
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        height: 14,
        borderRadius: 999,
        overflow: 'hidden',
        marginBottom: 10
      }
    }, parts.map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: p.value / total * 100 + '%',
        background: p.color
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, parts.map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        font: 'var(--body-sm)',
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: 999,
        background: p.color,
        flex: 'none'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        color: 'var(--text-body)'
      }
    }, p.label), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 13px/1 var(--font-mono)',
        color: 'var(--text-strong)'
      }
    }, "R$ ", p.value.toFixed(2).replace('.', ','))))));
  }
  function ComissoesScreen() {
    const sales = [{
      when: 'Hoje · 09:41',
      item: 'Gel de carboidrato · 6un',
      sup: 'Pacefuel',
      buyer: 'Marina C.',
      value: 'R$ 72,00',
      com: 'R$ 7,20',
      paid: true
    }, {
      when: 'Hoje · 08:15',
      item: 'Fone open-ear Audia',
      sup: 'Audia Sport',
      buyer: 'Diego M.',
      value: 'R$ 389,00',
      com: 'R$ 38,90',
      paid: true
    }, {
      when: 'Ontem',
      item: 'Kit suplementação 30d',
      sup: 'Z2 Suplementos',
      buyer: 'Camila S.',
      value: 'R$ 420,00',
      com: 'R$ 42,00',
      paid: true
    }, {
      when: 'Ontem',
      item: 'Relógio GPS · GPSRun',
      sup: 'GPSRun Tech',
      buyer: 'Rafael T.',
      value: 'R$ 2.890,00',
      com: 'R$ 144,50',
      paid: false
    }, {
      when: '07 jun',
      item: 'Meias compressão · 3 pares',
      sup: 'Terra Firme',
      buyer: 'João R.',
      value: 'R$ 96,00',
      com: 'R$ 9,60',
      paid: true
    }];
    const months = [['Jan', 620], ['Fev', 780], ['Mar', 940], ['Abr', 1120], ['Mai', 1490], ['Jun', 1842]];
    const max = Math.max(...months.map(m => m[1]));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement(Card, {
      tone: "dark",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 46,
        height: 46,
        borderRadius: 'var(--radius-12)',
        background: 'var(--terracota)',
        display: 'grid',
        placeItems: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "percent",
      size: 22,
      color: "var(--creme)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 260
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 15px/1.3 var(--font-body)',
        color: 'var(--text-on-dark)'
      }
    }, "Sua loja te paga."), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        fontSize: 13,
        color: 'var(--text-on-dark-muted)'
      }
    }, "Cada venda originada no seu site divide automaticamente no pagamento: fornecedor entrega, a retake opera, e ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--terracota-300)'
      }
    }, "voc\xEA fica com a comiss\xE3o"), " \u2014 sem tocar em estoque.")), /*#__PURE__*/React.createElement(Badge, {
      tone: "ocean",
      variant: "soft"
    }, "Split autom\xE1tico \xB7 gateway")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Comiss\xF5es em junho",
      value: "R$ 1.842",
      delta: 24,
      accent: true,
      caption: "vs maio"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Vendas originadas",
      value: "137",
      delta: 18,
      caption: "pela sua loja"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Taxa m\xE9dia",
      value: "10%",
      caption: "varia por categoria"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Pr\xF3ximo repasse",
      value: "Sex",
      caption: "13 jun \xB7 autom\xE1tico"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.7fr) minmax(260px, 1fr)',
        gap: 18,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 22px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0
      }
    }, "Vendas da sua loja"), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm"
    }, "Exportar CSV")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr 0.9fr 0.9fr 0.7fr',
        gap: '0 16px',
        padding: '10px 22px',
        borderBottom: '1px solid var(--border-soft)',
        font: '600 10.5px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Produto"), /*#__PURE__*/React.createElement("span", null, "Fornecedor"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right'
      }
    }, "Venda"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right'
      }
    }, "Sua comiss\xE3o"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right'
      }
    }, "Status")), sales.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'grid',
        gridTemplateColumns: '1.8fr 1fr 0.9fr 0.9fr 0.7fr',
        gap: '0 16px',
        alignItems: 'center',
        padding: '13px 22px',
        borderBottom: i < sales.length - 1 ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, s.item), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, s.when, " \xB7 ", s.buyer)), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        fontSize: 13,
        color: 'var(--text-body)'
      }
    }, s.sup), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        font: 'var(--mono-sm)',
        color: 'var(--text-body)'
      }
    }, s.value), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        font: '700 14px/1 var(--font-mono)',
        color: 'var(--terracota-600)'
      }
    }, s.com), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: s.paid ? 'success' : 'warning',
      dot: true
    }, s.paid ? 'Pago' : 'A liberar'))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: '0 0 14px'
      }
    }, "Comiss\xF5es por m\xEAs"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: 10,
        height: 120
      }
    }, months.map(([m, v], i) => /*#__PURE__*/React.createElement("div", {
      key: m,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: v / max * 92,
        borderRadius: 'var(--radius-4)',
        background: i === months.length - 1 ? 'var(--terracota)' : 'var(--azul-300)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        fontSize: 10,
        color: 'var(--text-muted)'
      }
    }, m))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: '0 0 4px'
      }
    }, "Como divide"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "Exemplo \xB7 kit suplementa\xE7\xE3o R$ 420"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement(SplitBar, {
      parts: [{
        label: 'Fornecedor (Z2)',
        value: 336,
        color: 'var(--grafite)'
      }, {
        label: 'Você (comissão 10%)',
        value: 42,
        color: 'var(--terracota)'
      }, {
        label: 'retake (taxa 10%)',
        value: 42,
        color: 'var(--azul-oceano)'
      }]
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)',
        margin: '14px 0 0'
      }
    }, "A divis\xE3o \xE9 definida no pagamento, mas o dinheiro fica retido no gateway e s\xF3 libera ap\xF3s a entrega confirmada.")))));
  }
  Object.assign(window, {
    RTK: {
      ...(window.RTK || {}),
      ComissoesScreen
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/ComissoesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/DashboardExtra.jsx
try { (() => {
/* Dashboard extra screens (Onda 3): Community, Settings, Agenda, Athletes+detail,
   structured Training. Attaches to window.RTK. */
;
(function () {
  const {
    Card,
    StatCard,
    Badge,
    Avatar,
    Button,
    Tabs,
    Input,
    Switch,
    Icon,
    ComplianceTag
  } = window.RT;
  const {
    useState
  } = React;
  const wrap = {
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 18
  };
  const head = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
    flexWrap: 'wrap'
  };
  const cap = {
    font: 'var(--caption)',
    color: 'var(--text-muted)'
  };
  const strong = {
    font: '600 14px/1.2 var(--font-body)',
    color: 'var(--text-strong)'
  };
  const th = {
    font: '600 11px/1.2 var(--font-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    textAlign: 'left',
    padding: '16px 16px 10px',
    whiteSpace: 'nowrap'
  };
  const td = {
    padding: '13px 16px',
    borderTop: '1px solid var(--border-soft)',
    font: 'var(--body-sm)',
    color: 'var(--text-body)',
    verticalAlign: 'middle'
  };

  /* ============================ COMMUNITY ============================ */
  function CommunityScreen() {
    const [tab, setTab] = useState('mural');
    const posts = [{
      who: 'Coach Léo',
      av: 'Léo',
      role: 'Treinador',
      txt: 'Treinão de domingo confirmado: 6h no Aterro. Bora!',
      likes: 48,
      comm: 12,
      pin: true,
      when: 'há 2 h'
    }, {
      who: 'Marina Costa',
      av: 'Marina Costa',
      role: 'Atleta',
      txt: 'Fechei meu primeiro 21k hoje 🏅 obrigada equipe!',
      likes: 96,
      comm: 23,
      when: 'há 4 h'
    }, {
      who: 'Diego Martins',
      av: 'Diego Martins',
      role: 'Atleta',
      txt: 'Alguém topa rodar amanhã 6h na Lagoa?',
      likes: 11,
      comm: 5,
      when: 'há 6 h',
      flag: true
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'mural',
        label: 'Mural'
      }, {
        id: 'avisos',
        label: 'Avisos'
      }, {
        id: 'desafios',
        label: 'Ranking & desafios'
      }]
    }), tab === 'mural' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.5fr 1fr',
        gap: 18,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, posts.map((p, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      pad: "18px",
      style: {
        borderColor: p.flag ? 'var(--amber)' : 'var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: p.av,
      size: 40
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: strong
    }, p.who), /*#__PURE__*/React.createElement(Badge, {
      tone: p.role === 'Treinador' ? 'accent' : 'neutral',
      variant: "soft"
    }, p.role), p.pin && /*#__PURE__*/React.createElement(Badge, {
      tone: "ocean",
      variant: "outline"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 10,
      style: {
        marginRight: 3
      }
    }), "Fixado"), /*#__PURE__*/React.createElement("span", {
      style: {
        ...cap,
        marginLeft: 'auto'
      }
    }, p.when)), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body)',
        color: 'var(--text-body)',
        margin: '8px 0 12px'
      }
    }, p.txt), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        ...cap
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "heart",
      size: 14,
      color: "var(--text-muted)"
    }), p.likes), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        ...cap
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 14,
      color: "var(--text-muted)"
    }), p.comm), /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 'auto',
        display: 'flex',
        gap: 4
      }
    }, p.flag && /*#__PURE__*/React.createElement(Badge, {
      tone: "warning",
      variant: "soft",
      dot: true
    }, "denunciado"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pin",
      size: 14
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "trash-2",
      size: 14
    }))))))))), /*#__PURE__*/React.createElement(Card, {
      pad: "20px",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 13px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, "Publicar no mural"), /*#__PURE__*/React.createElement("textarea", {
      placeholder: "Escreva um aviso para a equipe\u2026",
      style: {
        minHeight: 90,
        padding: 12,
        border: '1.5px solid var(--border-strong)',
        borderRadius: 'var(--radius-8)',
        background: 'var(--creme-50)',
        font: 'var(--body)',
        color: 'var(--text-body)',
        resize: 'vertical'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "image",
        size: 15
      })
    }, "Imagem"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "pin",
        size: 15
      })
    }, "Fixar")), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "send",
        size: 15
      })
    }, "Publicar"))), tab === 'avisos' && /*#__PURE__*/React.createElement(Card, {
      pad: "24px",
      style: {
        maxWidth: 620,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: strong
    }, "Disparo para a equipe"), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, "Vai para o app e, opcionalmente, push e WhatsApp.")), /*#__PURE__*/React.createElement(Input, {
      label: "T\xEDtulo",
      placeholder: "Ex.: Mudan\xE7a no treino de quinta"
    }), /*#__PURE__*/React.createElement("textarea", {
      placeholder: "Mensagem\u2026",
      style: {
        minHeight: 100,
        padding: 12,
        border: '1.5px solid var(--border-strong)',
        borderRadius: 'var(--radius-8)',
        background: 'var(--creme-50)',
        font: 'var(--body)',
        color: 'var(--text-body)',
        resize: 'vertical'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 18,
        flexWrap: 'wrap'
      }
    }, [['Notificação no app', true], ['Push', true], ['WhatsApp', false], ['E-mail', false]].map(([l, on]) => /*#__PURE__*/React.createElement("label", {
      key: l,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement(Switch, {
      checked: on,
      size: "sm",
      onChange: () => {}
    }), l))), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "megaphone",
        size: 16
      }),
      style: {
        alignSelf: 'flex-start'
      }
    }, "Enviar para 1.245 atletas")), tab === 'desafios' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: strong
    }, "Ranking de volume \xB7 junho"), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm"
    }, "Configurar")), [['Marina Costa', '52,4 km', 1], ['Diego Martins', '48,1 km', 2], ['Paula Reis', '41,7 km', 3], ['Rodrigo Alves', '39,2 km', 4]].map(([n, km, r]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 20px',
        borderTop: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 15px/1 var(--font-mono)',
        color: r === 1 ? 'var(--terracota)' : 'var(--text-muted)',
        width: 22
      }
    }, r), /*#__PURE__*/React.createElement(Avatar, {
      name: n,
      size: 32
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        ...strong,
        flex: 1
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 13px/1 var(--font-mono)',
        color: 'var(--text-strong)'
      }
    }, km)))), /*#__PURE__*/React.createElement(Card, {
      pad: "20px",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: strong
    }, "Desafios ativos"), [['Desafio 100 km no mês', '842 participando', 'accent'], ['Streak de 7 dias', '310 ativos', 'ocean']].map(([t, s, tone]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-12)'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: tone,
      variant: "soft",
      style: {
        width: 36,
        height: 36,
        padding: 0,
        borderRadius: 999,
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "flame",
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: strong
    }, t), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, s)))), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      }),
      style: {
        alignSelf: 'flex-start'
      }
    }, "Criar desafio"))));
  }

  /* ============================ SETTINGS ============================ */
  function SettingsScreen() {
    const [tab, setTab] = useState('equipe');
    const team = [{
      n: 'Léo Andrade',
      role: 'Dono · admin',
      perms: 'Tudo',
      av: 'Léo Andrade'
    }, {
      n: 'Carla Nunes',
      role: 'Treinadora',
      perms: 'Treinos, atletas, agenda',
      av: 'Carla Nunes'
    }, {
      n: 'Rafael Souza',
      role: 'Financeiro',
      perms: 'Financeiro, comissões',
      av: 'Rafael Souza'
    }, {
      n: 'Bia Lopes',
      role: 'Recepção',
      perms: 'Captação, agenda',
      av: 'Bia Lopes'
    }, {
      n: 'Marketing',
      role: 'Marketing',
      perms: 'Site, comunidade',
      av: 'Marketing'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'equipe',
        label: 'Equipe & permissões'
      }, {
        id: 'assinatura',
        label: 'Assinatura'
      }, {
        id: 'pagamentos',
        label: 'Pagamentos'
      }, {
        id: 'conta',
        label: 'Conta'
      }]
    }), tab === 'equipe' && /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...head,
        padding: '18px 20px 0'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: strong
    }, "Pessoas com acesso"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "user-plus",
        size: 15
      })
    }, "Convidar")), /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Pessoa"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Papel"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Permiss\xF5es"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }))), /*#__PURE__*/React.createElement("tbody", null, team.map((m, i) => /*#__PURE__*/React.createElement("tr", {
      key: i
    }, /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: m.av,
      size: 32
    }), /*#__PURE__*/React.createElement("span", {
      style: strong
    }, m.n))), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: i === 0 ? 'accent' : 'neutral',
      variant: "soft"
    }, m.role)), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--text-muted)'
      }
    }, m.perms), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "pencil",
      size: 14
    })))))))), tab === 'assinatura' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "24px",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      variant: "soft",
      style: {
        alignSelf: 'flex-start'
      }
    }, "Plano atual"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--metric-xl)',
        fontSize: 34,
        color: 'var(--text-strong)'
      }
    }, "Membro")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 18px/1 var(--font-mono)',
        color: 'var(--text-strong)'
      }
    }, "R$ 59", /*#__PURE__*/React.createElement("span", {
      style: {
        ...cap
      }
    }, " /m\xEAs \xB7 anual")), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, "Site personalizado pela retake \xB7 sem marcas de patrocinadores \xB7 dom\xEDnio pr\xF3prio \xB7 at\xE9 5 programas divulgados"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Mudar plano"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Ver benef\xEDcios"))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-soft)',
        ...strong
      }
    }, "Faturas"), [['Jun 2026', 'R$ 59', 'paid'], ['Mai 2026', 'R$ 59', 'paid'], ['Abr 2026', 'R$ 59', 'paid']].map(([m, v, s]) => /*#__PURE__*/React.createElement("div", {
      key: m,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        borderTop: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, m), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 13px/1 var(--font-mono)',
        color: 'var(--text-strong)'
      }
    }, v), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      variant: "soft",
      dot: true
    }, "pago"), /*#__PURE__*/React.createElement(Icon, {
      name: "receipt",
      size: 15,
      color: "var(--text-muted)"
    })))))), tab === 'pagamentos' && /*#__PURE__*/React.createElement(Card, {
      pad: "24px",
      style: {
        maxWidth: 620,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 46,
        height: 46,
        borderRadius: 'var(--radius-8)',
        background: 'var(--green-100)',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check-circle-2",
      size: 24,
      color: "var(--green)"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: strong
    }, "Gateway conectado"), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, "Stripe \xB7 subconta do seu CNPJ \xB7 voc\xEA \xE9 o Merchant of Record")), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      variant: "soft",
      dot: true,
      style: {
        marginLeft: 'auto'
      }
    }, "ativo")), /*#__PURE__*/React.createElement(Card, {
      tone: "sunken",
      pad: "14px 16px",
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield",
      size: 16,
      color: "var(--azul-700)"
    }), /*#__PURE__*/React.createElement("span", {
      style: cap
    }, "No plano pago, quem vende \xE9 o seu CNPJ. A retake s\xF3 orquestra o split com fornecedores e a comiss\xE3o da rede.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm"
    }, "Trocar conta"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm"
    }, "Ver repasses"))), tab === 'conta' && /*#__PURE__*/React.createElement(Card, {
      pad: "24px",
      style: {
        maxWidth: 620,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "Nome da assessoria",
      defaultValue: "Acelera Run Club"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement(Input, {
      label: "CNPJ",
      defaultValue: "12.345.678/0001-90"
    }), /*#__PURE__*/React.createElement(Input, {
      label: "Cidade",
      defaultValue: "Rio de Janeiro \xB7 RJ"
    })), /*#__PURE__*/React.createElement(Input, {
      label: "E-mail de contato",
      defaultValue: "contato@acelera.run"
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      style: {
        alignSelf: 'flex-start'
      }
    }, "Salvar altera\xE7\xF5es")));
  }

  /* ============================ AGENDA ============================ */
  function AgendaScreen() {
    const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const sessions = {
      Seg: [['06h', 'Base · Aterro', 'Carla', 18, 24]],
      Ter: [['06h', 'Intervalado · Pista', 'Léo', 22, 24], ['19h', 'Base · Lagoa', 'Carla', 14, 20]],
      Qua: [['06h', 'Regenerativo', 'Carla', 9, 20]],
      Qui: [['06h', 'Tempo run', 'Léo', 20, 24], ['19h', 'Base · Lagoa', 'Carla', 16, 20]],
      Sex: [['06h', 'Base · Aterro', 'Carla', 12, 24]],
      'Sáb': [['06h', 'Longão', 'Léo', 38, 50]]
    };
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("div", {
      style: head
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: "semana",
      onChange: () => {},
      items: [{
        id: 'semana',
        label: 'Semana'
      }, {
        id: 'mes',
        label: 'Mês'
      }]
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      })
    }, "Nova sess\xE3o")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: 12
      }
    }, days.map(d => /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 12px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-muted)',
        textAlign: 'center',
        paddingBottom: 8,
        borderBottom: '1px solid var(--border-soft)'
      }
    }, d), (sessions[d] || []).map(([h, t, c, n, capn], i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      pad: "12px",
      interactive: true,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 13px/1 var(--font-mono)',
        color: 'var(--terracota)'
      }
    }, h), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 12.5px/1.25 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, t), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        ...cap
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 12,
      color: "var(--text-muted)"
    }), c), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 11px/1 var(--font-mono)',
        color: n >= capn ? 'var(--red)' : 'var(--text-strong)'
      }
    }, n, "/", capn), /*#__PURE__*/React.createElement(Badge, {
      tone: n >= capn ? 'danger' : 'success',
      variant: "soft"
    }, n >= capn ? 'lotado' : 'check-in'))))))));
  }

  /* ============================ ATHLETES + DETAIL ============================ */
  const ATH = [{
    n: 'Marina Costa',
    plan: 'Performance',
    goal: 'Sub 1h45 nos 21k',
    status: 'online',
    adh: 94,
    pace: '4:32',
    since: 'mar 2024',
    pay: 'em dia'
  }, {
    n: 'Diego Martins',
    plan: 'Performance',
    goal: 'Primeira maratona',
    status: 'online',
    adh: 88,
    pace: '5:10',
    since: 'jan 2025',
    pay: 'em dia'
  }, {
    n: 'Paula Reis',
    plan: 'Base',
    goal: 'Voltar a correr',
    status: 'paused',
    adh: 61,
    pace: '6:20',
    since: 'set 2025',
    pay: 'pendente'
  }, {
    n: 'Rodrigo Alves',
    plan: 'Performance',
    goal: 'Sub 45 nos 10k',
    status: 'risk',
    adh: 42,
    pace: '4:58',
    since: 'nov 2024',
    pay: 'atrasado'
  }];
  function AthleteDetail({
    a,
    onBack
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onBack,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        alignSelf: 'flex-start',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        font: '600 12px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-left",
      size: 15
    }), "Atletas"), /*#__PURE__*/React.createElement(Card, {
      pad: "24px"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: a.n,
      size: 64,
      status: a.status,
      ring: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--h2)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)',
        color: 'var(--text-strong)'
      }
    }, a.n), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      variant: "soft"
    }, a.plan), /*#__PURE__*/React.createElement(Badge, {
      tone: a.pay === 'em dia' ? 'success' : a.pay === 'pendente' ? 'warning' : 'danger',
      variant: "soft",
      dot: true
    }, a.pay), /*#__PURE__*/React.createElement("span", {
      style: {
        ...cap,
        alignSelf: 'center'
      }
    }, "aluno desde ", a.since))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "message-circle",
        size: 15
      })
    }, "Mensagem"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "activity",
        size: 15
      })
    }, "Prescrever")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Ades\xE3o",
      value: a.adh,
      unit: "%",
      accent: a.adh < 60,
      caption: "\xFAltimas 4 semanas"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Pace m\xE9dio",
      value: a.pace,
      unit: "/km"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Volume m\xEAs",
      value: "128",
      unit: "km",
      delta: 6
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Meta",
      value: "21K",
      caption: a.goal
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-soft)',
        ...strong
      }
    }, "\xDAltimos treinos \xB7 prescrito \xD7 executado"), [['Intervalado 10×800m', 'done', 'há 1 dia'], ['Longão 24km', 'done', 'há 3 dias'], ['Tempo run 8km', 'partial', 'há 4 dias'], ['Regenerativo 6km', 'missed', 'há 5 dias']].map(([t, s, w], i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 20px',
        borderTop: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, t), /*#__PURE__*/React.createElement("span", {
      style: cap
    }, w), /*#__PURE__*/React.createElement(ComplianceTag, {
      status: s,
      size: "sm"
    })))), /*#__PURE__*/React.createElement(Card, {
      pad: "20px",
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: strong
    }, "Anamnese & sa\xFAde"), [['Lesões', 'Tendinite no joelho D (2023)'], ['Restrições', 'Nenhuma atual'], ['FC repouso', '52 bpm'], ['PSE médio', '6 / 10']].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: 10,
        paddingBottom: 8,
        borderBottom: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: cap
    }, k), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-body)',
        textAlign: 'right'
      }
    }, v))))));
  }
  function AthletesScreen2() {
    const [tab, setTab] = useState('all');
    const [open, setOpen] = useState(null);
    if (open) return /*#__PURE__*/React.createElement(AthleteDetail, {
      a: open,
      onBack: () => setOpen(null)
    });
    const st = {
      online: ['success', 'Ativo'],
      paused: ['warning', 'Pausado'],
      risk: ['danger', 'Em risco']
    };
    const filt = ATH.filter(a => tab === 'all' || tab === 'risk' && a.status === 'risk' || tab === 'active' && a.status !== 'risk');
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement("div", {
      style: head
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'Todos',
        count: 1245
      }, {
        id: 'active',
        label: 'Ativos',
        count: 1118
      }, {
        id: 'risk',
        label: 'Em risco',
        count: 34
      }]
    }), /*#__PURE__*/React.createElement(Input, {
      placeholder: "Buscar atleta",
      prefix: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 16
      }),
      style: {
        width: 240
      }
    })), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: '100%',
        borderCollapse: 'collapse'
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Atleta"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Plano"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Meta"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Ades\xE3o"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Pagamento"), /*#__PURE__*/React.createElement("th", {
      style: th
    }, "Status"), /*#__PURE__*/React.createElement("th", {
      style: {
        ...th,
        textAlign: 'right'
      }
    }))), /*#__PURE__*/React.createElement("tbody", null, filt.map((a, i) => /*#__PURE__*/React.createElement("tr", {
      key: i,
      onClick: () => setOpen(a),
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: a.n,
      size: 34,
      status: a.status
    }), /*#__PURE__*/React.createElement("span", {
      style: strong
    }, a.n))), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      variant: "soft"
    }, a.plan)), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        color: 'var(--text-muted)'
      }
    }, a.goal), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 13px/1 var(--font-mono)',
        color: a.adh < 60 ? 'var(--red)' : a.adh < 80 ? 'var(--amber)' : 'var(--green)'
      }
    }, a.adh, "%")), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: a.pay === 'em dia' ? 'success' : a.pay === 'pendente' ? 'warning' : 'danger',
      variant: "soft",
      dot: true
    }, a.pay)), /*#__PURE__*/React.createElement("td", {
      style: td
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: st[a.status][0],
      variant: "soft",
      dot: true
    }, st[a.status][1])), /*#__PURE__*/React.createElement("td", {
      style: {
        ...td,
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 16,
      color: "var(--cinza-mineral)"
    }))))))));
  }

  /* ============================ STRUCTURED TRAINING ============================ */
  function TrainingPlanScreen() {
    const [tab, setTab] = useState('plano');
    const phases = [{
      name: 'Base',
      weeks: 6,
      color: 'var(--azul-oceano)',
      vol: 'Volume crescente · Z2',
      done: true
    }, {
      name: 'Específico',
      weeks: 5,
      color: 'var(--amber)',
      vol: 'Limiar e tempo run',
      done: true
    }, {
      name: 'Pico',
      weeks: 3,
      color: 'var(--terracota)',
      vol: 'VO₂max · ritmo de prova',
      current: true
    }, {
      name: 'Polimento',
      weeks: 2,
      color: 'var(--cinza-mineral)',
      vol: 'Redução de carga'
    }];
    const lib = [['Intervalado VO₂max', '10×800m · rec 200m', 'activity', 'accent'], ['Longão progressivo', '28–32 km · final forte', 'route', 'ocean'], ['Tempo run', '3×10min @ limiar', 'gauge', 'accent'], ['Fartlek', '60min · 1–3min variados', 'shuffle', 'neutral'], ['Regenerativo', '40min Z1 · solto', 'heart-pulse', 'ocean'], ['Tiros curtos', '12×400m · velocidade', 'zap', 'accent']];
    const week = [['Seg', 'done'], ['Ter', 'done'], ['Qua', 'partial'], ['Qui', 'planned'], ['Sex', 'planned'], ['Sáb', 'planned'], ['Dom', 'planned']];
    return /*#__PURE__*/React.createElement("div", {
      style: wrap
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'plano',
        label: 'Planejamento'
      }, {
        id: 'biblioteca',
        label: 'Biblioteca'
      }, {
        id: 'compliance',
        label: 'Prescrito × executado'
      }]
    }), tab === 'plano' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: head
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: strong
    }, "Maratona do Rio \xB7 macrociclo"), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, "16 semanas \xB7 meta sub 3h30 \xB7 pico em 03 ago")), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      })
    }, "Novo mesociclo")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 12
      }
    }, phases.map(p => /*#__PURE__*/React.createElement(Card, {
      key: p.name,
      pad: "18px",
      style: {
        borderTop: `4px solid ${p.color}`,
        opacity: p.done ? 0.7 : 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--h4)',
        textTransform: 'uppercase',
        color: 'var(--text-strong)'
      }
    }, p.name), p.current && /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      variant: "soft",
      dot: true
    }, "agora"), p.done && /*#__PURE__*/React.createElement(Icon, {
      name: "check-circle-2",
      size: 16,
      color: "var(--green)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        font: '700 13px/1 var(--font-mono)',
        color: 'var(--text-muted)',
        marginBottom: 6
      }
    }, p.weeks, " semanas"), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, p.vol)))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-soft)',
        ...strong
      }
    }, "Microciclo desta semana \xB7 fase Pico"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 0
      }
    }, week.map(([d, s], i) => /*#__PURE__*/React.createElement("div", {
      key: d,
      style: {
        padding: '14px 12px',
        borderLeft: i ? '1px solid var(--border-soft)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 11px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-muted)'
      }
    }, d), /*#__PURE__*/React.createElement(ComplianceTag, {
      status: s,
      showLabel: false
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '10px/1.2 var(--font-body)',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }
    }, ['10×800m', 'Tempo', 'Reg.', 'Tiros', 'Base', 'Longão', 'Folga'][i])))))), tab === 'biblioteca' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: head
    }, /*#__PURE__*/React.createElement("span", {
      style: strong
    }, "Biblioteca de treinos \xB7 reutiliz\xE1veis"), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      })
    }, "Novo treino")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12
      }
    }, lib.map(([t, d, ic, tone], i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      pad: "18px",
      interactive: true,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: tone,
      variant: "soft",
      style: {
        width: 38,
        height: 38,
        padding: 0,
        borderRadius: 'var(--radius-8)',
        display: 'grid',
        placeItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 19
    })), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        padding: '0 8px'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "copy",
      size: 15
    }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: strong
    }, t), /*#__PURE__*/React.createElement("div", {
      style: cap
    }, d)), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      style: {
        alignSelf: 'flex-start'
      }
    }, "Prescrever"))))), tab === 'compliance' && /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-soft)',
        ...strong
      }
    }, "Ades\xE3o da equipe \xB7 esta semana"), ATH.map((a, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 20px',
        borderTop: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: a.n,
      size: 32
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        ...strong,
        flex: 1
      }
    }, a.n), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 5
      }
    }, ['done', 'done', 'partial', 'planned', 'planned', 'planned', 'planned'].map((s, j) => /*#__PURE__*/React.createElement(ComplianceTag, {
      key: j,
      status: j < 3 ? s : 'planned',
      showLabel: false
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '700 13px/1 var(--font-mono)',
        color: a.adh < 60 ? 'var(--red)' : 'var(--green)',
        width: 44,
        textAlign: 'right'
      }
    }, a.adh, "%")))));
  }
  Object.assign(window, {
    RTK: {
      ...(window.RTK || {}),
      CommunityScreen,
      SettingsScreen,
      AgendaScreen,
      AthletesScreen2,
      TrainingPlanScreen
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/DashboardExtra.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/SiteScreen.jsx
try { (() => {
/* Dashboard — tela "Meu site": cadastro que alimenta o site público + vibe coding.
   Attaches to window.RTK. */
;
(function () {
  const {
    Card,
    Badge,
    Avatar,
    Button,
    Input,
    Switch,
    Icon
  } = window.RT;
  const {
    useState
  } = React;

  /* linha de cadastro editável (mock) */
  function FieldRow({
    label,
    value,
    hint
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 120,
        flex: 'none',
        font: '600 11px/1.3 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: 'var(--body-sm)',
        color: 'var(--text-strong)'
      }
    }, value), hint && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, hint), /*#__PURE__*/React.createElement(Icon, {
      name: "pencil",
      size: 14,
      color: "var(--cinza-mineral)"
    }));
  }
  function SiteScreen() {
    const [aiStep, setAiStep] = useState(0); // 0 = proposta, 1 = aplicado
    const coaches = [{
      name: 'Léo Martins',
      role: 'Head coach · CREF 12345',
      on: true
    }, {
      name: 'Carol Dias',
      role: 'Treinadora · Iniciantes',
      on: true
    }, {
      name: 'Pedro Souza',
      role: 'Treinador · Trail',
      on: false
    }];
    const offers = [{
      name: 'Presencial',
      price: 'R$ 249/mês',
      on: true,
      hot: true
    }, {
      name: 'Híbrido',
      price: 'R$ 199/mês',
      on: true
    }, {
      name: 'Online',
      price: 'R$ 149/mês',
      on: true
    }, {
      name: 'Recovery avulso',
      price: 'R$ 60/sessão',
      on: false
    }];
    const [coachState, setCoachState] = useState(coaches.map(c => c.on));
    const [offerState, setOfferState] = useState(offers.map(o => o.on));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 340px)',
        gap: 20,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Card, {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 46,
        height: 46,
        borderRadius: 'var(--radius-12)',
        background: 'var(--green-100)',
        display: 'grid',
        placeItems: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "globe",
      size: 22,
      color: "var(--green)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 15px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, "acelera.retake.run"), /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, "No ar"), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      variant: "outline"
    }, "Plano Essencial \xB7 gr\xE1tis")), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "O site projeta este cadastro \u2014 toda edi\xE7\xE3o publica em segundos.")), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "external-link",
        size: 14
      })
    }, "Ver site")), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 22px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0
      }
    }, "Identidade"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "tenant_themes \xB7 v12")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '4px 22px 8px'
      }
    }, /*#__PURE__*/React.createElement(FieldRow, {
      label: "Logo",
      value: "acelera-logo.svg",
      hint: "enviado 02 jun"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '11px 0',
        borderBottom: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 120,
        flex: 'none',
        font: '600 11px/1.3 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)'
      }
    }, "Paleta"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, ['#D96C3A', '#1D1D1B', '#F6E2D6'].map((c, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        width: 22,
        height: 22,
        borderRadius: 999,
        background: c,
        border: '1px solid var(--border-strong)'
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: 'var(--body-sm)',
        color: 'var(--text-strong)'
      }
    }, "Brasa"), /*#__PURE__*/React.createElement(Icon, {
      name: "pencil",
      size: 14,
      color: "var(--cinza-mineral)"
    })), /*#__PURE__*/React.createElement(FieldRow, {
      label: "Headline",
      value: "Corra com quem leva voc\xEA mais longe.",
      hint: "gerada por IA"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '11px 0'
      }
    }, /*#__PURE__*/React.createElement(FieldRow, {
      label: "Cidade",
      value: "Rio de Janeiro \xB7 RJ"
    })))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 22px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0
      }
    }, "Treinadores no site"), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm"
    }, "Adicionar")), coaches.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 22px',
        borderBottom: i < coaches.length - 1 ? '1px solid var(--border-soft)' : 'none',
        opacity: coachState[i] ? 1 : 0.55
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: c.name,
      size: 36
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, c.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, c.role)), /*#__PURE__*/React.createElement(Switch, {
      size: "sm",
      checked: coachState[i],
      onChange: v => setCoachState(coachState.map((s, j) => j === i ? v : s))
    })))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 22px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0
      }
    }, "Planos & servi\xE7os no site"), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm"
    }, "Adicionar")), offers.map((o, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 22px',
        borderBottom: i < offers.length - 1 ? '1px solid var(--border-soft)' : 'none',
        opacity: offerState[i] ? 1 : 0.55
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, o.name, o.hot && /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      variant: "soft",
      style: {
        marginLeft: 8
      }
    }, "Destaque")), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--metric)',
        fontSize: 15,
        color: 'var(--text-strong)'
      }
    }, o.price), /*#__PURE__*/React.createElement(Switch, {
      size: "sm",
      checked: offerState[i],
      onChange: v => setOfferState(offerState.map((s, j) => j === i ? v : s))
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 22px',
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        background: 'var(--surface-sunken)',
        borderRadius: '0 0 var(--radius-16) var(--radius-16)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 14,
      color: "var(--cinza-mineral)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "Checkout e produtos pr\xF3prios s\xE3o do plano Personalizado \u2014 no Essencial o site s\xF3 capta."), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm",
      style: {
        marginLeft: 'auto'
      }
    }, "Fazer upgrade \u2192")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Card, {
      tone: "dark",
      pad: "0",
      style: {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px 18px',
        borderBottom: '1px solid var(--border-on-dark)',
        display: 'flex',
        alignItems: 'center',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 17,
      color: "var(--terracota)"
    }), /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0,
        color: 'var(--text-on-dark)'
      }
    }, "Editar com IA"), /*#__PURE__*/React.createElement(Badge, {
      tone: "ocean",
      variant: "soft",
      style: {
        marginLeft: 'auto'
      }
    }, "12 cr\xE9ditos")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        alignSelf: 'flex-end',
        maxWidth: '88%',
        background: 'var(--terracota)',
        color: 'var(--creme)',
        borderRadius: '14px 14px 4px 14px',
        padding: '10px 13px',
        font: 'var(--body-sm)',
        fontSize: 13
      }
    }, "Reescreve a se\xE7\xE3o \"sobre\" com foco em quem est\xE1 come\xE7ando do zero"), /*#__PURE__*/React.createElement("div", {
      style: {
        alignSelf: 'flex-start',
        maxWidth: '94%',
        background: 'var(--grafite-ink)',
        border: '1px solid var(--border-on-dark)',
        borderRadius: '14px 14px 14px 4px',
        padding: '12px 14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--terracota-300)',
        marginBottom: 7
      }
    }, "Proposta \xB7 textos \u203A sobre"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body-sm)',
        fontSize: 13,
        color: 'var(--text-on-dark)',
        margin: '0 0 10px'
      }
    }, "\"Nunca correu? Perfeito. A Acelera nasceu pra te levar do sof\xE1 ao seu primeiro 5k \u2014 no seu ritmo, com treino estruturado e um grupo que celebra cada quil\xF4metro.\""), aiStep === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      onClick: () => setAiStep(1)
    }, "Aplicar no site"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        color: 'var(--text-on-dark)'
      }
    }, "Refazer")) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        font: '600 12px/1.3 var(--font-body)',
        color: 'var(--green)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "circle-check",
      size: 15,
      color: "var(--green)"
    }), "Aplicado \xB7 site republicado em 3s"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        padding: 14,
        borderTop: '1px solid var(--border-on-dark)',
        display: 'flex',
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("input", {
      placeholder: "Pedir uma mudan\xE7a no site\u2026",
      style: {
        flex: 1,
        minWidth: 0,
        height: 40,
        padding: '0 13px',
        borderRadius: 'var(--radius-8)',
        border: '1px solid var(--border-on-dark)',
        background: 'var(--grafite-ink)',
        color: 'var(--creme)',
        font: 'var(--body-sm)',
        outline: 'none'
      }
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm",
      style: {
        height: 40
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-up",
      size: 16
    })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: '0 0 12px'
      }
    }, "Gerar com IA"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, [['wand-sparkles', 'Headline nova para o herói'], ['user', 'Bio do treinador Pedro Souza'], ['list', 'Descrição dos grupos de treino']].map((s, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 12px',
        borderRadius: 'var(--radius-8)',
        border: '1px solid var(--border-soft)',
        background: 'var(--creme-50)',
        cursor: 'pointer',
        font: 'var(--body-sm)',
        fontSize: 13,
        color: 'var(--text-body)',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s[0],
      size: 15,
      color: "var(--terracota)"
    }), s[1]))))));
  }
  Object.assign(window, {
    RTK: {
      ...(window.RTK || {}),
      SiteScreen
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/SiteScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/screens.jsx
try { (() => {
/* Dashboard screens. Attaches to window.RTK. */
;
(function () {
  const {
    Card,
    StatCard,
    Badge,
    Avatar,
    Button,
    Tabs,
    Input,
    ComplianceTag,
    Icon
  } = window.RT;
  const {
    useState
  } = React;

  /* --- simple line chart (data-viz, brand-styled) --- */
  function LineChart({
    data,
    height = 180,
    color = 'var(--grafite)',
    fill = false
  }) {
    const w = 640,
      pad = 8;
    const max = Math.max(...data),
      min = Math.min(...data);
    const span = max - min || 1;
    const pts = data.map((v, i) => {
      const x = pad + i / (data.length - 1) * (w - pad * 2);
      const y = pad + (1 - (v - min) / span) * (height - pad * 2);
      return [x, y];
    });
    const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const area = line + ` L ${pts[pts.length - 1][0].toFixed(1)} ${height} L ${pts[0][0].toFixed(1)} ${height} Z`;
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${w} ${height}`,
      preserveAspectRatio: "none",
      style: {
        width: '100%',
        height,
        display: 'block'
      }
    }, [0.25, 0.5, 0.75].map(g => /*#__PURE__*/React.createElement("line", {
      key: g,
      x1: "0",
      x2: w,
      y1: height * g,
      y2: height * g,
      stroke: "var(--creme-200)",
      strokeWidth: "1"
    })), fill && /*#__PURE__*/React.createElement("path", {
      d: area,
      fill: "var(--terracota-100)",
      opacity: "0.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: line,
      fill: "none",
      stroke: color,
      strokeWidth: "2.5",
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }), pts.filter((_, i) => i === pts.length - 1).map((p, i) => /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: p[0],
      cy: p[1],
      r: "4.5",
      fill: "var(--terracota)",
      stroke: "var(--creme-50)",
      strokeWidth: "2"
    })));
  }
  const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

  /* ============================ OVERVIEW ============================ */
  function OverviewScreen() {
    const [tab, setTab] = useState('revenue');
    const series = {
      revenue: [82, 88, 91, 104, 119, 128],
      athletes: [980, 1010, 1066, 1120, 1180, 1245]
    };
    const risk = [{
      name: 'Rafael Tavares',
      meta: 'Sumiu há 9 dias',
      status: 'missed'
    }, {
      name: 'Luiza Andrade',
      meta: '2 treinos perdidos',
      status: 'partial'
    }, {
      name: 'Pedro Nunes',
      meta: 'Contrato vence em 3d',
      status: 'partial'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Alunos ativos",
      value: "1.245",
      delta: 11,
      caption: "vs m\xEAs anterior"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Treinos conclu\xEDdos",
      value: "8.652",
      delta: 9,
      caption: "esta semana"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Faturamento",
      value: "R$ 128.650",
      delta: 10,
      accent: true,
      caption: "MRR"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.7fr 1fr',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 24px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--h3)',
        margin: '0 0 2px'
      }
    }, "Desempenho"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "\xDAltimos 6 meses")), /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'revenue',
        label: 'Receita'
      }, {
        id: 'athletes',
        label: 'Atletas'
      }],
      style: {
        border: 'none'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 16px 12px'
      }
    }, /*#__PURE__*/React.createElement(LineChart, {
      data: series[tab],
      fill: true
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 8px',
        font: 'var(--mono-sm)',
        color: 'var(--text-muted)'
      }
    }, MONTHS.map(m => /*#__PURE__*/React.createElement("span", {
      key: m
    }, m))))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 20px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "triangle-alert",
      size: 18,
      color: "var(--terracota)"
    }), /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0
      }
    }, "Atletas em risco")), /*#__PURE__*/React.createElement("div", null, risk.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 20px',
        borderBottom: i < risk.length - 1 ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.name,
      size: 38,
      status: "risk"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, r.meta)), /*#__PURE__*/React.createElement(ComplianceTag, {
      status: r.status,
      showLabel: false
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 14
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "text"
    }, "Ver todos \u2192"))))));
  }

  /* ============================ ATHLETES ============================ */
  function AthletesScreen() {
    const [tab, setTab] = useState('all');
    const rows = [{
      name: 'Marina Costa',
      group: 'Elite · Maratona',
      level: 'Avançado',
      status: ['success', 'Ativo'],
      comp: 'done',
      last: 'Hoje'
    }, {
      name: 'João Reis',
      group: 'Base · 10k',
      level: 'Intermediário',
      status: ['warning', 'Pausado'],
      comp: 'partial',
      last: '2 dias'
    }, {
      name: 'Bia Lima',
      group: 'Iniciante',
      level: 'Iniciante',
      status: ['success', 'Ativo'],
      comp: 'done',
      last: 'Ontem'
    }, {
      name: 'Rafael Tavares',
      group: 'Elite · Maratona',
      level: 'Avançado',
      status: ['danger', 'Inadimplente'],
      comp: 'missed',
      last: '9 dias'
    }, {
      name: 'Camila Souza',
      group: 'Base · 21k',
      level: 'Intermediário',
      status: ['success', 'Ativo'],
      comp: 'done',
      last: 'Hoje'
    }, {
      name: 'Diego Martins',
      group: 'Base · 10k',
      level: 'Intermediário',
      status: ['success', 'Ativo'],
      comp: 'partial',
      last: 'Ontem'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'Todos',
        count: 1245
      }, {
        id: 'active',
        label: 'Ativos',
        count: 1118
      }, {
        id: 'risk',
        label: 'Em risco',
        count: 34
      }]
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Buscar atleta",
      prefix: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 16
      }),
      style: {
        width: 240
      }
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 17
      })
    }, "Novo atleta"))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2.2fr 1.6fr 1.2fr 1fr 0.9fr',
        padding: '12px 22px',
        borderBottom: '1px solid var(--border-soft)',
        font: '600 11px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Atleta"), /*#__PURE__*/React.createElement("span", null, "Grupo"), /*#__PURE__*/React.createElement("span", null, "Status"), /*#__PURE__*/React.createElement("span", null, "Compliance"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right'
      }
    }, "Atividade")), rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'grid',
        gridTemplateColumns: '2.2fr 1.6fr 1.2fr 1fr 0.9fr',
        alignItems: 'center',
        padding: '13px 22px',
        borderBottom: i < rows.length - 1 ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: r.name,
      size: 38,
      status: r.status[0] === 'danger' ? 'risk' : r.status[0] === 'warning' ? 'paused' : 'online'
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, r.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, r.level))), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, r.group), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Badge, {
      tone: r.status[0],
      dot: true
    }, r.status[1])), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(ComplianceTag, {
      status: r.comp,
      size: "sm"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        font: 'var(--mono-sm)',
        color: 'var(--text-muted)'
      }
    }, r.last)))));
  }

  /* ============================ TRAINING ============================ */
  function TrainingScreen() {
    const week = [{
      d: 'Seg',
      s: 'done'
    }, {
      d: 'Ter',
      s: 'done'
    }, {
      d: 'Qua',
      s: 'partial'
    }, {
      d: 'Qui',
      s: 'planned'
    }, {
      d: 'Sex',
      s: 'planned'
    }, {
      d: 'Sáb',
      s: 'planned'
    }, {
      d: 'Dom',
      s: 'planned'
    }];
    const steps = [{
      name: 'Aquecimento',
      detail: '15 min · Z1–Z2',
      target: '5:30 /km',
      comp: 'done',
      exec: '5:24 /km'
    }, {
      name: 'Série principal · 10×800m',
      detail: 'recuperação 200m trote',
      target: '3:45 /km',
      comp: 'done',
      exec: '3:43 /km',
      main: true
    }, {
      name: 'Volta à calma',
      detail: '10 min · Z1',
      target: '6:00 /km',
      comp: 'partial',
      exec: '5:10 /km'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: 20,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow"
    }, "Microciclo \xB7 Semana 6 de 12"), /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--h3)',
        margin: '4px 0 0'
      }
    }, "Bloco Build \xB7 Maratona")), /*#__PURE__*/React.createElement(Badge, {
      tone: "ocean",
      variant: "soft"
    }, "Carga alvo 78%")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7,1fr)',
        gap: 8
      }
    }, week.map((w, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        textAlign: 'center',
        padding: '12px 4px',
        borderRadius: 'var(--radius-12)',
        background: w.s === 'planned' ? 'var(--surface-sunken)' : 'var(--surface-card)',
        border: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
        marginBottom: 8
      }
    }, w.d), /*#__PURE__*/React.createElement(ComplianceTag, {
      status: w.s,
      showLabel: false,
      style: {
        margin: '0 auto'
      }
    }))))), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px 24px',
        borderBottom: '1px solid var(--border-soft)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow"
    }, "Quarta-feira \xB7 Treino do dia"), /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--h3)',
        margin: '4px 0 0'
      }
    }, "Intervalado \xB7 VO\u2082max")), /*#__PURE__*/React.createElement(ComplianceTag, {
      status: "partial"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 130px 130px',
        padding: '10px 24px',
        font: '600 11px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-muted)',
        borderBottom: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Etapa"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right'
      }
    }, "Prescrito"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right'
      }
    }, "Executado")), steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 130px 130px',
        alignItems: 'center',
        padding: '15px 24px',
        borderBottom: i < steps.length - 1 ? '1px solid var(--border-soft)' : 'none',
        background: s.main ? 'var(--terracota-100)' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11
      }
    }, /*#__PURE__*/React.createElement(ComplianceTag, {
      status: s.comp,
      showLabel: false
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 15px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, s.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, s.detail))), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        font: 'var(--metric)',
        fontSize: 18,
        color: 'var(--text-strong)'
      }
    }, s.target), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        font: 'var(--metric)',
        fontSize: 18,
        color: s.comp === 'partial' ? 'var(--amber)' : 'var(--green)'
      }
    }, s.exec))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "pencil",
        size: 15
      })
    }, "Ajustar"), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm"
    }, "Ver no app do atleta \u2192")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: '0 0 14px'
      }
    }, "Thresholds \xB7 Marina"), [['Pace de limiar', '3:52 /km'], ['FC de limiar', '172 bpm'], ['VO₂max', '54,2']].map((t, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: i < 2 ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-muted)'
      }
    }, t[0]), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--metric)',
        fontSize: 17,
        color: 'var(--text-strong)'
      }
    }, t[1])))), /*#__PURE__*/React.createElement(Card, {
      tone: "dark"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "sparkles",
      size: 18,
      color: "var(--terracota)"
    }), /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0,
        color: 'var(--text-on-dark)'
      }
    }, "Sugest\xE3o da IA")), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-on-dark-muted)',
        margin: '0 0 14px'
      }
    }, "Marina vem batendo o pace alvo com folga. Subir a s\xE9rie principal para 12\xD7800m no pr\xF3ximo microciclo?"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      size: "sm"
    }, "Aplicar"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      size: "sm",
      style: {
        color: 'var(--text-on-dark)'
      }
    }, "Dispensar")))));
  }

  /* ============================ FINANCE ============================ */
  function FinanceScreen() {
    const [tab, setTab] = useState('all');
    const tx = [{
      who: 'Marina Costa',
      kind: 'Mensalidade · Performance',
      amt: '+ R$ 289,00',
      tone: 'success',
      when: 'Hoje · 09:12',
      method: 'Cartão'
    }, {
      who: 'Diego Martins',
      kind: 'Avulso · Recovery (2 sessões)',
      amt: '+ R$ 120,00',
      tone: 'success',
      when: 'Hoje · 08:40',
      method: 'Pix'
    }, {
      who: 'Repasse · Maurten',
      kind: 'Marketplace · split fornecedor',
      amt: '− R$ 412,30',
      tone: 'neutral',
      when: 'Ontem',
      method: 'Connect'
    }, {
      who: 'Rafael Tavares',
      kind: 'Mensalidade · Elite',
      amt: 'Falha · inadimplente',
      tone: 'danger',
      when: '9 dias',
      method: 'Cartão'
    }, {
      who: 'Camila Souza',
      kind: 'Mensalidade · Base',
      amt: '+ R$ 189,00',
      tone: 'success',
      when: 'Ontem',
      method: 'Pix'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "MRR",
      value: "R$ 128.650",
      delta: 10,
      accent: true,
      caption: "recorrente"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "A receber",
      value: "R$ 42.300",
      caption: "pr\xF3ximos 30d"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Inadimpl\xEAncia",
      value: "3,2%",
      delta: -1,
      caption: "R$ 8.140"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Taxa plataforma",
      value: "R$ 6.432",
      caption: "5% marketplace"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.7fr 1fr',
        gap: 16,
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '18px 22px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'Tudo'
      }, {
        id: 'in',
        label: 'Entradas'
      }, {
        id: 'out',
        label: 'Repasses'
      }],
      style: {
        border: 'none'
      }
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "text",
      size: "sm"
    }, "Exportar CSV")), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid var(--border-soft)'
      }
    }, tx.map((t, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '14px 22px',
        borderBottom: i < tx.length - 1 ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 'var(--radius-12)',
        background: t.tone === 'danger' ? 'var(--red-100)' : t.tone === 'neutral' ? 'var(--creme-200)' : 'var(--green-100)',
        display: 'grid',
        placeItems: 'center',
        flex: 'none'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.tone === 'danger' ? 'triangle-alert' : t.tone === 'neutral' ? 'arrow-up-right' : 'arrow-down-left',
      size: 18,
      color: t.tone === 'danger' ? 'var(--red)' : t.tone === 'neutral' ? 'var(--text-muted)' : '#3C6E47'
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, t.who), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, t.kind)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--metric)',
        fontSize: 15,
        color: t.tone === 'danger' ? 'var(--red)' : t.tone === 'neutral' ? 'var(--text-body)' : '#3C6E47'
      }
    }, t.amt), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--mono-sm)',
        fontSize: 11,
        color: 'var(--text-muted)'
      }
    }, t.when, " \xB7 ", t.method)))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: '0 0 4px'
      }
    }, "Split do m\xEAs"), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, "Como o dinheiro se divide"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, [['Tenant (você)', 78, 'var(--terracota)'], ['Fornecedores', 14, 'var(--azul-oceano)'], ['Comissão treinadores', 5, 'var(--amber)'], ['Taxa retake.run', 3, 'var(--cinza-mineral)']].map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        font: 'var(--body-sm)',
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-body)'
      }
    }, s[0]), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-muted)'
      }
    }, s[1], "%")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 8,
        borderRadius: 999,
        background: 'var(--surface-sunken)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: s[1] + '%',
        height: '100%',
        background: s[2],
        borderRadius: 999
      }
    })))))), /*#__PURE__*/React.createElement(Card, {
      tone: "dark"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "banknote",
      size: 18,
      color: "var(--terracota)"
    }), /*#__PURE__*/React.createElement("h4", {
      style: {
        font: 'var(--h4)',
        margin: 0,
        color: 'var(--text-on-dark)'
      }
    }, "Pr\xF3ximo payout")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--metric-xl)',
        fontSize: 34,
        color: 'var(--text-on-dark)'
      }
    }, "R$ 121.840"), /*#__PURE__*/React.createElement("p", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-on-dark-muted)',
        margin: '6px 0 0'
      }
    }, "Sexta \xB7 via Stripe Connect \xB7 l\xEDquido de taxas")))));
  }

  /* ============================ MARKETPLACE (sourcing) ============================ */
  const FULFILL = {
    dropship: {
      tone: 'accent',
      label: 'Dropship',
      desc: 'Fornecedor entrega ao aluno',
      icon: 'truck',
      cta: 'Adicionar à loja'
    },
    stock: {
      tone: 'ocean',
      label: 'Revenda c/ estoque',
      desc: 'Você compra e entrega',
      icon: 'package',
      cta: 'Comprar estoque'
    },
    ondemand: {
      tone: 'neutral',
      label: 'Sob demanda',
      desc: 'Compra para uso próprio',
      icon: 'shirt',
      cta: 'Solicitar orçamento'
    }
  };
  function MarketplaceScreen() {
    const [tab, setTab] = useState('all');
    const products = [{
      name: 'Relógio GPS multiesporte',
      sup: 'Garmin · distribuidor',
      cost: 'R$ 2.890',
      margin: '14% comissão',
      model: 'dropship',
      cat: 'equip',
      c1: 'var(--grafite)',
      c2: 'var(--grafite-700)'
    }, {
      name: 'Kit suplementação · 30 dias',
      sup: 'Maurten BR',
      cost: 'R$ 420',
      margin: '12% comissão',
      model: 'dropship',
      cat: 'nutri',
      c1: 'var(--azul-oceano)',
      c2: 'var(--azul-700)'
    }, {
      name: 'Gel de carboidrato · avulso',
      sup: 'NutriRun Atacado',
      cost: 'R$ 6,90',
      margin: 'revende a R$ 12',
      model: 'stock',
      cat: 'nutri',
      c1: 'var(--amber)',
      c2: 'var(--terracota-600)'
    }, {
      name: 'Isotônico em pó · sachê',
      sup: 'NutriRun Atacado',
      cost: 'R$ 2,40',
      margin: 'revende a R$ 6',
      model: 'stock',
      cat: 'nutri',
      c1: 'var(--azul-300)',
      c2: 'var(--azul-oceano)'
    }, {
      name: 'Uniforme do time · kit 20un',
      sup: 'Confecção Pace',
      cost: 'sob orçamento',
      margin: 'personalizado',
      model: 'ondemand',
      cat: 'vest',
      c1: 'var(--terracota)',
      c2: 'var(--grafite)'
    }, {
      name: 'Tenda 3×3 com a marca do clube',
      sup: 'Tenda Sul',
      cost: 'sob orçamento',
      margin: 'uso próprio',
      model: 'ondemand',
      cat: 'equip',
      c1: 'var(--cinza-mineral)',
      c2: 'var(--grafite-600)'
    }];
    const filtered = products.filter(p => tab === 'all' || (tab === 'resale' ? p.model !== 'ondemand' : tab === 'ondemand' ? p.model === 'ondemand' : p.cat === tab));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        background: 'var(--azul-100)',
        border: '1px solid var(--azul-300)',
        borderRadius: 'var(--radius-12)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield-check",
      size: 20,
      color: "var(--azul-700)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--grafite)'
      }
    }, "Fornecedores s\xE3o ", /*#__PURE__*/React.createElement("strong", null, "aprovados pela retake.run"), " (KYC/KYB). Voc\xEA escolhe o que revender ou compra para uso do clube \u2014 o repasse e a comiss\xE3o s\xE3o autom\xE1ticos no checkout.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'Tudo',
        count: 142
      }, {
        id: 'resale',
        label: 'Para revender'
      }, {
        id: 'ondemand',
        label: 'Uso próprio'
      }, {
        id: 'nutri',
        label: 'Nutrição'
      }, {
        id: 'equip',
        label: 'Equipamento'
      }]
    }), /*#__PURE__*/React.createElement(Input, {
      placeholder: "Buscar produto ou fornecedor",
      prefix: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 16
      }),
      style: {
        width: 280
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 16
      }
    }, filtered.map((p, i) => {
      const f = FULFILL[p.model];
      return /*#__PURE__*/React.createElement(Card, {
        key: i,
        pad: "0",
        interactive: true,
        style: {
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: 110,
          background: `linear-gradient(135deg, ${p.c1}, ${p.c2})`,
          position: 'relative'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute',
          top: 12,
          left: 12
        }
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: f.tone,
        variant: "solid",
        dot: true
      }, f.label))), /*#__PURE__*/React.createElement("div", {
        style: {
          padding: '14px 16px 16px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          font: '600 15px/1.3 var(--font-body)',
          color: 'var(--text-strong)',
          minHeight: 40
        }
      }, p.name), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          margin: '4px 0 6px'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "store",
        size: 14,
        color: "var(--cinza-mineral)"
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--caption)',
          color: 'var(--text-muted)'
        }
      }, p.sup)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          marginBottom: 12
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: f.icon,
        size: 13,
        color: "var(--text-muted)"
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--caption)',
          color: 'var(--text-muted)'
        }
      }, f.desc)), /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          font: 'var(--metric)',
          fontSize: 18,
          color: 'var(--text-strong)'
        }
      }, p.cost), /*#__PURE__*/React.createElement("div", {
        style: {
          font: 'var(--caption)',
          color: 'var(--text-accent)'
        }
      }, p.margin)), /*#__PURE__*/React.createElement(Button, {
        variant: p.model === 'ondemand' ? 'secondary' : 'primary',
        size: "sm"
      }, f.cta))));
    })));
  }

  /* ============================ LEADS / CAPTAÇÃO ============================ */
  const LEAD_ORIGINS = {
    Instagram: 'accent',
    Indicação: 'ocean',
    Site: 'neutral',
    'Google Ads': 'warning'
  };
  function LeadCard({
    lead,
    isDragging,
    onDragStart,
    onDragEnd
  }) {
    return /*#__PURE__*/React.createElement("div", {
      draggable: true,
      onDragStart: e => onDragStart(e, lead),
      onDragEnd: onDragEnd,
      style: {
        background: 'var(--surface-card)',
        border: '1px solid var(--border-soft)',
        borderRadius: 'var(--radius-12)',
        padding: 14,
        boxShadow: 'var(--shadow-100)',
        cursor: 'grab',
        opacity: isDragging ? 0.35 : 1,
        transform: isDragging ? 'scale(0.98)' : 'none',
        transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)',
        userSelect: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: lead.name,
      size: 32
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.2 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, lead.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, lead.goal)), /*#__PURE__*/React.createElement(Icon, {
      name: "grip-vertical",
      size: 15,
      color: "var(--cinza-mineral)"
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: LEAD_ORIGINS[lead.origin] || 'neutral',
      variant: "soft",
      style: {
        fontSize: 10
      }
    }, lead.origin), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--metric)',
        fontSize: 14,
        color: 'var(--text-strong)'
      }
    }, lead.value)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        borderTop: '1px solid var(--border-soft)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        font: 'var(--caption)',
        color: lead.due === 'Atrasado' ? 'var(--red)' : 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "clock",
      size: 13,
      color: lead.due === 'Atrasado' ? 'var(--red)' : 'var(--cinza-mineral)'
    }), lead.follow), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        font: '600 11px/1 var(--font-body)',
        color: '#3C6E47',
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "message-circle",
      size: 14,
      color: "#3C6E47"
    }), "WhatsApp")));
  }
  const INITIAL_COLUMNS = [{
    id: 'new',
    label: 'Novo',
    tone: 'var(--cinza-mineral)',
    leads: [{
      id: 'l1',
      name: 'Thiago Borges',
      goal: 'Primeira maratona',
      origin: 'Instagram',
      value: 'R$ 289',
      follow: 'Hoje'
    }, {
      id: 'l2',
      name: 'Paula Reis',
      goal: 'Voltar a correr',
      origin: 'Google Ads',
      value: 'R$ 189',
      follow: 'Hoje'
    }]
  }, {
    id: 'contacted',
    label: 'Contatado',
    tone: 'var(--azul-oceano)',
    leads: [{
      id: 'l3',
      name: 'Rodrigo Alves',
      goal: 'Sub 45 nos 10k',
      origin: 'Indicação',
      value: 'R$ 240',
      follow: 'D+3 · amanhã'
    }]
  }, {
    id: 'visit',
    label: 'Visita agendada',
    tone: 'var(--amber)',
    leads: [{
      id: 'l4',
      name: 'Fernanda Dias',
      goal: 'Emagrecimento',
      origin: 'Site',
      value: 'R$ 189',
      follow: 'Sex · 18h'
    }, {
      id: 'l5',
      name: 'Marcos Lima',
      goal: 'Trail running',
      origin: 'Instagram',
      value: 'R$ 340',
      follow: 'Atrasado',
      due: 'Atrasado'
    }]
  }, {
    id: 'won',
    label: 'Convertido',
    tone: 'var(--green)',
    leads: [{
      id: 'l6',
      name: 'Júlia Santos',
      goal: 'Meia maratona',
      origin: 'Indicação',
      value: 'R$ 289',
      follow: 'Matriculada'
    }]
  }];
  function LeadsScreen() {
    const [view, setView] = useState('kanban');
    const [columns, setColumns] = useState(INITIAL_COLUMNS);
    const [dragId, setDragId] = useState(null);
    const [overCol, setOverCol] = useState(null);
    const onDragStart = (e, lead) => {
      setDragId(lead.id);
      e.dataTransfer.effectAllowed = 'move';
      try {
        e.dataTransfer.setData('text/plain', lead.id);
      } catch (_) {}
    };
    const onDragEnd = () => {
      setDragId(null);
      setOverCol(null);
    };
    const dropInto = (colId, idFromEvent) => {
      const movingId = idFromEvent || dragId;
      if (!movingId) {
        setOverCol(null);
        return;
      }
      setColumns(cols => {
        let moved = null;
        const without = cols.map(c => {
          const found = c.leads.find(l => l.id === movingId);
          if (found) {
            moved = found;
            return {
              ...c,
              leads: c.leads.filter(l => l.id !== movingId)
            };
          }
          return c;
        });
        if (!moved) return cols;
        return without.map(c => c.id === colId ? {
          ...c,
          leads: [...c.leads, moved]
        } : c);
      });
      setDragId(null);
      setOverCol(null);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        height: '100%',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: view,
      onChange: setView,
      items: [{
        id: 'kanban',
        label: 'Funil'
      }, {
        id: 'list',
        label: 'Lista'
      }]
    }), view === 'kanban' && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "move",
      size: 13,
      color: "var(--cinza-mineral)"
    }), "arraste os cards entre as etapas")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Input, {
      placeholder: "Buscar lead",
      prefix: /*#__PURE__*/React.createElement(Icon, {
        name: "search",
        size: 16
      }),
      style: {
        width: 220
      }
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 17
      })
    }, "Novo lead"))), view === 'kanban' ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 14,
        flex: 1,
        minHeight: 0
      }
    }, columns.map(col => {
      const isOver = overCol === col.id && dragId;
      return /*#__PURE__*/React.createElement("div", {
        key: col.id,
        onDragOver: e => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (overCol !== col.id) setOverCol(col.id);
        },
        onDragLeave: e => {
          if (!e.currentTarget.contains(e.relatedTarget)) setOverCol(c => c === col.id ? null : c);
        },
        onDrop: e => {
          e.preventDefault();
          const id = (() => {
            try {
              return e.dataTransfer.getData('text/plain');
            } catch (_) {
              return null;
            }
          })();
          dropInto(col.id, id);
        },
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          background: isOver ? 'var(--terracota-100)' : 'var(--surface-sunken)',
          borderRadius: 'var(--radius-16)',
          padding: 12,
          border: isOver ? '2px dashed var(--terracota)' : '2px solid transparent',
          transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)',
          boxSizing: 'border-box'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2px 4px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          font: '600 12px/1 var(--font-body)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-strong)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 9,
          height: 9,
          borderRadius: 999,
          background: col.tone
        }
      }), col.label), /*#__PURE__*/React.createElement("span", {
        style: {
          font: '700 11px/1 var(--font-mono)',
          color: 'var(--text-muted)',
          background: 'var(--creme-50)',
          borderRadius: 999,
          padding: '3px 7px'
        }
      }, col.leads.length)), col.leads.map(l => /*#__PURE__*/React.createElement(LeadCard, {
        key: l.id,
        lead: l,
        isDragging: dragId === l.id,
        onDragStart: onDragStart,
        onDragEnd: onDragEnd
      })), col.leads.length === 0 && /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minHeight: 80,
          borderRadius: 'var(--radius-12)',
          border: '1.5px dashed var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          font: 'var(--caption)',
          color: 'var(--text-muted)',
          textAlign: 'center',
          padding: 8
        }
      }, isOver ? 'Solte aqui' : 'Arraste um lead para cá'));
    })) : /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, columns.flatMap(c => c.leads.map(l => ({
      ...l,
      status: c.label,
      tone: c.tone
    }))).map((l, i, arr) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1.4fr 1fr 1fr 0.8fr',
        alignItems: 'center',
        padding: '13px 22px',
        borderBottom: i < arr.length - 1 ? '1px solid var(--border-soft)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Avatar, {
      name: l.name,
      size: 36
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 14px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, l.name), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, l.goal))), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, l.origin), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        font: 'var(--body-sm)',
        color: 'var(--text-body)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 999,
        background: l.tone
      }
    }), l.status), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-muted)'
      }
    }, l.follow), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right',
        font: 'var(--metric)',
        fontSize: 14,
        color: 'var(--text-strong)'
      }
    }, l.value)))));
  }

  /* ============================ EVENTS ============================ */
  function EventsScreen() {
    const events = [{
      name: 'Sunset Run · Ipanema',
      date: ['23', 'Mai'],
      type: ['accent', 'Próprio'],
      place: 'Posto 9 · Ipanema, RJ',
      sub: 142,
      cap: 200,
      sponsor: 'Red Bull'
    }, {
      name: 'Maratona do Rio',
      date: ['08', 'Jun'],
      type: ['ocean', 'Externa'],
      place: 'Aterro do Flamengo, RJ',
      sub: 38,
      cap: null,
      sponsor: null
    }, {
      name: 'Treinão de Longão',
      date: ['15', 'Jun'],
      type: ['neutral', 'Grupo'],
      place: 'Lagoa Rodrigo de Freitas',
      sub: 64,
      cap: 80,
      sponsor: null
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(StatCard, {
      label: "Pr\xF3ximos eventos",
      value: "6",
      caption: "30 dias"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Inscri\xE7\xF5es",
      value: "244",
      delta: 18,
      caption: "abertas"
    }), /*#__PURE__*/React.createElement(StatCard, {
      label: "Receita de eventos",
      value: "R$ 38.900",
      delta: 12,
      accent: true
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        borderRadius: 'var(--radius-24)',
        overflow: 'hidden',
        position: 'relative',
        minHeight: 200
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: `url('../../assets/photo-run-banner.png') center/cover`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, rgba(13,13,12,0.85) 35%, rgba(13,13,12,0.25))'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        padding: 28,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        height: '100%',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "accent",
      variant: "solid"
    }, "Em destaque"), /*#__PURE__*/React.createElement(Badge, {
      tone: "neutral",
      variant: "solid"
    }, "Patroc\xEDnio \xB7 Red Bull")), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--h1)',
        color: 'var(--creme)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--track-display)'
      }
    }, "Sunset Run \xB7 Ipanema"), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--body)',
        color: 'var(--text-on-dark-muted)'
      }
    }, "S\xE1bado, 23 mai \xB7 18:00 \xB7 142 de 200 inscritos"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      arrow: true
    }, "Gerenciar inscri\xE7\xF5es"), /*#__PURE__*/React.createElement(Button, {
      variant: "inverse"
    }, "Log\xEDstica do grupo")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        font: 'var(--h3)',
        margin: 0
      }
    }, "Agenda"), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      size: "sm",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 15
      })
    }, "Criar evento")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
        gap: 16
      }
    }, events.map((e, i) => /*#__PURE__*/React.createElement(Card, {
      key: i,
      interactive: true,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        background: 'var(--grafite)',
        borderRadius: 'var(--radius-12)',
        padding: '8px 14px',
        color: 'var(--creme)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--metric)',
        fontSize: 22,
        lineHeight: 1
      }
    }, e.date[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--caption)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--terracota-300)'
      }
    }, e.date[1])), /*#__PURE__*/React.createElement(Badge, {
      tone: e.type[0],
      variant: "soft"
    }, e.type[1])), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        font: '600 16px/1.3 var(--font-body)',
        color: 'var(--text-strong)'
      }
    }, e.name), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "map-pin",
      size: 14,
      color: "var(--cinza-mineral)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, e.place))), /*#__PURE__*/React.createElement("div", {
      style: {
        paddingTop: 12,
        borderTop: '1px solid var(--border-soft)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--mono-sm)',
        color: 'var(--text-muted)'
      }
    }, e.sub, e.cap ? ` / ${e.cap}` : '', " inscritos"), e.sponsor && /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "badge-check",
      size: 14,
      color: "var(--terracota)"
    }), e.sponsor))))));
  }

  /* ============================ PRODUCTS (minha loja) ============================ */
  const SOURCE = {
    dropship: {
      label: 'Dropship · fornecedor',
      icon: 'truck',
      note: 'Garmin entrega'
    },
    stock: {
      label: 'Estoque próprio',
      icon: 'package',
      note: 'pronta entrega'
    },
    own: {
      label: 'Produto próprio',
      icon: 'badge-check',
      note: 'você entrega'
    },
    digital: {
      label: 'Digital',
      icon: 'play-circle',
      note: 'acesso imediato'
    },
    service: {
      label: 'Serviço',
      icon: 'heart-pulse',
      note: 'agendado'
    },
    plan: {
      label: 'Recorrente',
      icon: 'repeat',
      note: 'assinatura'
    }
  };
  function ProductsScreen() {
    const [tab, setTab] = useState('all');
    const rows = [{
      name: 'Plano Performance',
      type: ['accent', 'Assinatura'],
      src: 'plan',
      price: 'R$ 289/mês',
      stock: null,
      sales: 412,
      c: 'var(--terracota)',
      grp: 'plan'
    }, {
      name: 'Recovery avulso · sessão',
      type: ['ocean', 'Serviço'],
      src: 'service',
      price: 'R$ 60',
      stock: null,
      sales: 88,
      c: 'var(--azul-oceano)',
      grp: 'service'
    }, {
      name: 'Curso · Base para 10k',
      type: ['neutral', 'Digital'],
      src: 'digital',
      price: 'R$ 197',
      stock: null,
      sales: 234,
      c: 'var(--grafite)',
      grp: 'digital'
    }, {
      name: 'Relógio GPS multiesporte',
      type: ['warning', 'Físico'],
      src: 'dropship',
      price: 'R$ 3.290',
      stock: null,
      sales: 24,
      c: 'var(--grafite)',
      grp: 'phys'
    }, {
      name: 'Gel de carboidrato · avulso',
      type: ['warning', 'Físico'],
      src: 'stock',
      price: 'R$ 12',
      stock: 340,
      sales: 612,
      c: 'var(--amber)',
      grp: 'phys'
    }, {
      name: 'Garrafa térmica 600ml',
      type: ['warning', 'Físico'],
      src: 'stock',
      price: 'R$ 119',
      stock: 8,
      sales: 73,
      c: 'var(--amber)',
      grp: 'phys'
    }, {
      name: 'Camiseta do clube 2026',
      type: ['warning', 'Físico'],
      src: 'own',
      price: 'R$ 89',
      stock: 120,
      sales: 198,
      c: 'var(--terracota)',
      grp: 'phys'
    }];
    const filtered = rows.filter(r => tab === 'all' || r.grp === tab);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 32,
        display: 'flex',
        flexDirection: 'column',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 16,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      value: tab,
      onChange: setTab,
      items: [{
        id: 'all',
        label: 'Todos',
        count: 28
      }, {
        id: 'plan',
        label: 'Planos'
      }, {
        id: 'service',
        label: 'Serviços'
      }, {
        id: 'phys',
        label: 'Físicos'
      }, {
        id: 'digital',
        label: 'Digitais'
      }]
    }), /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      iconLeft: /*#__PURE__*/React.createElement(Icon, {
        name: "plus",
        size: 17
      })
    }, "Novo produto")), /*#__PURE__*/React.createElement(Card, {
      pad: "0"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1.3fr 0.9fr 0.9fr 0.7fr',
        gap: '0 24px',
        padding: '12px 22px',
        borderBottom: '1px solid var(--border-soft)',
        font: '600 11px/1 var(--font-body)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Produto"), /*#__PURE__*/React.createElement("span", null, "Tipo"), /*#__PURE__*/React.createElement("span", null, "Origem \xB7 entrega"), /*#__PURE__*/React.createElement("span", null, "Pre\xE7o"), /*#__PURE__*/React.createElement("span", null, "Estoque"), /*#__PURE__*/React.createElement("span", {
      style: {
        textAlign: 'right'
      }
    }, "Vendas")), filtered.map((r, i) => {
      const s = SOURCE[r.src];
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1.3fr 0.9fr 0.9fr 0.7fr',
          gap: '0 24px',
          alignItems: 'center',
          padding: '14px 22px',
          borderBottom: i < filtered.length - 1 ? '1px solid var(--border-soft)' : 'none'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-8)',
          background: `color-mix(in srgb, ${r.c} 20%, var(--creme-50))`,
          display: 'grid',
          placeItems: 'center',
          flex: 'none'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: s.icon,
        size: 19,
        color: r.c
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          font: '600 14px/1.3 var(--font-body)',
          color: 'var(--text-strong)'
        }
      }, r.name)), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(Badge, {
        tone: r.type[0],
        variant: "soft"
      }, r.type[1])), /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          font: 'var(--body-sm)',
          fontSize: 13,
          color: 'var(--text-body)'
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: s.icon,
        size: 14,
        color: r.src === 'own' ? 'var(--terracota)' : 'var(--cinza-mineral)'
      }), s.label), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--caption)',
          color: 'var(--text-muted)',
          paddingLeft: 20
        }
      }, s.note)), /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--metric)',
          fontSize: 15,
          color: 'var(--text-strong)'
        }
      }, r.price), /*#__PURE__*/React.createElement("span", null, r.stock == null ? /*#__PURE__*/React.createElement("span", {
        style: {
          font: 'var(--caption)',
          color: 'var(--text-muted)'
        }
      }, "\u2014") : /*#__PURE__*/React.createElement(Badge, {
        tone: r.stock <= 10 ? 'danger' : 'success',
        dot: true
      }, r.stock, " un")), /*#__PURE__*/React.createElement("span", {
        style: {
          textAlign: 'right',
          font: 'var(--mono-sm)',
          color: 'var(--text-muted)'
        }
      }, r.sales));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        font: 'var(--caption)',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "info",
      size: 15,
      color: "var(--cinza-mineral)"
    }), "Produto pr\xF3prio: a responsabilidade fiscal e de entrega \xE9 do tenant (Merchant of Record em defini\xE7\xE3o)."));
  }
  Object.assign(window, {
    RTK: {
      ...(window.RTK || {}),
      OverviewScreen,
      AthletesScreen,
      TrainingScreen,
      FinanceScreen,
      MarketplaceScreen,
      LeadsScreen,
      EventsScreen,
      ProductsScreen
    }
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/screens.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.ComplianceTag = __ds_scope.ComplianceTag;

__ds_ns.StatCard = __ds_scope.StatCard;

})();
