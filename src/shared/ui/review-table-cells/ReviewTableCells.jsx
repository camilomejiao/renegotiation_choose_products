import { ObservationText, StatusTag, WrappedText } from "./ReviewTableCells.styles";

const STATUS_COLORS = {
  Aprobado: "success",
  APROBADO: "success",
  Denegado: "error",
  DENEGADO: "error",
  Pendiente: "warning",
  PENDIENTE: "warning",
  RECHAZADO: "error",
  "Sin revisar": "default",
  "SIN REVISAR": "default",
};

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const ReadOnlyCell = ({ value }) => <WrappedText>{value ?? "-"}</WrappedText>;

export const CurrencyCell = ({ value }) => {
  const formatted = currencyFormatter.format(Number(value || 0));
  return <WrappedText>{formatted}</WrappedText>;
};

export const StatusCell = ({ value }) => {
  const normalized = value || "Pendiente";
  return <StatusTag color={STATUS_COLORS[normalized] || "default"}>{normalized}</StatusTag>;
};

export const ObservationCell = ({ value }) => {
  const comentario = value?.comentario || "Sin observacion";
  const funcionario = value?.funcionario || "";
  const fecha = value?.fecha || "";
  const detail = funcionario && fecha ? ` (${funcionario} - ${fecha})` : "";

  return <ObservationText>{`${comentario}${detail}`}</ObservationText>;
};
