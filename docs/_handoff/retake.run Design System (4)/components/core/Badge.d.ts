import * as React from 'react';

/**
 * Compact status or category label, pill-shaped by default.
 * Tones stay within the brand's warm temperature.
 */
export interface BadgeProps {
  children: React.ReactNode;
  /** @default "neutral" */
  tone?: 'neutral' | 'accent' | 'ocean' | 'success' | 'warning' | 'danger';
  /** @default "soft" */
  variant?: 'soft' | 'solid' | 'outline';
  /** Leading status dot. @default false */
  dot?: boolean;
  /** @default true */
  pill?: boolean;
  style?: React.CSSProperties;
}

export function Badge(props: BadgeProps): JSX.Element;
