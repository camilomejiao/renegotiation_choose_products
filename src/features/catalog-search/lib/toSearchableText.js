export const toSearchableText = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (Array.isArray(value)) {
    return value.map((item) => toSearchableText(item)).join(" ");
  }

  if (typeof value === "object") {
    return Object.values(value)
      .map((item) => toSearchableText(item))
      .join(" ");
  }

  return String(value);
};
