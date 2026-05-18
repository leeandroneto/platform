// .ladle/config.mjs — Catálogo visual (ADR-0013).

/** @type {import('@ladle/react').UserConfig} */
export default {
  port: 61000,
  stories: 'components/**/*.stories.{ts,tsx}',
  defaultStory: 'introduction--welcome',
  storyOrder: ['introduction/*', 'tokens/*', 'primitives/*', 'components/*', 'patterns/*'],
  addons: {
    a11y: { enabled: true },
    theme: { enabled: true, defaultState: 'dark' },
    width: {
      enabled: true,
      options: {
        mobile: 375,
        tablet: 768,
        desktop: 1280,
      },
      defaultState: 0,
    },
  },
}
