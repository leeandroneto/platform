# Guia de Projetos Futuros — Flutter

> Versão Flutter do GUIA-PROJETOS-FUTUROS.md. Mesmo nível de rigor, mesmas regras de não cometer o mesmo erro duas vezes. O backend (Supabase) é idêntico — as seções §4, §5 (segurança de backend), §6 (parcialmente), §8, §27 e §28 são reaproveitadas quase sem mudança.
> Atualizado: 2026-05-03

---

## 1. Antes de escrever uma linha de código

### Decida o idioma de cada camada

| Camada                                                | Idioma                    | Motivo                              |
| ----------------------------------------------------- | ------------------------- | ----------------------------------- |
| Banco de dados (tabelas, colunas, enums, RPCs)        | EN                        | Evita mistura com ORM e padrões SQL |
| Código (arquivos, tipos, classes, funções, providers) | EN                        | Consistência com dependências       |
| Nomes de rotas GoRouter                               | EN (slugs)                | Navegação interna é código          |
| Deep links públicos                                   | PT                        | SEO e UX do usuário final           |
| Strings de UI (Text widgets)                          | PT via `AppLocalizations` | i18n obrigatório desde o dia 1      |
| Documentação interna                                  | PT                        | Comunicação com o fundador          |

Se misturar no início, vai gastar semanas corrigindo depois. Decida e não revise.

### Defina a arquitetura em camadas antes de criar a primeira tela

```
lib/
  features/              → módulos por feature (cada feature é pasta isolada)
    auth/
      data/              → repositories: queries Supabase, retornam models
      domain/            → models, value objects (lógica pura, zero IO)
      presentation/      → screens, widgets locais, providers da feature
    dashboard/
    clients/
    ...
  shared/
    data/                → supabase client, storage client, API helpers
    domain/              → models compartilhados, validators
    widgets/             → UI components reutilizáveis (design system)
    theme/               → ThemeData, ThemeExtensions, ColorScheme
  core/
    env.dart             → variáveis de ambiente com validação no startup
    router.dart          → GoRouter: todas as rotas em um lugar
    supabase.dart        → inicialização do cliente Supabase

supabase/functions/      → Edge Functions (Deno — igual ao Next.js)
```

**Regras que não se negociam:**

- Widget nunca chama `Supabase.instance.client` diretamente — vai via repository injetado pelo provider
- `domain/` é lógica pura — sem imports de `supabase_flutter`, `flutter/material`, ou qualquer IO
- `data/` lança exceção — nunca retorna `null` silencioso para erro
- Service role (`supabase.dart` admin) nunca em widget tree
- Nunca usar `BuildContext` após `await` sem checar `mounted`

---

## 2. Stack — decida cedo e trave

Bumpar major no meio do projeto custa caro. Decida no dia 1.

```
Flutter (SDK travado via .fvmrc ou flutter-version em CI)
Dart → sound null safety (padrão a partir do Flutter 3)
Riverpod 2 (riverpod_annotation + flutter_riverpod) → state management
GoRouter → navegação declarativa, deep links, redirects de auth
supabase_flutter → banco + auth + storage + realtime
freezed + json_serializable → models imutáveis com copyWith e fromJson
flutter_localizations + intl + arb → i18n desde o dia 1
go_router_builder → rotas type-safe (codegen, evita typo em path)
flutter_secure_storage → tokens e secrets (nunca SharedPreferences)
sentry_flutter → observabilidade desde o dia 1
```

---

## 3. Design system — configure antes de criar telas

### Cores

- Defina paleta em OKLCH como fonte de cálculo; converta para `Color(0xFF...)` nos tokens finais
- Valide contraste com APCA (Lc ≥ 60 para UI, ≥ 75 para texto pequeno)
- Nunca hex literal em widget — só via `Theme.of(context).colorScheme.X` ou `Theme.of(context).extension<AppColors>()!.X`
- Nunca `color: Color(0xFF...)` hardcoded em widget — use token semântico

### Tokens no ThemeData

```dart
// lib/shared/theme/app_theme.dart
ThemeData buildTheme({Brightness brightness = Brightness.dark}) {
  final colors = brightness == Brightness.dark ? darkColors : lightColors;
  return ThemeData(
    useMaterial3: true,
    colorScheme: colors.toColorScheme(),
    textTheme: buildTextTheme(),
    extensions: [
      AppColors.fromPalette(colors),
      AppShapes.rounded,       // default — pode ser sobrescrito por tenant
      AppSpacing.instance,
    ],
  );
}
```

Qualquer valor que muda por tema, paleta ou tenant vira `ThemeExtension`. Valor fixo pode ser constante.

### Tipografia

- Nunca `TextStyle(fontSize: 14)` solto num widget
- Usar `Theme.of(context).textTheme.bodyMedium` ou componentes semânticos wrapper
- Se não tiver `<Heading>` e `<BodyText>` criados, crie antes de criar telas
- `TextStyle` direta só em `buildTextTheme()` — fonte da verdade

### Shapes e multi-tenant

Se o produto vai ter customização visual por usuário (paletas, formas, tipografia):

- Configure `ThemeExtension<AppShapes>` no `ThemeData` desde o dia 1
- Qualquer `BorderRadius.circular(12)` hardcoded num widget vai quebrar isso depois
- Use `Theme.of(context).extension<AppShapes>()!.card` desde o primeiro componente

### Widgets de UI

- Nunca `ElevatedButton` raw — sempre wrapper semântico (`PrimaryButton`, `SecondaryButton`)
- Nunca `Text(...)` raw em telas de produto — sempre via wrapper que aplica `textTheme`
- Nunca `Container` quando `Card` ou `DecoratedBox` são mais semânticos
- Máximo 300 linhas por arquivo de widget. Acima disso, decompor em `_components/`

---

## 4. Banco de dados

### RLS é obrigatório desde a migration 1

```sql
-- Toda tabela nova:
ALTER TABLE minha_tabela ENABLE ROW LEVEL SECURITY;
```

Nunca criar tabela sem RLS e "adicionar depois". Depois não acontece.

### RPCs de escrita

```sql
CREATE FUNCTION minha_rpc(...)
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$...$$;

REVOKE EXECUTE ON FUNCTION minha_rpc FROM PUBLIC;
GRANT EXECUTE ON FUNCTION minha_rpc TO authenticated;
```

- Mutação em 2+ tabelas → sempre RPC com `BEGIN/COMMIT`
- Race condition (cupons, slugs, vagas limitadas) → `SELECT FOR UPDATE`

### Migrations

- Nome: `YYYYMMDDHHMMSS_descricao.sql`
- Nunca criar `.sql` manualmente e aplicar depois — use a ferramenta do banco direto
- Migration e código andam juntos no mesmo commit

### Nomenclatura

```
snake_case em tudo
created_at + updated_at em toda tabela (com trigger de update automático)
FK com ON DELETE declarado (CASCADE, SET NULL ou RESTRICT — escolha explícita)
Soft delete: campo deleted_at, não deletar linha
```

---

## 5. Segurança

- Rate limit em toda Edge Function pública (login, signup, reset)
- Nunca PII em logs, URLs, route params ou analytics
- Timing-safe compare em webhooks (nunca `==` para comparar tokens)
- Secrets em `flutter_secure_storage`, nunca `SharedPreferences` (não é criptografado)
- `.env` local, nunca commitado — usar `--dart-define` em CI
- PITR habilitado no banco de produção
- Certificate pinning se o app lida com dados de saúde (configurar via `dio` + `HttpClient`)
- Deep links validados no Supabase — nunca confiar em URL apontando de volta pro app sem verificar o JWT
- `flutter_secure_storage` com `IOSOptions(accessibility: KeychainAccessibility.first_unlock)` para background refresh funcionar

