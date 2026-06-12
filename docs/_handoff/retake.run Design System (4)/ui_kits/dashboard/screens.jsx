/* Dashboard screens. Attaches to window.RTK. */
;(function () {
const { Card, StatCard, Badge, Avatar, Button, Tabs, Input, ComplianceTag, Icon } = window.RT;
const { useState } = React;

/* --- simple line chart (data-viz, brand-styled) --- */
function LineChart({ data, height = 180, color = 'var(--grafite)', fill = false }) {
  const w = 640, pad = 8;
  const max = Math.max(...data), min = Math.min(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = pad + (1 - (v - min) / span) * (height - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = line + ` L ${pts[pts.length - 1][0].toFixed(1)} ${height} L ${pts[0][0].toFixed(1)} ${height} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={w} y1={height * g} y2={height * g} stroke="var(--creme-200)" strokeWidth="1" />)}
      {fill && <path d={area} fill="var(--terracota-100)" opacity="0.6" />}
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.filter((_, i) => i === pts.length - 1).map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill="var(--terracota)" stroke="var(--creme-50)" strokeWidth="2" />)}
    </svg>
  );
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

/* ============================ OVERVIEW ============================ */
function OverviewScreen() {
  const [tab, setTab] = useState('revenue');
  const series = { revenue: [82, 88, 91, 104, 119, 128], athletes: [980, 1010, 1066, 1120, 1180, 1245] };
  const risk = [
    { name: 'Rafael Tavares', meta: 'Sumiu há 9 dias', status: 'missed' },
    { name: 'Luiza Andrade', meta: '2 treinos perdidos', status: 'partial' },
    { name: 'Pedro Nunes', meta: 'Contrato vence em 3d', status: 'partial' },
  ];
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <StatCard label="Alunos ativos" value="1.245" delta={11} caption="vs mês anterior" />
        <StatCard label="Treinos concluídos" value="8.652" delta={9} caption="esta semana" />
        <StatCard label="Faturamento" value="R$ 128.650" delta={10} accent caption="MRR" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16 }}>
        <Card pad="0">
          <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ font: 'var(--h3)', margin: '0 0 2px' }}>Desempenho</h3>
              <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>Últimos 6 meses</span>
            </div>
            <Tabs value={tab} onChange={setTab} items={[{ id: 'revenue', label: 'Receita' }, { id: 'athletes', label: 'Atletas' }]} style={{ border: 'none' }} />
          </div>
          <div style={{ padding: '8px 16px 12px' }}>
            <LineChart data={series[tab]} fill />
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', font: 'var(--mono-sm)', color: 'var(--text-muted)' }}>
              {MONTHS.map((m) => <span key={m}>{m}</span>)}
            </div>
          </div>
        </Card>

        <Card pad="0">
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="triangle-alert" size={18} color="var(--terracota)" />
            <h4 style={{ font: 'var(--h4)', margin: 0 }}>Atletas em risco</h4>
          </div>
          <div>
            {risk.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 20px', borderBottom: i < risk.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
                <Avatar name={r.name} size={38} status="risk" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{r.name}</div>
                  <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{r.meta}</div>
                </div>
                <ComplianceTag status={r.status} showLabel={false} />
              </div>
            ))}
            <div style={{ padding: 14 }}><Button variant="text">Ver todos →</Button></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================ ATHLETES ============================ */
function AthletesScreen() {
  const [tab, setTab] = useState('all');
  const rows = [
    { name: 'Marina Costa', group: 'Elite · Maratona', level: 'Avançado', status: ['success', 'Ativo'], comp: 'done', last: 'Hoje' },
    { name: 'João Reis', group: 'Base · 10k', level: 'Intermediário', status: ['warning', 'Pausado'], comp: 'partial', last: '2 dias' },
    { name: 'Bia Lima', group: 'Iniciante', level: 'Iniciante', status: ['success', 'Ativo'], comp: 'done', last: 'Ontem' },
    { name: 'Rafael Tavares', group: 'Elite · Maratona', level: 'Avançado', status: ['danger', 'Inadimplente'], comp: 'missed', last: '9 dias' },
    { name: 'Camila Souza', group: 'Base · 21k', level: 'Intermediário', status: ['success', 'Ativo'], comp: 'done', last: 'Hoje' },
    { name: 'Diego Martins', group: 'Base · 10k', level: 'Intermediário', status: ['success', 'Ativo'], comp: 'partial', last: 'Ontem' },
  ];
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Todos', count: 1245 }, { id: 'active', label: 'Ativos', count: 1118 }, { id: 'risk', label: 'Em risco', count: 34 }]} />
        <div style={{ display: 'flex', gap: 10 }}>
          <Input placeholder="Buscar atleta" prefix={<Icon name="search" size={16} />} style={{ width: 240 }} />
          <Button variant="primary" iconLeft={<Icon name="plus" size={17} />}>Novo atleta</Button>
        </div>
      </div>

      <Card pad="0">
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.6fr 1.2fr 1fr 0.9fr', padding: '12px 22px', borderBottom: '1px solid var(--border-soft)', font: '600 11px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          <span>Atleta</span><span>Grupo</span><span>Status</span><span>Compliance</span><span style={{ textAlign: 'right' }}>Atividade</span>
        </div>
        {rows.map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '2.2fr 1.6fr 1.2fr 1fr 0.9fr', alignItems: 'center', padding: '13px 22px', borderBottom: i < rows.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar name={r.name} size={38} status={r.status[0] === 'danger' ? 'risk' : r.status[0] === 'warning' ? 'paused' : 'online'} />
              <div>
                <div style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{r.name}</div>
                <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{r.level}</div>
              </div>
            </div>
            <span style={{ font: 'var(--body-sm)', color: 'var(--text-body)' }}>{r.group}</span>
            <span><Badge tone={r.status[0]} dot>{r.status[1]}</Badge></span>
            <span><ComplianceTag status={r.comp} size="sm" /></span>
            <span style={{ textAlign: 'right', font: 'var(--mono-sm)', color: 'var(--text-muted)' }}>{r.last}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ============================ TRAINING ============================ */
function TrainingScreen() {
  const week = [
    { d: 'Seg', s: 'done' }, { d: 'Ter', s: 'done' }, { d: 'Qua', s: 'partial' },
    { d: 'Qui', s: 'planned' }, { d: 'Sex', s: 'planned' }, { d: 'Sáb', s: 'planned' }, { d: 'Dom', s: 'planned' },
  ];
  const steps = [
    { name: 'Aquecimento', detail: '15 min · Z1–Z2', target: '5:30 /km', comp: 'done', exec: '5:24 /km' },
    { name: 'Série principal · 10×800m', detail: 'recuperação 200m trote', target: '3:45 /km', comp: 'done', exec: '3:43 /km', main: true },
    { name: 'Volta à calma', detail: '10 min · Z1', target: '6:00 /km', comp: 'partial', exec: '5:10 /km' },
  ];
  return (
    <div style={{ padding: 32, display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* microciclo */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div className="eyebrow">Microciclo · Semana 6 de 12</div>
              <h3 style={{ font: 'var(--h3)', margin: '4px 0 0' }}>Bloco Build · Maratona</h3>
            </div>
            <Badge tone="ocean" variant="soft">Carga alvo 78%</Badge>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 8 }}>
            {week.map((w, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '12px 4px', borderRadius: 'var(--radius-12)', background: w.s === 'planned' ? 'var(--surface-sunken)' : 'var(--surface-card)', border: '1px solid var(--border-soft)' }}>
                <div style={{ font: 'var(--caption)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>{w.d}</div>
                <ComplianceTag status={w.s} showLabel={false} style={{ margin: '0 auto' }} />
              </div>
            ))}
          </div>
        </Card>

        {/* prescribed vs executed */}
        <Card pad="0">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="eyebrow">Quarta-feira · Treino do dia</div>
              <h3 style={{ font: 'var(--h3)', margin: '4px 0 0' }}>Intervalado · VO₂max</h3>
            </div>
            <ComplianceTag status="partial" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px', padding: '10px 24px', font: '600 11px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-soft)' }}>
            <span>Etapa</span><span style={{ textAlign: 'right' }}>Prescrito</span><span style={{ textAlign: 'right' }}>Executado</span>
          </div>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 130px 130px', alignItems: 'center', padding: '15px 24px', borderBottom: i < steps.length - 1 ? '1px solid var(--border-soft)' : 'none', background: s.main ? 'var(--terracota-100)' : 'transparent' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                <ComplianceTag status={s.comp} showLabel={false} />
                <div>
                  <div style={{ font: '600 15px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{s.name}</div>
                  <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{s.detail}</div>
                </div>
              </div>
              <span style={{ textAlign: 'right', font: 'var(--metric)', fontSize: 18, color: 'var(--text-strong)' }}>{s.target}</span>
              <span style={{ textAlign: 'right', font: 'var(--metric)', fontSize: 18, color: s.comp === 'partial' ? 'var(--amber)' : 'var(--green)' }}>{s.exec}</span>
            </div>
          ))}
          <div style={{ padding: 18, display: 'flex', gap: 10 }}>
            <Button variant="secondary" size="sm" iconLeft={<Icon name="pencil" size={15} />}>Ajustar</Button>
            <Button variant="text" size="sm">Ver no app do atleta →</Button>
          </div>
        </Card>
      </div>

      {/* right rail: thresholds + library */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card>
          <h4 style={{ font: 'var(--h4)', margin: '0 0 14px' }}>Thresholds · Marina</h4>
          {[['Pace de limiar', '3:52 /km'], ['FC de limiar', '172 bpm'], ['VO₂max', '54,2']].map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-soft)' : 'none' }}>
              <span style={{ font: 'var(--body-sm)', color: 'var(--text-muted)' }}>{t[0]}</span>
              <span style={{ font: 'var(--metric)', fontSize: 17, color: 'var(--text-strong)' }}>{t[1]}</span>
            </div>
          ))}
        </Card>
        <Card tone="dark">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Icon name="sparkles" size={18} color="var(--terracota)" />
            <h4 style={{ font: 'var(--h4)', margin: 0, color: 'var(--text-on-dark)' }}>Sugestão da IA</h4>
          </div>
          <p style={{ font: 'var(--body-sm)', color: 'var(--text-on-dark-muted)', margin: '0 0 14px' }}>Marina vem batendo o pace alvo com folga. Subir a série principal para 12×800m no próximo microciclo?</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" size="sm">Aplicar</Button>
            <Button variant="ghost" size="sm" style={{ color: 'var(--text-on-dark)' }}>Dispensar</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================ FINANCE ============================ */
function FinanceScreen() {
  const [tab, setTab] = useState('all');
  const tx = [
    { who: 'Marina Costa', kind: 'Mensalidade · Performance', amt: '+ R$ 289,00', tone: 'success', when: 'Hoje · 09:12', method: 'Cartão' },
    { who: 'Diego Martins', kind: 'Avulso · Recovery (2 sessões)', amt: '+ R$ 120,00', tone: 'success', when: 'Hoje · 08:40', method: 'Pix' },
    { who: 'Repasse · Maurten', kind: 'Marketplace · split fornecedor', amt: '− R$ 412,30', tone: 'neutral', when: 'Ontem', method: 'Connect' },
    { who: 'Rafael Tavares', kind: 'Mensalidade · Elite', amt: 'Falha · inadimplente', tone: 'danger', when: '9 dias', method: 'Cartão' },
    { who: 'Camila Souza', kind: 'Mensalidade · Base', amt: '+ R$ 189,00', tone: 'success', when: 'Ontem', method: 'Pix' },
  ];
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
        <StatCard label="MRR" value="R$ 128.650" delta={10} accent caption="recorrente" />
        <StatCard label="A receber" value="R$ 42.300" caption="próximos 30d" />
        <StatCard label="Inadimplência" value="3,2%" delta={-1} caption="R$ 8.140" />
        <StatCard label="Taxa plataforma" value="R$ 6.432" caption="5% marketplace" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card pad="0">
          <div style={{ padding: '18px 22px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Tudo' }, { id: 'in', label: 'Entradas' }, { id: 'out', label: 'Repasses' }]} style={{ border: 'none' }} />
            <Button variant="text" size="sm">Exportar CSV</Button>
          </div>
          <div style={{ borderTop: '1px solid var(--border-soft)' }}>
            {tx.map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 22px', borderBottom: i < tx.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-12)', background: t.tone === 'danger' ? 'var(--red-100)' : t.tone === 'neutral' ? 'var(--creme-200)' : 'var(--green-100)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <Icon name={t.tone === 'danger' ? 'triangle-alert' : t.tone === 'neutral' ? 'arrow-up-right' : 'arrow-down-left'} size={18} color={t.tone === 'danger' ? 'var(--red)' : t.tone === 'neutral' ? 'var(--text-muted)' : '#3C6E47'} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{t.who}</div>
                  <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{t.kind}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ font: 'var(--metric)', fontSize: 15, color: t.tone === 'danger' ? 'var(--red)' : t.tone === 'neutral' ? 'var(--text-body)' : '#3C6E47' }}>{t.amt}</div>
                  <div style={{ font: 'var(--mono-sm)', fontSize: 11, color: 'var(--text-muted)' }}>{t.when} · {t.method}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card>
            <h4 style={{ font: 'var(--h4)', margin: '0 0 4px' }}>Split do mês</h4>
            <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>Como o dinheiro se divide</span>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[['Tenant (você)', 78, 'var(--terracota)'], ['Fornecedores', 14, 'var(--azul-oceano)'], ['Comissão treinadores', 5, 'var(--amber)'], ['Taxa retake.run', 3, 'var(--cinza-mineral)']].map((s, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', font: 'var(--body-sm)', marginBottom: 6 }}>
                    <span style={{ color: 'var(--text-body)' }}>{s[0]}</span>
                    <span style={{ font: 'var(--mono-sm)', color: 'var(--text-muted)' }}>{s[1]}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: 'var(--surface-sunken)', overflow: 'hidden' }}>
                    <div style={{ width: s[1] + '%', height: '100%', background: s[2], borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card tone="dark">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Icon name="banknote" size={18} color="var(--terracota)" />
              <h4 style={{ font: 'var(--h4)', margin: 0, color: 'var(--text-on-dark)' }}>Próximo payout</h4>
            </div>
            <div style={{ font: 'var(--metric-xl)', fontSize: 34, color: 'var(--text-on-dark)' }}>R$ 121.840</div>
            <p style={{ font: 'var(--caption)', color: 'var(--text-on-dark-muted)', margin: '6px 0 0' }}>Sexta · via Stripe Connect · líquido de taxas</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================ MARKETPLACE (sourcing) ============================ */
const FULFILL = {
  dropship: { tone: 'accent', label: 'Dropship', desc: 'Fornecedor entrega ao aluno', icon: 'truck', cta: 'Adicionar à loja' },
  stock:    { tone: 'ocean',  label: 'Revenda c/ estoque', desc: 'Você compra e entrega', icon: 'package', cta: 'Comprar estoque' },
  ondemand: { tone: 'neutral',label: 'Sob demanda', desc: 'Compra para uso próprio', icon: 'shirt', cta: 'Solicitar orçamento' },
};
function MarketplaceScreen() {
  const [tab, setTab] = useState('all');
  const products = [
    { name: 'Relógio GPS multiesporte', sup: 'Garmin · distribuidor', cost: 'R$ 2.890', margin: '14% comissão', model: 'dropship', cat: 'equip', c1: 'var(--grafite)', c2: 'var(--grafite-700)' },
    { name: 'Kit suplementação · 30 dias', sup: 'Maurten BR', cost: 'R$ 420', margin: '12% comissão', model: 'dropship', cat: 'nutri', c1: 'var(--azul-oceano)', c2: 'var(--azul-700)' },
    { name: 'Gel de carboidrato · avulso', sup: 'NutriRun Atacado', cost: 'R$ 6,90', margin: 'revende a R$ 12', model: 'stock', cat: 'nutri', c1: 'var(--amber)', c2: 'var(--terracota-600)' },
    { name: 'Isotônico em pó · sachê', sup: 'NutriRun Atacado', cost: 'R$ 2,40', margin: 'revende a R$ 6', model: 'stock', cat: 'nutri', c1: 'var(--azul-300)', c2: 'var(--azul-oceano)' },
    { name: 'Uniforme do time · kit 20un', sup: 'Confecção Pace', cost: 'sob orçamento', margin: 'personalizado', model: 'ondemand', cat: 'vest', c1: 'var(--terracota)', c2: 'var(--grafite)' },
    { name: 'Tenda 3×3 com a marca do clube', sup: 'Tenda Sul', cost: 'sob orçamento', margin: 'uso próprio', model: 'ondemand', cat: 'equip', c1: 'var(--cinza-mineral)', c2: 'var(--grafite-600)' },
  ];
  const filtered = products.filter((p) => tab === 'all' || (tab === 'resale' ? p.model !== 'ondemand' : tab === 'ondemand' ? p.model === 'ondemand' : p.cat === tab));
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* context strip — make clear suppliers are platform-approved */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--azul-100)', border: '1px solid var(--azul-300)', borderRadius: 'var(--radius-12)' }}>
        <Icon name="shield-check" size={20} color="var(--azul-700)" />
        <span style={{ font: 'var(--body-sm)', color: 'var(--grafite)' }}>
          Fornecedores são <strong>aprovados pela retake.run</strong> (KYC/KYB). Você escolhe o que revender ou compra para uso do clube — o repasse e a comissão são automáticos no checkout.
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Tudo', count: 142 }, { id: 'resale', label: 'Para revender' }, { id: 'ondemand', label: 'Uso próprio' }, { id: 'nutri', label: 'Nutrição' }, { id: 'equip', label: 'Equipamento' }]} />
        <Input placeholder="Buscar produto ou fornecedor" prefix={<Icon name="search" size={16} />} style={{ width: 280 }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {filtered.map((p, i) => {
          const f = FULFILL[p.model];
          return (
            <Card key={i} pad="0" interactive style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 110, background: `linear-gradient(135deg, ${p.c1}, ${p.c2})`, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, left: 12 }}><Badge tone={f.tone} variant="solid" dot>{f.label}</Badge></div>
              </div>
              <div style={{ padding: '14px 16px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ font: '600 15px/1.3 var(--font-body)', color: 'var(--text-strong)', minHeight: 40 }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '4px 0 6px' }}>
                  <Icon name="store" size={14} color="var(--cinza-mineral)" />
                  <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{p.sup}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Icon name={f.icon} size={13} color="var(--text-muted)" />
                  <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{f.desc}</span>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <div style={{ font: 'var(--metric)', fontSize: 18, color: 'var(--text-strong)' }}>{p.cost}</div>
                    <div style={{ font: 'var(--caption)', color: 'var(--text-accent)' }}>{p.margin}</div>
                  </div>
                  <Button variant={p.model === 'ondemand' ? 'secondary' : 'primary'} size="sm">{f.cta}</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ LEADS / CAPTAÇÃO ============================ */
const LEAD_ORIGINS = { Instagram: 'accent', Indicação: 'ocean', Site: 'neutral', 'Google Ads': 'warning' };
function LeadCard({ lead, isDragging, onDragStart, onDragEnd }) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      onDragEnd={onDragEnd}
      style={{ background: 'var(--surface-card)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-12)', padding: 14, boxShadow: 'var(--shadow-100)', cursor: 'grab', opacity: isDragging ? 0.35 : 1, transform: isDragging ? 'scale(0.98)' : 'none', transition: 'opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)', userSelect: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Avatar name={lead.name} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '600 14px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{lead.name}</div>
          <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{lead.goal}</div>
        </div>
        <Icon name="grip-vertical" size={15} color="var(--cinza-mineral)" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <Badge tone={LEAD_ORIGINS[lead.origin] || 'neutral'} variant="soft" style={{ fontSize: 10 }}>{lead.origin}</Badge>
        <span style={{ font: 'var(--metric)', fontSize: 14, color: 'var(--text-strong)' }}>{lead.value}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: 'var(--caption)', color: lead.due === 'Atrasado' ? 'var(--red)' : 'var(--text-muted)' }}>
          <Icon name="clock" size={13} color={lead.due === 'Atrasado' ? 'var(--red)' : 'var(--cinza-mineral)'} />{lead.follow}
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: '600 11px/1 var(--font-body)', color: '#3C6E47', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          <Icon name="message-circle" size={14} color="#3C6E47" />WhatsApp
        </span>
      </div>
    </div>
  );
}

const INITIAL_COLUMNS = [
  { id: 'new', label: 'Novo', tone: 'var(--cinza-mineral)', leads: [
    { id: 'l1', name: 'Thiago Borges', goal: 'Primeira maratona', origin: 'Instagram', value: 'R$ 289', follow: 'Hoje' },
    { id: 'l2', name: 'Paula Reis', goal: 'Voltar a correr', origin: 'Google Ads', value: 'R$ 189', follow: 'Hoje' },
  ] },
  { id: 'contacted', label: 'Contatado', tone: 'var(--azul-oceano)', leads: [
    { id: 'l3', name: 'Rodrigo Alves', goal: 'Sub 45 nos 10k', origin: 'Indicação', value: 'R$ 240', follow: 'D+3 · amanhã' },
  ] },
  { id: 'visit', label: 'Visita agendada', tone: 'var(--amber)', leads: [
    { id: 'l4', name: 'Fernanda Dias', goal: 'Emagrecimento', origin: 'Site', value: 'R$ 189', follow: 'Sex · 18h' },
    { id: 'l5', name: 'Marcos Lima', goal: 'Trail running', origin: 'Instagram', value: 'R$ 340', follow: 'Atrasado', due: 'Atrasado' },
  ] },
  { id: 'won', label: 'Convertido', tone: 'var(--green)', leads: [
    { id: 'l6', name: 'Júlia Santos', goal: 'Meia maratona', origin: 'Indicação', value: 'R$ 289', follow: 'Matriculada' },
  ] },
];

function LeadsScreen() {
  const [view, setView] = useState('kanban');
  const [columns, setColumns] = useState(INITIAL_COLUMNS);
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const onDragStart = (e, lead) => {
    setDragId(lead.id);
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', lead.id); } catch (_) {}
  };
  const onDragEnd = () => { setDragId(null); setOverCol(null); };

  const dropInto = (colId, idFromEvent) => {
    const movingId = idFromEvent || dragId;
    if (!movingId) { setOverCol(null); return; }
    setColumns((cols) => {
      let moved = null;
      const without = cols.map((c) => {
        const found = c.leads.find((l) => l.id === movingId);
        if (found) { moved = found; return { ...c, leads: c.leads.filter((l) => l.id !== movingId) }; }
        return c;
      });
      if (!moved) return cols;
      return without.map((c) => c.id === colId ? { ...c, leads: [...c.leads, moved] } : c);
    });
    setDragId(null); setOverCol(null);
  };

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18, height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Tabs value={view} onChange={setView} items={[{ id: 'kanban', label: 'Funil' }, { id: 'list', label: 'Lista' }]} />
          {view === 'kanban' && <span style={{ font: 'var(--caption)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="move" size={13} color="var(--cinza-mineral)" />arraste os cards entre as etapas</span>}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Input placeholder="Buscar lead" prefix={<Icon name="search" size={16} />} style={{ width: 220 }} />
          <Button variant="primary" iconLeft={<Icon name="plus" size={17} />}>Novo lead</Button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, flex: 1, minHeight: 0 }}>
          {columns.map((col) => {
            const isOver = overCol === col.id && dragId;
            return (
            <div key={col.id}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (overCol !== col.id) setOverCol(col.id); }}
              onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOverCol((c) => c === col.id ? null : c); }}
              onDrop={(e) => { e.preventDefault(); const id = (() => { try { return e.dataTransfer.getData('text/plain'); } catch (_) { return null; } })(); dropInto(col.id, id); }}
              style={{ display: 'flex', flexDirection: 'column', gap: 12, background: isOver ? 'var(--terracota-100)' : 'var(--surface-sunken)', borderRadius: 'var(--radius-16)', padding: 12, border: isOver ? '2px dashed var(--terracota)' : '2px solid transparent', transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)', boxSizing: 'border-box' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: '600 12px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-strong)' }}>
                  <span style={{ width: 9, height: 9, borderRadius: 999, background: col.tone }} />{col.label}
                </span>
                <span style={{ font: '700 11px/1 var(--font-mono)', color: 'var(--text-muted)', background: 'var(--creme-50)', borderRadius: 999, padding: '3px 7px' }}>{col.leads.length}</span>
              </div>
              {col.leads.map((l) => <LeadCard key={l.id} lead={l} isDragging={dragId === l.id} onDragStart={onDragStart} onDragEnd={onDragEnd} />)}
              {col.leads.length === 0 && (
                <div style={{ flex: 1, minHeight: 80, borderRadius: 'var(--radius-12)', border: '1.5px dashed var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: 'var(--caption)', color: 'var(--text-muted)', textAlign: 'center', padding: 8 }}>
                  {isOver ? 'Solte aqui' : 'Arraste um lead para cá'}
                </div>
              )}
            </div>
          );
          })}
        </div>
      ) : (
        <Card pad="0">
          {columns.flatMap((c) => c.leads.map((l) => ({ ...l, status: c.label, tone: c.tone }))).map((l, i, arr) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 0.8fr', alignItems: 'center', padding: '13px 22px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={l.name} size={36} />
                <div><div style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{l.name}</div><div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{l.goal}</div></div>
              </div>
              <span style={{ font: 'var(--body-sm)', color: 'var(--text-body)' }}>{l.origin}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, font: 'var(--body-sm)', color: 'var(--text-body)' }}><span style={{ width: 8, height: 8, borderRadius: 999, background: l.tone }} />{l.status}</span>
              <span style={{ font: 'var(--mono-sm)', color: 'var(--text-muted)' }}>{l.follow}</span>
              <span style={{ textAlign: 'right', font: 'var(--metric)', fontSize: 14, color: 'var(--text-strong)' }}>{l.value}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

/* ============================ EVENTS ============================ */
function EventsScreen() {
  const events = [
    { name: 'Sunset Run · Ipanema', date: ['23', 'Mai'], type: ['accent', 'Próprio'], place: 'Posto 9 · Ipanema, RJ', sub: 142, cap: 200, sponsor: 'Red Bull' },
    { name: 'Maratona do Rio', date: ['08', 'Jun'], type: ['ocean', 'Externa'], place: 'Aterro do Flamengo, RJ', sub: 38, cap: null, sponsor: null },
    { name: 'Treinão de Longão', date: ['15', 'Jun'], type: ['neutral', 'Grupo'], place: 'Lagoa Rodrigo de Freitas', sub: 64, cap: 80, sponsor: null },
  ];
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        <StatCard label="Próximos eventos" value="6" caption="30 dias" />
        <StatCard label="Inscrições" value="244" delta={18} caption="abertas" />
        <StatCard label="Receita de eventos" value="R$ 38.900" delta={12} accent />
      </div>

      {/* featured */}
      <div style={{ borderRadius: 'var(--radius-24)', overflow: 'hidden', position: 'relative', minHeight: 200 }}>
        <div style={{ position: 'absolute', inset: 0, background: `url('../../assets/photo-run-banner.png') center/cover` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(13,13,12,0.85) 35%, rgba(13,13,12,0.25))' }} />
        <div style={{ position: 'relative', padding: 28, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}><Badge tone="accent" variant="solid">Em destaque</Badge><Badge tone="neutral" variant="solid">Patrocínio · Red Bull</Badge></div>
          <div style={{ font: 'var(--h1)', color: 'var(--creme)', textTransform: 'uppercase', letterSpacing: 'var(--track-display)' }}>Sunset Run · Ipanema</div>
          <div style={{ font: 'var(--body)', color: 'var(--text-on-dark-muted)' }}>Sábado, 23 mai · 18:00 · 142 de 200 inscritos</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <Button variant="primary" arrow>Gerenciar inscrições</Button>
            <Button variant="inverse">Logística do grupo</Button>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ font: 'var(--h3)', margin: 0 }}>Agenda</h3>
        <Button variant="secondary" size="sm" iconLeft={<Icon name="plus" size={15} />}>Criar evento</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {events.map((e, i) => (
          <Card key={i} interactive style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ textAlign: 'center', background: 'var(--grafite)', borderRadius: 'var(--radius-12)', padding: '8px 14px', color: 'var(--creme)' }}>
                <div style={{ font: 'var(--metric)', fontSize: 22, lineHeight: 1 }}>{e.date[0]}</div>
                <div style={{ font: 'var(--caption)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--terracota-300)' }}>{e.date[1]}</div>
              </div>
              <Badge tone={e.type[0]} variant="soft">{e.type[1]}</Badge>
            </div>
            <div>
              <div style={{ font: '600 16px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{e.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <Icon name="map-pin" size={14} color="var(--cinza-mineral)" />
                <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{e.place}</span>
              </div>
            </div>
            <div style={{ paddingTop: 12, borderTop: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ font: 'var(--mono-sm)', color: 'var(--text-muted)' }}>{e.sub}{e.cap ? ` / ${e.cap}` : ''} inscritos</span>
              {e.sponsor && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, font: 'var(--caption)', color: 'var(--text-muted)' }}><Icon name="badge-check" size={14} color="var(--terracota)" />{e.sponsor}</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================ PRODUCTS (minha loja) ============================ */
const SOURCE = {
  dropship: { label: 'Dropship · fornecedor', icon: 'truck', note: 'Garmin entrega' },
  stock:    { label: 'Estoque próprio', icon: 'package', note: 'pronta entrega' },
  own:      { label: 'Produto próprio', icon: 'badge-check', note: 'você entrega' },
  digital:  { label: 'Digital', icon: 'play-circle', note: 'acesso imediato' },
  service:  { label: 'Serviço', icon: 'heart-pulse', note: 'agendado' },
  plan:     { label: 'Recorrente', icon: 'repeat', note: 'assinatura' },
};
function ProductsScreen() {
  const [tab, setTab] = useState('all');
  const rows = [
    { name: 'Plano Performance', type: ['accent', 'Assinatura'], src: 'plan', price: 'R$ 289/mês', stock: null, sales: 412, c: 'var(--terracota)', grp: 'plan' },
    { name: 'Recovery avulso · sessão', type: ['ocean', 'Serviço'], src: 'service', price: 'R$ 60', stock: null, sales: 88, c: 'var(--azul-oceano)', grp: 'service' },
    { name: 'Curso · Base para 10k', type: ['neutral', 'Digital'], src: 'digital', price: 'R$ 197', stock: null, sales: 234, c: 'var(--grafite)', grp: 'digital' },
    { name: 'Relógio GPS multiesporte', type: ['warning', 'Físico'], src: 'dropship', price: 'R$ 3.290', stock: null, sales: 24, c: 'var(--grafite)', grp: 'phys' },
    { name: 'Gel de carboidrato · avulso', type: ['warning', 'Físico'], src: 'stock', price: 'R$ 12', stock: 340, sales: 612, c: 'var(--amber)', grp: 'phys' },
    { name: 'Garrafa térmica 600ml', type: ['warning', 'Físico'], src: 'stock', price: 'R$ 119', stock: 8, sales: 73, c: 'var(--amber)', grp: 'phys' },
    { name: 'Camiseta do clube 2026', type: ['warning', 'Físico'], src: 'own', price: 'R$ 89', stock: 120, sales: 198, c: 'var(--terracota)', grp: 'phys' },
  ];
  const filtered = rows.filter((r) => tab === 'all' || r.grp === tab);
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Todos', count: 28 }, { id: 'plan', label: 'Planos' }, { id: 'service', label: 'Serviços' }, { id: 'phys', label: 'Físicos' }, { id: 'digital', label: 'Digitais' }]} />
        <Button variant="primary" iconLeft={<Icon name="plus" size={17} />}>Novo produto</Button>
      </div>
      <Card pad="0">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.3fr 0.9fr 0.9fr 0.7fr', gap: '0 24px', padding: '12px 22px', borderBottom: '1px solid var(--border-soft)', font: '600 11px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
          <span>Produto</span><span>Tipo</span><span>Origem · entrega</span><span>Preço</span><span>Estoque</span><span style={{ textAlign: 'right' }}>Vendas</span>
        </div>
        {filtered.map((r, i) => {
          const s = SOURCE[r.src];
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.3fr 0.9fr 0.9fr 0.7fr', gap: '0 24px', alignItems: 'center', padding: '14px 22px', borderBottom: i < filtered.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-8)', background: `color-mix(in srgb, ${r.c} 20%, var(--creme-50))`, display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <Icon name={s.icon} size={19} color={r.c} />
                </div>
                <span style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{r.name}</span>
              </div>
              <span><Badge tone={r.type[0]} variant="soft">{r.type[1]}</Badge></span>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--body-sm)', fontSize: 13, color: 'var(--text-body)' }}>
                  <Icon name={s.icon} size={14} color={r.src === 'own' ? 'var(--terracota)' : 'var(--cinza-mineral)'} />{s.label}
                </span>
                <span style={{ font: 'var(--caption)', color: 'var(--text-muted)', paddingLeft: 20 }}>{s.note}</span>
              </span>
              <span style={{ font: 'var(--metric)', fontSize: 15, color: 'var(--text-strong)' }}>{r.price}</span>
              <span>
                {r.stock == null
                  ? <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>—</span>
                  : <Badge tone={r.stock <= 10 ? 'danger' : 'success'} dot>{r.stock} un</Badge>}
              </span>
              <span style={{ textAlign: 'right', font: 'var(--mono-sm)', color: 'var(--text-muted)' }}>{r.sales}</span>
            </div>
          );
        })}
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: 'var(--caption)', color: 'var(--text-muted)' }}>
        <Icon name="info" size={15} color="var(--cinza-mineral)" />
        Produto próprio: a responsabilidade fiscal e de entrega é do tenant (Merchant of Record em definição).
      </div>
    </div>
  );
}

Object.assign(window, { RTK: { ...(window.RTK || {}), OverviewScreen, AthletesScreen, TrainingScreen, FinanceScreen, MarketplaceScreen, LeadsScreen, EventsScreen, ProductsScreen } });
})();
