export function profileInitials(displayName?: string | null): string {
  const initials = (displayName ?? '')
    .trim()
    .split(/\s+/u)
    .map(word => word.match(/[\p{L}\p{N}]/u)?.[0])
    .filter((letter): letter is string => Boolean(letter));
  if (!initials.length) return 'N';
  const chosen = initials.length === 1 ? [initials[0]] : [initials[0], initials.at(-1)!];
  return chosen.join('').toLocaleUpperCase();
}

