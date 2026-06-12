/* Dashboard extra screens (Onda 3): Community, Settings, Agenda, Athletes+detail,
   structured Training. Attaches to window.RTK. */
;(function () {
const { Card, StatCard, Badge, Avatar, Button, Tabs, Input, Switch, Icon, ComplianceTag } = window.RT;
const { useState } = React;

const wrap = { padding: 32, display: 'flex', flexDirection: 'column', gap: 18 };
const head = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' };
const cap = { font: 'var(--caption)', color: 'var(--text-muted)' };
const strong = { font: '600 14px/1.2 var(--font-body)', color: 'var(--text-strong)' };
const th = { font: '600 11px/1.2 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', textAlign: 'left', padding: '16px 16px 10px', whiteSpace: 'nowrap' };
const td = { padding: '13px 16px', borderTop: '1px solid var(--border-soft)', font: 'var(--body-sm)', color: 'var(--text-body)', verticalAlign: 'middle' };

/* ============================ COMMUNITY ============================ */
function CommunityScreen() {
  const [tab, setTab] = useState('mural');
  const posts = [
    { who: 'Coach Léo', av: 'Léo', role: 'Treinador', txt: 'Treinão de domingo confirmado: 6h no Aterro. Bora!', likes: 48, comm: 12, pin: true, when: 'há 2 h' },
    { who: 'Marina Costa', av: 'Marina Costa', role: 'Atleta', txt: 'Fechei meu primeiro 21k hoje 🏅 obrigada equipe!', likes: 96, comm: 23, when: 'há 4 h' },
    { who: 'Diego Martins', av: 'Diego Martins', role: 'Atleta', txt: 'Alguém topa rodar amanhã 6h na Lagoa?', likes: 11, comm: 5, when: 'há 6 h', flag: true },
  ];
  return (
    <div style={wrap}>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'mural', label: 'Mural' }, { id: 'avisos', label: 'Avisos' }, { id: 'desafios', label: 'Ranking & desafios' }]} />
      {tab === 'mural' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {posts.map((p, i) => (
              <Card key={i} pad="18px" style={{ borderColor: p.flag ? 'var(--amber)' : 'var(--border-soft)' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Avatar name={p.av} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={strong}>{p.who}</span>
                      <Badge tone={p.role === 'Treinador' ? 'accent' : 'neutral'} variant="soft">{p.role}</Badge>
                      {p.pin && <Badge tone="ocean" variant="outline"><Icon name="pin" size={10} style={{ marginRight: 3 }} />Fixado</Badge>}
                      <span style={{ ...cap, marginLeft: 'auto' }}>{p.when}</span>
                    </div>
                    <p style={{ font: 'var(--body)', color: 'var(--text-body)', margin: '8px 0 12px' }}>{p.txt}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...cap }}><Icon name="heart" size={14} color="var(--text-muted)" />{p.likes}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, ...cap }}><Icon name="message-circle" size={14} color="var(--text-muted)" />{p.comm}</span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                        {p.flag && <Badge tone="warning" variant="soft" dot>denunciado</Badge>}
                        <Button variant="ghost" size="sm" style={{ padding: '0 8px' }}><Icon name="pin" size={14} /></Button>
                        <Button variant="ghost" size="sm" style={{ padding: '0 8px' }}><Icon name="trash-2" size={14} /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Card pad="20px" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Publicar no mural</div>
            <textarea placeholder="Escreva um aviso para a equipe…" style={{ minHeight: 90, padding: 12, border: '1.5px solid var(--border-strong)', borderRadius: 'var(--radius-8)', background: 'var(--creme-50)', font: 'var(--body)', color: 'var(--text-body)', resize: 'vertical' }} />
            <div style={{ display: 'flex', gap: 8 }}><Button variant="ghost" size="sm" iconLeft={<Icon name="image" size={15} />}>Imagem</Button><Button variant="ghost" size="sm" iconLeft={<Icon name="pin" size={15} />}>Fixar</Button></div>
            <Button variant="primary" iconLeft={<Icon name="send" size={15} />}>Publicar</Button>
          </Card>
        </div>
      )}
      {tab === 'avisos' && (
        <Card pad="24px" style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><div style={strong}>Disparo para a equipe</div><div style={cap}>Vai para o app e, opcionalmente, push e WhatsApp.</div></div>
          <Input label="Título" placeholder="Ex.: Mudança no treino de quinta" />
          <textarea placeholder="Mensagem…" style={{ minHeight: 100, padding: 12, border: '1.5px solid var(--border-strong)', borderRadius: 'var(--radius-8)', background: 'var(--creme-50)', font: 'var(--body)', color: 'var(--text-body)', resize: 'vertical' }} />
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
            {[['Notificação no app', true], ['Push', true], ['WhatsApp', false], ['E-mail', false]].map(([l, on]) => (
              <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--body-sm)', color: 'var(--text-body)' }}><Switch checked={on} size="sm" onChange={() => {}} />{l}</label>
            ))}
          </div>
          <Button variant="primary" iconLeft={<Icon name="megaphone" size={16} />} style={{ alignSelf: 'flex-start' }}>Enviar para 1.245 atletas</Button>
        </Card>
      )}
      {tab === 'desafios' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
          <Card pad="0">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={strong}>Ranking de volume · junho</span><Button variant="text" size="sm">Configurar</Button></div>
            {[['Marina Costa', '52,4 km', 1], ['Diego Martins', '48,1 km', 2], ['Paula Reis', '41,7 km', 3], ['Rodrigo Alves', '39,2 km', 4]].map(([n, km, r]) => (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid var(--border-soft)' }}>
                <span style={{ font: '700 15px/1 var(--font-mono)', color: r === 1 ? 'var(--terracota)' : 'var(--text-muted)', width: 22 }}>{r}</span>
                <Avatar name={n} size={32} /><span style={{ ...strong, flex: 1 }}>{n}</span><span style={{ font: '700 13px/1 var(--font-mono)', color: 'var(--text-strong)' }}>{km}</span>
              </div>
            ))}
          </Card>
          <Card pad="20px" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={strong}>Desafios ativos</span>
            {[['Desafio 100 km no mês', '842 participando', 'accent'], ['Streak de 7 dias', '310 ativos', 'ocean']].map(([t, s, tone]) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--border-soft)', borderRadius: 'var(--radius-12)' }}>
                <Badge tone={tone} variant="soft" style={{ width: 36, height: 36, padding: 0, borderRadius: 999, display: 'grid', placeItems: 'center' }}><Icon name="flame" size={18} /></Badge>
                <div style={{ flex: 1 }}><div style={strong}>{t}</div><div style={cap}>{s}</div></div>
              </div>
            ))}
            <Button variant="secondary" size="sm" iconLeft={<Icon name="plus" size={15} />} style={{ alignSelf: 'flex-start' }}>Criar desafio</Button>
          </Card>
        </div>
      )}
    </div>
  );
}