---

## 6. Erros — padrão por camada

| Onde                 | Padrão                                                       |
| -------------------- | ------------------------------------------------------------ |
| `domain/`            | `throw DomainException(...)` (classe própria)                |
| `data/` repositories | `throw RepositoryException(...)` — wraps PostgrestException  |
| Providers (Riverpod) | `AsyncValue.error` — capturado automaticamente               |
| UI (widgets)         | `ref.watch(provider).when(error: (e, st) => ErrorWidget(e))` |
| Edge Functions       | `Response.json({ ok: false, error }, { status: 4xx })`       |

Nunca deixar erro silencioso. `catch {}` vazio = bug escondido.

```dart
// ✅ Repository wrapping Supabase exception
Future<List<Product>> getProducts(String tenantId) async {
  try {
    final data = await _client
      .from('products')
      .select()
      .eq('tenant_id', tenantId);
    return data.map(Product.fromJson).toList();
  } on PostgrestException catch (e) {
    throw RepositoryException('getProducts', e.message, e.code);
  }
}
```

```dart
// ✅ Provider — erro exposto automaticamente pelo AsyncNotifier
class ProductsNotifier extends AsyncNotifier<List<Product>> {
  @override
  Future<List<Product>> build() =>
      ref.watch(productRepositoryProvider).getProducts(ref.watch(tenantIdProvider));
}

// ✅ UI consome o AsyncValue
ref.watch(productsProvider).when(
  data: (products) => ProductList(products: products),
  loading: () => const ProductListSkeleton(),
  error: (e, _) => ErrorCard(message: e.toString()),
);
```

---

## 7. Variáveis de ambiente

Flutter não tem processo de servidor, então `--dart-define` é o mecanismo correto. **Nunca `dotenv` lido de arquivo em produção** — os valores ficam embutidos no binário em tempo de compilação.

```dart
// lib/core/env.dart
abstract final class Env {
  static const supabaseUrl =
      String.fromEnvironment('SUPABASE_URL');
  static const supabaseAnonKey =
      String.fromEnvironment('SUPABASE_ANON_KEY');
  static const sentryDsn =
      String.fromEnvironment('SENTRY_DSN');
  static const appEnv =
      String.fromEnvironment('APP_ENV', defaultValue: 'production');

  static bool get isDev => appEnv == 'development';

  static void validate() {
    // Falha em tempo de startup, não em runtime
    if (supabaseUrl.isEmpty) throw Exception('SUPABASE_URL obrigatório. Passe com --dart-define=SUPABASE_URL=...');
    if (supabaseAnonKey.isEmpty) throw Exception('SUPABASE_ANON_KEY obrigatório.');
  }
}
```

```bash
# Desenvolvimento
flutter run \
  --dart-define=SUPABASE_URL=https://xxx.supabase.co \
  --dart-define=SUPABASE_ANON_KEY=eyJ... \
  --dart-define=APP_ENV=development

# Alternativa: --dart-define-from-file=.env.json (Flutter 3.7+)
# .env.json (não commitado):
# { "SUPABASE_URL": "...", "SUPABASE_ANON_KEY": "..." }
```

Mantenha um `.env.json.example` commitado com todas as chaves e valores placeholder. Nunca commite `.env.json`.

Em CI: injetar via secrets (`${{ secrets.SUPABASE_URL }}`), nunca em arquivo commitado.

---

## 8. Inteligência Artificial

Idêntico ao GUIA Next.js — o backend de IA fica em Edge Functions/Supabase.

- **Engine ≠ Prompt.** Engine é código determinístico (`lib/domain/engine/`). Prompt é criativo e fica no banco.
- Nunca hardcodar prompt em código Flutter. Se está em código, é dívida.
- Todo input de IA validado no domain antes de ir para a Edge Function
- Todo output de IA validado com `freezed` + parse antes de persistir
- IA nunca toma decisão técnica. Ela flagga, o profissional decide.
- Toda chamada IA logada em tabela `ai_generations` (input, output, modelo, latência, custo)

---

## 9. Testes

| Tipo        | O que testa                                       | Ferramenta                              |
| ----------- | ------------------------------------------------- | --------------------------------------- |
| Unit        | `domain/` — cálculos, validators, regras puras    | `flutter test` (sem framework especial) |
| Repository  | `data/` — queries com banco real (Supabase local) | `flutter test` + Supabase local         |
| Widget      | Componentes isolados — render, interação, estados | `flutter_test` + `WidgetTester`         |
| Golden      | Snapshot visual — detectar regressões de UI       | `golden_toolkit` ou `alchemist`         |
| Integration | Fluxos críticos completos no device/emulador      | `integration_test` (Flutter nativo)     |

**Nunca mockar o banco nos testes de repository.** A divergência entre mock e produção vai aparecer na pior hora.

```dart
// ✅ Unit test — domain puro, sem Flutter
test('calcula IMC corretamente', () {
  final result = calculateBmi(weight: 70, heightCm: 175);
  expect(result.value, closeTo(22.9, 0.1));
  expect(result.classification, BmiClass.normal);
});

// ✅ Widget test
testWidgets('ProductCard mostra nome e preço', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [productsProvider.overrideWith((_) => fakeProducts)],
      child: const MaterialApp(home: ProductCard(id: 'p1')),
    ),
  );
  expect(find.text('Tênis de Corrida'), findsOneWidget);
  expect(find.text('R\$ 299,90'), findsOneWidget);
});
```

```yaml
# pubspec.yaml — testes separados de dev
dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  mocktail: ^1.0.0 # mock para unit tests onde necessário
  golden_toolkit: ^0.16.0
```

---

## 10. Acessibilidade — mínimo desde o dia 1

- WCAG 2.2 AA não é opcional — é obrigação legal no Brasil (LBI)
- `Semantics` wrapper em todo elemento interativo que não é widget Material padrão
- `MergeSemantics` + `ExcludeSemantics` para grupos de UI com label único
- Touch targets ≥ 48×48dp (Material guideline) — não 44px do iOS
- `MediaQuery.of(context).disableAnimations` em toda animação
- `focusNode` + `FocusTraversalOrder` para navegação por teclado/switch
- `Tooltip` em todo ícone sem texto

```dart
// ✅ Semantics em ícone de ação
Semantics(
  label: AppLocalizations.of(context).closeButton,
  button: true,
  child: IconButton(
    icon: const Icon(Icons.close),
    onPressed: onClose,
  ),
);

// ✅ Reduced motion
final disableAnimations = MediaQuery.of(context).disableAnimations;

AnimatedOpacity(
  duration: disableAnimations ? Duration.zero : const Duration(milliseconds: 250),
  opacity: isVisible ? 1.0 : 0.0,
  child: child,
);
```

Se deixar para depois, vai refatorar 100+ widgets. Custa muito mais.

---

## 11. CI/CD — configure antes do primeiro PR

```yaml
# .github/workflows/ci.yml — mínimo obrigatório em todo PR:
- flutter analyze --fatal-infos --fatal-warnings
- dart format --set-exit-if-changed .
- flutter test --coverage
- dart run scripts/check_rls.dart # tabelas sem RLS = exit 1
- dart run scripts/check_colors.dart # cores literais fora de theme = exit 1
- dart run scripts/metrics_check.dart # regressão de a11y/design = exit 1
- flutter build apk --release # não pushes com build quebrado
```

