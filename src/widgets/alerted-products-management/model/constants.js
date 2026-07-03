export const MANAGEMENT_VARIANT = {
  DEFAULT: "default",
  PRICE_ADJUSTMENT: "price-adjustment",
  HOMOLOGATION: "homologation",
};

export const JUSTIFICACION_TECNICA_LABEL = "JUSTIFICACION TECNICA";

export const isValidNewSalePrice = (value, record) => {
  if (value == null || value === "") return false;
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return false;
  const min = Number(record?.minimumPrice ?? 0);
  const max = Number(record?.maximumPrice ?? 0);
  return numeric >= min && numeric <= max;
};