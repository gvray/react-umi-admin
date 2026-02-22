import type { RefObject } from 'react';

export function callRef<T, R>(
  ref: RefObject<T | null | undefined>,
  fn: (current: T) => R,
): R | undefined {
  const current = ref.current;
  if (!current) return;
  return fn(current);
}
