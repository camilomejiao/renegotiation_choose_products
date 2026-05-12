const normalizeSearchText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export const matchesSupplierSelectOption = (inputValue, option) => {
  const query = normalizeSearchText(inputValue);

  if (!query) {
    return true;
  }

  const rawLabel = String(option?.label ?? "");
  const normalizedLabel = normalizeSearchText(rawLabel);
  const [supplierName = "", supplierNit = ""] = rawLabel.split("—");

  return (
    normalizedLabel.includes(query) ||
    normalizeSearchText(supplierName).includes(query) ||
    normalizeSearchText(supplierNit).includes(query)
  );
};