Pre-push hook local com os mesmos comandos. Se não tiver CI bloqueando, a main vai acumular dívida.

Para release (mobile):

```yaml
# CD — só na main, após CI verde
- flutter build appbundle --release
- fastlane deploy # ou codemagic / bitrise
```

---

## 12. Convenções de commit

```
feat(scope): descrição em lowercase
fix(scope): descrição
chore(scope): descrição
refactor(scope): descrição
docs(scope): descrição
test(scope): descrição
```

Commitlint configurado desde o dia 1. Histórico legível vale muito em debugging. Mesmo `.commitlintrc.ts` do GUIA Next.js funciona — é agnóstico de plataforma.

---

## 13. Observabilidade

- `sentry_flutter` instalado desde o dia 1 — não quando os primeiros crashes chegarem
- `SentryFlutter.init(dsn: Env.sentryDsn, ...)` no `main()` antes de `runApp`
- `SentryNavigatorObserver` no `MaterialApp.router` para rastrear navegação
- Alertar em crash rate, não em crash individual
- Nunca `print()` em produção — usar `Logger` do package `logger` com nível de log
- Eventos de negócio rastreados: cadastro, pagamento, ação principal do produto

```dart
// main.dart
Future<void> main() async {
  await SentryFlutter.init(
    (options) {
      options.dsn = Env.sentryDsn;
      options.environment = Env.appEnv;
      options.tracesSampleRate = 0.1;
    },
    appRunner: () => runApp(
      ProviderScope(child: const App()),
    ),
  );
}
```

---

## 14. Estrutura de documentação

```
docs/
  core/
    architecture.md    → estrutura, camadas, regras
    schema.md          → tabelas, RPCs, segurança
    decisions.md       → decisões fechadas (nunca revisitar sem motivo)
    design-reference.md → princípios UI/UX
    copy-positioning.md → tom de voz, palavras proibidas
CLAUDE.md              → contexto do projeto para o agente
```

`decisions.md` é o mais importante. Toda decisão arquitetural vai lá com data e motivo. Sem isso, o próximo agente (ou você em 3 meses) vai refazer a mesma discussão.

---

## 15. Anti-padrões Flutter — o que causa mais retrabalho

| Anti-padrão                                      | Consequência real                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------ |
| `setState` em widget com estado complexo         | Rebuild inteiro desnecessário; difícil de testar; troque por Riverpod    |
| `BuildContext` após `await` sem checar `mounted` | Crash em release quando usuário navega durante operação                  |
| `Color(0xFF...)` hardcoded em widget             | Elemento "preso" que não responde a tema do tenant                       |
| `TextStyle(fontSize: 14)` hardcoded              | 500+ widgets com tamanhos inconsistentes descobertos meses depois        |
| `Navigator.push` direto (imperativo)             | Deep links não funcionam; backstack bagunçado; use GoRouter              |
| `StatefulWidget` desnecessário                   | Acumula boilerplate; difícil de testar; prefira `ConsumerWidget`         |
| `dynamic` ou `Object` sem narrowing              | Apaga a rede de segurança; use tipos explícitos                          |
| `catch (e) {}` silencioso                        | Engole crashes reais; logue ou relance                                   |
| `SharedPreferences` para tokens                  | Não é criptografado; use `flutter_secure_storage`                        |
| Widget >300 linhas "por enquanto"                | Nunca decomposto; vira gargalo de conflito em paralelo                   |
| Supabase client direto em widget                 | Impossível de testar; injeta via provider                                |
| `print()` em produção                            | Leak de PII em logs de dispositivo; use `Logger` com nível               |
| `if (tenant.id == 'X')` para lógica por tenant   | Código de cliente vaza para o produto; use `tenant.features['flag']`     |
| Float para dinheiro                              | Erro de arredondamento; use `bigint` em centavos no banco, `int` no Dart |
| `Future.delayed(Duration.zero)` para scheduling  | Symptom of bad architecture; reestruture o setState/provider             |
| `context.read` dentro de `build()`               | Re-executa a cada rebuild; use `ref.read` só em callbacks                |
| Chave hardcoded em `intl/arb`                    | String PT visível no código; tudo vai via `AppLocalizations.of(context)` |

---

## 16. Checklist de início de projeto (do zero)

```
[ ] Idioma de cada camada definido e documentado
[ ] Flutter SDK version fixada via .fvmrc ou CI matrix
[ ] Arquitetura de pastas criada (mesmo que vazia)
[ ] pubspec.yaml com versões fixas (sem ^) para dependências críticas
[ ] Supabase configurado com RLS na primeira tabela
[ ] lib/core/env.dart com Env.validate() chamado no main()
[ ] .env.json.example commitado com todas as chaves
[ ] analysis_options.yaml com very_good_analysis
[ ] ThemeData + ThemeExtension<AppShapes> + ThemeExtension<AppColors> criados
[ ] GoRouter configurado com redirect de auth
[ ] flutter_localizations + ARB configurados (mesmo que 1 idioma)
[ ] Commitlint + git hooks configurados
[ ] scripts/check_rls.dart no pre-push
[ ] CI básico (analyze + test + build + gitleaks) no primeiro PR
[ ] Pre-push hook local espelhando CI
[ ] Sentry instalado
[ ] CLAUDE.md criado (≤150 linhas) + .claude/rules/ para regras por tópico
[ ] docs/patterns.md criado + docs/adr/0001-stack.md (primeira decisão)
[ ] RLS em toda tabela desde a migration 1
[ ] Semantics em todo componente interativo não-Material
[ ] metrics_check.dart configurado como baseline
```

---

## 17. Sobre paralelismo com agentes

Se for usar múltiplos agentes em paralelo:

- Cada agente trabalha em diretório físico separado via `git worktree`
- Tarefas pequenas e isoladas — arquivos diferentes, sem overlap
- Cada tarefa tem critério de conclusão mensurável (número antes → número depois)
- Agente nunca declara "feito" sem medir
- Agente nunca toca arquivo fora do escopo sem avisar
- Agente nunca reverte mudança no working tree sem perguntar
- Agente nunca assume que avisos de `dart analyze` sem correção são aceitáveis

A principal causa de retrabalho com agentes não é incompetência técnica — é falta de portão de qualidade automático e critério de conclusão vago.

---

## 18. Como usar Claude Code de forma eficaz

Idêntico ao GUIA Next.js — esta seção não muda por plataforma.

### CLAUDE.md — o documento mais importante

É o único arquivo que carrega em toda sessão automaticamente. Trate como sinal alto, não como dump de conhecimento.

**O que colocar:**

- Comandos de build e teste (`flutter test`, `dart analyze`, etc.)
- Arquitetura em camadas (o que pode importar o quê)
- Convenções de nomenclatura
- Stack travada com versões
- Anti-padrões do projeto (o que nunca fazer)
- Links para docs de referência

**O que não colocar:**

- Coisas que o agente pode inferir lendo o código
- Tutoriais longos ou docs de bibliotecas
- Histórico de mudanças (isso é o git)

**Limite prático: 150-200 linhas.** O que não cabe vai para `.claude/rules/`.

### Dois princípios que governam tudo

**Estado real > memória.** Antes de tocar em qualquer arquivo, releia. Antes de criar widget, liste o que já existe. A memória do agente é cache sujo — o arquivo no disco é a fonte da verdade.

