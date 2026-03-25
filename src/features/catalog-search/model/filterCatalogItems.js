import { toSearchableText } from "../lib/toSearchableText";

export const filterCatalogItems = (rows, query) => {
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return rows;
  }

  return rows.filter((row) =>
    Object.values(row).some((value) =>
      toSearchableText(value).toLowerCase().includes(normalizedQuery)
    )
  );
};
