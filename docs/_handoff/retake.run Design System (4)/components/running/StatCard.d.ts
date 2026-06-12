import * as React from 'react';

/**
 * Dashboard metric tile — uppercase label, big tabular-mono value,
 * optional period delta. The workhorse stat of the coach dashboard.
 *
 * @startingPoint section="Running" subtitle="KPI metric tile with delta" viewport="320x160"
 */
export interface StatCardProps {
  /** Uppercase metric label. */
  label: string;
  /** The number/string shown big (e.g. "1.245", "R$ 128.650"). */
  value: React.ReactNode;
  /** Small unit suffix (e.g. "km", "/km"). */
  unit?: string | null;
  /** Signed delta vs previous period; sets ▲/▼ + green/red. */
  delta?: number | null;
  /** Delta suffix. @default "%" */
  deltaSuffix?: string;
  /** Muted caption (e.g. "vs mês anterior"). */
  caption?: string | null;
  /** Terracotta value color. @default false */
  accent?: boolean;
  /** @default "light" */
  tone?: 'light' | 'dark';
  style?: React.CSSProperties;
}

export function StatCard(props: StatCardProps): JSX.Element;
