# Headings diretos com contexto

```
app/(app)/(shell)/clients/new/page.tsx:24:        <h1 className="bc text-3xl md:text-4xl">{t('clientNew.title')}</h1>
app/(app)/(shell)/clients/page.tsx:86:            <h1 className="bc text-3xl md:text-4xl">{t('clients.title')}</h1>
app/(app)/(shell)/clients/[id]/page.tsx:82:        <h1 className="bc text-3xl md:text-4xl leading-tight">{clientRow.name}</h1>
app/(app)/(shell)/clients/_components/ClientDetailPanel.tsx:101:          <h2 className="bc text-xl leading-tight truncate">{client.name}</h2>
app/(app)/(shell)/dashboard/page.tsx:62:          <h1 className="bc text-3xl md:text-4xl leading-tight">
app/(app)/(shell)/dashboard/page.tsx:210:          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/(app)/(shell)/error.tsx:26:        <h1 className="bc text-3xl md:text-4xl">{t('shellTitle')}</h1>
app/(app)/(shell)/leads/new/page.tsx:18:        <h1 className="bc text-3xl md:text-4xl">{t('leads.newTitle')}</h1>
app/(app)/(shell)/leads/page.tsx:69:          <h1 className="bc text-3xl md:text-4xl">{t('leads.title')}</h1>
app/(app)/(shell)/leads/[id]/page.tsx:60:          <h1 className="bc text-3xl md:text-4xl leading-tight">{lead.name}</h1>
app/(app)/(shell)/leads/[id]/page.tsx:155:          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/(app)/(shell)/leads/_components/LeadDetailPanel.tsx:92:          <h2 className="bc text-xl leading-tight truncate">{lead.name}</h2>
app/(app)/(shell)/settings/contact/page.tsx:15:        <h1 className="bc text-3xl md:text-4xl">{t('title')}</h1>
app/(app)/(shell)/settings/design/page.tsx:15:        <h1 className="bc text-3xl md:text-4xl">{t('title')}</h1>
app/(app)/(shell)/settings/media/page.tsx:16:        <h1 className="bc text-3xl md:text-4xl">{t('title')}</h1>
app/(app)/(shell)/settings/media/page.tsx:23:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/(app)/(shell)/settings/media/page.tsx:34:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/(app)/(shell)/settings/notifications/history/page.tsx:83:        <h1 className="bc text-3xl md:text-4xl">{t('title')}</h1>
app/(app)/(shell)/settings/notifications/page.tsx:39:          <h1 className="bc text-3xl md:text-4xl">{t('title')}</h1>
app/(app)/(shell)/settings/profile/page.tsx:31:        <h1 className="bc text-3xl md:text-4xl">{t('title')}</h1>
app/(app)/(shell)/site/page.tsx:35:          <h1 className="bc text-3xl md:text-4xl">{t('title')}</h1>
app/(app)/(shell)/site/page.tsx:43:          <h2 className="bc text-2xl md:text-3xl leading-tight">
app/(app)/(shell)/subscription/page.tsx:51:        <h1 className="bc text-3xl md:text-4xl leading-tight">{t('title')}</h1>
app/(app)/(shell)/subscription/page.tsx:99:          <h2 className="bc text-lg md:text-xl">
app/(app)/(shell)/subscription/page.tsx:111:          <h2 className="bc text-lg md:text-xl">{t('cancelTitle')}</h2>
app/(app)/(shell)/template/active/page.tsx:96:              <h2 className="text-xs uppercase tracking-display text-muted-foreground font-medium">
app/(app)/(shell)/template/active/page.tsx:118:      <h1 className="md:hidden text-xl font-semibold">{activeLabel}</h1>
app/(app)/(shell)/template/active/page.tsx:122:        <h1 className="text-lg font-semibold">{activeLabel}</h1>
app/(app)/(shell)/template/page.tsx:29:          <h1 className="bc text-3xl">{t('heading')}</h1>
app/(app)/(shell)/template/[modality]/page.tsx:91:            <h1 className="text-xl font-semibold">{modalityLabel}</h1>
app/(app)/(shell)/template/[modality]/page.tsx:108:          <h1 className="text-lg font-semibold">{modalityLabel}</h1>
app/(app)/onboarding/_steps/Celebration.tsx:91:          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center">
app/(app)/onboarding/_steps/Checkout.tsx:125:          <h2 className="text-sm font-semibold text-foreground tracking-tight">
app/(app)/onboarding/_steps/Pricing.tsx:74:              <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight">
app/(app)/onboarding/_steps/ProfilePreview.tsx:120:                  <h3 className="bc uppercase text-sm md:text-base tracking-tight text-foreground mt-0.5 leading-tight">
app/(app)/onboarding/_steps/TransitionChoice.tsx:41:          <h2 className="bc text-3xl sm:text-4xl md:text-5xl text-foreground">
app/(app)/onboarding/_steps/_simulation/ProximoPasso.tsx:31:        <h3 className="mt-2 text-lg font-semibold text-foreground">
app/(influencer)/influencer/commissions/page.tsx:69:        <h1 className="bc uppercase text-3xl md:text-4xl">{t('title')}</h1>
app/(influencer)/influencer/dashboard/page.tsx:62:        <h1 className="bc uppercase text-3xl md:text-4xl">
app/(influencer)/influencer/onboarding/page.tsx:30:        <h1 className="bc uppercase text-3xl md:text-4xl">{t('title')}</h1>
app/(influencer)/influencer/payouts/page.tsx:64:        <h1 className="bc uppercase text-2xl md:text-3xl lg:text-4xl">{t('title')}</h1>
app/(influencer)/influencer/payouts/page.tsx:98:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/(influencer)/influencer/referrals/page.tsx:39:        <h1 className="bc uppercase text-3xl md:text-4xl">{t('title')}</h1>
app/(public)/about/page.tsx:60:            <h2 className="bc uppercase text-3xl md:text-4xl lg:text-5xl leading-display-loose">
app/(public)/about/page.tsx:96:          <h2 className="bc uppercase text-3xl md:text-4xl lg:text-5xl leading-display-loose mb-6">
app/(public)/about/page.tsx:143:      <h2 className="sr-only">{principleLabel}</h2>
app/(public)/about/page.tsx:148:        <h3 className="bc uppercase text-lg md:text-xl lg:text-2xl mb-2 leading-tight">{title}</h3>
app/(public)/changelog/page.tsx:28:          <h1 className="bc uppercase text-5xl md:text-7xl leading-display mb-5">
app/(public)/changelog/page.tsx:43:                  <h2 className="bc uppercase text-3xl md:text-4xl">v{entry.version}</h2>
app/(public)/cookies/page.tsx:27:      <h2>{t('whatTitle')}</h2>
app/(public)/cookies/page.tsx:30:      <h2>{t('categoriesTitle')}</h2>
app/(public)/cookies/page.tsx:31:      <h3>{t('necessarySub')}</h3>
app/(public)/cookies/page.tsx:39:      <h3>{t('analyticsSub')}</h3>
app/(public)/cookies/page.tsx:45:      <h3>{t('marketingSub')}</h3>
app/(public)/cookies/page.tsx:52:      <h2>{t('controlTitle')}</h2>
app/(public)/cookies/page.tsx:62:      <h2>{t('updatesTitle')}</h2>
app/(public)/cookies/page.tsx:65:      <h2>{t('contactTitle')}</h2>
app/(public)/error.tsx:31:      <h1 className="bc uppercase text-4xl md:text-5xl leading-display-loose max-w-lg">
app/(public)/help/page.tsx:66:          <h1 className="bc uppercase text-4xl md:text-7xl leading-display mb-5">
app/(public)/help/page.tsx:79:              <h2 className="bc uppercase text-2xl md:text-3xl mb-5 md:mb-6">
app/(public)/help/page.tsx:85:                    <h3 className="text-base md:text-lg font-medium mb-1.5">{q}</h3>
app/(public)/help/page.tsx:98:          <h2 className="bc uppercase text-3xl md:text-4xl leading-display-loose">
app/(public)/influencer/signup/page.tsx:32:          <h1 className="bc uppercase text-3xl md:text-4xl">
app/(public)/lgpd/page.tsx:29:      <h2>{t('relatedDocsTitle')}</h2>
app/(public)/lgpd/page.tsx:42:      <h2>{t('dpoTitle')}</h2>
app/(public)/lgpd/page.tsx:51:      <h2>{t('rightsTitle')}</h2>
app/(public)/lgpd/page.tsx:63:      <h2>{t('exerciseTitle')}</h2>
app/(public)/lgpd/request/page.tsx:13:        <h1 className="bc uppercase text-3xl md:text-4xl leading-tight">{t('title')}</h1>
app/(public)/mockups/charts/page.tsx:47:        <h1 className="text-2xl font-semibold">{t('mockupsCharts.headerTitle')}</h1>
app/(public)/mockups/charts/page.tsx:263:        <h2 className="text-lg font-semibold">{title}</h2>
app/(public)/mockups/dashboard/page.tsx:29:            <h1 className="bc uppercase text-3xl md:text-4xl leading-tight">
app/(public)/mockups/dashboard/page.tsx:94:              <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/(public)/plans/setup/page.tsx:245:            <h2 className="font-[family-name:var(--font-geist)] text-xl md:text-2xl font-semibold mb-8" style={{ color: 'var(--brand-text)' }}>
app/(public)/plans/setup/page.tsx:254:                  <h4 className="font-[family-name:var(--font-geist)] text-base md:text-sm font-semibold mb-2" style={{ color: 'var(--brand-text)' }}>
app/(public)/plans/setup/page.tsx:267:              <h3 className="font-[family-name:var(--font-geist)] text-xl md:text-2xl font-semibold mb-3" style={{ color: 'var(--brand-text)' }}>
app/(public)/privacy/page.tsx:28:      <h2>{t('controllerTitle')}</h2>
app/(public)/privacy/page.tsx:32:      <h2>{t('dataCollectionTitle')}</h2>
app/(public)/privacy/page.tsx:33:      <h3>{t('dataClientSubtitle')}</h3>
app/(public)/privacy/page.tsx:42:      <h3>{t('dataProfessionalSubtitle')}</h3>
app/(public)/privacy/page.tsx:50:      <h2>{t('purposeTitle')}</h2>
app/(public)/privacy/page.tsx:56:      <h2>{t('legalBasisTitle')}</h2>
app/(public)/privacy/page.tsx:64:      <h2>{t('sharingTitle')}</h2>
app/(public)/privacy/page.tsx:68:      <h2>{t('retentionTitle')}</h2>
app/(public)/privacy/page.tsx:75:      <h2>{t('rightsTitle')}</h2>
app/(public)/privacy/page.tsx:89:      <h2>{t('dpoTitle')}</h2>
app/(public)/privacy/page.tsx:92:      <h2>{t('securityTitle')}</h2>
app/(public)/privacy/page.tsx:95:      <h2>{t('minorsTitle')}</h2>
app/(public)/privacy/page.tsx:98:      <h2>{t('changesTitle')}</h2>
app/(public)/privacy/page.tsx:101:      <h2>{t('contactTitle')}</h2>
app/(public)/terms/page.tsx:26:      <h2>{t('s1Title')}</h2>
app/(public)/terms/page.tsx:29:      <h2>{t('s2Title')}</h2>
app/(public)/terms/page.tsx:32:      <h2>{t('s3Title')}</h2>
app/(public)/terms/page.tsx:39:      <h2>{t('s4Title')}</h2>
app/(public)/terms/page.tsx:40:      <h3>{t('s4Sub1')}</h3>
app/(public)/terms/page.tsx:45:      <h3>{t('s4Sub2')}</h3>
app/(public)/terms/page.tsx:50:      <h3>{t('s4Sub3')}</h3>
app/(public)/terms/page.tsx:55:      <h2>{t('s5Title')}</h2>
app/(public)/terms/page.tsx:56:      <h3>{t('s5Sub1')}</h3>
app/(public)/terms/page.tsx:61:      <h3>{t('s5Sub2')}</h3>
app/(public)/terms/page.tsx:67:      <h2>{t('s6Title', v)}</h2>
app/(public)/terms/page.tsx:74:      <h2>{t('s7Title')}</h2>
app/(public)/terms/page.tsx:78:      <h2>{t('s8Title')}</h2>
app/(public)/terms/page.tsx:81:      <h2>{t('s9Title')}</h2>
app/(public)/terms/page.tsx:84:      <h2>{t('s10Title')}</h2>
app/(public)/terms/page.tsx:87:      <h2>{t('s11Title')}</h2>
app/(public)/terms/page.tsx:90:      <h2>{t('s12Title')}</h2>
app/(public)/[slug]/analise/page.tsx:40:          <h1 className="text-2xl font-semibold text-foreground leading-snug">
app/admin/broadcast/page.tsx:11:        <h1 className="bc uppercase text-3xl md:text-4xl">{t('title')}</h1>
app/admin/dsr/page.tsx:31:        <h1 className="bc uppercase text-3xl md:text-4xl">{t('title')}</h1>
app/admin/dsr/page.tsx:38:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/admin/dsr/page.tsx:69:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/admin/dsr/[id]/page.tsx:43:        <h1 className="bc uppercase text-2xl md:text-3xl lg:text-4xl">
app/admin/dsr/[id]/page.tsx:66:          <h2 className="text-xs uppercase tracking-widest text-amber-500">{t('actionsTitle')}</h2>
app/admin/error.tsx:28:            <h1 className="bc uppercase text-2xl">{t('title')}</h1>
app/admin/page.tsx:56:        <h1 className="bc uppercase text-3xl md:text-4xl">{t('title')}</h1>
app/admin/page.tsx:79:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">{t('howToAdmin')}</h2>
app/admin/payouts/page.tsx:49:        <h1 className="bc uppercase text-2xl md:text-3xl lg:text-4xl">{t('title')}</h1>
app/admin/payouts/page.tsx:56:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/admin/payouts/page.tsx:74:          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/admin/professionals/page.tsx:42:        <h1 className="bc uppercase text-2xl sm:text-3xl md:text-4xl">{t('title')}</h1>
app/admin/professionals/[id]/page.tsx:41:          <h1 className="bc uppercase text-2xl md:text-3xl">{prof.full_name}</h1>
app/admin/professionals/[id]/page.tsx:66:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/admin/professionals/[id]/page.tsx:76:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/admin/professionals/[id]/page.tsx:101:        <h2 className="text-xs uppercase tracking-widest text-amber-500">{t('actionsTitle')}</h2>
app/admin/revenue/page.tsx:37:        <h1 className="bc uppercase text-2xl md:text-4xl">{t('title')}</h1>
app/demo/dashboard/page.tsx:51:            <h1 className="bc uppercase text-3xl md:text-4xl leading-tight">
app/demo/dashboard/page.tsx:116:              <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
app/demo/logos/page.tsx:81:        <h1 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
app/demo/logos/page.tsx:149:                <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>
app/error.tsx:42:          <h1 className="bc uppercase text-5xl md:text-7xl leading-display-loose text-foreground">
components/account/NotificationPreferencesForm.tsx:67:        <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
components/account/NotificationPreferencesForm.tsx:86:        <h2 className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
components/account/NotificationPreferencesForm.tsx:105:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
components/auth/AuthCard.tsx:18:          <h1 className="bc uppercase text-3xl md:text-4xl text-center leading-tight">
components/clients/AssessmentList.tsx:130:          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{t('assessments.newAssessment')}</h3>
components/clients/ClientPlanSection.tsx:132:          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{t('plans.newPlan')}</h3>
components/clients/TransformationEditor.tsx:156:          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{t('transformations.newTransformation')}</h3>
components/clients/WorkoutEditor.tsx:192:          <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{t('workouts.newWorkoutTitle')}</h3>
components/dashboard/DashboardEmptyState.tsx:25:        <h3 className="text-sm font-semibold text-foreground">{t('emptyState.title')}</h3>
components/dashboard/SubscriptionStatusCard.tsx:27:            <h3 className="font-medium text-amber-900 dark:text-amber-200">
components/dashboard/SubscriptionStatusCard.tsx:50:            <h3 className="font-medium text-red-900 dark:text-red-200">
components/form/audit/AuditForm.tsx:595:        <h2 className="text-xl md:text-2xl font-semibold font-[family-name:var(--font-geist)]">
components/funnel/onboarding/EditorTour.tsx:58:            <h3 className="text-lg font-semibold mb-2">{current.title}</h3>
components/funnel/preview/ReportPreview.tsx:35:        <h2 className="text-lg font-semibold leading-snug">{intro.heading}</h2>
components/funnel/preview/ReportPreview.tsx:45:          <h3 className="text-sm font-semibold">{firstPillar.title}</h3>
components/funnel/SpecialtyTemplateManager.tsx:141:      <h3 className="text-sm font-semibold">{item.label}</h3>
components/funnel/SpecialtyTemplateManager.tsx:246:          <h2 className="text-lg font-semibold">{t('heading')}</h2>
components/funnel/tabs/ProximoPassoTab.tsx:122:          <h4 className="text-sm font-semibold text-foreground">
components/funnel/tabs/ProximoPassoTab.tsx:160:          <h4 className="text-sm font-semibold text-foreground">
components/funnel/tabs/_components/report-panels.tsx:231:        <h3 className="text-sm font-semibold">{t('metricsHeading')}</h3>
components/funnel/tabs/_respostas/OptionBrowser.tsx:59:            <h3 className="text-sm font-semibold leading-snug">
components/landing/institucional/Faq.tsx:31:        <h2 className="bc uppercase text-4xl md:text-6xl leading-display-loose">
components/landing/onboarding/ProductShowcase.tsx:333:                  <h3 className="text-xl font-semibold text-[var(--brand-text)] font-[family-name:var(--font-geist)]">
components/landing/onboarding/storyboard/Ato2Jornada.tsx:17:      <h3 className="text-base font-semibold mb-5 font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/landing/onboarding/storyboard/Ato2Jornada.tsx:37:      <h3 className="text-base font-semibold mb-5 font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/landing/onboarding/storyboard/Ato2Jornada.tsx:60:      <h3 className="text-base font-semibold mb-5 font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/landing/onboarding/storyboard/Ato2Jornada.tsx:80:      <h3 className="text-base font-semibold mb-5 font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/landing/onboarding/storyboard/Ato2Jornada.tsx:100:      <h3 className="text-base font-semibold mb-4 font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/landing/onboarding/storyboard/Ato2Jornada.tsx:129:      <h3 className="text-base font-semibold mb-4 font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/landing/onboarding/storyboard/Ato2Jornada.tsx:149:      <h3 className="text-base font-semibold mb-5 font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/launch/_sections/MethodPipeline.tsx:24:        <h2 className="text-xl md:text-2xl font-semibold font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/launch/_sections/Pricing.tsx:28:        <h2 className="text-xl md:text-2xl font-semibold font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/launch/_sections/Roadmap.tsx:35:        <h2 className="text-xl md:text-2xl font-semibold font-[family-name:var(--font-geist)]" style={{ color: 'var(--brand-text)' }}>
components/legal/LegalShell.tsx:30:        <h1 className="bc uppercase text-3xl md:text-4xl leading-tight">{title}</h1>
components/report/lead/_sections/JourneySection.tsx:26:          <h2 className="text-micro md:text-xs uppercase tracking-extra-display text-muted-foreground mb-2">
components/report/lead/_sections/MetricsSection.tsx:72:          <h2 className="text-micro md:text-xs uppercase tracking-extra-display text-muted-foreground">
components/report/lead/_sections/NutritionSection.tsx:46:          <h2 className="text-micro md:text-xs uppercase tracking-extra-display text-muted-foreground mb-8 md:mb-12">
components/report/lead/_sections/ObservationsSection.tsx:57:          <h2 className="text-micro md:text-xs uppercase tracking-extra-display text-muted-foreground">
components/report/lead/_sections/PapelProfissionalSection.tsx:16:            <h2 className="bc uppercase text-2xl md:text-4xl leading-tight mb-4 md:mb-6">
components/report/lead/_sections/PillarsSection.tsx:53:            <h2 className="bc uppercase text-4xl md:text-6xl leading-display">
components/report/lead/_sections/PillarsSection.tsx:105:        <h3 className="bc uppercase text-2xl md:text-3xl mb-4 md:mb-5 leading-tight">
components/report/lead/_sections/ProfessionalBlock.tsx:191:                <h2 className="bc uppercase text-lg tracking-widest">{t('leadReport.nextStep')}</h2>
components/settings/ContactForm.tsx:251:          <h2 className="text-sm font-semibold">{t('slug.sectionTitle')}</h2>
components/settings/ContactForm.tsx:263:          <h2 className="text-sm font-semibold">{t('whatsapp.sectionTitle')}</h2>
components/settings/CustomLinksSection.tsx:52:        <h2 className="text-sm font-medium">{t('title')}</h2>
components/settings/DesignForm.tsx:43:        <h2 className="text-sm font-semibold">{t('sectionTitle')}</h2>
components/shared/ConfigLayout.tsx:73:              <h2 className="text-micro uppercase tracking-display text-muted-foreground/60 font-medium">
components/shared/CookieBanner.tsx:66:                <h2 className="bc text-base md:text-lg leading-tight">
components/shared/ProUpsellCard.tsx:29:        <h2 className="bc text-2xl md:text-3xl leading-tight">
components/site/SiteHub.tsx:136:                  <h1 className="bc text-3xl md:text-4xl">{t('site.editorTitle')}</h1>
components/site/SiteHub.tsx:312:        <h1 className="bc text-3xl md:text-4xl leading-tight">{title}</h1>
components/subscription/CheckoutFlow.tsx:190:        <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
components/subscription/DunningSection.tsx:17:          <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
components/subscription/_checkout/CheckoutSuccess.tsx:66:        <h2 className="bc text-2xl md:text-3xl">{t('title')}</h2>
components/ui/form-section.tsx:22:        <h3 className="text-lg font-semibold leading-none tracking-tight">
components/ui/Walkthrough.tsx:163:              <h3 className="text-sm font-semibold text-foreground leading-tight">{current.title}</h3>
```
