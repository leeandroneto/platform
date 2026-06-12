import * as React from 'react';

/**
 * Prescribed-vs-executed compliance signal. Green = done as prescribed,
 * amber = partial, red = missed, neutral = planned/upcoming.
 */
export interface ComplianceTagProps {
  /** @default "planned" */
  status?: 'done' | 'partial' | 'missed' | 'planned';
  /** Override the default PT-BR label. */
  label?: string | null;
  /** Show the text label; false renders a bare dot. @default true */
  showLabel?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function ComplianceTag(props: ComplianceTagProps): JSX.Element;
