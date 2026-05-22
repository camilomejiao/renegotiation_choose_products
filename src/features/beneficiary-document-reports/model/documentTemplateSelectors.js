export const SECTION_TWO_M2_OPTION = {
  YES: "yes",
  NO: "no",
  NOT_APPLICABLE: "not_applicable",
};

const normalizeComparableValue = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

export const resolveM2ValidationOption = (value) => {
  const normalizedValue = normalizeComparableValue(value);

  if (normalizedValue === "SI") {
    return SECTION_TWO_M2_OPTION.YES;
  }

  if (normalizedValue === "NO") {
    return SECTION_TWO_M2_OPTION.NO;
  }

  return SECTION_TWO_M2_OPTION.NOT_APPLICABLE;
};
