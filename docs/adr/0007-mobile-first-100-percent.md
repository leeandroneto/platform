# 0007. Mobile-first 100% incluindo painel profissional

Date: 2026-05-17
Status: accepted

## Context

Master plan dizia "mobile-first PWA aluno, painel prof preferencialmente desktop". Fundador exige 100% mobile incluindo painel profissional (90% dos profs operam só de celular — observação direta no mercado fitness BR). Fonte: `_CONFLITOS.md #7` + pesquisa 15 (editor mobile-first).

## Decision

Tudo viável em mobile 375px touch (iPhone 14 portrait padrão). Aceitar até 3 features como "ok mobile, melhor desktop" (progressive enhancement) sem bloquear MVP.

Detalhes execução (pesquisa 15):
- Toggle Edit/Preview canto superior direito (longe do polegar)
- vaul `snapPoints={[0.5, 0.92]}` + `repositionInputs` + `modal` + `shouldScaleBackground={false}`
- dnd-kit `TouchSensor {delay:200, tolerance:5}` + drag handle 44×44 + `-webkit-touch-callout: none`
- NumberStepper custom long-press repeat (~1KB)
- react-easy-crop (12KB) pra recorte imagem
- `font-size: 16px` em TODO input (evita auto-zoom iOS)
- Proibido `whileHover` em touch (Motion #1179) — só `whileTap` + `whileFocus`
- Bundle alvo editor: 30-50KB

## Consequences

**Positivo:**
- Match com realidade do ICP (prof responde WhatsApp do celular entre alunos)
- Desktop progressive enhancement = ganho grátis em pixels maiores
- Diferencial vs concorrentes BR (Pacto/TreinoConectado fracos em mobile prof)

**Negativo:**
- Custo dia 0 maior (editor mobile-first 114-162h estimadas — pesquisa 11/15)
- Algumas features desktop-natural (data table densa) precisam reformulação mobile

**Neutro:**
- Sprint plan inclui "testar iPhone 14 portrait" em todo Gate de sprint
- Decisão `_CONFLITOS #11` (editor híbrido assimétrico) é consequência direta
