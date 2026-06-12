/* Dashboard shell: sidebar + topbar. Attaches to window.RTK. */
;(function () {
const { Avatar, Badge, Icon, Button } = window.RT;
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
        backgroundColor: active ? 'var(--terracota)' : hover ? 'var(--creme-200)' : 'transparent',
        color: active ? 'var(--creme)' : 'var(--text-body)',
        font: '500 14px/1 var(--font-body)',
        transition: 'none',
      }}>
      <Icon name={item.icon} size={18} />{item.label}
    </button>
  );
}

const NAV = [
  { id: 'overview', label: 'Visão geral', icon: 'layout-dashboard' },
  { id: 'site', label: 'Meu site', icon: 'globe' },
  { id: 'leads', label: 'Captação', icon: 'user-plus' },
  { id: 'athletes', label: 'Atletas', icon: 'users' },
  { id: 'training', label: 'Treinos', icon: 'activity' },
  { id: 'agenda', label: 'Agenda', icon: 'calendar-clock' },
  { id: 'finance', label: 'Financeiro', icon: 'wallet' },
  { id: 'comissoes', label: 'Comissões', icon: 'percent' },
  { id: 'community', label: 'Comunidade', icon: 'message-circle' },
  { id: 'events', label: 'Eventos', icon: 'calendar' },
  { id: 'marketplace', label: 'Marketplace', icon: 'store' },
  { id: 'products', label: 'Produtos', icon: 'package' },
];

function Sidebar({ active, onNav }) {
  return (
    <aside style={{
      width: 248, flex: 'none', background: 'var(--creme-50)',
      borderRight: '1px solid var(--border-soft)', display: 'flex', flexDirection: 'column',
      height: '100%', padding: '22px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px 22px' }}>
        <img src="../../assets/logo-full.svg" alt="RETAKE" style={{ height: 22 }} />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {NAV.map((n) => <NavItem key={n.id} item={n} active={n.id === active} onClick={() => onNav(n.id)} />)}
      </nav>

      <NavItem item={{ id: 'settings', label: 'Configurações', icon: 'settings' }} active={active === 'settings'} onClick={() => onNav('settings')} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, padding: '12px 10px 0', borderTop: '1px solid var(--border-soft)' }}>
        <Avatar name="Time Acelera" size={36} />
        <div style={{ minWidth: 0 }}>
          <div style={{ font: '600 13px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>Acelera Run Club</div>
          <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>Plano Performance</div>
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
        <button style={{ width: 42, height: 42, borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: 'var(--surface-card)', cursor: 'pointer', display: 'grid', placeItems: 'center', position: 'relative' }}>
          <Icon name="bell" size={19} color="var(--text-body)" />
          <span style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 999, background: 'var(--terracota)', border: '2px solid var(--surface-card)' }} />
        </button>
        {children}
      </div>
    </header>
  );
}

Object.assign(window, { RTK: { ...(window.RTK || {}), Sidebar, Topbar, NAV } });
})();
