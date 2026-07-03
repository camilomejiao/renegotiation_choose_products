export const formatCurrency = (value) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);

// Formato COP solo visual; el valor almacenado y enviado sigue siendo numérico.
export const formatCopInput = (value) => {
  if (value == null || value === "") return "";
  const numeric = Number(String(value).replace(/[^\d]/g, ""));
  if (!Number.isFinite(numeric)) return "";
  return `$ ${numeric.toLocaleString("es-CO")}`;
};

export const parseCopInput = (value) => (value ? value.replace(/[^\d]/g, "") : "");

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(timestamp));
};