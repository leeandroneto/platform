/* Admin screens — part 1: Overview, Tenants, Approvals. Attaches to window.RTADM. */
;(function () {
const { Card, StatCard, Badge, Avatar, Button, Tabs, Input, Icon } = window.RT;
const { useState } = React;

const wrap = { padding: 32, display: 'flex', flexDirection: 'column', gap: 18 };
const rowHead = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' };
const th = { font: '600 11px/1.2 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', textAlign: 'left', padding: '0 16px 10px', whiteSpace: 'nowrap' };
const td = { padding: '14px 16px', borderTop: '1px solid var(--border-soft)', font: 'var(--body-sm)', color: 'var(--text-body)', verticalAlign: 'middle' };
const mono = { font: '700 13px/1 var(--font-mono)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' };

function SectionTitle({ children, n }) {
  return (
    <div style={rowHead}>
      <h2 style={{ font: 'var(--h2)', textTransform: 'uppercase', letterSpacing: 'var(--track-display)', color: 'var(--text-strong)', margin: 0 }}>{children}</h2>
      {n && <span style={{ font: 'var(--mono-sm)', color: 'var(--text-muted)' }}>{n}</span>}
    </div>
  );
}

/* ============================ OVERVIEW ============================ */
function OverviewScreen() {
  const queue = [
    { icon: 'shield-check', label: 'Aprovações pendentes', n: 7, sub: '4 patrocinadores · 3 fornecedores', tone: 'accent', to: 'approvals' },
    { icon: 'calendar-check', label: 'Eventos na fila', n: 12, sub: '9 sugeridos · 3 reivindicações', tone: 'ocean', to: 'events' },
    { icon: 'shield-alert', label: 'Sinais de abuso', n: 5, sub: '3 sites ociosos · 2 denúncias', tone: 'warning', to: 'quality' },
    { icon: 'wallet', label: 'Cobranças vencidas', n: 3, sub: 'R$ 1.737 em atraso', tone: 'danger', to: 'billing' },
  ];
  const activity = [
    ['shield-check', 'Pacefuel Nutrition aprovada como Patrocinador Nacional', 'há 12 min', 'accent'],
    ['building-2', 'Novo tenant: Movimento BH · plano Apoiador', 'há 1 h', 'ocean'],
    ['calendar-check', 'Evento "Night Run Salvador" publicado no calendário', 'há 2 h', 'neutral'],
    ['shield-alert', 'Site "retake.run/coralrun" marcado como ocioso (62 dias)', 'há 3 h', 'warning'],
    ['wallet', 'Fatura paga: Stride Wear · R$ 200', 'há 5 h', 'accent'],
  ];
  return (
    <div style={wrap}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        <StatCard label="MRR da rede" value="9,4" unit="mil R$" delta={11} caption="vs maio" accent />
        <StatCard label="Tenants ativos" value="86" delta={6} caption="+5 no mês" />
        <StatCard label="Sites publicados" value="74" caption="38 grátis · 36 pago" />
        <StatCard label="Impressões/mês" value="1,9" unit="mi" delta={14} caption="faixa de marcas" />
        <StatCard label="GMV marketplace" value="212" unit="mil R$" delta={-3} caption="loja dos clubes" />
      </div>

      <SectionTitle>Fila de trabalho</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {queue.map((q) => (
          <Card key={q.label} interactive pad="18px" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ width: 40, height: 40, borderRadius: 'var(--radius-8)', display: 'grid', placeItems: 'center', background: 'var(--creme-200)' }}><Icon name={q.icon} size={20} color="var(--grafite)" /></span>
              <span style={{ font: '700 30px/1 var(--font-display)', color: 'var(--text-strong)' }}>{q.n}</span>
            </div>
            <div>
              <div style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{q.label}</div>
              <div style={{ font: 'var(--caption)', color: 'var(--text-muted)', marginTop: 2 }}>{q.sub}</div>
            </div>
            <Button variant="text" size="sm" style={{ alignSelf: 'flex-start', padding: 0 }}>Abrir fila →</Button>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, alignItems: 'start' }}>
        <Card pad="0">
          <div style={{ padding: '18px 22px 12px', borderBottom: '1px solid var(--border-soft)', font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Atividade recente</div>
          <div>
            {activity.map(([ic, txt, when, tone], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 22px', borderTop: i ? '1px solid var(--border-soft)' : 'none' }}>
                <Badge tone={tone} variant="soft" style={{ width: 30, height: 30, padding: 0, borderRadius: 999, display: 'grid', placeItems: 'center' }}><Icon name={ic} size={15} /></Badge>
                <span style={{ flex: 1, font: 'var(--body-sm)', color: 'var(--text-body)' }}>{txt}</span>
                <span style={{ font: 'var(--caption)', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{when}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card pad="0">
          <div style={{ padding: '18px 22px 12px', borderBottom: '1px solid var(--border-soft)', font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Top patrocinadores · receita</div>
          {[['Pacefuel Nutrition', 'Oficial · nutrição', 'R$ 1.200', 1], ['GPSRun Tech', 'Nacional', 'R$ 500', 0.42], ['Stride Wear', 'Estadual · 2 UF', 'R$ 200', 0.17], ['Z2 Suplementos', 'Estadual', 'R$ 100', 0.08]].map(([n, t, v, w], i) => (
            <div key={i} style={{ padding: '12px 22px', borderTop: i ? '1px solid var(--border-soft)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ font: '600 13.5px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{n}</span>
                <span style={mono}>{v}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{t}</span>
                <div style={{ flex: 1, maxWidth: 120, height: 5, borderRadius: 999, background: 'var(--creme-200)', overflow: 'hidden' }}><span style={{ display: 'block', height: '100%', width: (w * 100) + '%', background: 'var(--terracota)' }} /></div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ============================ TENANTS ============================ */
function TenantsScreen() {
  const [tab, setTab] = useState('all');
  const rows = [
    { name: 'Acelera Run Club', city: 'Rio de Janeiro · RJ', plan: 'Membro', site: 'pago', status: 'active', ath: 1245, mrr: '59', last: 'hoje' },
    { name: 'Pace Club', city: 'São Paulo · SP', plan: 'Membro', site: 'pago', status: 'active', ath: 980, mrr: '59', last: 'hoje' },
    { name: 'Movimento BH', city: 'Belo Horizonte · MG', plan: 'Apoiador', site: 'pago', status: 'active', ath: 412, mrr: '29', last: 'ontem' },
    { name: 'Equipe Maré', city: 'Rio de Janeiro · RJ', plan: 'Grátis', site: 'grátis', status: 'active', ath: 86, mrr: '0', last: '3 dias' },
    { name: 'Curitiba Run', city: 'Curitiba · PR', plan: 'Grátis', site: 'grátis', status: 'idle', ath: 54, mrr: '0', last: '62 dias' },
    { name: 'Coral Run', city: 'Recife · PE', plan: 'Grátis', site: 'grátis', status: 'idle', ath: 31, mrr: '0', last: '74 dias' },
    { name: 'Sul Endurance', city: 'Porto Alegre · RS', plan: 'Apoiador', site: 'pago', status: 'suspended', ath: 220, mrr: '29', last: '12 dias' },
  ];
  const filt = rows.filter((r) => tab === 'all' || (tab === 'paid' && r.site === 'pago') || (tab === 'free' && r.site === 'grátis') || (tab === 'idle' && r.status === 'idle'));
  const stTone = { active: ['success', 'Ativo'], idle: ['warning', 'Ocioso'], suspended: ['danger', 'Suspenso'] };
  return (
    <div style={wrap}>
      <div style={rowHead}>
        <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Todos', count: rows.length }, { id: 'paid', label: 'Pago' }, { id: 'free', label: 'Grátis' }, { id: 'idle', label: 'Ociosos', count: 2 }]} />
        <Input placeholder="Buscar tenant" prefix={<Icon name="search" size={16} />} style={{ width: 260 }} />
      </div>
      <Card pad="0">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <th style={{ ...th, paddingTop: 16 }}>Tenant</th><th style={{ ...th, paddingTop: 16 }}>Plano · site</th>
            <th style={{ ...th, paddingTop: 16 }}>Atletas</th><th style={{ ...th, paddingTop: 16 }}>MRR</th>
            <th style={{ ...th, paddingTop: 16 }}>Último acesso</th><th style={{ ...th, paddingTop: 16 }}>Status</th>
            <th style={{ ...th, paddingTop: 16, textAlign: 'right' }}>Ações</th>
          </tr></thead>
          <tbody>
            {filt.map((r, i) => (
              <tr key={r.name}>
                <td style={td}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <Avatar name={r.name} size={36} />
                    <div><div style={{ font: '600 14px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{r.name}</div><div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{r.city}</div></div>
                  </div>
                </td>
                <td style={td}><div style={{ font: '600 13px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{r.plan}</div><Badge tone={r.site === 'pago' ? 'accent' : 'neutral'} variant="soft" style={{ marginTop: 4 }}>{r.site}</Badge></td>
                <td style={{ ...td, ...mono }}>{r.ath.toLocaleString('pt-BR')}</td>
                <td style={{ ...td, ...mono }}>{r.mrr === '0' ? <span style={{ color: 'var(--text-muted)', font: 'var(--caption)' }}>—</span> : 'R$ ' + r.mrr}</td>
                <td style={{ ...td, color: r.status === 'idle' ? 'var(--amber)' : 'var(--text-muted)' }}>{r.last}</td>
                <td style={td}><Badge tone={stTone[r.status][0]} variant="soft" dot>{stTone[r.status][1]}</Badge></td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Button variant="ghost" size="sm" style={{ padding: '0 8px' }}><Icon name="external-link" size={15} /></Button>
                  <Button variant="ghost" size="sm" style={{ padding: '0 8px' }}><Icon name="log-in" size={15} /></Button>
                  <Button variant="ghost" size="sm" style={{ padding: '0 8px' }}><Icon name="more-horizontal" size={15} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ============================ APPROVALS ============================ */
function KycRow({ ok, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--caption)', color: ok ? 'var(--green)' : 'var(--text-muted)' }}>
      <Icon name={ok ? 'check-circle-2' : 'circle'} size={14} color={ok ? 'var(--green)' : 'var(--cinza-mineral)'} />{label}
    </div>
  );
}
function ApprovalCard({ a }) {
  const [done, setDone] = useState(null);
  return (
    <Card pad="0" style={{ opacity: done ? 0.55 : 1, transition: 'opacity var(--dur) var(--ease-out)' }}>
      <div style={{ display: 'flex', gap: 16, padding: 20, alignItems: 'flex-start' }}>
        <div style={{ width: 52, height: 52, borderRadius: 'var(--radius-12)', flex: 'none', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg,' + a.g[0] + ',' + a.g[1] + ')', font: '700 18px/1 var(--font-display)', color: 'var(--creme)' }}>{a.abbr}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ font: '600 16px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{a.name}</span>
            <Badge tone={a.kind === 'Fornecedor B2B' ? 'ocean' : 'accent'} variant="soft">{a.kind}</Badge>
          </div>
          <div style={{ font: 'var(--caption)', color: 'var(--text-muted)', margin: '4px 0 10px' }}>CNPJ {a.cnpj} · {a.cat} · solicitado {a.when}</div>
          <div style={{ font: 'var(--body-sm)', color: 'var(--text-body)', marginBottom: 12 }}>{a.ask}</div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {a.kyc.map(([ok, l]) => <KycRow key={l} ok={ok} label={l} />)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 'none', minWidth: 150 }}>
          {done ? (
            <Badge tone={done === 'ok' ? 'success' : 'danger'} variant="soft" dot style={{ alignSelf: 'flex-end' }}>{done === 'ok' ? 'Aprovado' : 'Rejeitado'}</Badge>
          ) : (
            <>
              <Button variant="primary" size="sm" onClick={() => setDone('ok')} iconLeft={<Icon name="check" size={15} />}>Aprovar</Button>
              <Button variant="secondary" size="sm" onClick={() => setDone('no')}>Rejeitar</Button>
              <Button variant="text" size="sm">Ver dossiê</Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
function ApprovalsScreen() {
  const [tab, setTab] = useState('sponsors');
  const sponsors = [
    { name: 'Pacefuel Nutrition', abbr: 'PF', g: ['#1D1D1B', '#C25C2D'], kind: 'Patrocinador Nacional', cnpj: '12.345.678/0001-90', cat: 'Suplementação', when: 'hoje', ask: 'Cota Nacional R$ 500/mês + cupom RETAKE10 (-15%). Quer faixa de marcas na rede inteira e página de marca.', kyc: [[true, 'CNPJ ativo'], [true, 'E-commerce verificado'], [true, 'Cupom ≥ -10%'], [false, 'Pagamento antecipado (3 meses)']] },
    { name: 'SulAmérica Saúde', abbr: 'SA', g: ['#4E8C5A', '#1D1D1B'], kind: 'Patrocinador Estadual', cnpj: '01.685.053/0001-56', cat: 'Saúde', when: 'ontem', ask: 'Cota Estadual SP + RJ (R$ 200/mês). Quer faixa de marcas nos dois estados. Sem venda ao corredor.', kyc: [[true, 'CNPJ ativo'], [true, 'Marca aprovada'], [false, 'Logo + descrição (7 dias)'], [false, 'Pagamento antecipado']] },
    { name: 'Z2 Suplementos', abbr: 'Z2', g: ['#7FABB5', '#2A2A27'], kind: 'Cupom & Afiliado', cnpj: '22.111.000/0001-22', cat: 'Suplementação', when: 'há 2 dias', ask: 'Solicita entrada do cupom Z2RUN (-12%) na área de cupons da rede. Comissão 20% via programa de afiliados.', kyc: [[true, 'CNPJ ativo'], [false, 'E-commerce verificado'], [true, 'Cupom ≥ -10%']] },
  ];
  const suppliers = [
    { name: 'Confecção Pace', abbr: 'CP', g: ['#C25C2D', '#1D1D1B'], kind: 'Fornecedor B2B', cnpj: '33.444.555/0001-66', cat: 'Uniformes', when: 'hoje', ask: 'Vitrine B2B R$ 99/mês. Confecção de uniformes sob demanda, entrega nacional.', kyc: [[true, 'CNPJ ativo'], [true, 'KYC concluído'], [true, 'Capacidade de entrega'], [false, 'Amostra recebida']] },
    { name: 'TrackLab Equipamentos', abbr: 'TL', g: ['#1D1D1B', '#D96C3A'], kind: 'Fornecedor B2B', cnpj: '44.555.666/0001-77', cat: 'Equipamentos', when: 'há 3 dias', ask: 'Vitrine B2B R$ 99/mês. Equipamentos de pista sob orçamento.', kyc: [[true, 'CNPJ ativo'], [false, 'KYC concluído'], [true, 'Capacidade de entrega']] },
  ];
  const list = tab === 'sponsors' ? sponsors : suppliers;
  return (
    <div style={wrap}>
      <p style={{ font: 'var(--body-sm)', color: 'var(--text-muted)', margin: 0, maxWidth: 720 }}>Toda entrada passa por curadoria — é o que mantém a rede valiosa para as marcas.</p>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'sponsors', label: 'Patrocinadores & cupons', count: sponsors.length }, { id: 'suppliers', label: 'Fornecedores B2B', count: suppliers.length }]} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 4 }}>
        {list.map((a) => <ApprovalCard key={a.name} a={a} />)}
      </div>
    </div>
  );
}

Object.assign(window, { RTADM: { ...(window.RTADM || {}), OverviewScreen, TenantsScreen, ApprovalsScreen } });
})();
