export const ORDER_SEARCH_DEBOUNCE_MS = 500;

export const ORDER_SEARCH_OPTIONS = [
  { value: "cub", label: "CUB" },
  { value: "orden", label: "ORDEN" },
  { value: "cedula", label: "CEDULA" },
];

export const DEFAULT_ORDER_SEARCH_OPTION = ORDER_SEARCH_OPTIONS[0];

export const normalizeOrderSearchValue = (value) =>
  String(value ?? "").trim();

export const getOrderSearchError = (
  { field, value },
  { allowEmpty = false } = {}
) => {
  const normalizedField = String(field ?? "").trim().toLowerCase();
  const normalizedValue = normalizeOrderSearchValue(value);

  if (!normalizedValue.length && allowEmpty) {
    return null;
  }

  if (normalizedField === "cedula" && normalizedValue.length < 5) {
    return "El valor a buscar debe tener al menos 5 caracteres";
  }

  return null;
};
