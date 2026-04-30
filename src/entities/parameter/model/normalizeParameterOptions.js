const resolveOptionValue = (row) =>
  row?.id ??
  row?.value ??
  row?.valor ??
  row?.codigo ??
  row?.key ??
  null;

const resolveOptionLabel = (row) =>
  row?.nombre ??
  row?.label ??
  row?.descripcion ??
  row?.detalle ??
  row?.valor ??
  "";

export const normalizeParameterOptions = (rows = []) =>
  rows
    .map((row) => ({
      value: resolveOptionValue(row),
      label: resolveOptionLabel(row),
    }))
    .filter((option) => option.value !== null && option.label);
