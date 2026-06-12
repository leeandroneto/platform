/* Admin screens — part 2: Events moderation, Media, Billing, Quality. window.RTADM. */
;(function () {
const { Card, StatCard, Badge, Avatar, Button, Tabs, Input, Switch, Icon } = window.RT;
const { useState } = React;

const wrap = { padding: 32, display: 'flex', flexDirection: 'column', gap: 18 };
const rowHead = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' };
const th = { font: '600 11px/1.2 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', textAlign: 'left', padding: '16px 16px 10px', whiteSpace: 'nowrap' };
const td = { padding: '14px 16px', borderTop: '1px solid var(--border-soft)', font: 'var(--body-sm)', color: 'var(--text-body)', verticalAlign: 'middle' };
const mono = { font: '700 13px/1 var(--font-mono)', color: 'var(--text-strong)', fontVariantNumeric: 'tabular-nums' };
function SectionTitle({ children, n }) {
  return (<div style={rowHead}><h2 style={{ font: 'var(--h2)', textTransform: 'uppercase', letterSpacing: 'var(--track-display)', color: 'var(--text-strong)', margin: 0 }}>{children}</h2>{n && <span style={{ font: 'var(--mono-sm)', color: 'var(--text-muted)' }}>{n}</span>}</div>);
}

/* ============================ EVENTS MODERATION ============================ */
const SRC = {
  gerenciado: { tone: 'success', label: 'Gerenciado', icon: 'badge-check', note: 'organizador verificado' },
  importado: { tone: 'ocean', label: 'Curado / importado', icon: 'download', note: 'equipe retake' },
  sugerido: { tone: 'warning', label: 'Sugerido', icon: 'user', note: 'comunidade' },
};
function FlagLine({ ok, warn, children }) {
  const c = warn ? 'var(--amber)' : ok ? 'var(--green)' : 'var(--red)';
  return <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: 'var(--caption)', color: c }}><Icon name={warn ? 'alert-triangle' : ok ? 'check-circle-2' : 'x-circle'} size={14} color={c} />{children}</div>;
}
function EventModCard({ e }) {
  const [done, setDone] = useState(null);
  const s = SRC[e.src];
  return (
    <Card pad="0" style={{ opacity: done ? 0.55 : 1, transition: 'opacity var(--dur) var(--ease-out)', borderColor: e.dupe ? 'var(--amber)' : 'var(--border-soft)' }}>
      <div style={{ display: 'flex', gap: 16, padding: 20, alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 'var(--radius-12)', background: 'var(--grafite-ink)', color: 'var(--creme)', flex: 'none' }}>
          <span style={{ font: '700 24px/1 var(--font-display)' }}>{e.d}</span>
          <span style={{ font: '700 9px/1 var(--font-mono)', color: 'var(--terracota-300)', letterSpacing: '0.1em', marginTop: 3 }}>{e.m}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <span style={{ font: '600 16px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{e.name}</span>
            <Badge tone={s.tone} variant="soft"><Icon name={s.icon} size={11} style={{ marginRight: 3 }} />{s.label}</Badge>
            <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{e.type} · {e.city}</span>
          </div>
          <div style={{ font: 'var(--caption)', color: 'var(--text-muted)', marginBottom: 12 }}>Enviado por <b style={{ color: 'var(--text-body)' }}>{e.by}</b> · {s.note} · {e.when}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px 18px', maxWidth: 560 }}>
            <FlagLine ok={e.domainOk} warn={!e.domainOk}>{e.domainOk ? 'Link de inscrição em domínio confiável' : 'Link fora da whitelist — revisar'}</FlagLine>
            <FlagLine ok={e.cnpj}>{e.cnpj ? 'CNPJ do organizador verificado' : 'Sem CNPJ — listar sem botão de inscrição'}</FlagLine>
            <FlagLine ok={!e.dupe} warn={e.dupe}>{e.dupe ? 'Possível duplicata: "' + e.dupe + '"' : 'Sem duplicata detectada'}</FlagLine>
            <FlagLine ok={e.reports === 0} warn={e.reports > 0}>{e.reports === 0 ? 'Nenhuma denúncia' : e.reports + ' denúncia(s) da comunidade'}</FlagLine>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 'none', minWidth: 150 }}>
          {done ? (
            <Badge tone={done === 'ok' ? 'success' : done === 'merge' ? 'ocean' : 'danger'} variant="soft" dot style={{ alignSelf: 'flex-end' }}>{done === 'ok' ? 'Publicado' : done === 'merge' ? 'Fundido' : 'Rejeitado'}</Badge>
          ) : (
            <>
              <Button variant="primary" size="sm" onClick={() => setDone('ok')} iconLeft={<Icon name="check" size={15} />}>Publicar</Button>
              {e.dupe && <Button variant="secondary" size="sm" onClick={() => setDone('merge')} iconLeft={<Icon name="git-merge" size={14} />}>Fundir</Button>}
              {e.src !== 'gerenciado' && <Button variant="ghost" size="sm" iconLeft={<Icon name="shield-check" size={14} />}>Verificar org.</Button>}
              <Button variant="text" size="sm" onClick={() => setDone('no')}>Rejeitar</Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
function EventsModScreen() {
  const [tab, setTab] = useState('queue');
  const queue = [
    { d: '12', m: 'JUL', name: 'Night Run Salvador', type: 'Prova de rua', city: 'Salvador · BA', src: 'sugerido', by: 'corredor anônimo', when: 'há 2 h', domainOk: true, cnpj: false, dupe: null, reports: 0 },
    { d: '20', m: 'JUL', name: 'Corrida da Orla 10K', type: 'Prova de rua', city: 'Rio · RJ', src: 'sugerido', by: 'Marina C.', when: 'há 5 h', domainOk: false, cnpj: false, dupe: 'Corrida da Orla — Leme ao Pontal', reports: 0 },
    { d: '03', m: 'AGO', name: 'Maratona do Sol', type: 'Prova de rua', city: 'Natal · RN', src: 'importado', by: 'equipe retake', when: 'ontem', domainOk: true, cnpj: true, dupe: null, reports: 0 },
    { d: '15', m: 'AGO', name: 'Trail da Pedra Grande', type: 'Trail', city: 'Atibaia · SP', src: 'sugerido', by: 'corredor anônimo', when: 'há 2 dias', domainOk: true, cnpj: false, dupe: null, reports: 2 },
  ];
  const claims = [
    { d: '14', m: 'JUN', name: 'Circuito Retake — Ibirapuera', type: 'Prova de rua', city: 'São Paulo · SP', src: 'gerenciado', by: 'Rio Run Series', when: 'há 1 h', domainOk: true, cnpj: true, dupe: null, reports: 0 },
  ];
  const list = tab === 'queue' ? queue : tab === 'claims' ? claims : [];
  return (
    <div style={wrap}>
      <p style={{ font: 'var(--body-sm)', color: 'var(--text-muted)', margin: 0, maxWidth: 720 }}>A retake nunca processa o pagamento — a inscrição é sempre no site oficial do organizador. Aqui você decide o que ganha selo de confiança.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Na fila" value="12" caption="9 sugeridos · 3 import." />
        <StatCard label="Reivindicações" value="3" caption="organizadores reivindicando" accent />
        <StatCard label="Publicados (mês)" value="148" delta={22} caption="vs maio" />
        <StatCard label="Denúncias abertas" value="2" caption="auto-despublicado em 3" />
      </div>
      <Tabs value={tab} onChange={setTab} items={[{ id: 'queue', label: 'Fila de revisão', count: 12 }, { id: 'claims', label: 'Reivindicações', count: 3 }, { id: 'rules', label: 'Regras & whitelist' }]} />
      {tab === 'rules' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card pad="22px">
            <div style={{ font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14 }}>Whitelist de inscrição</div>
            {['ticketsports.com.br', 'brasilcorridas.com.br', 'centraldacorrida.com.br', 'minhasinscricoes.com.br', 'doity.com.br'].map((d) => (
              <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--border-soft)' }}>
                <span style={{ font: 'var(--mono-sm)', color: 'var(--text-body)' }}>{d}</span>
                <Badge tone="success" variant="soft" dot>confiável</Badge>
              </div>
            ))}
            <Button variant="secondary" size="sm" iconLeft={<Icon name="plus" size={14} />} style={{ marginTop: 14 }}>Adicionar domínio</Button>
          </Card>
          <Card pad="22px">
            <div style={{ font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 14 }}>Regras automáticas</div>
            {[['Auto-publicar eventos de organizador verificado', true], ['Enfileirar sugestões da comunidade', true], ['Despublicar com 3+ denúncias', true], ['Esconder preço de evento não gerenciado', true], ['Expirar evento após a data', true], ['Marcar "desatualizado" sem edição em 4 meses', false]].map(([l, on]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '11px 0', borderTop: '1px solid var(--border-soft)' }}>
                <span style={{ font: 'var(--body-sm)', color: 'var(--text-body)' }}>{l}</span>
                <Switch checked={on} size="sm" onChange={() => {}} />
              </div>
            ))}
          </Card>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map((e, i) => <EventModCard key={i} e={e} />)}
        </div>
      )}
    </div>
  );
}

