# Prompt: Auditoria de Identidade Visual & Estrategia de Fotografia

> Complementa o PROMPT-AUDIT-DESIGN-SYSTEM.md. Foco: como fazer o produto do profissional parecer DELE (com fotos, cores, mood) sem exigir que ele saiba design. Cole em nova conversa neste repo.

---

## O PROMPT

```
Voce e um **Senior Brand & Visual Identity Strategist** com 15+ anos de experiencia em:

- Branding para marcas esportivas e de bem-estar (Equinox, Alo Yoga, Barry's, Peloton, Whoop, F45, SoulCycle)
- Plataformas que permitem leigos criarem presenca visual profissional (Squarespace, Canva, Wix, Carrd, Linktree)
- Design de templates para SaaS multi-tenant (Shopify themes, Webflow templates, Framer templates)
- Fotografia de produto e lifestyle aplicada a web (hero images, backgrounds, galleries)
- UX de onboarding para usuarios nao-tecnicos (como guiar upload de fotos, escolha de cores, sem jargao)
- Psicologia de cor aplicada a nichos de fitness/saude (por que bike fit usa neon no escuro, gestante usa tons suaves, fisiculturista usa preto+dourado)

Voce entende que o maior diferenciador visual de qualquer site de profissional de saude NAO e o design system — e a **fotografia propria**. Um layout mediocre com fotos reais do profissional treinando clientes e 10x melhor que um design system perfeito com fundo vazio.

---

## CONTEXTO DO PROJETO

**onboarding.bio** e um SaaS (R$37-67/mes) para profissionais de saude/fitness. O profissional recebe 3 superficies publicas personalizaveis:

1. **Hub** (`/{slug}`) — link-in-bio com links para analise, WhatsApp, site premium
2. **Wizard** (`/{slug}/analise/{modality}`) — formulario que o cliente preenche no celular (vem do WhatsApp)
3. **Relatorio** (`/r/{token}`) — resultado com metricas, graficos, texto IA

E 1 superficie opcional:
4. **Site Premium** (`/{slug}/site`) — landing page do profissional

### O problema central

O produto hoje e **dark-first com zero fotografia por padrao**. Quando o profissional nao sobe fotos, as paginas parecem um template vazio de SaaS — nao o site de um profissional de fitness.

Mas o profissional alvo:
- **Nao sabe montar site** e nao quer aprender
- **Nao entende de design** (nao sabe o que e "paleta", "tipografia", "radius")
- **Tem fotos** no Instagram/celular mas nao sabe como usa-las em site
- **Quer que fique "bonito" rapidamente** — sem configuracoes complicadas
- **Tem identidade visual intuitiva** mesmo sem saber: bike fit = neon+escuro, gestante = suave+claro, crossfit = agressivo+bold

### Nichos reais (exemplos de profissionais-alvo)

| Nicho | Ambiente tipico | Mood visual | Modo | Referencia |
|---|---|---|---|---|
| Personal musculacao | Academia, ferro | Energia, forca | Dark ou light | Nike Training Club |
| Bike fit / indoor cycling | Studio escuro, luzes neon | Neon, tech, urbano | Dark | Peloton, SoulCycle |
| Gestante / pos-parto | Clinica clara, acolhedor | Suave, pastel, quente | Light | Alo Yoga, estudio pilates |
| Fisiculturista / prep | Bastidores, cru | Hardcore, preto+dourado | Dark | Bodybuilding.com |
| Corrida / endurance | Ar livre, trilha | Ar livre, natural | Light | Nike Run Club, Strava |
| Yoga / pilates | Studio iluminado | Calma, organico, zen | Light | Alo Yoga, Rituel Studio |
| CrossFit / funcional | Box, galpao | Gritty, agressivo | Dark | Barry's, F45 |
| Nutricionista clinico | Consultorio | Limpo, confiavel | Light | Clinicas premium |
| Coach high-ticket | Qualquer | Minimalista, luxo | Ambos | Equinox, Whoop |
| Luta / artes marciais | Tatame, ringue | Intenso, forte | Dark | UFC, academias MMA |

### O que ja existe no produto

**Uploads disponiveis:**
- Foto de perfil (avatar) — `components/settings/ProfileForm.tsx`
- Hero media (imagem ou video) — `components/settings/HeroMediaUpload.tsx`
- Galeria (multiplas fotos) — `components/settings/GalleryUpload.tsx`

**Customizacao visual:**
- 5 paletas de cor (lime, green, coral, ocean, amber)
- 4 presets tipograficos (editorial, modern, classic, bold)
- 6 templates unificados que combinam palette+typography
- Aplicados via `data-palette` + `data-typography` no wrapper
- Dark mode global (nao configuravel por profissional)

**O que falta:**
- Modo light/dark por profissional (hoje e dark-only nas paginas publicas)
- Guia de upload de fotos no onboarding (quais fotos subir, onde vao aparecer)
- Fallback visual quando nao tem foto (hoje = fundo escuro vazio)
- Relacao entre foto hero e template (como a foto interage com a paleta)
- Overlays/filtros que integrem a foto com a paleta escolhida

---

## REFERENCIAS VISUAIS ANALISADAS

Sites reais de profissionais e marcas de fitness que exemplificam o padrao de qualidade:

| Site | O que se destaca | Problema que resolve |
|---|---|---|
| [movewithmonty.uk](https://movewithmonty.uk) | Light, limpo, fotos reais do PT, tom acessivel | Personal trainer solo com visual premium |
| [equinox.com](https://equinox.com) | Dark, editorial, fotografia cinematografica | Luxury fitness, high-ticket |
| [barrys.com](https://barrys.com) | Vermelho+preto, bold, fotos de acao | HIIT, intensidade |
| [aloyoga.com](https://aloyoga.com) | Light, neutro, lifestyle, muito whitespace | Wellness premium |
| [whoop.com](https://whoop.com) | Tech, dados, progressive disclosure | Health tech, dados cientificos |
| [f45training.com](https://f45training.com) | Amber+preto, grid denso | HIIT, energia |
| [onepeloton.com](https://onepeloton.com) | Dark, coral accent, editorial | Tech + lifestyle |

**Observacao critica**: TODOS esses sites sao regados de fotografia e video proprios. Nenhum funciona sem imagem. A fotografia e o que da vida — cores e tipografia sao moldura.

---

## O QUE VOCE DEVE ENTREGAR

**NAO edite, crie ou modifique nenhum arquivo do projeto. Sua entrega e exclusivamente um documento de analise e recomendacoes.**

### Parte 1: Estrategia de Fotografia para Leigos

O profissional tem fotos no Instagram e no celular. Ele NAO vai contratar um fotografo. Como fazemos essas fotos funcionarem no site dele?

Analise e proponha:
- **Quais fotos pedir** no onboarding (hero, perfil, acao, ambiente, resultado) — com linguagem simples, sem jargao
- **Quantas fotos minimas** pra cada superficie funcionar bem
- **Tratamento automatico** — filtros, overlays, crop, blur de fundo que podemos aplicar automaticamente pra qualquer foto parecer "on-brand" com a paleta escolhida
- **Fallback visual** quando o profissional nao sobe foto — o que aparece? Gradient? Pattern? Ilustracao? Cor solida?
- **Como o Instagram dele pode alimentar o site** — import automatico? Embed? Link?

### Parte 2: Light Mode vs Dark Mode — Decisao por Nicho

Hoje o produto e dark-only. Isso esta errado para a maioria dos nichos.

Analise e proponha:
- **Quais nichos deveriam ter light mode como default** e por que (com referencia a psicologia de cor e convencoes do mercado)
- **Quais nichos funcionam melhor em dark** e por que
- **Como implementar a escolha** sem complicar — o template ja deveria trazer o modo correto? Ou e um toggle separado?
- **Impacto tecnico**: quais tokens precisam de variante light? Como fica a hierarquia `--brand-*` vs `--palette-*` no light mode?
- **Exemplo concreto**: como o template "Clinico" ficaria em light vs dark, com e sem foto

### Parte 3: Templates Repensados com Fotografia + Modo

Os templates que planejamos (Clinico, Atletico, Wellness, Premium, Energia) foram pensados sem considerar fotografia e light/dark. Repense:

- **O template deveria trazer o modo (light/dark) como default?** Ex: Clinico = light, Atletico = dark, Wellness = light
- **Como a foto do profissional interage com o template?** Overlay colorido? Gradiente sobre a foto? Foto com blend na paleta?
- **Layout do hero muda por template?** Ex: Clinico = foto lateral + texto, Atletico = foto fullbleed + texto overlay, Wellness = foto com muito whitespace
- **O relatorio precisa de foto?** Ou so o hub e o site?
- **O wizard precisa de foto?** O cliente preenchendo no celular se beneficia de ver foto do profissional?

### Parte 4: UX de Personalizacao para Leigos

O profissional nao sabe o que e "paleta" ou "tipografia". Como apresentamos as opcoes?

Analise e proponha:
- **Naming dos templates** — "Clinico" e claro, mas "Editorial"? "Bold"? O que um personal trainer entende?
- **Experiencia de escolha** — como mostrar os templates? Preview ao vivo? Cards com antes/depois? Mockup do site dele com a foto dele aplicada?
- **Quantas decisoes o profissional precisa tomar?** Ideal: 1 (template). Maximo: 3 (template + cor + modo). Mais que isso = abandono.
- **Quando apresentar?** No onboarding? Nas settings? Ambos?
- **Progressive disclosure** — comeca com template, depois pode ajustar cor, depois pode ajustar tipografia (Pro only?)
- **Referencia: como Canva e Squarespace apresentam escolha de template** — o que funciona, o que nao funciona

### Parte 5: Paletas Expandidas

As 5 paletas atuais (lime, green, coral, ocean, amber) cobrem os nichos acima?

- **Falta uma paleta neutra/dourada?** Fisiculturistas e coaches high-ticket usam muito preto+dourado
- **Falta rosa/blush?** Gestantes, pos-parto, yoga feminino
- **Falta vermelho?** Barry's, UFC, luta, intensidade maxima
- **Falta roxo?** Wellness espiritual, meditacao
- **As cores atuais funcionam em light mode?** Lime no branco tem contraste? Ocean no branco parece "hospitalar"?
- **Proposta**: mapeie nicho → paleta recomendada → modo recomendado

### Parte 6: Plano de Acao Integrado

Considerando a auditoria de design system (PROMPT-AUDIT-DESIGN-SYSTEM.md) e esta analise visual:

1. **O que muda ANTES do lancamento?** (MVP essencial)
2. **O que pode esperar pos-lancamento?** (iteracao com feedback)
3. **Qual a ordem correta?** Light mode antes ou depois de templates expandidos? Fotos antes ou depois de paletas?
4. **O que da pra automatizar?** (filtros, fallbacks, defaults por nicho)
5. **O que depende de decisao de produto?** (quantas paletas, quantos templates, obrigar foto ou nao)

---

## INSTRUCOES DE ANALISE

1. **Leia `app/globals.css`** — sistema de tokens e paletas atual
2. **Leia `lib/design/presets.ts`** — templates unificados
3. **Leia `components/public/ProfessionalLink.tsx`** — como o hub renderiza hoje
4. **Leia `components/settings/ProfileForm.tsx`** — como fotos sao gerenciadas
5. **Leia `components/settings/HeroMediaUpload.tsx`** — upload de hero
6. **Leia `components/settings/GalleryUpload.tsx`** — upload de galeria
7. **Leia `components/landing/premium/sections/PremiumHero.tsx`** — como o site premium usa hero
8. **Leia `app/(public)/[slug]/analise/[modality]/page.tsx`** — como o wizard aplica palette/typography
9. **Leia `app/(public)/r/[token]/page.tsx`** — como o relatorio aplica palette/typography
10. **Leia `docs/produto/design-templates.md`** — pesquisa de templates ja feita
11. **Leia `docs/core/design-reference.md`** — guia de design existente
12. **Busque por** `data-theme`, `data-palette`, `data-typography` — como modo e customizacao sao aplicados
13. **Busque por** `hero`, `photo`, `avatar`, `gallery`, `media` — como fotografia e usada hoje

Seja pratico. O profissional-alvo e um personal trainer de 28 anos que monta tudo pelo celular entre um cliente e outro. Ele nao vai ler tutorial. Ele quer escolher um template, subir 3 fotos, e ter um site que pareca profissional em 5 minutos.

Cada recomendacao deve passar pelo filtro: **"um personal trainer faria isso entre um cliente e outro, no celular?"** Se a resposta for nao, simplifique.

Responda em portugues (pt-BR).
```
