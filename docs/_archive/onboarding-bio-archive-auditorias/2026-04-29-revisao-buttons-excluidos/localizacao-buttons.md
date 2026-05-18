# Localizacao de todos os buttons auditados

## Raw `<button>` (5 — nos ignores do eslint)

| #   | Arquivo                                                      | Linha | Contexto                                          |
| --- | ------------------------------------------------------------ | ----- | ------------------------------------------------- |
| 1   | `app/global-error.tsx`                                       | 66    | Botao "Tentar novamente" no error boundary global |
| 2   | `app/(app)/onboarding/_steps/_simulation/SimulationTabs.tsx` | 58    | Tab trigger em nav pill                           |
| 3   | `app/(app)/onboarding/_steps/ProfilePhoto.tsx`               | 70    | Upload area (aspect 3:4)                          |
| 4   | `app/(app)/onboarding/_steps/BackgroundPhoto.tsx`            | 70    | Upload area (aspect 16:9)                         |
| 5   | `app/(app)/onboarding/_steps/Checkout.tsx`                   | 164   | Radio card (payment method)                       |

## `motion.button` (17 arquivos, ~20 usages)

| #   | Arquivo                                                          | Linha(s)      | Contexto                                              |
| --- | ---------------------------------------------------------------- | ------------- | ----------------------------------------------------- |
| 6   | `components/motion/MagneticButton.tsx`                           | 76            | Motion primitive — magnetic follow cursor             |
| 7   | `components/motion/SpotlightCard.tsx`                            | 61            | Motion primitive — dynamic tag (button/div)           |
| 8   | `components/form/lead/_steps/primitives.tsx`                     | 110, 255, 308 | OptionList, BigCard, PillGroup — selection interfaces |
| 9   | `components/form/audit/_blocks/MultiSelect.tsx`                  | 30            | Multi-select chips                                    |
| 10  | `components/form/audit/DiagnosticIntro.tsx`                      | 78            | CTA "comecar" com brand theming                       |
| 11  | `app/(app)/onboarding/_steps/Audience.tsx`                       | 91            | Selection cards                                       |
| 12  | `app/(app)/onboarding/_steps/Focus.tsx`                          | 268           | Selection cards                                       |
| 13  | `app/(app)/onboarding/_steps/Modality.tsx`                       | 88            | Selection cards                                       |
| 14  | `app/(app)/onboarding/_steps/Nutrition.tsx`                      | 69            | Selection cards                                       |
| 15  | `app/(app)/onboarding/_steps/Personality.tsx`                    | 90            | Selection cards                                       |
| 16  | `app/(app)/onboarding/_steps/ServiceMode.tsx`                    | 80            | Selection cards                                       |
| 17  | `app/(app)/onboarding/_steps/PricingBridge.tsx`                  | 127           | CTA com brand theming                                 |
| 18  | `app/(app)/onboarding/_steps/TransitionChoice.tsx`               | 93            | Skip link secundario                                  |
| 19  | `components/subscription/_checkout/PlanSelector.tsx`             | 48            | Plan selection cards                                  |
| 20  | `components/diagnostic-activation/_sections/TemplateSection.tsx` | 176           | Template selection grid                               |
| 21  | `components/landing/premium/primitives/QuickLeadForm.tsx`        | 101           | CTA submit com brand theming                          |
| 22  | `components/funnel/preview/PreviewFAB.tsx`                       | 17            | FAB com entry animation                               |
