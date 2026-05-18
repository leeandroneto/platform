// .storybook/main.ts — Storybook 10 (ADR-0038 substitui ADR-0013 Ladle).
// Stories co-localizadas: components/<nome>/<nome>.stories.tsx (Pesquisa 18 Q8).
// Framework @storybook/nextjs-vite — Vite-based, integra Next 16 App Router,
// next/font, next/image, server components transparente. Single source dev/build.

import type { StorybookConfig } from '@storybook/nextjs-vite'

const config: StorybookConfig = {
  stories: ['../components/**/*.mdx', '../components/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-a11y', // axe-core, gate dia 0 (ADR-0040 §H)
    '@storybook/addon-docs', // autodocs + MDX
    '@storybook/addon-mcp', // serve stories como catálogo Claude/Cursor (Phase A F3)
    '@chromatic-com/storybook', // visual regression CI (JIT setup quando merge a main)
    '@storybook/addon-vitest', // play() + interaction tests JIT (overhead zero parado)
  ],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
}

export default config
