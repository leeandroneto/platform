/* Dashboard — tela "Comissões": o que a loja do clube paga à assessoria (split 3 vias).
   Attaches to window.RTK. */
;(function () {
const { Card, StatCard, Badge, Button, Icon } = window.RT;

function SplitBar({ parts }) {
  /* parts: [{label, value, color}] */
  const total = parts.reduce((s, p) => s + p.value, 0);
  return (
    <div>
      <div style={{ display: 'flex', height: 14, borderRadius: 999, overflow: 'hidden', marginBottom: 10 }}>
        {parts.map((p, i) => <div key={i} style={{ width: (p.value / total * 100) + '%', background: p.color }} />)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {parts.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, font: 'var(--body-sm)', fontSize: 13 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: p.color, flex: 'none' }} />
            <span style={{ flex: 1, color: 'var(--text-body)' }}>{p.label}</span>
            <span style={{ font: '700 13px/1 var(--font-mono)', color: 'var(--text-strong)' }}>R$ {p.value.toFixed(2).replace('.', ',')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComissoesScreen() {
  const sales = [
    { when: 'Hoje · 09:41', item: 'Gel de carboidrato · 6un', sup: 'Pacefuel', buyer: 'Marina C.', value: 'R$ 72,00', com: 'R$ 7,20', paid: true },
    { when: 'Hoje · 08:15', item: 'Fone open-ear Audia', sup: 'Audia Sport', buyer: 'Diego M.', value: 'R$ 389,00', com: 'R$ 38,90', paid: true },
    { when: 'Ontem', item: 'Kit suplementação 30d', sup: 'Z2 Suplementos', buyer: 'Camila S.', value: 'R$ 420,00', com: 'R$ 42,00', paid: true },
    { when: 'Ontem', item: 'Relógio GPS · GPSRun', sup: 'GPSRun Tech', buyer: 'Rafael T.', value: 'R$ 2.890,00', com: 'R$ 144,50', paid: false },
    { when: '07 jun', item: 'Meias compressão · 3 pares', sup: 'Terra Firme', buyer: 'João R.', value: 'R$ 96,00', com: 'R$ 9,60', paid: true },
  ];
  const months = [['Jan', 620], ['Fev', 780], ['Mar', 940], ['Abr', 1120], ['Mai', 1490], ['Jun', 1842]];
  const max = Math.max(...months.map((m) => m[1]));

  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* explicação do modelo */}
      <Card tone="dark" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ width: 46, height: 46, borderRadius: 'var(--radius-12)', background: 'var(--terracota)', display: 'grid', placeItems: 'center', flex: 'none' }}>
          <Icon name="percent" size={22} color="var(--creme)" />
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ font: '600 15px/1.3 var(--font-body)', color: 'var(--text-on-dark)' }}>Sua loja te paga.</div>
          <span style={{ font: 'var(--body-sm)', fontSize: 13, color: 'var(--text-on-dark-muted)' }}>Cada venda originada no seu site divide automaticamente no pagamento: fornecedor entrega, a retake opera, e <strong style={{ color: 'var(--terracota-300)' }}>você fica com a comissão</strong> — sem tocar em estoque.</span>
        </div>
        <Badge tone="ocean" variant="soft">Split automático · gateway</Badge>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        <StatCard label="Comissões em junho" value="R$ 1.842" delta={24} accent caption="vs maio" />
        <StatCard label="Vendas originadas" value="137" delta={18} caption="pela sua loja" />
        <StatCard label="Taxa média" value="10%" caption="varia por categoria" />
        <StatCard label="Próximo repasse" value="Sex" caption="13 jun · automático" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.7fr) minmax(260px, 1fr)', gap: 18, alignItems: 'start' }}>
        {/* vendas com comissão */}
        <Card pad="0">
          <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ font: 'var(--h4)', margin: 0 }}>Vendas da sua loja</h4>
            <Button variant="text" size="sm">Exportar CSV</Button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.9fr 0.9fr 0.7fr', gap: '0 16px', padding: '10px 22px', borderBottom: '1px solid var(--border-soft)', font: '600 10.5px/1 var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            <span>Produto</span><span>Fornecedor</span><span style={{ textAlign: 'right' }}>Venda</span><span style={{ textAlign: 'right' }}>Sua comissão</span><span style={{ textAlign: 'right' }}>Status</span>
          </div>
          {sales.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 0.9fr 0.9fr 0.7fr', gap: '0 16px', alignItems: 'center', padding: '13px 22px', borderBottom: i < sales.length - 1 ? '1px solid var(--border-soft)' : 'none' }}>
              <div>
                <div style={{ font: '600 14px/1.3 var(--font-body)', color: 'var(--text-strong)' }}>{s.item}</div>
                <div style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>{s.when} · {s.buyer}</div>
              </div>
              <span style={{ font: 'var(--body-sm)', fontSize: 13, color: 'var(--text-body)' }}>{s.sup}</span>
              <span style={{ textAlign: 'right', font: 'var(--mono-sm)', color: 'var(--text-body)' }}>{s.value}</span>
              <span style={{ textAlign: 'right', font: '700 14px/1 var(--font-mono)', color: 'var(--terracota-600)' }}>{s.com}</span>
              <span style={{ textAlign: 'right' }}><Badge tone={s.paid ? 'success' : 'warning'} dot>{s.paid ? 'Pago' : 'A liberar'}</Badge></span>
            </div>
          ))}
        </Card>

        {/* lateral: gráfico + split exemplo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card>
            <h4 style={{ font: 'var(--h4)', margin: '0 0 14px' }}>Comissões por mês</h4>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
              {months.map(([m, v], i) => (
                <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: '100%', height: (v / max) * 92, borderRadius: 'var(--radius-4)', background: i === months.length - 1 ? 'var(--terracota)' : 'var(--azul-300)' }} />
                  <span style={{ font: 'var(--mono-sm)', fontSize: 10, color: 'var(--text-muted)' }}>{m}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h4 style={{ font: 'var(--h4)', margin: '0 0 4px' }}>Como divide</h4>
            <span style={{ font: 'var(--caption)', color: 'var(--text-muted)' }}>Exemplo · kit suplementação R$ 420</span>
            <div style={{ marginTop: 14 }}>
              <SplitBar parts={[
                { label: 'Fornecedor (Z2)', value: 336, color: 'var(--grafite)' },
                { label: 'Você (comissão 10%)', value: 42, color: 'var(--terracota)' },
                { label: 'retake (taxa 10%)', value: 42, color: 'var(--azul-oceano)' },
              ]} />
            </div>
            <p style={{ font: 'var(--caption)', color: 'var(--text-muted)', margin: '14px 0 0' }}>A divisão é definida no pagamento, mas o dinheiro fica retido no gateway e só libera após a entrega confirmada.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { RTK: { ...(window.RTK || {}), ComissoesScreen } });
})();