/* ============================ SETTINGS ============================ */
function SettingsScreen() {
  const [tab, setTab] = useState('equipe');
  const team = [
    { n: 'Léo Andrade', role: 'Dono · admin', perms: 'Tudo', av: 'Léo Andrade' },
    { n: 'Carla Nunes', role: 'Treinadora', perms: 'Treinos, atletas, agenda', av: 'Carla Nunes' },
    { n: 'Rafael Souza', role: 'Financeiro', perms: 'Financeiro, comissões', av: 'Rafael Souza' },
    { n: 'Bia Lopes', role: 'Recepção', perms: 'Captação, agenda', av: 'Bia Lopes' },
    { n: 'Marketing', role: 'Marketing', perms: 'Site, comunidade', av: 'Marketing' },
  ];
  return (
    <div style={wrap}>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'equipe', label: 'Equipe & permissões' }, { id: 'assinatura', label: 'Assinatura' }, { id: 'pagamentos', label: 'Pagamentos' }, { id: 'conta', label: 'Conta' }]} />
      {tab === 'equipe' && (
        <Card pad="0">
          <div style={{ ...head, padding: '18px 20px 0' }}><span style={strong}>Pessoas com acesso</span><Button variant="primary" size="sm" iconLeft={<Icon name="user-plus" size={15} />}>Convidar</Button></div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
            <thead><tr><th style={th}>Pessoa</th><th style={th}>Papel</th><th style={th}>Permissões</th><th style={{ ...th, textAlign: 'right' }}></th></tr></thead>
            <tbody>
              {team.map((m, i) => (
                <tr key={i}>
                  <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={m.av} size={32} /><span style={strong}>{m.n}</span></div></td>
                  <td style={td}><Badge tone={i === 0 ? 'accent' : 'neutral'} variant="soft">{m.role}</Badge></td>
                  <td style={{ ...td, color: 'var(--text-muted)' }}>{m.perms}</td>
                  <td style={{ ...td, textAlign: 'right' }}><Button variant="ghost" size="sm" style={{ padding: '0 8px' }}><Icon name="pencil" size={14} /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === 'assinatura' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
          <Card pad="24px" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Badge tone="accent" variant="soft" style={{ alignSelf: 'flex-start' }}>Plano atual</Badge>
            <div><span style={{ font: 'var(--metric-xl)', fontSize: 34, color: 'var(--text-strong)' }}>Membro</span></div>
            <div style={{ font: '700 18px/1 var(--font-mono)', color: 'var(--text-strong)' }}>R$ 59<span style={{ ...cap }}> /mês · anual</span></div>
            <div style={cap}>Site personalizado pela retake · sem marcas de patrocinadores · domínio próprio · até 5 programas divulgados</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}><Button variant="secondary" size="sm">Mudar plano</Button><Button variant="ghost" size="sm">Ver benefícios</Button></div>
          </Card>
          <Card pad="0">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-soft)', ...strong }}>Faturas</div>
            {[['Jun 2026', 'R$ 59', 'paid'], ['Mai 2026', 'R$ 59', 'paid'], ['Abr 2026', 'R$ 59', 'paid']].map(([m, v, s]) => (
              <div key={m} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid var(--border-soft)' }}>
                <span style={{ font: 'var(--body-sm)', color: 'var(--text-body)' }}>{m}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><span style={{ font: '700 13px/1 var(--font-mono)', color: 'var(--text-strong)' }}>{v}</span><Badge tone="success" variant="soft" dot>pago</Badge><Icon name="receipt" size={15} color="var(--text-muted)" /></div>
              </div>
            ))}
          </Card>
        </div>
      )}
      {tab === 'pagamentos' && (
        <Card pad="24px" style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 46, height: 46, borderRadius: 'var(--radius-8)', background: 'var(--green-100)', display: 'grid', placeItems: 'center' }}><Icon name="check-circle-2" size={24} color="var(--green)" /></span>
            <div><div style={strong}>Gateway conectado</div><div style={cap}>Stripe · subconta do seu CNPJ · você é o Merchant of Record</div></div>
            <Badge tone="success" variant="soft" dot style={{ marginLeft: 'auto' }}>ativo</Badge>
          </div>
          <Card tone="sunken" pad="14px 16px" style={{ display: 'flex', gap: 10 }}><Icon name="shield" size={16} color="var(--azul-700)" /><span style={cap}>No plano pago, quem vende é o seu CNPJ. A retake só orquestra o split com fornecedores e a comissão da rede.</span></Card>
          <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" size="sm">Trocar conta</Button><Button variant="ghost" size="sm">Ver repasses</Button></div>
        </Card>
      )}
      {tab === 'conta' && (
        <Card pad="24px" style={{ maxWidth: 620, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input label="Nome da assessoria" defaultValue="Acelera Run Club" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}><Input label="CNPJ" defaultValue="12.345.678/0001-90" /><Input label="Cidade" defaultValue="Rio de Janeiro · RJ" /></div>
          <Input label="E-mail de contato" defaultValue="contato@acelera.run" />
          <Button variant="primary" style={{ alignSelf: 'flex-start' }}>Salvar alterações</Button>
        </Card>
      )}
    </div>
  );
}

