import * as React from 'react';

/** Surface container. Cream by default; `dark` for graphite sections. */
export interface CardProps {
  children: React.ReactNode;
  /** @default "light" */
  tone?: 'light' | 'sunken' | 'dark';
  /** Shadow step. @default 1 */
  elevation?: 0 | 1 | 2 | 3;
  /** CSS padding. @default "var(--space-3)" */
  pad?: string;
  /** CSS border-radius. @default "var(--radius-16)" */
  radius?: string;
  /** Lift + shadow on hover. @default false */
  interactive?: boolean;
  style?: React.CSSProperties;
}

export function Card(props: CardProps): JSX.Element;
