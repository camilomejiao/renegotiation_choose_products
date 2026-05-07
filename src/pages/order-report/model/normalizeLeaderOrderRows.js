const formatCurrencyValue = (value) => {
  const numericValue = Number.parseFloat(value);

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return numericValue;
};

const buildBeneficiaryName = (beneficiary = {}) => {
  const fullName =
    beneficiary?.nombre_completo ||
    [beneficiary?.nombre, beneficiary?.apellido].filter(Boolean).join(" ");

  return fullName || "";
};

export const normalizeLeaderOrderRows = (rows = []) =>
  rows.map((row) => ({
    id: row?.id,
    orderId: row?.id ?? row?.orden_id ?? "",
    cubId: row?.cub?.cub_id || row?.cub_id || "",
    beneficiary: buildBeneficiaryName(row?.cub),
    supplier:
      (typeof row?.proveedor === "string" ? row.proveedor : row?.proveedor?.nombre) ||
      row?.supplier?.nombre ||
      row?.supplier_name ||
      "",
    totalValue: formatCurrencyValue(row?.valor_total),
  }));