**Errou pelo mesmo motivo duas vezes = vira regra.** Se você corrigiu o agente pela mesma razão em duas sessões diferentes, atualize o CLAUDE.md ou o `.claude/rules/` correspondente. Nem antes (CLAUDE.md inflado), nem depois (mesmo bug pela terceira vez).

### .claude/rules/ — modularização das regras

```
.claude/rules/
  architecture.md   → camadas, quem importa quem
  rls.md            → RLS, tenant_id, policies
  widgets.md        → wrappers semânticos, ThemeExtension, max 300l
  theming.md        → tokens semânticos, proibições de cor literal
  i18n.md           → AppLocalizations, chaves em todos os ARBs
  security.md       → secure_storage, Env.validate, service_role
  testing.md        → o que testar onde, sem mock do banco
  routing.md        → GoRouter, deep links, redirect de auth
```

No CLAUDE.md, referencie: `"Quando errar em RLS → .claude/rules/rls.md"`.

**Princípio de ouro:** nunca escreva regra negativa pura. `"Nunca use X"` sem alternativa bloqueia o agente. Sempre: `"Use Y em vez de X, exceto quando Z"`.

### Memória — o que persiste entre sessões

| Tipo         | Onde fica                              | Carrega quando                     |
| ------------ | -------------------------------------- | ---------------------------------- |
| CLAUDE.md    | Raiz do projeto (git)                  | Toda sessão                        |
| Auto-memória | `~/.claude/projects/<projeto>/memory/` | Toda sessão (primeiras 200 linhas) |

A auto-memória tem tipos: **user** (perfil), **feedback** (correções e validações), **project** (contexto de produto), **reference** (onde encontrar coisas).

**O mais valioso é o feedback.** Cada vez que você corrigir o agente, ele deve salvar o motivo. Sem isso, vai repetir o mesmo erro na próxima sessão.

### Skills, MCP Servers, Hooks, Settings, Agents, Commands

Todos iguais ao GUIA Next.js — são agnósticos de plataforma. Os patterns de `.mcp.json`, `.claude/agents/`, `.claude/commands/`, `.claude/settings.json` e `/verify-state` se aplicam sem mudança.

A única diferença: substituir os agents específicos de Next.js por equivalentes Flutter:

```
.claude/agents/
  code-reviewer.md     → lê diff, reporta issues (sem escrever código)
  a11y-reviewer.md     → Semantics, touch targets 48dp, MediaQuery.disableAnimations
  rls-auditor.md       → tabelas sem RLS, policies sem index, cross-tenant
  explorer.md          → mapeia codebase relevante (read-only, retorna resumo)
  widget-reviewer.md   → cor literal, hardcode de TextStyle, BuildContext após await
```

### Anti-padrões de uso do Claude Code

| Anti-padrão                       | Consequência                        | Solução                                   |
| --------------------------------- | ----------------------------------- | ----------------------------------------- |
| Sessão longa com muitas correções | Contexto cheio de tentativas falhas | `/clear` e reescrever o prompt            |
| CLAUDE.md com 500+ linhas         | Agente ignora partes                | Cortar para 150-200l, mover para Skills   |
| Não dar verificação ao agente     | Código plausível com bugs           | Sempre incluir como testar                |
| Exploração sem subagente          | Contexto principal poluído          | Usar subagente para investigação          |
| Agente declara "feito" sem medir  | Problema persiste                   | Exigir número antes → número depois       |
| Não salvar feedback em memória    | Repete o mesmo erro                 | Após correção, pedir que salve em memória |

---

## 19. Analysis options — equivalente ao ESLint

Dart não tem plugins inline como o ESLint, mas `analysis_options.yaml` com `very_good_analysis` é o equivalente mais próximo ao strict mode + regras customizadas.

### Instalar very_good_analysis

```yaml
# pubspec.yaml
dev_dependencies:
  very_good_analysis: ^7.0.0 # atualizar com flutter upgrade
```

### analysis_options.yaml

```yaml
include: package:very_good_analysis/analysis_options.yaml

analyzer:
  exclude:
    - '**/*.g.dart' # gerado por json_serializable
    - '**/*.freezed.dart' # gerado por freezed
    - 'lib/l10n/**' # gerado pelo intl
  errors:
    missing_required_param: error
    missing_return: error
    dead_code: warning
    # Infos que queremos como error:
    avoid_print: error
    unused_import: error

linter:
  rules:
    # Extras além do very_good_analysis:
    avoid_dynamic_calls: true
    cast_nullable_to_non_nullable: false # off — freezed gera isso
    prefer_const_constructors: true
    prefer_const_constructors_in_immutables: true
    use_super_parameters: true
    avoid_redundant_argument_values: false # off — legibilidade
    no_literal_bool_comparisons: true
    unawaited_futures: true # Futures não aguardados são bugs
    use_build_context_synchronously: true # BuildContext após await = bug
    discarded_futures: true
```

### Por que `very_good_analysis` e não `flutter_lints`?

`flutter_lints` é o mínimo. `very_good_analysis` é o que a VGV usa em produção — inclui ~80 regras extras que pegam bugs reais:

- `avoid_dynamic_calls` → sem `.toString()` em `dynamic`
- `unawaited_futures` → Future não aguardado = silentemente ignorado
- `use_build_context_synchronously` → BuildContext após await = crash

A trade-off: alguns `freezed`/`riverpod_generator` gerados precisam de `// ignore:` pontual. Vale o custo.

### Estratégia warn → error (para projetos legados)

Dart não tem "warn" nativo — toda regra é error ou ignorada. Para migração progressiva:

```yaml
# Primeiro: só warning (analyzer.errors)
analyzer:
  errors:
    use_build_context_synchronously: warning  # warning, não error

# Depois, quando tudo corrigido:
    use_build_context_synchronously: error
```

### custom_lint — quando analysis_options não basta

Para regras específicas do projeto (equivalente ao plugin inline do ESLint):

```yaml
dev_dependencies:
  custom_lint: ^0.7.0

# analysis_options.yaml
analyzer:
  plugins:
    - custom_lint
```

```dart
// lib/lints/no_hardcoded_color.dart
class NoHardcodedColor extends DartLintRule {
  @override
  void run(CustomLintResolver resolver, ErrorReporter reporter, ...) {
    // Detectar Color(0xFF...) fora de lib/shared/theme/
  }
}
```

Cria se repetir mais de 3 violações do mesmo padrão. Antes disso, um script de grep é suficiente.

---

## 20. Theming completo — ThemeData + ThemeExtension

### A diferença principal em relação ao ThemeData simples

`ThemeData` cobre `ColorScheme`, `TextTheme`, `ButtonTheme` etc. Para tokens que o Material não prevê (shape por tipo de componente, spacing semântico, elevação customizada), use `ThemeExtension<T>`.

### Cores — ColorScheme M3

