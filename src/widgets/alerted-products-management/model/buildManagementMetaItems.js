import { normalizeLabel } from "../lib/labels";
import { JUSTIFICACION_TECNICA_LABEL } from "./constants";

export const buildManagementMetaItems = (
  managementTypeLabel = "",
  { isPriceAdjustment = false, isHomologation = false } = {}
) => {
  const normalizedType = normalizeLabel(managementTypeLabel);
  const reviewerRole = isHomologation
    ? "No aplica"
    : normalizedType === JUSTIFICACION_TECNICA_LABEL
    ? "Sub. Operativa"
    : "Supervisión";

  return [
    { label: "Tipo de gestión", value: managementTypeLabel || "—", variant: "type" },
    { label: "Rol responsable", value: "Implementación" },
    { label: "Rol revisor", value: reviewerRole },
    {
      label: isPriceAdjustment || isHomologation ? "Estado inicial" : "Estado",
      value: "Sin Gestión",
      variant: "status",
      statusColor: "default",
    },
  ];
};