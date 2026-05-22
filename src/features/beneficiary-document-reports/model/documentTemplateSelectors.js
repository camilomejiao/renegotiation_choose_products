import { SECTION_THREE_TEMPLATE_COMPONENT_ROWS } from "./documentTemplateConfig";

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

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
  });

const includesMatcher = (value, matcher) =>
  normalizeComparableValue(value).includes(normalizeComparableValue(matcher));

const rowMatchesTemplate = (row, template) =>
  (template.matchers || []).some((matcher) => includesMatcher(row?.component, matcher));

const getTemplateMatches = (accountStatementRows = [], template) =>
  accountStatementRows.filter((row) => rowMatchesTemplate(row, template));

const buildDerivedComponentRow = (template, accountStatementRows = []) => {
  const matches = getTemplateMatches(accountStatementRows, template);
  const matchedRow = matches[0];
  const totalExecuted =
    template.matchMode === "aggregate"
      ? matches.length > 0
        ? formatCurrency(
            matches.reduce((total, row) => total + Number(row?.payNum || 0), 0)
          )
        : ""
      : matchedRow?.pay ?? "";

  return {
    component: template.component,
    totalExecuted,
    operator: matchedRow?.operator || template.fallbackOperator || "",
    lastDeliveryDate: matchedRow?.lastDeliveryDate || "",
  };
};

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

export const buildSectionThreeComponentRows = (rows = []) => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return [];
  }

  return rows.map((row) => ({
    component: row?.component ?? "",
    totalExecuted: row?.totalExecuted ?? "",
    operator: row?.operator ?? "",
    lastDeliveryDate: row?.lastDeliveryDate ?? "",
  }));
};

export const buildSectionThreeRowsFromAccountStatement = (accountStatementRows = []) =>
  SECTION_THREE_TEMPLATE_COMPONENT_ROWS.map((template) =>
    buildDerivedComponentRow(template, accountStatementRows)
  );

export const buildSectionThreeBalanceRows = (
  beneficiaryDetails,
  fields = [],
  accountStatementRows = []
) =>
  fields.map(({ label, sourceKey }) => {
    const explicitValue = beneficiaryDetails?.[sourceKey];

    if (explicitValue) {
      return {
        label,
        value: explicitValue,
      };
    }

    const matchingTemplate = SECTION_THREE_TEMPLATE_COMPONENT_ROWS.find((template) =>
      (template.balanceSourceKeys || []).includes(sourceKey)
    );
    const matches = matchingTemplate
      ? getTemplateMatches(accountStatementRows, matchingTemplate)
      : [];
    const totalBalance = matches.reduce(
      (total, row) => total + Number(row?.debtNum || 0),
      0
    );

    return {
      label,
      value: matches.length > 0 ? formatCurrency(totalBalance) : "",
    };
  });
