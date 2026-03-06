const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const buildProductUploadPayload = ({ rows = [], environmentalKeys = [] }) => {
  return rows.map((row) => ({
    categoria_producto: row?.category,
    nombre: row?.name,
    unidad_medida: row?.unit,
    precio_min: toNumber(row?.price_min),
    precio_max: toNumber(row?.price_max),
    ambiental: Object.fromEntries(environmentalKeys.map((key) => [key, 1])),
    cantidad_ambiental: {
      cant: 0,
      ambiental_key: "",
    },
  }));
};
