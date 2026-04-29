const normalizeValue = (value) => String(value ?? "").toLowerCase();

export const filterProductPriceQuotes = (rows, query) => {
  const normalizedQuery = normalizeValue(query).trim();

  if (!normalizedQuery) {
    return rows;
  }

  return rows.filter((product) =>
    [
      product?.name,
      product?.description,
      product?.brand,
      product?.unit,
      product?.category,
      product?.price,
      product?.state,
      product?.status_supervision,
    ].some((value) => normalizeValue(value).includes(normalizedQuery))
  );
};
