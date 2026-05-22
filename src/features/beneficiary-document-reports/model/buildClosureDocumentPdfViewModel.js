import {
  buildSectionOneFields,
  DOCUMENT_JUSTIFICATION_PARAGRAPHS,
  DOCUMENT_TEMPLATE_TITLE,
  getDocumentTemplateVariant,
  SECTION_FOUR_PARAGRAPHS,
  SECTION_FOUR_SUBTITLE,
  SECTION_FOUR_SUBTITLE_PARAGRAPHS,
  SECTION_FOUR_TITLE,
  SECTION_FIVE_SUPPORT_COLUMNS,
  SECTION_FIVE_SUPPORT_ROWS,
  SECTION_THREE_BALANCE_FIELDS,
  SECTION_THREE_COMPONENT_COLUMNS,
  SECTION_THREE_TITLE,
  SECTION_TWO_M2_CHOICES,
  SECTION_TWO_M2_LABEL,
  SECTION_TWO_TITLE,
} from "./documentTemplateConfig";
import {
  buildSectionThreeBalanceRows,
  buildSectionThreeComponentRows,
  buildSectionThreeRowsFromAccountStatement,
  resolveM2ValidationOption,
} from "./documentTemplateSelectors";

export const buildClosureDocumentPdfViewModel = ({
  beneficiaryDetails,
  beneficiaryMovements,
  graduationCause,
}) => {
  const variant = getDocumentTemplateVariant(graduationCause);

  if (!variant) {
    return null;
  }

  const sectionOneRows = buildSectionOneFields(beneficiaryDetails, graduationCause);
  const explicitSectionThreeRows = buildSectionThreeComponentRows(
    beneficiaryDetails?.pai_family_components
  );
  const sectionThreeRows =
    explicitSectionThreeRows.length > 0
      ? explicitSectionThreeRows
      : buildSectionThreeRowsFromAccountStatement(beneficiaryMovements?.estado_cuenta);

  return {
    sectionOne: {
      heading: variant.heading,
      title: DOCUMENT_TEMPLATE_TITLE,
      rows: sectionOneRows,
      justificationParagraphs: DOCUMENT_JUSTIFICATION_PARAGRAPHS,
    },
    sectionTwo: {
      title: SECTION_TWO_TITLE,
      label: SECTION_TWO_M2_LABEL,
      choices: SECTION_TWO_M2_CHOICES,
      selectedOption: resolveM2ValidationOption(beneficiaryDetails?.tiene_m2),
    },
    sectionThree: {
      title: SECTION_THREE_TITLE,
      columns: SECTION_THREE_COMPONENT_COLUMNS,
      rows: sectionThreeRows,
      balanceRows: buildSectionThreeBalanceRows(
        beneficiaryDetails,
        SECTION_THREE_BALANCE_FIELDS,
        beneficiaryMovements?.estado_cuenta
      ),
    },
    sectionFour: {
      title: SECTION_FOUR_TITLE,
      paragraphs: SECTION_FOUR_PARAGRAPHS,
      subtitle: SECTION_FOUR_SUBTITLE,
      subtitleParagraphs: SECTION_FOUR_SUBTITLE_PARAGRAPHS,
    },
    sectionFive: {
      columns: SECTION_FIVE_SUPPORT_COLUMNS,
      rows: SECTION_FIVE_SUPPORT_ROWS,
    },
  };
};