```dart
// lib/shared/theme/app_colors.dart
@immutable
class AppColors extends ThemeExtension<AppColors> {
  final Color brandPrimary;
  final Color brandOnPrimary;
  final Color brandDim;      // primary com 12% opacidade — hover backgrounds
  final Color brandSubtle;   // primary com 6% opacidade — selected backgrounds

  const AppColors({
    required this.brandPrimary,
    required this.brandOnPrimary,
    required this.brandDim,
    required this.brandSubtle,
  });

  @override
  AppColors copyWith({Color? brandPrimary, Color? brandOnPrimary, Color? brandDim, Color? brandSubtle}) =>
    AppColors(
      brandPrimary: brandPrimary ?? this.brandPrimary,
      brandOnPrimary: brandOnPrimary ?? this.brandOnPrimary,
      brandDim: brandDim ?? this.brandDim,
      brandSubtle: brandSubtle ?? this.brandSubtle,
    );

  @override
  AppColors lerp(ThemeExtension<AppColors>? other, double t) {
    if (other is! AppColors) return this;
    return AppColors(
      brandPrimary: Color.lerp(brandPrimary, other.brandPrimary, t)!,
      brandOnPrimary: Color.lerp(brandOnPrimary, other.brandOnPrimary, t)!,
      brandDim: Color.lerp(brandDim, other.brandDim, t)!,
      brandSubtle: Color.lerp(brandSubtle, other.brandSubtle, t)!,
    );
  }
}
```

### Por que OKLCH no cálculo de tokens?

OKLCH é perceptualmente uniforme — mudar `L` por 10% sempre parece o mesmo salto visual. Use-o para derivar as variantes (`dim`, `subtle`, hover) programaticamente antes de converter para `Color`:

```dart
// lib/shared/theme/oklch.dart — só para cálculo de tokens, não em widgets
// oklch(62% 0.13 175) → Color(0xFF1D9E6C) (exemplo)
Color oklchToColor(double l, double c, double h) {
  // conversão OKLCH → linear sRGB → gamma sRGB
  // use o package 'color_models' ou implemente via cálculo matricial
}

// Derivar tokens de uma cor primária
AppColors tokensFromPrimary(Color primary) {
  final (l, c, h) = colorToOklch(primary);
  return AppColors(
    brandPrimary: primary,
    brandOnPrimary: l > 0.5 ? const Color(0xFF1A1A1A) : const Color(0xFFFFFFFF),
    brandDim: primary.withOpacity(0.12),
    brandSubtle: primary.withOpacity(0.06),
  );
}
```

Validar contraste via APCA:

- Lc ≥ 60 para UI body (botões, labels)
- Lc ≥ 75 para texto pequeno
- Package `apca_dart` (porta do `apca-w3`)

### Shapes — ThemeExtension

```dart
@immutable
class AppShapes extends ThemeExtension<AppShapes> {
  final BorderRadius card;
  final BorderRadius button;
  final BorderRadius input;
  final BorderRadius badge;

  const AppShapes._({
    required this.card,
    required this.button,
    required this.input,
    required this.badge,
  });

  // Variantes nomeadas — equivalente ao data-shape
  static const rounded = AppShapes._(
    card:   BorderRadius.all(Radius.circular(14)),
    button: BorderRadius.all(Radius.circular(10)),
    input:  BorderRadius.all(Radius.circular(10)),
    badge:  BorderRadius.all(Radius.circular(4)),
  );

  static const sharp = AppShapes._(
    card:   BorderRadius.all(Radius.circular(7)),
    button: BorderRadius.all(Radius.circular(5)),
    input:  BorderRadius.all(Radius.circular(5)),
    badge:  BorderRadius.all(Radius.circular(2)),
  );

  static const soft = AppShapes._(
    card:   BorderRadius.all(Radius.circular(22)),
    button: BorderRadius.all(Radius.circular(16)),
    input:  BorderRadius.all(Radius.circular(16)),
    badge:  BorderRadius.all(Radius.circular(8)),
  );

  @override
  AppShapes copyWith({...}) => AppShapes._(...);

  @override
  AppShapes lerp(ThemeExtension<AppShapes>? other, double t) {
    if (other is! AppShapes) return this;
    return AppShapes._(
      card:   BorderRadius.lerp(card,   other.card,   t)!,
      button: BorderRadius.lerp(button, other.button, t)!,
      input:  BorderRadius.lerp(input,  other.input,  t)!,
      badge:  BorderRadius.lerp(badge,  other.badge,  t)!,
    );
  }
}
```

```dart
// ❌ Hardcoded — não responde a AppShapes do tenant
Container(decoration: BoxDecoration(borderRadius: BorderRadius.circular(12)));

// ✅ Correto — usa token do theme
final shapes = Theme.of(context).extension<AppShapes>()!;
Container(decoration: BoxDecoration(borderRadius: shapes.card));
```

### Tipografia — TextTheme

```dart
// lib/shared/theme/app_typography.dart
TextTheme buildTextTheme() {
  return const TextTheme(
    displayLarge:  TextStyle(fontSize: 48, fontWeight: FontWeight.w800, height: 1.05, letterSpacing: -0.02 * 48),
    headlineMedium: TextStyle(fontSize: 28, fontWeight: FontWeight.w700, height: 1.15),
    bodyMedium:   TextStyle(fontSize: 14, fontWeight: FontWeight.w400, height: 1.55),
    labelSmall:   TextStyle(fontSize: 11, fontWeight: FontWeight.w500, letterSpacing: 0.04 * 11),
  );
}
```

```dart
// Uso em widget — nunca TextStyle inline
Text('Título', style: Theme.of(context).textTheme.headlineMedium),
```

### ThemeData completo

```dart
ThemeData buildTheme({required AppColors colors, AppShapes shapes = AppShapes.rounded}) {
  return ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: ColorScheme.dark(
      primary: colors.brandPrimary,
      onPrimary: colors.brandOnPrimary,
      surface: const Color(0xFF0F0F0F),
      onSurface: const Color(0xFFF0F0F0),
    ),
    textTheme: buildTextTheme(),
    extensions: [colors, shapes, AppSpacing.instance],
  );
}
```

---

## 21. Git hooks + dart format + commitlint

### Instalar

```bash
# commitlint (Node — funciona em repos Flutter)
npm init -y
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# git hooks manualmente (sem Husky — menos overhead em Flutter)
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
dart format --set-exit-if-changed .
dart analyze --fatal-infos
dart run scripts/check_colors.dart
EOF
chmod +x .git/hooks/pre-commit

cat > .git/hooks/commit-msg << 'EOF'
#!/bin/sh
npx --no-install commitlint --edit "$1"
EOF
chmod +x .git/hooks/commit-msg

cat > .git/hooks/pre-push << 'EOF'
#!/bin/sh
flutter test
dart analyze --fatal-infos --fatal-warnings
dart run scripts/check_rls.dart
dart run scripts/metrics_check.dart
EOF
chmod +x .git/hooks/pre-push
```

A separação pre-commit (rápido) vs pre-push (completo) é intencional: pre-commit lento desanima commits frequentes.

### Por que não lefthook ou husky?

`lefthook` (Go) funciona sem Node e é mais rápido que Husky. Use se o time não tiver Node. Para projetos Flutter puros que não querem dependência Node:

```yaml
# lefthook.yml
pre-commit:
  commands:
    format:
      run: dart format --set-exit-if-changed .
    analyze:
      run: dart analyze --fatal-infos

pre-push:
  commands:
    test:
      run: flutter test
    check-rls:
      run: dart run scripts/check_rls.dart
```

### commitlint.config.ts

```typescript
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'chore',
        'docs',
        'refactor',
        'test',
        'perf',
        'ci',
        'style',
        'revert',
        'build',
      ],
    ],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
  },
}
```

---

## 22. pub — por que e como configurar

### pubspec.yaml — versões e disciplina

