// RESEARCH: tweakcn (Apache-2.0) — copied from utils/format.ts
// See NOTICE.md.

/**
 * Format number to show in k format (e.g., 1557 => 1.6k)
 */
export function formatCompactNumber(num: number): string {
  if (num < 1000) {
    return num.toString()
  }
  return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
}
