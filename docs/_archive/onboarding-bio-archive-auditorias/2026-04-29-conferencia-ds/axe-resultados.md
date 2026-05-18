# Axe-core a11y

## Estado

**Nao executavel automaticamente.** Diretorio `tests/a11y/` nao existe. Nenhum teste Playwright com axe-core foi criado.

## O que foi verificado

A auditoria de a11y lint (Fase 9) ja cravou:

- `jsx-a11y` strict mode ativo
- 14 `autoFocus` documentados com justificativa
- 0 erros de lint a11y

## O que falta (requer navegacao manual)

Rodar extensao axe DevTools nas 5 rotas criticas:

1. `/` (landing)
2. `/dashboard`
3. `/{slug}` (site do profissional)
4. `/r/{token}` (relatorio)
5. `/onboarding` (wizard step)

## Veredicto: N/A (requer teste manual em browser)

### Issue rastreado

- [ ] Criar suite Playwright + @axe-core/playwright para 5 rotas criticas
- [ ] Rodar extensao axe DevTools manualmente e documentar resultados