```yaml
name: meu_app
description: SaaS de saúde para personal trainers
version: 1.0.0+1
publish_to: none # não é um package público

environment:
  sdk: '>=3.0.0 <4.0.0'
  flutter: '>=3.22.0'

dependencies:
  flutter:
    sdk: flutter

  # Fixar versão exata para dependências críticas de segurança
  supabase_flutter: 2.9.1 # sem ^
  flutter_secure_storage: 9.2.4

  # ^ aceitável para UI/utilities com bom histórico de semver
  go_router: ^14.0.0
  riverpod: ^2.0.0
  flutter_riverpod: ^2.0.0
  riverpod_annotation: ^2.0.0
  freezed_annotation: ^2.0.0
  json_annotation: ^4.0.0
  sentry_flutter: ^8.0.0
  intl: ^0.19.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  build_runner: ^2.0.0
  freezed: ^2.0.0
  json_serializable: ^6.0.0
  riverpod_generator: ^2.0.0
  go_router_builder: ^2.0.0
  very_good_analysis: ^7.0.0
  custom_lint: ^0.7.0
```

**Versões fixas para dependências de segurança** — `supabase_flutter`, `flutter_secure_storage`, `dio` (se usar). Sem `^`. Um patch release pode mudar comportamento de criptografia.

**`publish_to: none`** — evita acidente de `flutter pub publish` em app.

### flutter_pub_version_checker no CI

Uma linha que previne usar versão abandonada com CVE:

```yaml
# .github/workflows/ci.yml
- name: Check for outdated dependencies
  run: flutter pub outdated --no-color
```

Não falha o build por padrão — serve como informação. Configure falha apenas para vulnerabilidades conhecidas se usar Snyk/Dependabot.

---

## 23. Responsividade e mobile

### A abordagem Flutter

Flutter é mobile-first por natureza — o mesmo código roda em iOS e Android. A questão é quando precisa rodar também em tablet, web ou desktop.

```dart
// ❌ Assumir tamanho fixo
Container(width: 320, child: ...)

// ✅ LayoutBuilder responde ao espaço disponível
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth >= 1024) return const DesktopLayout();
    if (constraints.maxWidth >= 768)  return const TabletLayout();
    return const MobileLayout();
  },
)
```

### Breakpoints como constantes

```dart
// lib/shared/theme/breakpoints.dart
abstract final class Breakpoints {
  static const double sm = 640;
  static const double md = 768;
  static const double lg = 1024;
  static const double xl = 1280;
}

// Extension para conveniência
extension BreakpointExt on BoxConstraints {
  bool get isMobile  => maxWidth < Breakpoints.md;
  bool get isTablet  => maxWidth >= Breakpoints.md && maxWidth < Breakpoints.lg;
  bool get isDesktop => maxWidth >= Breakpoints.lg;
}
```

### Containers responsivos

```dart
// Container centralizado com max-width (equivalente ao max-w-7xl)
class ContentContainer extends StatelessWidget {
  final Widget child;
  final double maxWidth;

  const ContentContainer({required this.child, this.maxWidth = 1280});

  @override
  Widget build(BuildContext context) {
    return Align(
      child: ConstrainedBox(
        constraints: BoxConstraints(maxWidth: maxWidth),
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: MediaQuery.of(context).size.width >= Breakpoints.lg ? 32 : 16,
          ),
          child: child,
        ),
      ),
    );
  }
}
```

### Bottom sheet vs dialog

```dart
// Regra: mobile = bottom sheet, tablet/desktop = dialog
Future<T?> showAdaptiveModal<T>({
  required BuildContext context,
  required Widget child,
}) {
  final width = MediaQuery.of(context).size.width;
  if (width < Breakpoints.md) {
    return showModalBottomSheet<T>(
      context: context,
      isScrollControlled: true,
      builder: (_) => child,
    );
  }
  return showDialog<T>(
    context: context,
    builder: (_) => Dialog(child: child),
  );
}
```

### Tipografia adaptiva

```dart
// Dois tamanhos fixos mobile/desktop são mais previsíveis que clamp
Text(
  'Título',
  style: constraints.maxWidth >= Breakpoints.md
    ? Theme.of(context).textTheme.displayLarge
    : Theme.of(context).textTheme.headlineMedium,
),
```

---

## 24. Sistema de shapes, paletas e superfícies

### O problema que esse sistema resolve

Quando um profissional escolhe a cor da marca e o estilo da sua página, todos os componentes precisam refletir essa escolha sem que cada widget saiba qual paleta está ativa. A solução Flutter: `ThemeExtension` injetada via `ProviderScope` e propagada via `Theme.of(context)`.

### Como aplicar por tenant

```dart
// Riverpod provider que constrói o theme do tenant atual
final tenantThemeProvider = FutureProvider<ThemeData>((ref) async {
  final tenant = await ref.watch(currentTenantProvider.future);
  if (tenant == null) return buildTheme(); // defaults internos

  final palette = tenant.palette;          // "lime" | "ocean" | "coral"
  final shapeStyle = tenant.shapeStyle;   // "rounded" | "sharp" | "soft"

  final colors = tokensFromPrimary(paletteMap[palette]!);
  final shapes = shapeVariantMap[shapeStyle]!;

  return buildTheme(colors: colors, shapes: shapes);
});

// Em App.dart
class App extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(tenantThemeProvider);
    return MaterialApp.router(
      theme: theme.valueOrNull ?? internalTheme,  // surface interna
      routerConfig: ref.watch(routerProvider),
    );
  }
}
```

### Surface interna vs pública

```dart
// Superfície interna do dashboard — brand fixo
// Não usa tenantThemeProvider — usa o tema padrão da plataforma
class DashboardShell extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Theme(
      data: internalTheme,  // brand fixo, ignora paleta do tenant
      child: child,
    );
  }
}

// Superfície pública do profissional — usa tema do tenant
class PublicProfileShell extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final theme = ref.watch(tenantThemeProvider);
    return theme.when(
      data: (t) => Theme(data: t, child: child),
      loading: () => const SplashScreen(),
      error: (_, __) => Theme(data: fallbackPublicTheme, child: child),
    );
  }
}
```

### Como usar nos widgets

```dart
// ❌ Hardcoded
Container(
  decoration: BoxDecoration(
    borderRadius: BorderRadius.circular(12),  // ignora shape do tenant
    color: const Color(0xFF4CAF50),           // ignora paleta do tenant
  ),
)

// ✅ Via theme
final shapes = Theme.of(context).extension<AppShapes>()!;
final colors = Theme.of(context).extension<AppColors>()!;
Container(
  decoration: BoxDecoration(
    borderRadius: shapes.card,
    color: colors.brandDim,
  ),
)
```

---

## 25. Padrões de UI de app — do zero

### Z-index / Elevation hierarchy

Flutter usa `elevation` em vez de z-index. Defina como constantes:

```dart
// lib/shared/theme/app_elevation.dart
abstract final class AppElevation {
  static const double base     = 0;
  static const double raised   = 1;
  static const double card     = 2;
  static const double dropdown = 4;
  static const double overlay  = 8;     // scrim
  static const double modal    = 12;    // dialog, bottom sheet
  static const double popover  = 16;    // tooltip, menu
  static const double toast    = 24;    // topo de tudo
}
```

### Bottom navigation

