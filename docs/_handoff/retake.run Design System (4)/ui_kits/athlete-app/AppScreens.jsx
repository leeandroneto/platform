/* Athlete app screens. Attaches to window.RTA. Uses window.RT + Lucide. */
;(function () {
const { Button, Card, Badge, Avatar, ComplianceTag, Icon } = window.RT;
const { useState } = React;

const TOPPAD = 56;

function Header({ name }) {
  return (
    <div style={{ padding: `${TOPPAD}px 20px 8px`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <div className="eyebrow" style={{ color: 'var(--text-muted)' }}>Quarta · 9 jun</div>
        <div style={{ font: 'var(--h2)', fontSize: 26, textTransform: 'uppercase', letterSpacing: 'var(--track-display)', color: 'var(--text-strong)', marginTop: 2 }}>Bom treino, {name}</div>
      </div>
      <Avatar name={name} size={44} status="online" />
    </div>
  );
}

/* week strip of compliance dots */
function WeekStrip() {
  const week = [['Seg', 'done'], ['Ter', 'done'], ['Qua', 'planned'], ['Qui', 'planned'], ['Sex', 'planned'], ['Sáb', 'done'], ['Dom', 'missed']];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, padding: '4px 20px 0' }}>
      {week.map(([d, s], i) => (
        <div key={i} style={{ textAlign: 'center', padding: '9px 0', borderRadius: 'var(--radius-12)', background: i === 2 ? 'var(--terracota-100)' : 'transparent', border: i === 2 ? '1px solid var(--terracota-300)' : '1px solid transparent' }}>
          <div style={{ font: 'var(--caption)', fontSize: 11, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 7 }}>{d}</div>
          <ComplianceTag status={s} showLabel={false} style={{ margin: '0 auto' }} />
        </div>
      ))}
    </div>
  );
}

/* ============================ TODAY ============================ */
function TodayScreen() {
  const [started, setStarted] = useState(false);
  const steps = [['Aquecimento', '15 min · Z1–Z2'], ['10×800m', 'ritmo 3:45/km · rec 200m'], ['Volta à calma', '10 min · Z1']];
  return (
    <div>
      <Header name="Marina" />
      <WeekStrip />

      {/* hero workout card (graphite) */}
      <div style={{ padding: '16px 16px 0' }}>
        <Card tone="dark" radius="var(--radius-24)" pad="0" elevation={0} style={{ overflow: 'hidden' }}>
          <div style={{ padding: '20px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--terracota-300)' }}>Treino do dia</div>
              <div style={{ font: 'var(--h2)', color: 'var(--text-on-dark)', textTransform: 'uppercase', letterSpacing: 'var(--track-display)', marginTop: 4 }}>Intervalado<br/>VO₂max</div>
            </div>
            <Badge tone="accent" variant="solid">Build · S6</Badge>
          </div>

          <div style={{ display: 'flex', gap: 16, padding: '16px 20px 18px' }}>
            <div>
              <div style={{ font: 'var(--caption)', fontSize: 10, color: 'var(--text-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Ritmo alvo</div>
              <div style={{ font: 'var(--metric)', color: 'var(--text-on-dark)', marginTop: 3 }}>3:45 <span style={{ font: 'var(--mono-sm)', color: 'var(--text-on-dark-muted)' }}>/km</span></div>
            </div>
            <div style={{ width: 1, background: 'var(--border-on-dark)' }} />
            <div>
              <div style={{ font: 'var(--caption)', fontSize: 10, color: 'var(--text-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Volume</div>
              <div style={{ font: 'var(--metric)', color: 'var(--text-on-dark)', marginTop: 3 }}>12,4 <span style={{ font: 'var(--mono-sm)', color: 'var(--text-on-dark-muted)' }}>km</span></div>
            </div>
            <div style={{ width: 1, background: 'var(--border-on-dark)' }} />
            <div>
              <div style={{ font: 'var(--caption)', fontSize: 10, color: 'var(--text-on-dark-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Duração</div>
              <div style={{ font: 'var(--metric)', color: 'var(--text-on-dark)', marginTop: 3 }}>~58 <span style={{ font: 'var(--mono-sm)', color: 'var(--text-on-dark-muted)' }}>min</span></div>
            </div>
          </div>

          <div style={{ background: 'var(--grafite-ink)', padding: '6px 8px' }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px' }}>
                <span style={{ width: 26, height: 26, borderRadius: 999, border: '1.5px solid var(--border-on-dark)', display: 'grid', placeItems: 'center', font: '700 12px/1 var(--font-mono)', color: 'var(--terracota-300)', flex: 'none' }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-on-dark)' }}>{s[0]}</div>
                  <div style={{ font: 'var(--caption)', color: 'var(--text-on-dark-muted)' }}>{s[1]}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ padding: 16 }}>
            <Button variant={started ? 'inverse' : 'primary'} size="lg" pill arrow={!started} onClick={() => setStarted(!started)} style={{ width: '100%' }}>
              {started ? 'Treino em andamento' : 'Iniciar treino'}
            </Button>
          </div>
        </Card>
      </div>

      {/* next event */}
      <div style={{ padding: '16px 16px 0' }}>
        <Card interactive style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-12)', background: 'var(--azul-100)', display: 'grid', placeItems: 'center', flex: 'none' }}>
            <Icon name="calendar" size={22} color="var(--azul-700)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: '600 15px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>Sunset Run · Ipanema</div>
            <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>Sábado, 23 mai · 18:00 · grupo confirmado</div>
          </div>
          <Icon name="chevron-right" size={20} color="var(--cinza-mineral)" />
        </Card>
      </div>
      <div style={{ height: 16 }} />
    </div>
  );
}

/* ============================ PERFORMANCE ============================ */
function Bars() {
  const data = [60, 72, 55, 80, 68, 90, 48];
  const max = Math.max(...data);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, padding: '0 4px' }}>
      {data.map((v, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{ width: '100%', height: (v / max) * 104, borderRadius: 'var(--radius-4)', background: i === 5 ? 'var(--terracota)' : 'var(--azul-300)' }} />
          <span style={{ font: 'var(--mono-sm)', fontSize: 10, color: 'var(--text-muted)' }}>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][i]}</span>
        </div>
      ))}
    </div>
  );
}

