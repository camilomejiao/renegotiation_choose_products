export const transformCatalogEditRows = ({ rows = [], environmentalKeys = [] }) => {
  return rows.map((product) => ({
    id: product?.id,
    categoria_producto: product?.category,
    nombre: product?.name,
    unidad_medida: product?.unit,
    precio_min: Number(product?.price_min),
    precio_max: Number(product?.price_max),
    ambiental: Object.fromEntries(environmentalKeys.map((key) => [key, 1])),
    cantidad_ambiental: {
      cant: parseInt(product?.customValue, 10) || 0,
      ambiental_key: product?.selectedCategory || "",
    },
  }));
};
