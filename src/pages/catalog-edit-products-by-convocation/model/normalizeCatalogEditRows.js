export const normalizeCatalogEditRows = (rows = []) => {
  return rows.map((row) => ({
    id: row?.id,
    name: row?.nombre,
    description: row?.especificacion_tecnicas,
    brand: row?.marca_comercial,
    unit: row?.unidad_medida?.id ?? null,
    category: row?.categoria_producto?.id ?? null,
    price_min: row?.precio_min,
    price_max: row?.precio_max,
  }));
};