function PerformanceScreen() {
  const zones = [['Z1 Recuperação', 18, 'var(--azul-300)'], ['Z2 Base', 42, 'var(--azul-oceano)'], ['Z3 Tempo', 24, 'var(--amber)'], ['Z4 Limiar', 12, 'var(--terracota)'], ['Z5 VO₂max', 4, 'var(--red)']];
  return (
    <div style={{ padding: `${TOPPAD}px 0 16px` }}>
      <div style={{ padding: '0 20px 4px' }}>
        <div className="eyebrow" style={{ color: 'var(--text-muted)' }}>Esta semana</div>
        <div style={{ font: 'var(--h2)', fontSize: 26, textTransform: 'uppercase', letterSpacing: 'var(--track-display)', color: 'var(--text-strong)', marginTop: 2 }}>Desempenho</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, padding: '12px 16px 0' }}>
        {[['Pace médio', '4:12', '/km'], ['Treinos', '6', 'de 7'], ['Volume', '48,7', 'km']].map((m, i) => (
          <Card key={i} pad="14px" radius="var(--radius-16)">
            <div style={{ font: 'var(--caption)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{m[0]}</div>
            <div style={{ font: 'var(--metric)', fontSize: 22, color: 'var(--text-strong)', marginTop: 6 }}>{m[1]}</div>
            <div style={{ font: 'var(--mono-sm)', fontSize: 11, color: 'var(--text-muted)' }}>{m[2]}</div>
          </Card>
        ))}
      </div>

      <div style={{ padding: '12px 16px 0' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h4 style={{ font: 'var(--h4)', margin: 0 }}>Volume diário</h4>
            <Badge tone="success" dot>+8% vs anterior</Badge>
          </div>
          <Bars />
        </Card>
      </div>

      <div style={{ padding: '12px 16px 0' }}>
        <Card>
          <h4 style={{ font: 'var(--h4)', margin: '0 0 14px' }}>Distribuição por zona</h4>
          {zones.map((z, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < zones.length - 1 ? 12 : 0 }}>
              <span style={{ width: 86, font: 'var(--body-sm)', fontSize: 13, color: 'var(--text-body)', flex: 'none' }}>{z[0]}</span>
              <div style={{ flex: 1, height: 10, borderRadius: 999, background: 'var(--surface-sunken)', overflow: 'hidden' }}>
                <div style={{ width: z[1] + '%', height: '100%', background: z[2], borderRadius: 999 }} />
              </div>
              <span style={{ width: 34, textAlign: 'right', font: 'var(--mono-sm)', color: 'var(--text-muted)', flex: 'none' }}>{z[1]}%</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

/* ============================ TAB BAR ============================ */
const TABS = [['today', 'Hoje', 'flame'], ['perf', 'Treinos', 'activity'], ['community', 'Comunidade', 'users'], ['shop', 'Loja', 'store'], ['profile', 'Perfil', 'user']];
function TabBar({ active, onNav }) {
  return (
    <div style={{
      display: 'flex', padding: '10px 8px 24px', background: 'color-mix(in srgb, var(--creme-50) 88%, transparent)',
      backdropFilter: 'blur(12px)', borderTop: '1px solid var(--border-soft)', flex: 'none',
    }}>
      {TABS.map(([id, label, icon]) => {
        const a = id === active;
        return (
          <button key={id} onClick={() => onNav(id)} style={{ flex: 1, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '4px 0' }}>
            <Icon name={icon} size={22} color={a ? 'var(--terracota)' : 'var(--cinza-mineral)'} />
            <span style={{ font: '600 10px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.06em', color: a ? 'var(--terracota)' : 'var(--cinza-mineral)' }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function StubScreen({ label }) {
  return (
    <div style={{ height: '100%', display: 'grid', placeItems: 'center', padding: 40, textAlign: 'center' }}>
      <div style={{ color: 'var(--text-muted)' }}>
        <Icon name="hammer" size={28} color="var(--cinza-mineral)" />
        <p style={{ marginTop: 12, font: 'var(--body-sm)' }}><strong>{label}</strong><br/>não incluído neste kit.</p>
      </div>
    </div>
  );
}

/* ============================ COMMUNITY ============================ */
function CommunityScreen() {
  const ranking = [
    ['Marina Costa', '52,4 km', true], ['Diego Martins', '48,1 km', false],
    ['Camila Souza', '44,8 km', false], ['Bia Lima', '39,2 km', false],
  ];
  const feed = [
    ['Diego Martins', 'completou Longão 18 km', '4:38 /km · há 2h', 12],
    ['Camila Souza', 'bateu PR nos 5 km', '19:42 · há 5h', 31],
  ];
  return (
    <div style={{ padding: `${TOPPAD}px 0 16px` }}>
      <div style={{ padding: '0 20px 4px' }}>
        <div className="eyebrow" style={{ color: 'var(--text-muted)' }}>Acelera Run Club</div>
        <div style={{ font: 'var(--h2)', fontSize: 26, textTransform: 'uppercase', letterSpacing: 'var(--track-display)', color: 'var(--text-strong)', marginTop: 2 }}>Comunidade</div>
      </div>

      {/* streak / gamification */}
      <div style={{ padding: '12px 16px 0' }}>
        <Card tone="dark" radius="var(--radius-24)" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 999, background: 'var(--terracota)', display: 'grid', placeItems: 'center', flex: 'none' }}>
            <Icon name="flame" size={30} color="var(--creme)" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--metric)', fontSize: 26, color: 'var(--text-on-dark)' }}>14 dias</div>
            <div style={{ font: 'var(--caption)', color: 'var(--text-on-dark-muted)' }}>sequência de treinos · nível Prata</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['award', 'zap', 'mountain'].map((b, i) => (
              <div key={i} style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--grafite-ink)', border: '1px solid var(--border-on-dark)', display: 'grid', placeItems: 'center' }}>
                <Icon name={b} size={16} color="var(--terracota-300)" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ranking */}
      <div style={{ padding: '12px 16px 0' }}>
        <Card pad="0">
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h4 style={{ font: 'var(--h4)', margin: 0 }}>Ranking · volume</h4>
            <Badge tone="ocean" variant="soft">Semana</Badge>
          </div>
          {ranking.map(([name, km, me], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', background: me ? 'var(--terracota-100)' : 'transparent', borderBottom: i < ranking.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <span style={{ width: 22, font: '700 15px/1 var(--font-mono)', color: i === 0 ? 'var(--terracota)' : 'var(--text-muted)', flex: 'none' }}>{i + 1}</span>
              <Avatar name={name} size={34} />
              <span style={{ flex: 1, font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{name}{me ? ' (você)' : ''}</span>
              <span style={{ font: 'var(--metric)', fontSize: 15, color: 'var(--text-strong)' }}>{km}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* feed */}
      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {feed.map(([name, action, meta, kudos], i) => (
          <Card key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <Avatar name={name} size={40} status="online" />
              <div style={{ flex: 1 }}>
                <div style={{ font: 'var(--body-sm)', color: 'var(--text-strong)' }}><strong style={{ font: '600 14px/1.3 var(--font-body)' }}>{name}</strong> {action}</div>
                <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{meta}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 18, paddingTop: 4 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--body-sm)', color: 'var(--text-muted)' }}><Icon name="flame" size={16} color="var(--terracota)" /> {kudos}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: 'var(--body-sm)', color: 'var(--text-muted)' }}><Icon name="message-circle" size={16} /> Comentar</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================ SHOP ============================ */
function ShopScreen() {
  const items = [
    { name: 'Uniforme oficial', price: 189, c1: 'var(--terracota)', c2: 'var(--grafite)', sup: 'Clube' },
    { name: 'Boné performance', price: 79, c1: 'var(--grafite)', c2: 'var(--grafite-700)', sup: 'Clube' },
    { name: 'Gel de carboidrato', price: 22, c1: 'var(--azul-oceano)', c2: 'var(--azul-700)', sup: 'Pacefuel' },
    { name: 'Kit suplementação 30d', price: 420, c1: 'var(--cinza-mineral)', c2: 'var(--grafite-600)', sup: 'Z2' },
  ];
  const [step, setStep] = useState('list'); // list | checkout | done
  const [sel, setSel] = useState(null);
  const money = (v) => 'R$ ' + v.toFixed(2).replace('.', ',');

  /* ---------- checkout: resumo com split ---------- */
  if (step === 'checkout' && sel) {
    const marketplace = sel.sup !== 'Clube';
    const forn = sel.price * 0.8, clube = sel.price * 0.1, retake = sel.price * 0.1;
    return (
      <div style={{ padding: `${TOPPAD}px 16px 16px` }}>
        <button onClick={() => setStep('list')} style={{ display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'transparent', cursor: 'pointer', font: '600 12px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', padding: '4px 0 14px' }}>
          <Icon name="arrow-left" size={15} />Loja
        </button>
        <div style={{ font: 'var(--h2)', fontSize: 24, textTransform: 'uppercase', letterSpacing: 'var(--track-display)', color: 'var(--text-strong)', marginBottom: 12 }}>Confirmar pedido</div>

        <Card pad="0" style={{ overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ height: 80, background: `linear-gradient(135deg, ${sel.c1}, ${sel.c2})`, display: 'flex', alignItems: 'flex-end', padding: 12 }}>
            <Badge tone="neutral" variant="solid" style={{ fontSize: 10 }}>{sel.sup}</Badge>
          </div>
          <div style={{ padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ font: '600 15px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{sel.name}</span>
            <span style={{ font: 'var(--metric)', fontSize: 18, color: 'var(--text-strong)' }}>{money(sel.price)}</span>
          </div>
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <div style={{ font: '600 11px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 10 }}>
            {marketplace ? 'Para onde vai seu dinheiro' : 'Produto do clube'}
          </div>
          {marketplace ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[[sel.sup + ' · entrega o produto', forn, 'var(--grafite)'], ['Seu clube · comissão', clube, 'var(--terracota)'], ['retake · plataforma', retake, 'var(--azul-oceano)']].map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--body-sm)', fontSize: 13 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 999, background: r[2], flex: 'none' }} />
                  <span style={{ flex: 1, color: 'var(--text-body)' }}>{r[0]}</span>
                  <span style={{ font: '700 12.5px/1 var(--font-mono)', color: 'var(--text-strong)' }}>{money(r[1])}</span>
                </div>
              ))}
              <span style={{ font: 'var(--caption)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Comprando aqui, você apoia o seu clube sem pagar nada a mais.</span>
            </div>
          ) : (
            <span style={{ font: 'var(--body-sm)', fontSize: 13, color: 'var(--text-muted)' }}>Retirada no treino · pagamento direto ao clube.</span>
          )}
        </Card>

        <Button variant="primary" size="lg" pill onClick={() => setStep('done')} style={{ width: '100%' }}>Pagar com Pix · demo</Button>
      </div>
    );
  }

  /* ---------- pedido confirmado ---------- */
  if (step === 'done' && sel) {
    const marketplace = sel.sup !== 'Clube';
    return (
      <div style={{ padding: `${TOPPAD + 30}px 20px 16px`, textAlign: 'center' }}>
        <span style={{ width: 76, height: 76, borderRadius: 999, border: '3px solid var(--green)', display: 'inline-grid', placeItems: 'center', marginBottom: 16 }}>
          <Icon name="check" size={34} color="var(--green)" />
        </span>
        <div style={{ font: 'var(--h2)', fontSize: 24, textTransform: 'uppercase', color: 'var(--text-strong)', marginBottom: 6 }}>Pedido #1048</div>
        <p style={{ font: 'var(--body-sm)', color: 'var(--text-muted)', margin: '0 0 14px' }}>
          {marketplace
            ? `Pagamento confirmado — fica retido até a entrega. ${sel.sup} já recebeu o pedido e prepara o envio.`
            : 'Combinado! Retire com o coach no próximo treino.'}
        </p>
        {marketplace && (
          <Card tone="dark" pad="14px" style={{ marginBottom: 16, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <Icon name="heart-handshake" size={18} color="var(--terracota)" />
              <span style={{ font: 'var(--body-sm)', fontSize: 13, color: 'var(--text-on-dark)' }}>Seu clube ganhou <strong style={{ color: 'var(--terracota-300)' }}>{money(sel.price * 0.1)}</strong> com esta compra.</span>
            </div>
          </Card>
        )}
        <Button variant="secondary" onClick={() => { setStep('list'); setSel(null); }}>Voltar à loja</Button>
      </div>
    );
  }

  /* ---------- lista ---------- */
  return (
    <div style={{ padding: `${TOPPAD}px 0 16px` }}>
      <div style={{ padding: '0 20px 4px' }}>
        <div className="eyebrow" style={{ color: 'var(--text-muted)' }}>Loja + Marketplace</div>
        <div style={{ font: 'var(--h2)', fontSize: 26, textTransform: 'uppercase', letterSpacing: 'var(--track-display)', color: 'var(--text-strong)', marginTop: 2 }}>Loja</div>
      </div>

      {/* featured banner */}
      <div style={{ padding: '12px 16px 0' }}>
        <div style={{ borderRadius: 'var(--radius-24)', overflow: 'hidden', position: 'relative', height: 132 }}>
          <div style={{ position: 'absolute', inset: 0, background: `url('../../assets/photo-run-banner.png') center/cover` }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(13,13,12,0.82), rgba(13,13,12,0.2))' }} />
          <div style={{ position: 'relative', padding: 18 }}>
            <Badge tone="accent" variant="solid">Drop · edição Sunset</Badge>
            <div style={{ font: 'var(--h3)', color: 'var(--creme)', textTransform: 'uppercase', letterSpacing: 'var(--track-display)', marginTop: 10 }}>Coleção 2026</div>
            <div style={{ font: 'var(--caption)', color: 'var(--terracota-300)', marginTop: 2 }}>frete grátis p/ membros</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '14px 16px 0' }}>
        {items.map((it, i) => (
          <Card key={i} pad="0" interactive style={{ overflow: 'hidden' }} onClick={() => { setSel(it); setStep('checkout'); }}>
            <div style={{ height: 96, background: `linear-gradient(135deg, ${it.c1}, ${it.c2})`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: 8, left: 8 }}><Badge tone="neutral" variant="solid" style={{ fontSize: 10 }}>{it.sup}</Badge></div>
            </div>
            <div style={{ padding: '12px 12px 14px' }}>
              <div style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)', minHeight: 36 }}>{it.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ font: 'var(--metric)', fontSize: 17, color: 'var(--text-strong)' }}>{money(it.price)}</span>
                <div style={{ width: 34, height: 34, borderRadius: 999, background: 'var(--terracota)', display: 'grid', placeItems: 'center' }}>
                  <Icon name="plus" size={18} color="var(--creme)" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { RTA: { TodayScreen, PerformanceScreen, CommunityScreen, ShopScreen, TabBar, StubScreen } });
})();
