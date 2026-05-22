// .storybook/default-theme.css.ts — Static CSS string for Storybook theme inject.
//
// Generated from DEFAULT_THEME via `lib/design/build-theme-css.ts` algorithm
// (same as buildThemeCSS but without `server-only` import — Storybook is
// browser/Vite context, cannot import server-only modules).
//
// HOW TO REGENERATE: run in project root:
//   npx tsx gen-css-temp.ts  (see scripts pattern in CLAUDE.md)
// The output is the string below. Re-generate if DEFAULT_THEME changes.
//
// Commit hash this was generated from: HEAD (2026-05-22 fase-0.5 bootstrap)

export const DEFAULT_THEME_CSS = `@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --card: oklch(1 0 0);
    --card-foreground: oklch(0.145 0 0);
    --popover: oklch(1 0 0);
    --popover-foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    --secondary: oklch(0.97 0 0);
    --secondary-foreground: oklch(0.205 0 0);
    --muted: oklch(0.97 0 0);
    --muted-foreground: oklch(0.556 0 0);
    --accent: oklch(0.97 0 0);
    --accent-foreground: oklch(0.205 0 0);
    --destructive: oklch(0.577 0.245 27.325);
    --destructive-foreground: oklch(1 0 0);
    --border: oklch(0.922 0 0);
    --input: oklch(0.922 0 0);
    --ring: oklch(0.708 0 0);
    --chart-1: oklch(0.81 0.10 252);
    --chart-2: oklch(0.62 0.19 260);
    --chart-3: oklch(0.55 0.22 263);
    --chart-4: oklch(0.49 0.22 264);
    --chart-5: oklch(0.42 0.18 266);
    --sidebar: oklch(0.985 0 0);
    --sidebar-foreground: oklch(0.145 0 0);
    --sidebar-primary: oklch(0.205 0 0);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.97 0 0);
    --sidebar-accent-foreground: oklch(0.205 0 0);
    --sidebar-border: oklch(0.922 0 0);
    --sidebar-ring: oklch(0.708 0 0);
    --shadow-color: oklch(0 0 0);
    --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --radius: 0.625rem;
    --shadow-opacity: 0.1;
    --shadow-blur: 3px;
    --shadow-spread: 0px;
    --shadow-offset-x: 0;
    --shadow-offset-y: 1px;
    --letter-spacing: 0em;
    --spacing: 0.25rem;
    --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.0500);
    --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.0500);
    --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.2500);
    --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 1px 2px -1px hsl(0 0% 0% / 0.1000);
    --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 1px 2px -1px hsl(0 0% 0% / 0.1000);
    --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 2px 4px -1px hsl(0 0% 0% / 0.1000);
    --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 4px 6px -1px hsl(0 0% 0% / 0.1000);
    --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 8px 10px -1px hsl(0 0% 0% / 0.1000);
  }
  .dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.269 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.371 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --destructive-foreground: oklch(0.985 0 0);
    --border: oklch(0.275 0 0);
    --input: oklch(0.325 0 0);
    --ring: oklch(0.556 0 0);
    --chart-1: oklch(0.81 0.10 252);
    --chart-2: oklch(0.62 0.19 260);
    --chart-3: oklch(0.55 0.22 263);
    --chart-4: oklch(0.49 0.22 264);
    --chart-5: oklch(0.42 0.18 266);
    --sidebar: oklch(0.205 0 0);
    --sidebar-foreground: oklch(0.985 0 0);
    --sidebar-primary: oklch(0.488 0.243 264.376);
    --sidebar-primary-foreground: oklch(0.985 0 0);
    --sidebar-accent: oklch(0.269 0 0);
    --sidebar-accent-foreground: oklch(0.985 0 0);
    --sidebar-border: oklch(0.275 0 0);
    --sidebar-ring: oklch(0.439 0 0);
    --shadow-color: oklch(0 0 0);
    --font-sans: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
    --font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
    --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    --radius: 0.625rem;
    --shadow-opacity: 0.1;
    --shadow-blur: 3px;
    --shadow-spread: 0px;
    --shadow-offset-x: 0;
    --shadow-offset-y: 1px;
    --letter-spacing: 0em;
    --spacing: 0.25rem;
    --shadow-2xs: 0 1px 3px 0px hsl(0 0% 0% / 0.0500);
    --shadow-xs: 0 1px 3px 0px hsl(0 0% 0% / 0.0500);
    --shadow-2xl: 0 1px 3px 0px hsl(0 0% 0% / 0.2500);
    --shadow-sm: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 1px 2px -1px hsl(0 0% 0% / 0.1000);
    --shadow: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 1px 2px -1px hsl(0 0% 0% / 0.1000);
    --shadow-md: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 2px 4px -1px hsl(0 0% 0% / 0.1000);
    --shadow-lg: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 4px 6px -1px hsl(0 0% 0% / 0.1000);
    --shadow-xl: 0 1px 3px 0px hsl(0 0% 0% / 0.1000), 0 8px 10px -1px hsl(0 0% 0% / 0.1000);
  }
}`
