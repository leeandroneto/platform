// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/theme-preview/components-showcase.tsx
// See NOTICE.md.
// ADAPT:
//   1. ThemeEditorPreviewProps → imported from lib/design/contract/theme
//   2. All shadcn primitives @/components/ui/* kept as-is (platform has them installed)
//   3. i18n strings → namespace theme-studio.componentsShowcase
//   4. No store dependency — pure props-based component (no useEditorStore)

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-components-showcase",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Live showcase of shadcn-ui components (buttons, cards, badges, alerts, tables) rendered with the active theme tokens. Adapted from TweakCN components-showcase.",
 *   "examples": [],
 *   "when_to_use": ["theme studio preview panel — components tab"],
 *   "anti_patterns": ["standalone usage without a Theme object"],
 *   "related": ["theme-studio-preview-panel", "theme-studio-color-preview"],
 *   "vertical": null
 * }
 */

import { useTranslations } from 'next-intl'

import { AlertTriangle, Info, Settings, Star } from 'lucide-react'

import type { ThemeEditorPreviewProps } from '@/lib/design/contract/theme'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// ── ComponentsShowcase ────────────────────────────────────────────────────────

interface ComponentsShowcaseProps {
  styles: ThemeEditorPreviewProps['styles']
  currentMode: ThemeEditorPreviewProps['currentMode']
}

const ComponentsShowcase = ({ styles, currentMode }: ComponentsShowcaseProps) => {
  const t = useTranslations('theme-studio.componentsShowcase')

  if (!styles || !styles[currentMode]) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Button showcase */}
      <section className="space-y-3">
        <h3 className="border-b pb-2 text-sm font-medium">{t('buttonsTitle')}</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="default">{t('btnPrimary')}</Button>
            <Button variant="secondary">{t('btnSecondary')}</Button>
            <Button variant="outline">{t('btnOutline')}</Button>
            <Button variant="ghost">{t('btnGhost')}</Button>
            <Button variant="link">{t('btnLink')}</Button>
            <Button variant="destructive">{t('btnDestructive')}</Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <label htmlFor="notifications">{t('switchNotifications')}</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="darkmode" />
              <label htmlFor="darkmode">{t('switchDarkMode')}</label>
            </div>
          </div>
        </div>
      </section>

      {/* Cards & Containers */}
      <section className="space-y-3">
        <h3 className="border-b pb-2 text-sm font-medium">{t('cardsTitle')}</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('cardFeatureTitle')}</CardTitle>
              <CardDescription>{t('cardFeatureDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t('cardFeatureBody')}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost">{t('btnCancel')}</Button>
              <Button>{t('btnContinue')}</Button>
            </CardFooter>
          </Card>

          <div className="space-y-3">
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: styles[currentMode].popover,
                color: styles[currentMode]['popover-foreground'],
                border: `1px solid ${styles[currentMode].border}`,
              }}
            >
              <h4 className="mb-2 text-sm font-medium">{t('popoverContainerTitle')}</h4>
              <p className="text-xs">{t('popoverContainerBody')}</p>
            </div>

            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: styles[currentMode].muted,
                color: styles[currentMode]['muted-foreground'],
              }}
            >
              <h4 className="mb-2 text-sm font-medium">{t('mutedContainerTitle')}</h4>
              <p className="text-xs">{t('mutedContainerBody')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Indicators */}
      <section className="space-y-3">
        <h3 className="border-b pb-2 text-sm font-medium">{t('statusTitle')}</h3>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge>{t('badgeDefault')}</Badge>
            <Badge variant="secondary">{t('badgeSecondary')}</Badge>
            <Badge variant="outline">{t('badgeOutline')}</Badge>
            <Badge variant="destructive">{t('badgeDestructive')}</Badge>
            <Badge className="bg-blue-500 hover:bg-blue-600">{t('badgeCustom')}</Badge>
          </div>

          <div className="space-y-3">
            <Alert>
              <Info className="size-4 " />
              <AlertTitle>{t('alertInfoTitle')}</AlertTitle>
              <AlertDescription>{t('alertInfoDesc')}</AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <AlertTriangle className="size-4 " />
              <AlertTitle>{t('alertErrorTitle')}</AlertTitle>
              <AlertDescription>{t('alertErrorDesc')}</AlertDescription>
            </Alert>

            <div
              className="flex items-start gap-3 rounded-lg border p-4"
              style={{
                borderColor: styles[currentMode].border,
                backgroundColor: `${styles[currentMode].accent}20`,
              }}
            >
              <Star className="size-5  shrink-0 text-yellow-500" />
              <div>
                <h5 className="text-sm font-medium">{t('alertSuccessTitle')}</h5>
                <p className="mt-1 text-xs">{t('alertSuccessDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Display */}
      <section className="space-y-3">
        <h3 className="border-b pb-2 text-sm font-medium">{t('dataTitle')}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableColUser')}</TableHead>
              <TableHead>{t('tableColStatus')}</TableHead>
              <TableHead>{t('tableColRole')}</TableHead>
              <TableHead className="text-right">{t('tableColActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{t('tableUser1')}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-green-500/10 text-green-600">
                  {t('statusActive')}
                </Badge>
              </TableCell>
              <TableCell>{t('roleAdmin')}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <Settings className="size-4 " />
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">{t('tableUser2')}</TableCell>
              <TableCell>
                <Badge variant="outline" className="bg-destructive/10 text-destructive">
                  {t('statusInactive')}
                </Badge>
              </TableCell>
              <TableCell>{t('roleUser')}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  <Settings className="size-4 " />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  )
}

export default ComponentsShowcase
