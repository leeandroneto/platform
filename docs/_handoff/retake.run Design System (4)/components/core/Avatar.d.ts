import * as React from 'react';

/** Round avatar with photo or initials fallback and optional status. */
export interface AvatarProps {
  /** Image URL. Falls back to initials from `name`. */
  src?: string | null;
  /** Full name — used for initials + alt text. */
  name?: string;
  /** Pixel diameter. @default 40 */
  size?: number;
  /** Terracotta focus ring. @default false */
  ring?: boolean;
  /** Status dot. @default null */
  status?: 'online' | 'paused' | 'risk' | null;
  style?: React.CSSProperties;
}

export function Avatar(props: AvatarProps): JSX.Element;
