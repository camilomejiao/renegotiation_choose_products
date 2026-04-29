import { sanitizeAlphaNumericText } from "../../../shared/lib/sanitizeAlphaNumericText";

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const EXPECTED_COLUMN_COUNT = 6;

const parseClipboardRows = ({ clipboardText, separator, expectedColumnCount }) => {
  const rows = [];
  let currentRow = [];
  let currentCell = "";
  let isInsideQuotes = false;
  let quoteWrappedCell = false;

  const pushCell = () => {
    currentRow.push(currentCell.trim());
    currentCell = "";
    quoteWrappedCell = false;
  };

  const pushRow = () => {
    const hasContent = currentRow.some((cell) => String(cell || "").trim() !== "");

    if (hasContent) {
      rows.push(currentRow);
    }

    currentRow = [];
  };

  for (let index = 0; index < clipboardText.length; index += 1) {
    const character = clipboardText[index];
    const nextCharacter = clipboardText[index + 1];

    if (character === '"' && (quoteWrappedCell || currentCell === "")) {
      if (isInsideQuotes && nextCharacter === '"') {
        currentCell += '"';
        index += 1;
        continue;
      }

      quoteWrappedCell = true;
      isInsideQuotes = !isInsideQuotes;
      continue;
    }

    if (!isInsideQuotes && character === separator) {
      pushCell();
      continue;
    }

    if (!isInsideQuotes && (character === "\n" || character === "\r")) {
      const isLineBreakForCurrentCell = currentRow.length < expectedColumnCount - 1;

      if (isLineBreakForCurrentCell) {
        currentCell += "\n";

        if (character === "\r" && nextCharacter === "\n") {
          index += 1;
        }

        continue;
      }

      pushCell();
      pushRow();

      if (character === "\r" && nextCharacter === "\n") {
        index += 1;
      }

      continue;
    }

    currentCell += character;
  }

  pushCell();
  pushRow();

  return rows;
};

const isHeaderRow = (cells = []) => {
  const [id, category, name, unit, priceMin, priceMax] = cells;

  return (
    normalizeText(id) === "id" &&
    normalizeText(category) === "categoria" &&
    normalizeText(name) === "nombre" &&
    normalizeText(unit) === "unidad" &&
    normalizeText(priceMin) === "precio min" &&
    normalizeText(priceMax) === "precio max"
  );
};

const parseNumberCell = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const normalized = String(value).replace(/[^\d.,-]/g, "").replace(/\.(?=.*\.)/g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const resolveSelectValue = ({ options, value, fallback }) => {
  const normalized = normalizeText(sanitizeAlphaNumericText(value));
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

  const rawRows = parseClipboardRows({
    clipboardText,
    separator,
    expectedColumnCount: EXPECTED_COLUMN_COUNT,
  }).filter((cells) => !isHeaderRow(cells));

  const parsedRows = rawRows.map((cells, index) => {
    const [rawId, rawCategory, rawName, rawUnit, rawPriceMin, rawPriceMax] = cells;
    const rowKey = `${Date.now()}-${index + 1}`;
    const idValue = rawId && rawId !== "-" ? rawId : "";
    const sanitizedCategory = sanitizeAlphaNumericText(rawCategory);
    const sanitizedName = sanitizeAlphaNumericText(rawName, { preserveLineBreaks: true });
    const sanitizedUnit = sanitizeAlphaNumericText(rawUnit);

    const categoryId = resolveSelectValue({
      options: categoryOptions,
      value: sanitizedCategory,
      fallback: categoryOptions[0]?.id,
    });
    const unitId = resolveSelectValue({
      options: unitOptions,
      value: sanitizedUnit,
      fallback: unitOptions[0]?.id,
    });

    return {
      rowKey,
      id: idValue,
      category: categoryId,
      categoryLabel: resolveSelectLabel({
        options: categoryOptions,
        id: categoryId,
        fallback: sanitizedCategory,
      }),
      name: sanitizedName,
      unit: unitId,
      unitLabel: resolveSelectLabel({
        options: unitOptions,
        id: unitId,
        fallback: sanitizedUnit,
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
