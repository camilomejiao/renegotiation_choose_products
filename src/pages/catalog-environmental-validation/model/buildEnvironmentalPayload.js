const toInt = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const buildEnvironmentalPayload = ({ rows = [], environmentalKeys = [] }) => {
  return rows.map((row) => ({
    id: row?.id,
    ambiental: Object.fromEntries(
      environmentalKeys.map((key) => [key, toInt(row?.[key])])
    ),
    cantidad_ambiental: {
      cant: toInt(row?.customValue),
      ambiental_key: row?.selectedCategory || "",
    },
  }));
};
