const formatCurrencyValue = (value) => {
  const numericValue = Number.parseFloat(value);

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return numericValue;
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
  }));