```dart
// NavigationBar (Material 3) — usa safe area automaticamente
Scaffold(
  body: child,
  bottomNavigationBar: NavigationBar(
    destinations: const [
      NavigationDestination(icon: Icon(Icons.home), label: 'Início'),
      NavigationDestination(icon: Icon(Icons.people), label: 'Clientes'),
      NavigationDestination(icon: Icon(Icons.analytics), label: 'Relatórios'),
    ],
    selectedIndex: selectedIndex,
    onDestinationSelected: onDestinationSelected,
  ),
)

// Desktop/tablet — substituir por NavigationRail ou Drawer
LayoutBuilder(builder: (context, constraints) {
  if (constraints.maxWidth >= Breakpoints.lg) {
    return Row(children: [const AppNavigationRail(), Expanded(child: child)]);
  }
  return Scaffold(body: child, bottomNavigationBar: const AppBottomNav());
})
```

### Touch targets — mínimo 48×48dp

Material guideline é 48dp (não 44px do iOS). Flutter já garante isso para botões Material. Para custom widgets:

```dart
// ❌ ícone solto de 24dp — impossível de tocar
GestureDetector(
  onTap: onTap,
  child: const Icon(Icons.close, size: 24),
)

// ✅ área de toque garantida
InkWell(
  onTap: onTap,
  customBorder: const CircleBorder(),
  child: Padding(
    padding: const EdgeInsets.all(12), // 24 + 12*2 = 48dp
    child: const Icon(Icons.close, size: 24),
  ),
)

// Ou com o widget do Material 3:
IconButton(
  onPressed: onTap,
  icon: const Icon(Icons.close),
  // IconButton já garante 48dp por padrão com useMaterial3: true
)
```

### 7 estados interativos obrigatórios

```
1. default      → estado normal
2. hovered      → cursor sobre o elemento (tablet/desktop com mouse)
3. focused      → navegação por teclado/switch — FocusNode visible
4. pressed      → sendo clicado — ink splash
5. disabled     → opacity 0.38 + não responde a interação
6. loading      → CircularProgressIndicator + IgnorePointer
7. selected     → visual diferenciado de default
```

Material 3 cobre 1-5 automaticamente para `ElevatedButton`, `FilledButton`, `OutlinedButton`. `loading` e `selected` são responsabilidade do produto.

```dart
// Estado loading em botão
FilledButton(
  onPressed: isLoading ? null : onSubmit,  // null = disabled automaticamente
  child: isLoading
    ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
    : Text(AppLocalizations.of(context).submit),
)
```

### Skeleton loading

Não mostrar `CircularProgressIndicator` genérico para conteúdo com formato conhecido:

```dart
// ❌ spinner genérico
if (isLoading) return const Center(child: CircularProgressIndicator());

// ✅ skeleton que antecipa o formato
if (isLoading) return const ProductCardSkeleton();

// ProductCardSkeleton usa shimmer:
class ProductCardSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey.shade800,
      highlightColor: Colors.grey.shade700,
      child: Column(children: [
        Container(height: 16, width: 180, color: Colors.white),
        const SizedBox(height: 8),
        Container(height: 14, color: Colors.white),
        Container(height: 14, width: 120, color: Colors.white),
      ]),
    );
  }
}
```

### Empty states

```dart
// Todo ListView/GridView tem dois estados vazios
if (items.isEmpty) {
  return isFiltered
    ? EmptyState(
        icon: Icons.search_off,
        title: AppLocalizations.of(context).noResults,
        action: TextButton(onPressed: clearFilters, child: Text(AppLocalizations.of(context).clearFilters)),
      )
    : EmptyState(
        icon: Icons.people_outline,
        title: AppLocalizations.of(context).noClients,
        action: FilledButton(onPressed: goToAddClient, child: Text(AppLocalizations.of(context).addClient)),
      );
}
```

### Reduced motion

```dart
// Todo AnimationController deve respeitar disableAnimations
bool get _reduced => MediaQuery.of(context).disableAnimations;

AnimatedContainer(
  duration: _reduced ? Duration.zero : const Duration(milliseconds: 250),
  curve: _reduced ? Curves.linear : Curves.easeOut,
  child: child,
)

// Animations implícitas da Motion/Lottie: pular se reduced
if (!_reduced) LottieBuilder.asset('assets/success.json');
```

---

## 26. Dart — configurações que valem o custo

Dart tem sound null safety por padrão a partir do Flutter 3 — você já ganha o equivalente ao `"strict": true` do TypeScript automaticamente. O que adiciona além disso:

### analysis_options.yaml extras

```yaml
analyzer:
  language:
    strict-casts: true # sem implicit cast de Object para tipo específico
    strict-inference: true # sem tipo inferido como dynamic
    strict-raw-types: true # sem List sem tipo genérico

  errors:
    unnecessary_null_comparison: warning # comparação com null de tipo não-nullable
    unused_local_variable: error
    unused_element: warning
    unnecessary_import: error
```

### O que cada um previne

**`strict-casts`** — `final String s = someObject as String` sem verificação → `ClassCastException` em runtime. Com a opção, você precisa verificar antes:

```dart
if (someObject is String) final s = someObject; // safe
```

**`strict-inference`** — impede que tipos sejam inferidos como `dynamic` silenciosamente:

```dart
// Sem strict-inference: items infera como List<dynamic>
final items = [];  // ← bug silencioso

// Com strict-inference: erro em compile time → força explicitação
final items = <Product>[];
```

**`unawaited_futures` (linter)** — a regra mais importante do Flutter:

```dart
// ❌ Future não aguardado — erro silencioso
someAsyncOperation();

// ✅ aguardado
await someAsyncOperation();

// ✅ ou explicitamente ignorado
unawaited(someAsyncOperation());
```

**`use_build_context_synchronously`** — previne o crash mais comum em Flutter:

```dart
// ❌ BuildContext usado após await sem verificar mounted
Future<void> onSave() async {
  await repository.save(data);
  ScaffoldMessenger.of(context).showSnackBar(...);  // context pode estar inválido
}

// ✅
Future<void> onSave() async {
  await repository.save(data);
  if (!mounted) return;
  ScaffoldMessenger.of(context).showSnackBar(...);
}
```

---

## 27. Multi-tenant — patterns SQL essenciais

Idêntico ao GUIA Next.js — esta seção não muda. O banco Supabase é o mesmo, RLS é o mesmo, helpers SQL são os mesmos.

### Estrutura base de tabelas

```sql
CREATE TABLE public.products (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name       text NOT NULL,
  price_cents bigint NOT NULL CHECK (price_cents >= 0),
  currency   text NOT NULL DEFAULT 'BRL',
  deleted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX products_tenant_idx ON public.products (tenant_id) WHERE deleted_at IS NULL;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
```

### Helpers SQL reutilizáveis

```sql
CREATE OR REPLACE FUNCTION public.active_tenant_id()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(
    coalesce(current_setting('request.jwt.claims', true)::jsonb ->> 'active_tenant_id', ''),
    ''
  )::uuid;
$$;
```

### RLS policies

```sql
CREATE POLICY products_select ON public.products
  FOR SELECT USING (tenant_id = public.active_tenant_id() AND deleted_at IS NULL);

CREATE POLICY products_mutate ON public.products
  FOR ALL USING (tenant_id = public.active_tenant_id())
  WITH CHECK (tenant_id = public.active_tenant_id());
```

### JWT hook, RPC transacional, scripts check-rls

Ver §27 do GUIA Next.js — byte-a-byte idênticos.

### Tenant resolver (Flutter-side)

No Flutter, não há SSR. O tenant ativo vem do JWT + perfil do usuário:

