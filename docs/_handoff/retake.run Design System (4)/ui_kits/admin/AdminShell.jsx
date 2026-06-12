/* Admin console shell: dark staff sidebar + topbar. Attaches to window.RTADM. */
;(function () {
const { Avatar, Icon } = window.RT;
const { useState } = React;

function NavItem({ item, active, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
        border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%',
        borderRadius: 'var(--radius-8)',
        backgroundColor: active ? 'var(--terracota)' : hover ? 'rgba(241,236,226,0.08)' : 'transparent',
        color: active ? 'var(--creme)' : hover ? 'var(--creme)' : 'var(--text-on-dark-muted)',
        font: '500 14px/1 var(--font-body)',
        transition: 'none',
      }}>
      <Icon name={item.icon} size={18} />
      <span style={{ flex: 1 }}>{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span style={{
          font: '700 11px/1 var(--font-mono)', minWidth: 20, textAlign: 'center',
          padding: '3px 6px', borderRadius: 999,
          background: active ? 'rgba(13,13,12,0.25)' : 'var(--terracota)',
          color: 'var(--creme)',
        }}>{item.badge}</span>
      )}
    </button>
  );
}

const NAV = [
  { id: 'overview', label: 'Visão geral', icon: 'gauge' },
  { id: 'tenants', label: 'Tenants', icon: 'building-2' },
  { id: 'approvals', label: 'Aprovações', icon: 'shield-check', badge: 7 },
  { id: 'events', label: 'Moderação de eventos', icon: 'calendar-check', badge: 12 },
  { id: 'media', label: 'Faixa de marcas', icon: 'panel-top' },
  { id: 'billing', label: 'Faturamento', icon: 'wallet' },
  { id: 'quality', label: 'Qualidade & abuso', icon: 'shield-alert', badge: 5 },
];

function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: 256, flex: 'none', background: 'var(--grafite-ink)',
      borderRight: '1px solid var(--border-on-dark)', display: 'flex', flexDirection: 'column',
      height: '100%', padding: '22px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px 8px' }}>
        <img src="../../assets/logo-full-cream.svg" alt="RETAKE" style={{ height: 22 }} />
      </div>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start',
        margin: '0 10px 18px', padding: '4px 10px', borderRadius: 999,
        background: 'rgba(217,108,58,0.16)', border: '1px solid var(--terracota)',
        font: '700 9.5px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.12em',
        color: 'var(--terracota-300)',
      }}>
        <Icon name="lock" size={11} color="var(--terracota-300)" />Console interno
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV.map((n) => <NavItem key={n.id} item={n} active={n.id === active} onClick={() => onNav(n.id)} />)}
      </nav>

      <NavItem item={{ id: 'settings', label: 'Ajustes do console', icon: 'settings' }} active={active === 'settings'} onClick={() => onNav('settings')} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '12px 10px 0', borderTop: '1px solid var(--border-on-dark)' }}>
        <Avatar name="Ana Staff" size={36} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: '600 13px/1.2 var(--font-body)', color: 'var(--creme)' }}>Ana Ribeiro</div>
          <div style={{ font: 'var(--caption)', color: 'var(--text-on-dark-muted)' }}>Operações · retake</div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({ title, subtitle, children }) {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 32px', borderBottom: '1px solid var(--border-soft)',
      background: 'color-mix(in srgb, var(--creme-100) 86%, transparent)',
      backdropFilter: 'blur(8px)', position: 'sticky', top: 0, zIndex: 5,
    }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 4 }}>{subtitle}</div>
        <h1 style={{ font: 'var(--h1)', margin: 0, whiteSpace: 'nowrap' }}>{title}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, background: 'var(--surface-card)', border: '1px solid var(--border-strong)', font: 'var(--body-sm)', color: 'var(--text-muted)' }}>
          <Icon name="search" size={15} color="var(--text-muted)" />buscar na rede
        </div>
        {children}
      </div>
    </header>
  );
}

Object.assign(window, { RTADM: { ...(window.RTADM || {}), Sidebar, Topbar, NAV } });
})();
