// RESEARCH: tweakcn (Apache-2.0) — data extracted from contrast-checker.tsx
// Color pair seeds for the APCA contrast checker.
// 11 pairs across 3 categories — TweakCN-preserved list.

import type { ThemeStyleProps } from '@/lib/design/contract/theme'

export type ColorCategory = 'content' | 'interactive' | 'functional'

export type PairSeed = {
  id: string
  fgKey: keyof ThemeStyleProps
  bgKey: keyof ThemeStyleProps
  label: string
  category: ColorCategory
}

export const PAIR_SEEDS: PairSeed[] = [
  { id: 'base', fgKey: 'foreground', bgKey: 'background', label: 'Base', category: 'content' },
  { id: 'card', fgKey: 'card-foreground', bgKey: 'card', label: 'Card', category: 'content' },
  {
    id: 'popover',
    fgKey: 'popover-foreground',
    bgKey: 'popover',
    label: 'Popover',
    category: 'content',
  },
  { id: 'muted', fgKey: 'muted-foreground', bgKey: 'muted', label: 'Muted', category: 'content' },
  {
    id: 'primary',
    fgKey: 'primary-foreground',
    bgKey: 'primary',
    label: 'Primary',
    category: 'interactive',
  },
  {
    id: 'secondary',
    fgKey: 'secondary-foreground',
    bgKey: 'secondary',
    label: 'Secondary',
    category: 'interactive',
  },
  {
    id: 'accent',
    fgKey: 'accent-foreground',
    bgKey: 'accent',
    label: 'Accent',
    category: 'interactive',
  },
  {
    id: 'destructive',
    fgKey: 'destructive-foreground',
    bgKey: 'destructive',
    label: 'Destructive',
    category: 'functional',
  },
  {
    id: 'sidebar',
    fgKey: 'sidebar-foreground',
    bgKey: 'sidebar',
    label: 'Sidebar Base',
    category: 'functional',
  },
  {
    id: 'sidebar-primary',
    fgKey: 'sidebar-primary-foreground',
    bgKey: 'sidebar-primary',
    label: 'Sidebar Primary',
    category: 'functional',
  },
  {
    id: 'sidebar-accent',
    fgKey: 'sidebar-accent-foreground',
    bgKey: 'sidebar-accent',
    label: 'Sidebar Accent',
    category: 'functional',
  },
]
