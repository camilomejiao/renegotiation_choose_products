const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

// Normaliza a MAYÚSCULAS sin acentos para comparaciones de etiquetas.
export const normalizeLabel = (value = "") =>
  String(value).normalize("NFD").replace(DIACRITICS, "").trim().toUpperCase();