/* ============================ AGENDA ============================ */
function AgendaScreen() {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const sessions = {
    Seg: [['06h', 'Base · Aterro', 'Carla', 18, 24]], Ter: [['06h', 'Intervalado · Pista', 'Léo', 22, 24], ['19h', 'Base · Lagoa', 'Carla', 14, 20]],
    Qua: [['06h', 'Regenerativo', 'Carla', 9, 20]], Qui: [['06h', 'Tempo run', 'Léo', 20, 24], ['19h', 'Base · Lagoa', 'Carla', 16, 20]],
    Sex: [['06h', 'Base · Aterro', 'Carla', 12, 24]], 'Sáb': [['06h', 'Longão', 'Léo', 38, 50]],
  };
  return (
    <div style={wrap}>
      <div style={head}>
        <Tabs value="semana" onChange={() => {}} items={[{ id: 'semana', label: 'Semana' }, { id: 'mes', label: 'Mês' }]} />
        <Button variant="primary" size="sm" iconLeft={<Icon name="plus" size={15} />}>Nova sessão</Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
        {days.map((d) => (
          <div key={d} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ font: '600 12px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', textAlign: 'center', paddingBottom: 8, borderBottom: '1px solid var(--border-soft)' }}>{d}</div>
            {(sessions[d] || []).map(([h, t, c, n, capn], i) => (
              <Card key={i} pad="12px" interactive style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ font: '700 13px/1 var(--font-mono)', color: 'var(--terracota)' }}>{h}</div>
                <div style={{ font: '600 12.5px/1.25 var(--font-body)', color: 'var(--text-strong)' }}>{t}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, ...cap }}><Icon name="user" size={12} color="var(--text-muted)" />{c}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, marginTop: 2 }}>
                  <span style={{ font: '700 11px/1 var(--font-mono)', color: n >= capn ? 'var(--red)' : 'var(--text-strong)' }}>{n}/{capn}</span>
                  <Badge tone={n >= capn ? 'danger' : 'success'} variant="soft">{n >= capn ? 'lotado' : 'check-in'}</Badge>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================ ATHLETES + DETAIL ============================ */
