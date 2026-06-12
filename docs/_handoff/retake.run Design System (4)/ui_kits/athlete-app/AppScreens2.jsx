/* Athlete app — Onda 4 screens: guided execution (Today2), Profile + sub-screens
   (subscription, history, chat, notifications, anamnese, onboarding). window.RTA. */
;(function () {
const { Card, Badge, Avatar, Button, Switch, Icon, ComplianceTag } = window.RT;
const { useState } = React;

const col = { height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--surface-page)' };
const darkHead = { background: 'var(--grafite-ink)', color: 'var(--creme)', padding: '40px 20px 22px' };
const body = { flex: 1, overflow: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 };
const eyebrow = { font: '600 11px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--terracota-300)' };
const cap = { font: 'var(--caption)', color: 'var(--text-muted)' };
const strong = { font: '600 15px/1.25 var(--font-body)', color: 'var(--text-strong)' };

function Sub({ title, onBack, children }) {
  return (
    <div style={col}>
      <div style={{ ...darkHead, padding: '40px 18px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ border: 'none', background: 'rgba(241,236,226,0.12)', width: 34, height: 34, borderRadius: 999, display: 'grid', placeItems: 'center', cursor: 'pointer', flex: 'none' }}><Icon name="arrow-left" size={18} color="var(--creme)" /></button>
        <span style={{ font: 'var(--h4)', fontSize: 18, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--creme)' }}>{title}</span>
      </div>
      <div style={body}>{children}</div>
    </div>
  );
}

/* ============================ GUIDED EXECUTION (TODAY 2) ============================ */
function TodayScreen2() {
  const steps = [
    { t: 'Aquecimento', d: '15 min · Z1–Z2', dur: '15:00', kind: 'warm' },
    { t: 'Tiro 1 · 800m', d: 'ritmo 3:45/km', dur: '3:00', kind: 'work' },
    { t: 'Recuperação', d: 'trote 200m', dur: '1:30', kind: 'rec' },
    { t: 'Tiro 2 · 800m', d: 'ritmo 3:45/km', dur: '3:00', kind: 'work' },
    { t: 'Recuperação', d: 'trote 200m', dur: '1:30', kind: 'rec' },
    { t: 'Volta à calma', d: '10 min · Z1', dur: '10:00', kind: 'cool' },
  ];
  const [phase, setPhase] = useState('intro'); // intro | run | done
  const [cur, setCur] = useState(0);
  const [pse, setPse] = useState(0);
  const kindColor = { warm: 'var(--azul-oceano)', work: 'var(--terracota)', rec: 'var(--cinza-mineral)', cool: 'var(--azul-300)' };

  if (phase === 'done') return (
    <div style={col}>
      <div style={{ ...darkHead, paddingTop: 44 }}>
        <span style={eyebrow}>Treino concluído</span>
        <div style={{ font: '700 30px/1 var(--font-display)', textTransform: 'uppercase', color: 'var(--creme)', margin: '8px 0 4px' }}>Mandou bem!</div>
        <div style={{ font: 'var(--body-sm)', color: 'var(--text-on-dark-muted)' }}>Intervalado 10×800m · registrado</div>
      </div>
      <div style={body}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[['Distância', '11,4', 'km'], ['Tempo', '52', 'min'], ['Pace méd.', '4:34', '/km']].map(([l, v, u]) => (
            <Card key={l} pad="14px" style={{ textAlign: 'center' }}><div style={{ font: '700 22px/1 var(--font-mono)', color: 'var(--text-strong)' }}>{v}</div><div style={cap}>{l} · {u}</div></Card>
          ))}
        </div>
        <Card pad="18px" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={strong}>Como foi o esforço? (PSE)</span>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
            {[...Array(10)].map((_, i) => (
              <button key={i} onClick={() => setPse(i + 1)} style={{ flex: 1, height: 38, borderRadius: 'var(--radius-8)', border: '1.5px solid ' + (pse === i + 1 ? 'var(--terracota)' : 'var(--border-strong)'), background: pse === i + 1 ? 'var(--terracota)' : 'var(--creme-50)', color: pse === i + 1 ? 'var(--creme)' : 'var(--text-muted)', font: '700 13px/1 var(--font-mono)', cursor: 'pointer' }}>{i + 1}</button>
            ))}
          </div>
          <Button variant="primary" onClick={() => { setPhase('intro'); setCur(0); setPse(0); }}>Enviar para o treinador</Button>
        </Card>
      </div>
    </div>
  );

  if (phase === 'run') {
    const s = steps[cur];
    return (
      <div style={col}>
        <div style={{ ...darkHead, paddingTop: 44, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <span style={eyebrow}>Passo {cur + 1} de {steps.length}</span>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14, textAlign: 'center' }}>
            <Badge tone={s.kind === 'work' ? 'accent' : 'ocean'} variant="soft">{s.kind === 'work' ? 'Forte' : s.kind === 'rec' ? 'Recuperação' : s.kind === 'warm' ? 'Aquecimento' : 'Calma'}</Badge>
            <div style={{ font: '700 34px/1 var(--font-display)', textTransform: 'uppercase', color: 'var(--creme)' }}>{s.t}</div>
            <div style={{ font: 'var(--body)', color: 'var(--text-on-dark-muted)' }}>{s.d}</div>
            <div style={{ font: '700 72px/1 var(--font-mono)', color: kindColor[s.kind] }}>{s.dur}</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="inverse" size="lg" style={{ flex: 1 }} onClick={() => cur + 1 < steps.length ? setCur(cur + 1) : setPhase('done')} arrow>{cur + 1 < steps.length ? 'Próximo' : 'Finalizar'}</Button>
            <button onClick={() => setPhase('done')} style={{ width: 54, borderRadius: 'var(--radius-8)', border: '2px solid var(--border-on-dark)', background: 'transparent', cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="square" size={20} color="var(--creme)" /></button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={col}>
      <div style={darkHead}>
        <span style={eyebrow}>Treino do dia · Ter</span>
        <div style={{ font: '700 28px/1 var(--font-display)', textTransform: 'uppercase', color: 'var(--creme)', margin: '8px 0 4px' }}>Intervalado 10×800m</div>
        <div style={{ font: 'var(--body-sm)', color: 'var(--text-on-dark-muted)' }}>Fase Pico · prescrito por Coach Léo</div>
      </div>
      <div style={body}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-card)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-12)' }}>
            <span style={{ width: 6, height: 36, borderRadius: 999, background: kindColor[s.kind], flex: 'none' }} />
            <div style={{ flex: 1 }}><div style={strong}>{s.t}</div><div style={cap}>{s.d}</div></div>
            <span style={{ font: '700 13px/1 var(--font-mono)', color: 'var(--text-muted)' }}>{s.dur}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: 18, borderTop: '1px solid var(--border-soft)', background: 'var(--surface-card)' }}>
        <Button variant="primary" size="lg" style={{ width: '100%' }} onClick={() => { setPhase('run'); setCur(0); }} iconLeft={<Icon name="play" size={18} />}>Iniciar treino</Button>
      </div>
    </div>
  );
}

/* ============================ PROFILE + SUB-SCREENS ============================ */
function SubSubscription({ onBack }) {
  return (
    <Sub title="Minha assinatura" onBack={onBack}>
      <Card pad="20px" tone="dark" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Badge tone="accent" variant="soft" style={{ alignSelf: 'flex-start' }}>Plano Performance</Badge>
        <div style={{ font: '700 22px/1 var(--font-mono)', color: 'var(--creme)' }}>R$ 289<span style={{ font: 'var(--caption)', color: 'var(--text-on-dark-muted)' }}> /mês</span></div>
        <div style={{ font: 'var(--caption)', color: 'var(--text-on-dark-muted)' }}>Renova em 05 jul · cartão final 4242</div>
      </Card>
      <div style={cap}>Carteirinha do clube</div>
      <Card pad="18px" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-12)', background: 'var(--grafite-ink)', display: 'grid', placeItems: 'center' }}><Icon name="qr-code" size={28} color="var(--creme)" /></div>
        <div><div style={strong}>Marina Costa</div><div style={cap}>Acelera Run Club · #1042</div></div>
      </Card>
      <div style={cap}>Faturas</div>
      {[['Jun 2026', 'R$ 289'], ['Mai 2026', 'R$ 289']].map(([m, v]) => (
        <div key={m} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--surface-card)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-12)' }}>
          <span style={{ font: 'var(--body-sm)', color: 'var(--text-body)' }}>{m}</span><div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><span style={{ font: '700 13px/1 var(--font-mono)' }}>{v}</span><Badge tone="success" variant="soft" dot>pago</Badge></div>
        </div>
      ))}
    </Sub>
  );
}
function SubHistory({ onBack }) {
  const items = [['Hoje', 'Intervalado 10×800m', 'done'], ['Ontem', 'Longão 24km', 'done'], ['Dom', 'Folga', 'planned'], ['Sáb', 'Tempo run 8km', 'partial'], ['Sex', 'Regenerativo 6km', 'missed'], ['Qui', 'Base 10km', 'done']];
  return (
    <Sub title="Histórico" onBack={onBack}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[['Sequência', '18', 'dias'], ['Volume mês', '128', 'km'], ['Adesão', '94', '%']].map(([l, v, u]) => (
          <Card key={l} pad="12px" style={{ textAlign: 'center' }}><div style={{ font: '700 20px/1 var(--font-mono)', color: 'var(--terracota)' }}>{v}</div><div style={cap}>{l}</div></Card>
        ))}
      </div>
      {items.map(([d, t, s], i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-card)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-12)' }}>
          <span style={{ ...cap, width: 42 }}>{d}</span><span style={{ flex: 1, font: 'var(--body-sm)', color: 'var(--text-body)' }}>{t}</span><ComplianceTag status={s} size="sm" />
        </div>
      ))}
    </Sub>
  );
}
function SubChat({ onBack }) {
  const msgs = [
    { me: false, t: 'Bom treino hoje! Mandou super bem no longão 💪', w: '08:12' },
    { me: true, t: 'Valeu coach! Senti o joelho um pouco no fim', w: '08:30' },
    { me: false, t: 'Vamos reduzir o volume de quinta então. Já ajustei seu treino.', w: '08:34' },
    { me: true, t: 'Perfeito, obrigada!', w: '08:35' },
  ];
  return (
    <div style={col}>
      <div style={{ ...darkHead, padding: '40px 18px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ border: 'none', background: 'rgba(241,236,226,0.12)', width: 34, height: 34, borderRadius: 999, display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Icon name="arrow-left" size={18} color="var(--creme)" /></button>
        <Avatar name="Léo" size={36} status="online" /><div><div style={{ font: '600 15px/1.1 var(--font-body)', color: 'var(--creme)' }}>Coach Léo</div><div style={{ font: 'var(--caption)', color: 'var(--text-on-dark-muted)' }}>online</div></div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
            <div style={{ padding: '10px 14px', borderRadius: m.me ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: m.me ? 'var(--terracota)' : 'var(--surface-card)', color: m.me ? 'var(--creme)' : 'var(--text-body)', border: m.me ? 'none' : '1px solid var(--border-soft)', font: 'var(--body-sm)' }}>{m.t}</div>
            <div style={{ ...cap, textAlign: m.me ? 'right' : 'left', marginTop: 3 }}>{m.w}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: 14, borderTop: '1px solid var(--border-soft)', background: 'var(--surface-card)', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 42, borderRadius: 999, border: '1.5px solid var(--border-strong)', display: 'flex', alignItems: 'center', padding: '0 16px', color: 'var(--text-muted)', font: 'var(--body-sm)' }}>Mensagem…</div>
        <button style={{ width: 42, height: 42, borderRadius: 999, border: 'none', background: 'var(--terracota)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}><Icon name="send" size={18} color="var(--creme)" /></button>
      </div>
    </div>
  );
}
function SubNotifications({ onBack }) {
  const n = [
    ['activity', 'Novo treino prescrito para amanhã', 'há 1 h', 'accent'],
    ['calendar', 'Treinão de domingo confirmado · 6h Aterro', 'há 3 h', 'ocean'],
    ['trophy', 'Você subiu para 1º no ranking de volume!', 'ontem', 'accent'],
    ['credit-card', 'Pagamento de junho confirmado', 'há 2 dias', 'neutral'],
  ];
  return (
    <Sub title="Notificações" onBack={onBack}>
      {n.map(([ic, t, w, tone], i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '13px 14px', background: 'var(--surface-card)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-12)' }}>
          <Badge tone={tone} variant="soft" style={{ width: 36, height: 36, padding: 0, borderRadius: 999, display: 'grid', placeItems: 'center', flex: 'none' }}><Icon name={ic} size={17} /></Badge>
          <div style={{ flex: 1 }}><div style={{ font: 'var(--body-sm)', color: 'var(--text-body)' }}>{t}</div><div style={{ ...cap, marginTop: 3 }}>{w}</div></div>
        </div>
      ))}
    </Sub>
  );
}
function SubAnamnese({ onBack }) {
  return (
    <Sub title="Anamnese & saúde" onBack={onBack}>
      {[['Objetivo', 'Sub 1h45 nos 21k'], ['Lesões', 'Tendinite joelho D (2023)'], ['Restrições', 'Nenhuma atual'], ['FC repouso', '52 bpm'], ['Disponibilidade', '5 dias/semana'], ['Experiência', '3 anos correndo']].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '13px 14px', background: 'var(--surface-card)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-12)' }}><span style={cap}>{k}</span><span style={{ font: 'var(--body-sm)', color: 'var(--text-body)', textAlign: 'right' }}>{v}</span></div>
      ))}
      <Button variant="secondary" iconLeft={<Icon name="pencil" size={15} />}>Atualizar respostas</Button>
    </Sub>
  );
}
function SubOnboarding({ onBack }) {
  const [step, setStep] = useState(0);
  const total = 4;
  const next = () => step + 1 < total ? setStep(step + 1) : onBack();
  return (
    <div style={col}>
      <div style={{ ...darkHead, paddingTop: 40 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>{[...Array(total)].map((_, i) => <span key={i} style={{ flex: 1, height: 4, borderRadius: 999, background: i <= step ? 'var(--terracota)' : 'rgba(241,236,226,0.2)' }} />)}</div>
        <span style={eyebrow}>Passo {step + 1} de {total}</span>
        <div style={{ font: '700 24px/1.05 var(--font-display)', textTransform: 'uppercase', color: 'var(--creme)', margin: '8px 0 0' }}>{['Bem-vindo à retake', 'Entre no seu clube', 'Conte sobre você', 'Tudo pronto!'][step]}</div>
      </div>
      <div style={body}>
        {step === 0 && <><p style={{ font: 'var(--body)', color: 'var(--text-body)' }}>O app único dos corredores da rede. Treino do dia, desempenho, loja e a sua comunidade — em um só lugar.</p><Card pad="16px" style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Icon name="smartphone" size={22} color="var(--terracota)" /><span style={cap}>Use o mesmo login do seu clube ou crie sua conta com e-mail.</span></Card></>}
        {step === 1 && <><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={cap}>Código de convite do clube</span><div style={{ height: 50, borderRadius: 'var(--radius-12)', border: '1.5px solid var(--border-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', font: '700 22px/1 var(--font-mono)', letterSpacing: '0.3em', color: 'var(--text-strong)', background: 'var(--surface-card)' }}>ACEL-42</div></div><Card pad="16px" style={{ display: 'flex', gap: 12, alignItems: 'center' }}><Avatar name="Acelera" size={40} /><div><div style={strong}>Acelera Run Club</div><div style={cap}>Rio de Janeiro · 1.245 atletas</div></div><Icon name="check-circle-2" size={20} color="var(--green)" style={{ marginLeft: 'auto' }} /></Card></>}
        {step === 2 && <>{['Qual seu objetivo?', 'Tem alguma lesão?', 'Quantos dias por semana?'].map((q, i) => (<div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><span style={cap}>{q}</span><div style={{ height: 46, borderRadius: 'var(--radius-12)', border: '1.5px solid var(--border-strong)', display: 'flex', alignItems: 'center', padding: '0 14px', color: 'var(--text-muted)', font: 'var(--body-sm)', background: 'var(--surface-card)' }}>{['Sub 1h45 nos 21k', 'Tendinite no joelho', '5 dias'][i]}</div></div>))}</>}
        {step === 3 && <div style={{ textAlign: 'center', marginTop: 20 }}><div style={{ width: 72, height: 72, borderRadius: 999, background: 'var(--green-100)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}><Icon name="check" size={34} color="var(--green)" /></div><p style={{ font: 'var(--body)', color: 'var(--text-body)' }}>Pronto, Marina! Seu treinador já recebeu sua anamnese e vai prescrever seu primeiro treino.</p></div>}
      </div>
      <div style={{ padding: 18, borderTop: '1px solid var(--border-soft)', background: 'var(--surface-card)' }}><Button variant="primary" size="lg" style={{ width: '100%' }} onClick={next} arrow>{step + 1 < total ? 'Continuar' : 'Começar a treinar'}</Button></div>
    </div>
  );
}

function ProfileScreen() {
  const [view, setView] = useState(null);
  if (view === 'sub') return <SubSubscription onBack={() => setView(null)} />;
  if (view === 'hist') return <SubHistory onBack={() => setView(null)} />;
  if (view === 'chat') return <SubChat onBack={() => setView(null)} />;
  if (view === 'notif') return <SubNotifications onBack={() => setView(null)} />;
  if (view === 'anam') return <SubAnamnese onBack={() => setView(null)} />;
  if (view === 'onb') return <SubOnboarding onBack={() => setView(null)} />;
  const menu = [
    ['credit-card', 'Minha assinatura', 'Performance · R$ 289', 'sub'],
    ['history', 'Histórico de treinos', '18 dias de sequência', 'hist'],
    ['message-circle', 'Conversa com o treinador', '1 nova mensagem', 'chat'],
    ['bell', 'Notificações', '3 não lidas', 'notif'],
    ['clipboard-list', 'Anamnese & saúde', 'atualizada em mai', 'anam'],
    ['sparkles', 'Refazer onboarding', 'demo do fluxo de entrada', 'onb'],
  ];
  return (
    <div style={col}>
      <div style={{ ...darkHead, paddingTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar name="Marina Costa" size={60} ring />
          <div><div style={{ font: '700 22px/1 var(--font-display)', textTransform: 'uppercase', color: 'var(--creme)' }}>Marina Costa</div><div style={{ font: 'var(--body-sm)', color: 'var(--text-on-dark-muted)', marginTop: 4 }}>Acelera Run Club · desde mar 2024</div></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 18 }}>
          {[['5K', '22:14'], ['10K', '46:58'], ['21K', '1:48:30']].map(([k, v]) => (
            <div key={k} style={{ background: 'rgba(241,236,226,0.08)', borderRadius: 'var(--radius-8)', padding: '10px 8px', textAlign: 'center' }}><div style={{ font: '700 9px/1 var(--font-body)', letterSpacing: '0.1em', color: 'var(--terracota-300)' }}>RECORDE {k}</div><div style={{ font: '700 15px/1.2 var(--font-mono)', color: 'var(--creme)', marginTop: 4 }}>{v}</div></div>
          ))}
        </div>
      </div>
      <div style={body}>
        {menu.map(([ic, t, s, v]) => (
          <button key={v} onClick={() => setView(v)} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', background: 'var(--surface-card)', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-12)', cursor: 'pointer', textAlign: 'left', width: '100%' }}>
            <Icon name={ic} size={20} color="var(--terracota)" />
            <div style={{ flex: 1 }}><div style={strong}>{t}</div><div style={cap}>{s}</div></div>
            <Icon name="chevron-right" size={18} color="var(--cinza-mineral)" />
          </button>
        ))}
        <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}><Icon name="log-out" size={16} color="var(--text-muted)" />Sair</button>
      </div>
    </div>
  );
}

Object.assign(window, { RTA: { ...(window.RTA || {}), TodayScreen2, ProfileScreen } });
})();
