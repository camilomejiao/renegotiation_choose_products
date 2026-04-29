export const sanitizeAlphaNumericText = (value, { preserveLineBreaks = false } = {}) => {
  const normalizedValue = String(value ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  if (preserveLineBreaks) {
    return normalizedValue
      .replace(/[^\S\n]+/g, " ")
      .replace(/[^0-9A-Za-zÀ-ÿ \n]/g, "")
      .replace(/[ ]{2,}/g, " ")
      .replace(/ *\n */g, "\n")
      .replace(/\n{2,}/g, "\n")
      .trim();
  }

  return normalizedValue
    .replace(/\n+/g, " ")
    .replace(/[^0-9A-Za-zÀ-ÿ\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};
