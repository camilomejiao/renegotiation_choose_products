const normalizeText = (value) => String(value || "").trim().toLowerCase();

const parseNumberCell = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const normalized = String(value).replace(/[^\d.,-]/g, "").replace(/\.(?=.*\.)/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const resolveSelectValue = ({ options, value, fallback }) => {
  const normalized = normalizeText(value);
  const foundByName = options.find((option) => normalizeText(option?.nombre) === normalized);

  if (foundByName) {
    return foundByName.id;
  }

  const foundById = options.find((option) => String(option?.id) === String(value));

  if (foundById) {
    return foundById.id;
  }

  return fallback;
};

const resolveSelectLabel = ({ options, id, fallback = "" }) => {
  const found = options.find((option) => String(option?.id) === String(id));
  return found?.nombre ?? fallback;
};

export const parseProductUploadClipboard = ({ clipboardText, unitOptions = [], categoryOptions = [] }) => {
  const separator = clipboardText.includes("\t") ? "\t" : clipboardText.includes(",") ? "," : null;

  if (!separator) {
    return { rows: [], hasValidSeparator: false };
  }

  const rawRows = clipboardText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.split(separator).map((cell) => cell.trim()));

  const parsedRows = rawRows.map((cells, index) => {
    const [rawId, rawCategory, rawName, rawUnit, rawPriceMin, rawPriceMax] = cells;

    const idValue = rawId && rawId !== "-" ? rawId : `${Date.now()}-${index + 1}`;

    const categoryId = resolveSelectValue({
      options: categoryOptions,
      value: rawCategory,
      fallback: categoryOptions[0]?.id,
    });
    const unitId = resolveSelectValue({
      options: unitOptions,
      value: rawUnit,
      fallback: unitOptions[0]?.id,
    });

    return {
      rowKey: `${Date.now()}-${index + 1}`,
      id: idValue,
      category: categoryId,
      categoryLabel: resolveSelectLabel({
        options: categoryOptions,
        id: categoryId,
        fallback: rawCategory || "",
      }),
      name: rawName || "",
      unit: unitId,
      unitLabel: resolveSelectLabel({
        options: unitOptions,
        id: unitId,
        fallback: rawUnit || "",
      }),
      price_min: parseNumberCell(rawPriceMin),
      price_max: parseNumberCell(rawPriceMax),
    };
  });

  return {
    rows: parsedRows,
    hasValidSeparator: true,
  };
};
