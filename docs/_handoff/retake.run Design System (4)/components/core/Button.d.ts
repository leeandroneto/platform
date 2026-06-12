import * as React from 'react';

/**
 * Athletic, decisive button. Primary action uses solid terracotta;
 * secondary uses a graphite outline; text/ghost stay quiet.
 *
 * @startingPoint section="Core" subtitle="Primary / secondary / ghost actions" viewport="700x140"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** Visual style. @default "primary" */
  variant?: 'primary' | 'secondary' | 'ghost' | 'inverse' | 'text';
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Stadium / pill radius (track flavor). @default false */
  pill?: boolean;
  /** Show a trailing → arrow. @default false */
  arrow?: boolean;
  /** Optional leading icon node. */
  iconLeft?: React.ReactNode;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
