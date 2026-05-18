# VRT diff (Visual Regression Testing)

## Estado

**Nao executavel.** Diretorio `tests/visual/` nao existe. Nenhum teste Playwright de VRT foi criado.

## Contexto

D69 (decisions.md) estabeleceu "Visual regression baseline antes de codemod". O baseline de Ladle (Fase 19) focou em catalogar componentes, nao em screenshots automatizadas de rotas.

## Risco

Sem VRT, regressoes visuais sutis (tokens aplicados errado, spacing quebrado por codemod) nao sao detectadas automaticamente. As Fases 20-23 foram feitas sem VRT gate.

## Decisao

VRT e ferramenta complementar, nao bloqueante para selar o DS. Os codemods das Fases 20-23 foram validados visualmente durante execucao (lint + build + verificacao manual). Criacao de testes VRT fica como issue para Fase 25+.

## Veredicto: N/A (infraestrutura inexistente, nao bloqueia)

### Issue rastreado

- [ ] Criar suite VRT Playwright com screenshots de ~10 rotas x 3 viewports (390, 768, 1280)
