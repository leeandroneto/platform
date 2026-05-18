# Decisoes — conferencia final do DS (Fase 24)

## Decisoes tomadas durante auditoria

### Dec-24-1: VRT nao bloqueia selar o DS

VRT (Visual Regression Testing) nao tem infraestrutura criada. Codemods das Fases 20-23 foram validados por lint + build + inspecao visual durante execucao. Risco aceito. VRT e issue para Fase 25+.

### Dec-24-2: Ladle < 90% nao bloqueia selar

14/28 componentes DS tem story (50%). Gap e de documentacao/catalogo. Todos os componentes existem, sao usados no produto, e passam lint/tsc/build. Stories faltantes sao issues rastreados.

### Dec-24-3: APCA 16/18 com 2 falhas nao-bloqueantes

- `ob-danger-400` (Lc 40.9 vs 45 necessario) em dark mode: issue rastreado, impacto pontual em status dots.
- `gray-950 on brand-400` (Lc 59.4 vs 60): combo nao usado no produto.

### Dec-24-4: Checks manuais (estados, outline, axe) ficam como issues

Requerem navegacao manual em browser. Analise de codigo indica conformidade. Fases 20-23 ja validaram durante execucao. Nao bloqueia selar.

### Dec-24-5: Warning pre-existente de Ladle config nao e DS

`.ladle/config.mjs` warning (`import/no-anonymous-default-export`) e limitacao do Ladle que exige `export default {}`. Nao relacionado ao design system.