const ATH = [
  { n: 'Marina Costa', plan: 'Performance', goal: 'Sub 1h45 nos 21k', status: 'online', adh: 94, pace: '4:32', since: 'mar 2024', pay: 'em dia' },
  { n: 'Diego Martins', plan: 'Performance', goal: 'Primeira maratona', status: 'online', adh: 88, pace: '5:10', since: 'jan 2025', pay: 'em dia' },
  { n: 'Paula Reis', plan: 'Base', goal: 'Voltar a correr', status: 'paused', adh: 61, pace: '6:20', since: 'set 2025', pay: 'pendente' },
  { n: 'Rodrigo Alves', plan: 'Performance', goal: 'Sub 45 nos 10k', status: 'risk', adh: 42, pace: '4:58', since: 'nov 2024', pay: 'atrasado' },
];
function AthleteDetail({ a, onBack }) {
  return (
    <div style={wrap}>
      <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, alignSelf: 'flex-start', border: 'none', background: 'none', cursor: 'pointer', font: '600 12px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}><Icon name="arrow-left" size={15} />Atletas</button>
      <Card pad="24px">
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <Avatar name={a.n} size={64} status={a.status} ring />
          <div style={{ flex: 1 }}>
            <div style={{ font: 'var(--h2)', textTransform: 'uppercase', letterSpacing: 'var(--track-display)', color: 'var(--text-strong)' }}>{a.n}</div>
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}><Badge tone="accent" variant="soft">{a.plan}</Badge><Badge tone={a.pay === 'em dia' ? 'success' : a.pay === 'pendente' ? 'warning' : 'danger'} variant="soft" dot>{a.pay}</Badge><span style={{ ...cap, alignSelf: 'center' }}>aluno desde {a.since}</span></div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}><Button variant="secondary" size="sm" iconLeft={<Icon name="message-circle" size={15} />}>Mensagem</Button><Button variant="primary" size="sm" iconLeft={<Icon name="activity" size={15} />}>Prescrever</Button></div>
        </div>
      </Card>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Adesão" value={a.adh} unit="%" accent={a.adh < 60} caption="últimas 4 semanas" />
        <StatCard label="Pace médio" value={a.pace} unit="/km" />
        <StatCard label="Volume mês" value="128" unit="km" delta={6} />
        <StatCard label="Meta" value="21K" caption={a.goal} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card pad="0">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-soft)', ...strong }}>Últimos treinos · prescrito × executado</div>
          {[['Intervalado 10×800m', 'done', 'há 1 dia'], ['Longão 24km', 'done', 'há 3 dias'], ['Tempo run 8km', 'partial', 'há 4 dias'], ['Regenerativo 6km', 'missed', 'há 5 dias']].map(([t, s, w], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid var(--border-soft)' }}>
              <span style={{ flex: 1, font: 'var(--body-sm)', color: 'var(--text-body)' }}>{t}</span><span style={cap}>{w}</span><ComplianceTag status={s} size="sm" />
            </div>
          ))}
        </Card>
        <Card pad="20px" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span style={strong}>Anamnese & saúde</span>
          {[['Lesões', 'Tendinite no joelho D (2023)'], ['Restrições', 'Nenhuma atual'], ['FC repouso', '52 bpm'], ['PSE médio', '6 / 10']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, paddingBottom: 8, borderBottom: '1px solid var(--border-soft)' }}><span style={cap}>{k}</span><span style={{ font: 'var(--body-sm)', color: 'var(--text-body)', textAlign: 'right' }}>{v}</span></div>
          ))}
        </Card>
      </div>
    </div>
  );
}
function AthletesScreen2() {
  const [tab, setTab] = useState('all');
  const [open, setOpen] = useState(null);
  if (open) return <AthleteDetail a={open} onBack={() => setOpen(null)} />;
  const st = { online: ['success', 'Ativo'], paused: ['warning', 'Pausado'], risk: ['danger', 'Em risco'] };
  const filt = ATH.filter((a) => tab === 'all' || (tab === 'risk' && a.status === 'risk') || (tab === 'active' && a.status !== 'risk'));
  return (
    <div style={wrap}>
      <div style={head}>
        <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Todos', count: 1245 }, { id: 'active', label: 'Ativos', count: 1118 }, { id: 'risk', label: 'Em risco', count: 34 }]} />
        <Input placeholder="Buscar atleta" prefix={<Icon name="search" size={16} />} style={{ width: 240 }} />
      </div>
      <Card pad="0">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Atleta</th><th style={th}>Plano</th><th style={th}>Meta</th><th style={th}>Adesão</th><th style={th}>Pagamento</th><th style={th}>Status</th><th style={{ ...th, textAlign: 'right' }}></th></tr></thead>
          <tbody>
            {filt.map((a, i) => (
              <tr key={i} onClick={() => setOpen(a)} style={{ cursor: 'pointer' }}>
                <td style={td}><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Avatar name={a.n} size={34} status={a.status} /><span style={strong}>{a.n}</span></div></td>
                <td style={td}><Badge tone="neutral" variant="soft">{a.plan}</Badge></td>
                <td style={{ ...td, color: 'var(--text-muted)' }}>{a.goal}</td>
                <td style={td}><span style={{ font: '700 13px/1 var(--font-mono)', color: a.adh < 60 ? 'var(--red)' : a.adh < 80 ? 'var(--amber)' : 'var(--green)' }}>{a.adh}%</span></td>
                <td style={td}><Badge tone={a.pay === 'em dia' ? 'success' : a.pay === 'pendente' ? 'warning' : 'danger'} variant="soft" dot>{a.pay}</Badge></td>
                <td style={td}><Badge tone={st[a.status][0]} variant="soft" dot>{st[a.status][1]}</Badge></td>
                <td style={{ ...td, textAlign: 'right' }}><Icon name="chevron-right" size={16} color="var(--cinza-mineral)" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ============================ STRUCTURED TRAINING ============================ */
function TrainingPlanScreen() {
  const [tab, setTab] = useState('plano');
  const phases = [
    { name: 'Base', weeks: 6, color: 'var(--azul-oceano)', vol: 'Volume crescente · Z2', done: true },
    { name: 'Específico', weeks: 5, color: 'var(--amber)', vol: 'Limiar e tempo run', done: true },
    { name: 'Pico', weeks: 3, color: 'var(--terracota)', vol: 'VO₂max · ritmo de prova', current: true },
    { name: 'Polimento', weeks: 2, color: 'var(--cinza-mineral)', vol: 'Redução de carga' },
  ];
  const lib = [
    ['Intervalado VO₂max', '10×800m · rec 200m', 'activity', 'accent'], ['Longão progressivo', '28–32 km · final forte', 'route', 'ocean'],
    ['Tempo run', '3×10min @ limiar', 'gauge', 'accent'], ['Fartlek', '60min · 1–3min variados', 'shuffle', 'neutral'],
    ['Regenerativo', '40min Z1 · solto', 'heart-pulse', 'ocean'], ['Tiros curtos', '12×400m · velocidade', 'zap', 'accent'],
  ];
  const week = [['Seg', 'done'], ['Ter', 'done'], ['Qua', 'partial'], ['Qui', 'planned'], ['Sex', 'planned'], ['Sáb', 'planned'], ['Dom', 'planned']];
  return (
    <div style={wrap}>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'plano', label: 'Planejamento' }, { id: 'biblioteca', label: 'Biblioteca' }, { id: 'compliance', label: 'Prescrito × executado' }]} />
      {tab === 'plano' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={head}><div><div style={strong}>Maratona do Rio · macrociclo</div><div style={cap}>16 semanas · meta sub 3h30 · pico em 03 ago</div></div><Button variant="primary" size="sm" iconLeft={<Icon name="plus" size={15} />}>Novo mesociclo</Button></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {phases.map((p) => (
              <Card key={p.name} pad="18px" style={{ borderTop: `4px solid ${p.color}`, opacity: p.done ? 0.7 : 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ font: 'var(--h4)', textTransform: 'uppercase', color: 'var(--text-strong)' }}>{p.name}</span>
                  {p.current && <Badge tone="accent" variant="soft" dot>agora</Badge>}
                  {p.done && <Icon name="check-circle-2" size={16} color="var(--green)" />}
                </div>
                <div style={{ font: '700 13px/1 var(--font-mono)', color: 'var(--text-muted)', marginBottom: 6 }}>{p.weeks} semanas</div>
                <div style={cap}>{p.vol}</div>
              </Card>
            ))}
          </div>
          <Card pad="0">
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-soft)', ...strong }}>Microciclo desta semana · fase Pico</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0 }}>
              {week.map(([d, s], i) => (
                <div key={d} style={{ padding: '14px 12px', borderLeft: i ? '1px solid var(--border-soft)' : 'none', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                  <span style={{ font: '600 11px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>{d}</span>
                  <ComplianceTag status={s} showLabel={false} />
                  <span style={{ font: '10px/1.2 var(--font-body)', color: 'var(--text-muted)', textAlign: 'center' }}>{['10×800m', 'Tempo', 'Reg.', 'Tiros', 'Base', 'Longão', 'Folga'][i]}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
      {tab === 'biblioteca' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={head}><span style={strong}>Biblioteca de treinos · reutilizáveis</span><Button variant="primary" size="sm" iconLeft={<Icon name="plus" size={15} />}>Novo treino</Button></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {lib.map(([t, d, ic, tone], i) => (
              <Card key={i} pad="18px" interactive style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Badge tone={tone} variant="soft" style={{ width: 38, height: 38, padding: 0, borderRadius: 'var(--radius-8)', display: 'grid', placeItems: 'center' }}><Icon name={ic} size={19} /></Badge>
                  <Button variant="ghost" size="sm" style={{ padding: '0 8px' }}><Icon name="copy" size={15} /></Button>
                </div>
                <div><div style={strong}>{t}</div><div style={cap}>{d}</div></div>
                <Button variant="secondary" size="sm" style={{ alignSelf: 'flex-start' }}>Prescrever</Button>
              </Card>
            ))}
          </div>
        </div>
      )}
      {tab === 'compliance' && (
        <Card pad="0">
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-soft)', ...strong }}>Adesão da equipe · esta semana</div>
          {ATH.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderTop: '1px solid var(--border-soft)' }}>
              <Avatar name={a.n} size={32} /><span style={{ ...strong, flex: 1 }}>{a.n}</span>
              <div style={{ display: 'flex', gap: 5 }}>{['done', 'done', 'partial', 'planned', 'planned', 'planned', 'planned'].map((s, j) => <ComplianceTag key={j} status={j < 3 ? s : 'planned'} showLabel={false} />)}</div>
              <span style={{ font: '700 13px/1 var(--font-mono)', color: a.adh < 60 ? 'var(--red)' : 'var(--green)', width: 44, textAlign: 'right' }}>{a.adh}%</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

Object.assign(window, { RTK: { ...(window.RTK || {}), CommunityScreen, SettingsScreen, AgendaScreen, AthletesScreen2, TrainingPlanScreen } });
})();
