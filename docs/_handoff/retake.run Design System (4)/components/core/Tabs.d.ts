import * as React from 'react';

export interface TabItem {
  id: string;
  label: string;
  /** Optional count pill. */
  count?: number;
}

/** Underline tab bar in display type with a terracotta active indicator. */
export interface TabsProps {
  items: TabItem[];
  /** Active tab id. */
  value: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}

export function Tabs(props: TabsProps): JSX.Element;
