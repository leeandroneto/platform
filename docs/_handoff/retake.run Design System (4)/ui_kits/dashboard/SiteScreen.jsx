/* Dashboard — tela "Meu site": cadastro que alimenta o site público + vibe coding.
   Attaches to window.RTK. */
;(function () {
const { Card, Badge, Avatar, Button, Input, Switch, Icon } = window.RT;
const { useState } = React;

/* linha de cadastro editável (mock) */
function FieldRow({ label, value, hint }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border-soft)' }}>
      <span style={{ width: 120, flex: 'none', font: '600 11px/1.3 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>{label}</span>
      <span style={{ flex: 1, font: 'var(--body-sm)', color: 'var(--text-strong)' }}>{value}</span>
      {hint && <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{hint}</span>}
      <Icon name="pencil" size={14} color="var(--cinza-mineral)" />
    </div>
  );
}

function SiteScreen() {
  const [aiStep, setAiStep] = useState(0); // 0 = proposta, 1 = aplicado
  const coaches = [
    { name: 'Léo Martins', role: 'Head coach · CREF 12345', on: true },
    { name: 'Carol Dias', role: 'Treinadora · Iniciantes', on: true },
    { name: 'Pedro Souza', role: 'Treinador · Trail', on: false },
  ];
  const offers = [
    { name: 'Presencial', price: 'R$ 249/mês', on: true, hot: true },
    { name: 'Híbrido', price: 'R$ 199/mês', on: true },
    { name: 'Online', price: 'R$ 149/mês', on: true },
    { name: 'Recovery avulso', price: 'R$ 60/sessão', on: false },
  ];
  const [coachState, setCoachState] = useState(coaches.map((c) => c.on));
  const [offerState, setOfferState] = useState(offers.map((o) => o.on));

  return (
    <div style={{ padding: 32, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(280px, 340px)', gap: 20, alignItems: 'start' }}>
      {/* ============ coluna esquerda: cadastro ============ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* status do site */}
        <Card style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-12)', background: 'var(--green-100)', display: 'grid', placeItems: 'center', flex: 'none' }}>
            <Icon name="globe" size={22} color="var(--green)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ font: '600 15px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>acelera.retake.run</span>
              <Badge tone="success" dot>No ar</Badge>
              <Badge tone="neutral" variant="outline">Plano Essencial · grátis</Badge>
            </div>
            <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>O site projeta este cadastro — toda edição publica em segundos.</span>
          </div>
          <Button variant="secondary" size="sm" iconLeft={<Icon name="external-link" size={14} />}>Ver site</Button>
        </Card>

        {/* identidade */}
        <Card pad="0">
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ font: 'var(--h4)', margin: 0 }}>Identidade</h4>
            <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>tenant_themes · v12</span>
          </div>
          <div style={{ padding: '4px 22px 8px' }}>
            <FieldRow label="Logo" value="acelera-logo.svg" hint="enviado 02 jun" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border-soft)' }}>
              <span style={{ width: 120, flex: 'none', font: '600 11px/1.3 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>Paleta</span>
              <span style={{ display: 'flex', gap: 6 }}>
                {['#D96C3A', '#1D1D1B', '#F6E2D6'].map((c, i) => <span key={i} style={{ width: 22, height: 22, borderRadius: 999, background: c, border: '1px solid var(--border-strong)' }} />)}
              </span>
              <span style={{ flex: 1, font: 'var(--body-sm)', color: 'var(--text-strong)' }}>Brasa</span>
              <Icon name="pencil" size={14} color="var(--cinza-mineral)" />
            </div>
            <FieldRow label="Headline" value="Corra com quem leva você mais longe." hint="gerada por IA" />
            <div style={{ padding: '11px 0' }}>
              <FieldRow label="Cidade" value="Rio de Janeiro · RJ" />
            </div>
          </div>
        </Card>

        {/* treinadores */}
        <Card pad="0">
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ font: 'var(--h4)', margin: 0 }}>Treinadores no site</h4>
            <Button variant="text" size="sm">Adicionar</Button>
          </div>
          {coaches.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderBottom: i < coaches.length - 1 ? '1px solid var(--border-soft)' : 'none', opacity: coachState[i] ? 1 : 0.55 }}>
              <Avatar name={c.name} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{c.name}</div>
                <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{c.role}</div>
              </div>
              <Switch size="sm" checked={coachState[i]} onChange={(v) => setCoachState(coachState.map((s, j) => (j === i ? v : s)))} />
            </div>
          ))}
        </Card>

        {/* oferta */}
        <Card pad="0">
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ font: 'var(--h4)', margin: 0 }}>Planos &amp; serviços no site</h4>
            <Button variant="text" size="sm">Adicionar</Button>
          </div>
          {offers.map((o, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', borderBottom: i < offers.length - 1 ? '1px solid var(--border-soft)' : 'none', opacity: offerState[i] ? 1 : 0.55 }}>
              <span style={{ flex: 1, font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{o.name}{o.hot && <Badge tone="accent" variant="soft" style={{ marginLeft: 8 }}>Destaque</Badge>}</span>
              <span style={{ font: 'var(--metric)', fontSize: 15, color: 'var(--text-strong)' }}>{o.price}</span>
              <Switch size="sm" checked={offerState[i]} onChange={(v) => setOfferState(offerState.map((s, j) => (j === i ? v : s)))} />
            </div>
          ))}
          <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 9, background: 'var(--surface-sunken)', borderRadius: '0 0 var(--radius-16) var(--radius-16)' }}>
            <Icon name="lock" size={14} color="var(--cinza-mineral)" />
            <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>Checkout e produtos próprios são do plano Personalizado — no Essencial o site só capta.</span>
            <Button variant="text" size="sm" style={{ marginLeft: 'auto' }}>Fazer upgrade →</Button>
          </div>
        </Card>
      </div>

      {/* ============ coluna direita: vibe coding ============ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card tone="dark" pad="0" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid var(--border-on-dark)', display: 'flex', alignItems: 'center', gap: 9 }}>
            <Icon name="sparkles" size={17} color="var(--terracota)" />
            <h4 style={{ font: 'var(--h4)', margin: 0, color: 'var(--text-on-dark)' }}>Editar com IA</h4>
            <Badge tone="ocean" variant="soft" style={{ marginLeft: 'auto' }}>12 créditos</Badge>
          </div>

          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* mensagem do tenant */}
            <div style={{ alignSelf: 'flex-end', maxWidth: '88%', background: 'var(--terracota)', color: 'var(--creme)', borderRadius: '14px 14px 4px 14px', padding: '10px 13px', font: 'var(--body-sm)', fontSize: 13 }}>
              Reescreve a seção "sobre" com foco em quem está começando do zero
            </div>

            {/* proposta da IA (approval gate) */}
            <div style={{ alignSelf: 'flex-start', maxWidth: '94%', background: 'var(--grafite-ink)', border: '1px solid var(--border-on-dark)', borderRadius: '14px 14px 14px 4px', padding: '12px 14px' }}>
              <div style={{ font: 'var(--caption)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--terracota-300)', marginBottom: 7 }}>Proposta · textos › sobre</div>
              <p style={{ font: 'var(--body-sm)', fontSize: 13, color: 'var(--text-on-dark)', margin: '0 0 10px' }}>
                "Nunca correu? Perfeito. A Acelera nasceu pra te levar do sofá ao seu primeiro 5k — no seu ritmo, com treino estruturado e um grupo que celebra cada quilômetro."
              </p>
              {aiStep === 0 ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="primary" size="sm" onClick={() => setAiStep(1)}>Aplicar no site</Button>
                  <Button variant="ghost" size="sm" style={{ color: 'var(--text-on-dark)' }}>Refazer</Button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, font: '600 12px/1.3 var(--font-body)', color: 'var(--green)' }}>
                  <Icon name="circle-check" size={15} color="var(--green)" />Aplicado · site republicado em 3s
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 'auto', padding: 14, borderTop: '1px solid var(--border-on-dark)', display: 'flex', gap: 9 }}>
            <input placeholder="Pedir uma mudança no site…" style={{ flex: 1, minWidth: 0, height: 40, padding: '0 13px', borderRadius: 'var(--radius-8)', border: '1px solid var(--border-on-dark)', background: 'var(--grafite-ink)', color: 'var(--creme)', font: 'var(--body-sm)', outline: 'none' }} />
            <Button variant="primary" size="sm" style={{ height: 40 }}><Icon name="arrow-up" size={16} /></Button>
          </div>
        </Card>

        {/* sugestões de copy */}
        <Card>
          <h4 style={{ font: 'var(--h4)', margin: '0 0 12px' }}>Gerar com IA</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['wand-sparkles', 'Headline nova para o herói'], ['user', 'Bio do treinador Pedro Souza'], ['list', 'Descrição dos grupos de treino']].map((s, i) => (
              <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 'var(--radius-8)', border: '1px solid var(--border-soft)', background: 'var(--creme-50)', cursor: 'pointer', font: 'var(--body-sm)', fontSize: 13, color: 'var(--text-body)', textAlign: 'left' }}>
                <Icon name={s[0]} size={15} color="var(--terracota)" />{s[1]}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { RTK: { ...(window.RTK || {}), SiteScreen } });
})();
