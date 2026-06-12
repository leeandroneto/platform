import * as React from 'react';

/** Text input with label, hint/error, and optional prefix/suffix. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  /** Uppercase field label. */
  label?: string | null;
  /** Helper text below the field. */
  hint?: string | null;
  /** Error text (turns the field red, overrides hint). */
  error?: string | null;
  /** Leading adornment (e.g. "R$"). */
  prefix?: React.ReactNode;
  /** Trailing adornment (e.g. "/km"). */
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
