export const MAX_TAG_LENGTH = 50;

export const validateTagArray = (tags: unknown): boolean => {
  if (!Array.isArray(tags)) return false;
  const seen = new Set<string>();
  for (const tag of tags) {
    if (typeof tag !== 'string') return false;
    const trimmed = tag.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_TAG_LENGTH) return false;
    if (seen.has(trimmed)) return false;
    seen.add(trimmed);
  }
  return true;
};