/* ============================ MEDIA / FAIXA DE MARCAS ============================ */
function MediaScreen() {
  const slots = [
    { pos: 1, brand: 'Pacefuel Nutrition', kind: 'Oficial · nutrição', tone: 'accent', fixed: true, imp: '482k', clk: '6,1k' },
    { pos: 2, brand: 'SulAmérica Saúde', kind: 'Estadual · SP+RJ', tone: 'success', fixed: true, imp: '441k', clk: '2,3k' },
    { pos: 3, brand: 'Stride Wear', kind: 'Estadual · rotativo', tone: 'neutral', fixed: false, imp: '388k', clk: '5,2k' },
    { pos: 4, brand: 'GPSRun Tech', kind: 'Nacional · rotativo', tone: 'neutral', fixed: false, imp: '372k', clk: '4,8k' },
    { pos: 5, brand: 'Z2 Suplementos', kind: 'Cupom · rotativo', tone: 'neutral', fixed: false, imp: '301k', clk: '3,9k' },
  ];
  return (
    <div style={wrap}>
      <p style={{ font: 'var(--body-sm)', color: 'var(--text-muted)', margin: 0, maxWidth: 720 }}>O que aparece na faixa, em quais sites, e quanto cada posição rende.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Impressões/mês" value="1,9" unit="mi" delta={14} caption="rede inteira" accent />
        <StatCard label="Sites exibindo" value="74" caption="faixa ativa" />
        <StatCard label="CTR médio" value="1,3" unit="%" delta={4} caption="cliques/impressões" />
        <StatCard label="Cotas vendidas" value="5" unit="/ 6" caption="1 vaga rotativa livre" />
      </div>
      <Card pad="0">
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Posições da faixa</span>
          <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>arraste para reordenar · fixos no topo</span>
        </div>
        {slots.map((s, i) => (
          <div key={s.pos} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderTop: i ? '1px solid var(--border-soft)' : 'none' }}>
            <Icon name="grip-vertical" size={16} color="var(--cinza-mineral)" />
            <span style={{ font: '700 16px/1 var(--font-mono)', color: 'var(--text-muted)', width: 22 }}>{s.pos}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ font: '600 14px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{s.brand}</span>
                {s.fixed && <Badge tone="accent" variant="outline"><Icon name="pin" size={10} style={{ marginRight: 3 }} />fixo</Badge>}
              </div>
              <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{s.kind}</span>
            </div>
            <div style={{ textAlign: 'right' }}><div style={mono}>{s.imp}</div><div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>impressões</div></div>
            <div style={{ textAlign: 'right', width: 70 }}><div style={mono}>{s.clk}</div><div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>cliques</div></div>
            <Button variant="ghost" size="sm" style={{ padding: '0 8px' }}><Icon name="more-horizontal" size={15} /></Button>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ============================ BILLING ============================ */
function BillingScreen() {
  const [tab, setTab] = useState('all');
  const inv = [
    { who: 'Acelera Run Club', kind: 'Tenant · Membro', amt: '59', due: '05 jun', status: 'paid' },
    { who: 'Pacefuel Nutrition', kind: 'Patrocinador Oficial', amt: '1.200', due: '05 jun', status: 'paid' },
    { who: 'SulAmérica Saúde', kind: 'Estadual · 2 UF', amt: '200', due: '08 jun', status: 'open' },
    { who: 'Stride Wear', kind: 'Patrocinador Estadual', amt: '100', due: '08 jun', status: 'paid' },
    { who: 'Confecção Pace', kind: 'Vitrine B2B', amt: '99', due: '01 jun', status: 'overdue' },
    { who: 'Sul Endurance', kind: 'Tenant · Apoiador', amt: '29', due: '28 mai', status: 'overdue' },
    { who: 'TrackLab', kind: 'Vitrine B2B', amt: '99', due: '01 jun', status: 'overdue' },
  ];
  const stTone = { paid: ['success', 'Pago'], open: ['warning', 'Em aberto'], overdue: ['danger', 'Vencido'] };
  const filt = inv.filter((r) => tab === 'all' || r.status === tab);
  return (
    <div style={wrap}>
      <p style={{ font: 'var(--body-sm)', color: 'var(--text-muted)', margin: 0, maxWidth: 720 }}>Cotas de patrocínio, planos dos tenants e comissões — tudo o que a rede fatura.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <StatCard label="Faturado (mês)" value="9,4" unit="mil R$" delta={11} accent />
        <StatCard label="Recebido" value="8,1" unit="mil R$" caption="86%" />
        <StatCard label="Em aberto" value="200" unit="R$" caption="1 fatura" />
        <StatCard label="Vencido" value="227" unit="R$" caption="3 faturas" />
      </div>
      <div style={rowHead}>
        <Tabs value={tab} onChange={setTab} items={[{ id: 'all', label: 'Tudo', count: inv.length }, { id: 'open', label: 'Em aberto' }, { id: 'overdue', label: 'Vencidas', count: 3 }, { id: 'paid', label: 'Pagas' }]} />
        <Button variant="text" size="sm">Exportar CSV</Button>
      </div>
      <Card pad="0">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Cliente</th><th style={th}>Origem</th><th style={th}>Valor</th><th style={th}>Vencimento</th><th style={th}>Status</th><th style={{ ...th, textAlign: 'right' }}>Ações</th></tr></thead>
          <tbody>
            {filt.map((r, i) => (
              <tr key={i}>
                <td style={{ ...td, font: '600 14px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{r.who}</td>
                <td style={td}>{r.kind}</td>
                <td style={{ ...td, ...mono }}>R$ {r.amt}</td>
                <td style={{ ...td, color: r.status === 'overdue' ? 'var(--red)' : 'var(--text-muted)' }}>{r.due}</td>
                <td style={td}><Badge tone={stTone[r.status][0]} variant="soft" dot>{stTone[r.status][1]}</Badge></td>
                <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>{r.status === 'overdue' ? <Button variant="secondary" size="sm">Cobrar</Button> : <Button variant="ghost" size="sm" style={{ padding: '0 8px' }}><Icon name="receipt" size={15} /></Button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

/* ============================ QUALITY & ABUSE ============================ */
function QualityScreen() {
  const idle = [
    { site: 'coralrun.retake.run', tenant: 'Coral Run', days: 74, leads: 0, action: 'arquivar' },
    { site: 'curitibarun.retake.run', tenant: 'Curitiba Run', days: 62, leads: 1, action: 'avisar' },
    { site: 'litoralpace.retake.run', tenant: 'Litoral Pace', days: 51, leads: 0, action: 'avisar' },
  ];
  const verif = [
    { who: 'Equipe Nova SP', type: 'Novo site Essencial', checks: [[true, 'WhatsApp'], [false, 'Instagram'], [false, 'CREF']], when: 'hoje' },
    { who: 'RunZone BH', type: 'Novo site Essencial', checks: [[true, 'WhatsApp'], [true, 'Instagram'], [false, 'CREF']], when: 'ontem' },
  ];
  const reports = [
    { target: 'Trail da Pedra Grande', type: 'Evento', reason: 'Link suspeito de inscrição', n: 2 },
    { target: 'cupom FAKE50', type: 'Cupom', reason: 'Desconto não honrado na loja', n: 1 },
  ];
  return (
    <div style={wrap}>
      <p style={{ font: 'var(--body-sm)', color: 'var(--text-muted)', margin: 0, maxWidth: 720 }}>A qualidade da rede é o produto vendido às marcas — sites ociosos, denúncias e verificação de novos.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        <Card pad="0">
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="moon" size={16} color="var(--amber)" /><span style={{ font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Sites ociosos</span>
          </div>
          {idle.map((s, i) => (
            <div key={s.site} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderTop: i ? '1px solid var(--border-soft)' : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: 'var(--mono-sm)', color: 'var(--text-strong)' }}>{s.site}</div>
                <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{s.tenant} · {s.leads} leads · sem acesso há {s.days} dias</div>
              </div>
              <Button variant={s.action === 'arquivar' ? 'secondary' : 'ghost'} size="sm">{s.action === 'arquivar' ? 'Arquivar' : 'Avisar'}</Button>
            </div>
          ))}
        </Card>
        <Card pad="0">
          <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="flag" size={16} color="var(--red)" /><span style={{ font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Denúncias da comunidade</span>
          </div>
          {reports.map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderTop: i ? '1px solid var(--border-soft)' : 'none' }}>
              <Badge tone="danger" variant="soft" style={{ width: 30, height: 30, padding: 0, borderRadius: 999, display: 'grid', placeItems: 'center' }}>{r.n}</Badge>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 13.5px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{r.target} <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>· {r.type}</span></div>
                <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{r.reason}</div>
              </div>
              <Button variant="ghost" size="sm">Investigar</Button>
            </div>
          ))}
        </Card>
      </div>
      <Card pad="0">
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border-soft)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="user-check" size={16} color="var(--azul-700)" /><span style={{ font: '600 13px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Verificação anti-abuso do grátis</span>
        </div>
        {verif.map((v, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 22px', borderTop: i ? '1px solid var(--border-soft)' : 'none' }}>
            <Avatar name={v.who} size={34} />
            <div style={{ flex: 1 }}><div style={{ font: '600 14px/1.2 var(--font-body)', color: 'var(--text-strong)' }}>{v.who}</div><div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{v.type} · {v.when}</div></div>
            <div style={{ display: 'flex', gap: 14 }}>
              {v.checks.map(([ok, l]) => <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--caption)', color: ok ? 'var(--green)' : 'var(--text-muted)' }}><Icon name={ok ? 'check-circle-2' : 'circle'} size={14} color={ok ? 'var(--green)' : 'var(--cinza-mineral)'} />{l}</div>)}
            </div>
            <Button variant="primary" size="sm">Liberar</Button>
          </div>
        ))}
      </Card>
    </div>
  );
}

Object.assign(window, { RTADM: { ...(window.RTADM || {}), EventsModScreen, MediaScreen, BillingScreen, QualityScreen } });
})();
