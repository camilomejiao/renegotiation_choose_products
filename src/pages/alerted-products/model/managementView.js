import { normalizeLabel } from "../../../shared/lib/normalizeLabel";

export const MANAGEMENT_VARIANT = {
  DEFAULT: "default",
  PRICE_ADJUSTMENT: "price-adjustment",
  HOMOLOGATION: "homologation",
  INDETERMINATE: "indeterminate",
};

const PRICE_ADJUSTMENT_LABEL = "AJUSTE DE PRECIO";
const INDETERMINATE_LABEL = "INDETERMINADO";
// El backend puede rotular este tipo como "HOMOLOGAR" u "HOMOLOGACION":
// se detecta por prefijo para cubrir ambas variantes.
const HOMOLOGATION_LABEL_PREFIX = "HOMOLOG";

const SUPPORTED_VIEW_CODES = new Set([5275, 5272]);
const SUPPORTED_VIEW_LABELS = new Set([
  "ACTA COMPLEMENTARIA",
  "JUSTIFICACION TECNICA",
  PRICE_ADJUSTMENT_LABEL,
]);

const isHomologationLabel = (label = "") =>
  normalizeLabel(label).startsWith(HOMOLOGATION_LABEL_PREFIX);

// Decide si la asignación actual usa una vista de gestión soportada y con qué variante.
export const resolveManagementView = (assignment) => {
  const code = assignment?.selectedRows?.[0]?.managementTypeCode;
  const label = assignment?.managementType;
  const normalized = normalizeLabel(label);

  // El backend puede rotularlo "INDETERMINADO" o "PRODUCTO INDETERMINADO":
  // se detecta por inclusión para cubrir ambas variantes.
  const isIndeterminate = normalized.includes(INDETERMINATE_LABEL);

  const shouldUseCurrentView =
    SUPPORTED_VIEW_CODES.has(Number(code)) ||
    SUPPORTED_VIEW_LABELS.has(normalized) ||
    isHomologationLabel(label) ||
    isIndeterminate;

  const variant = isIndeterminate
    ? MANAGEMENT_VARIANT.INDETERMINATE
    : normalized === PRICE_ADJUSTMENT_LABEL
    ? MANAGEMENT_VARIANT.PRICE_ADJUSTMENT
    : isHomologationLabel(label)
    ? MANAGEMENT_VARIANT.HOMOLOGATION
    : MANAGEMENT_VARIANT.DEFAULT;

  return { shouldUseCurrentView, variant };
};