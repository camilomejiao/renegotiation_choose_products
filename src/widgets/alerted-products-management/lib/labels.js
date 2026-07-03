const DIACRITICS = new RegExp("[\\u0300-\\u036f]", "g");

export const normalizeLabel = (value = "") =>
  String(value).normalize("NFD").replace(DIACRITICS, "").trim().toUpperCase();

export const extractFileName = (name = "") => {
  const withoutExt = name.replace(/\.[^.]+$/, "");
  const parts = withoutExt.split("_");
  return parts[2] ?? parts[parts.length - 1] ?? name;
};