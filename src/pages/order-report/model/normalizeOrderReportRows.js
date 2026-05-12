const formatCurrencyValue = (value) => {
  const numericValue = Number.parseFloat(value);

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return numericValue;
};

const normalizeCanCancelRequest = (row = {}) => {
  const rawValue =
    row?.eliminar ??
    row?.puede_anular ??
    row?.elegible_anulacion ??
    row?.anulable ??
    row?.can_cancel_request;

  if (rawValue === undefined || rawValue === null) {
    return true;
  }

  if (typeof rawValue === "string") {
    return rawValue.trim().toLowerCase() !== "false";
  }

  return Boolean(rawValue);
};

export const normalizeOrderReportRows = (rows = []) =>
  rows.map((row) => ({
    id: row?.id,
    cub_id: row?.cub?.cub_id || "",
    cub_identificacion: row?.cub?.identificacion || "",
    cub_nombre: row?.cub?.nombre || "",
    cub_apellido: row?.cub?.apellido || "",
    valor_total: formatCurrencyValue(row?.valor_total),
    fecha_registro: row?.fecha_registro || "",
    canCancelRequest: normalizeCanCancelRequest(row),
  }));
