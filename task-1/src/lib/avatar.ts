/** DiceBear SVG — decorative avatars only (no corporate photos). */
export function avatarUrl(seed: string): string {
  const s = encodeURIComponent(seed);
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${s}`;
}
