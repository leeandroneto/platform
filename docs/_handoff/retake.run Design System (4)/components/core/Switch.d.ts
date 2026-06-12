import * as React from 'react';

/** Binary on/off toggle. Track fills terracotta when on. */
export interface SwitchProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  disabled?: boolean;
  /** @default "md" */
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}

export function Switch(props: SwitchProps): JSX.Element;
