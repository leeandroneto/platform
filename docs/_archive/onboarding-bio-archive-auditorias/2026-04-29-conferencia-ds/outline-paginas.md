# Outline semantico — paginas criticas

## Estado

**Requer verificacao manual em browser.** Chrome DevTools > Accessibility > Headings.

## Paginas a verificar

| #   | Rota                     | Expectativa                                            |
| --- | ------------------------ | ------------------------------------------------------ |
| 1   | `/` (landing)            | 1 h1 (hero), h2 por secao, hierarquia coerente         |
| 2   | `/dashboard`             | 1 h1 (Dashboard), h2 por secao                         |
| 3   | `/{slug}` (site pro)     | 1 h1 (nome do profissional), h2 por secao              |
| 4   | `/r/{token}` (relatorio) | 1 h1 (titulo relatorio), h2 por secao, h3 por subsecao |
| 5   | `/onboarding` (wizard)   | 1 h1 (step title), hierarquia coerente                 |

## O que verificar

Para cada pagina:

1. Abrir Chrome DevTools > Elements > Accessibility pane > Headings
2. Confirmar: exatamente 1 `<h1>`
3. Confirmar: hierarquia nao pula niveis (ex: h1 -> h3 sem h2)
4. Confirmar: headings usam `<Heading level={N}>` (renderiza tag semantica)
5. Nenhum heading decorativo (div com classe de heading sem tag semantica)

## Nota sobre migracoes completadas

Fase 20 migrou 308 headings para `<Heading level={N}>`. Fase 23 promoveu a regra de lint para `error`. Risco de heading fora do padrao e baixo.

## Veredicto: PENDENTE (requer verificacao manual em browser)

### Issue rastreado

- [ ] Abrir 5 rotas em Chrome, verificar outline, preencher tabela com resultados
