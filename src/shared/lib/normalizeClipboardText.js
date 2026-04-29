export const normalizeClipboardText = (value, { preserveLineBreaks = false } = {}) => {
  const normalizedValue = String(value ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (preserveLineBreaks) {
    return normalizedValue
      .replace(/[^\S\n]+/g, " ")
      .replace(/[ ]{2,}/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }

  return normalizedValue.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
};

export const normalizeLookupText = (value) =>
  normalizeClipboardText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^0-9a-z\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