```dart
// lib/features/auth/data/tenant_repository.dart
class TenantRepository {
  final SupabaseClient _client;

  Future<Tenant?> getCurrentTenant() async {
    final userId = _client.auth.currentUser?.id;
    if (userId == null) return null;

    // JWT hook já injetou active_tenant_id — buscar do perfil
    final data = await _client
      .from('tenants')
      .select('id, slug, features, palette, shape_style, tenant_themes(tokens)')
      .eq('id', _client.auth.currentUser!.userMetadata?['active_tenant_id'])
      .maybeSingle();

    return data != null ? Tenant.fromJson(data) : null;
  }
}
```

---

## 28. Banco — padrões que completam o básico

Idêntico ao GUIA Next.js. Resumo:

- **Dinheiro em bigint** — centavos, nunca float
- **Full-text search** via `tsvector generated always` — evita Typesense/Algolia no MVP
- **Audit log** — crie uma vez, ative por tabela
- **Breaking change = 2 deploys** — nunca remove coluna no mesmo deploy que parou de usá-la

No Dart, dinheiro:

```dart
// Armazena e trafega em centavos (int)
final priceCents = product.priceCents; // 29990

// Exibe formatado
final formatted = NumberFormat.currency(locale: 'pt_BR', symbol: 'R\$')
    .format(priceCents / 100); // "R$ 299,90"
```

---

## 29. Feature flags e auditoria de código

### Feature flags via tenant.features

```dart
// ✅ feature flag — desativa por tenant sem deploy
if (tenant.features['advanced_reports'] == true) {
  // mostra relatórios avançados
}

// ❌ hardcode — vaza lógica de cliente para o produto
if (tenant.id == 'cliente-especial') { /* nunca */ }
```

```dart
// Entitlements por plano
const planFeatures = {
  'free':       {'advanced_reports': false, 'custom_domain': false},
  'pro':        {'advanced_reports': true,  'custom_domain': false},
  'enterprise': {'advanced_reports': true,  'custom_domain': true},
};

bool hasFeature(Tenant tenant, String flag) {
  return (tenant.features[flag] as bool?)          // override manual
      ?? (planFeatures[tenant.plan]?[flag] as bool?)  // por plano
      ?? false;
}
```

### scripts/check_colors.dart — cor literal fora do theme

```dart
// scripts/check_colors.dart
import 'dart:io';

void main() async {
  final patterns = [
    RegExp(r'Color\(0x[Ff]{2}[0-9a-fA-F]{6}\)'),   // Color(0xFF...)
    RegExp(r'Color\.fromARGB\('),
    RegExp(r'Color\.fromRGBO\('),
    RegExp(r'#[0-9a-fA-F]{6}\b'),                    // hex em strings/comments
  ];

  final allowed = ['lib/shared/theme/', 'scripts/'];

  var violations = 0;
  final files = await _dartFiles(Directory('lib'));

  for (final file in files) {
    if (allowed.any((a) => file.path.contains(a))) continue;
    final content = await file.readAsString();
    final lines = content.split('\n');
    for (var i = 0; i < lines.length; i++) {
      for (final pat in patterns) {
        if (pat.hasMatch(lines[i])) {
          print('❌ ${file.path}:${i + 1}: ${lines[i].trim()}');
          violations++;
        }
      }
    }
  }

  if (violations > 0) {
    print('\n$violations cor(es) literal(is) fora de lib/shared/theme/');
    exit(1);
  }
  print('✅ Nenhuma cor literal fora de theme/');
}

Future<List<File>> _dartFiles(Directory dir) async {
  final files = <File>[];
  await for (final entity in dir.list(recursive: true)) {
    if (entity is File && entity.path.endsWith('.dart')) files.add(entity);
  }
  return files;
}
```

### gitleaks — segredos no git

```yaml
# .github/workflows/ci.yml
- name: Secret scan (gitleaks)
  uses: gitleaks/gitleaks-action@v2
  with:
    config-path: .gitleaks.toml
```

Uma linha no CI. Custa nada, evita o clássico "commitei minha chave da API às 2h".

### OKLCH — checklist por componente

Antes de mergear qualquer widget novo:

```
[ ] Nenhuma cor literal em Color(0xFF...) ou Color.fromARGB
[ ] Todo borderRadius via Theme.of(context).extension<AppShapes>()!
[ ] Todo TextStyle via Theme.of(context).textTheme.X
[ ] Toda cor via Theme.of(context).colorScheme.X ou extension<AppColors>()!
[ ] Funciona em light e dark (alternar Brightness no test)
[ ] Foco visível em teclado (FocusNode com decoration de outline)
[ ] Touch target ≥ 48dp
[ ] Semantics em elementos não-Material
[ ] disableAnimations respeitado
```

---

## 30. Otimização de tokens — sem perder qualidade

Idêntico ao GUIA Next.js — esta seção não muda por plataforma. Claude Code é o mesmo, CLAUDE.md é o mesmo, os princípios são os mesmos.

### O que o Claude Code carrega e quando

```
Startup (toda sessão):
  CLAUDE.md raiz + ~/.claude/CLAUDE.md     → completo, sempre
  .claude/rules/ sem paths:                → completo, sempre
  MEMORY.md                                → primeiras 200 linhas / 25KB

On-demand (só quando relevante):
  .claude/rules/ com paths: "lib/data/**" → só ao abrir arquivo matching
  Skills                                   → só quando invocadas
  MCP tool definitions                     → deferred, só ao usar a ferramenta
  CLAUDE.md em subdiretórios              → só ao abrir arquivo naquele dir
```

### O que sobrevive a compactação

1. Remove primeiro: outputs de ferramentas antigos (logs de flutter test, grep, bash)
2. Depois resume: histórico da conversa
3. Nunca remove: requests recentes, CLAUDE.md (re-lido do disco e re-injetado)

Instruções dadas apenas em conversa somem após compactação. Se precisou dizer a mesma coisa duas vezes em sessões diferentes, vai para o CLAUDE.md.

### Subagents — isolamento de contexto

Cada subagent roda em janela de contexto separada e independente. Use para:

- Exploração de codebase (grep + leitura de muitos arquivos)
- Rodar testes e extrair só as falhas
- Revisão de PR em paralelo
- Qualquer tarefa que gera output que você não vai precisar depois

### Estratégias práticas de economia

**`/clear` entre tarefas não relacionadas.** Contexto limpo é mais barato e mais preciso.

**`/compact` manual com instrução:**

```
/compact foque nas mudanças de widget e nos erros de flutter test
```

**Modelos certos para cada tarefa:**

- Implementação complexa, decisão arquitetural → Sonnet/Opus
- Subagents de exploração (read-only, grep) → Haiku
- Agents em paralelo → Sonnet

**Skills em vez de instruções no chat.** Instrução colada toda hora consome tokens toda hora.

**`.claude/rules/` com `paths:` específicos:**

```yaml
# .claude/rules/rls.md
paths:
  - 'supabase/migrations/**'
  - 'scripts/check_rls*'
```

Regras de RLS só carregam ao abrir migration. Regras de widgets só ao abrir `.dart`. O contexto de cada sessão só tem o que é relevante.

**Prompts específicos poupam leituras:**

```
❌ "melhore este codebase"
✅ "adicione validação de CPF no domain validator lib/features/clients/domain/cpf_validator.dart"
```

### O que não economizar

Re-ler o arquivo que vai modificar antes de modificar: **não economize isso**. Um read de 200 tokens antes de um edit evita um bug que custa uma sessão inteira de debugging para achar.
