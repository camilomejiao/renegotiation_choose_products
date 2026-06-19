import { GRADUATION_CAUSE } from "../../../entities/beneficiary";

const DOCUMENT_TITLE =
  "FORMALIZACION DEL CIERRE DE LA IMPLEMENTACION DEL PROGRAMA NACIONAL DE SUSTITUCION DE CULTIVOS DE USO ILICITO - PNIS";

const JUSTIFICATION_PARAGRAPHS = [
  "Con fundamento en la informacion registrada en los sistemas de informacion institucionales y los soportes documentales asociados al expediente del titular, se deja constancia que la Direccion de Sustitucion de Cultivos de Uso Ilicito (DSCI) adelanto las acciones que se encontraban a su cargo en el marco de la implementacion de los componentes del Programa Nacional Integral de Sustitucion de Cultivos de Uso Ilicito (PNIS).",
  "En este contexto, el presente formato constituye el instrumento de consolidacion de la informacion tecnica, administrativa y financiera del proceso de atencion, mediante el cual se documentan las acciones ejecutadas, se verifica el cumplimiento de las obligaciones a cargo de las partes y se formaliza el cierre de la implementacion del programa en el proceso del titular.",
];

const SECTION_LINE_WIDTH = 92;

const getOptionalText = (value) => String(value ?? "").trim();

const wrapText = (text, maxWidth = SECTION_LINE_WIDTH) => {
  const normalizedText = getOptionalText(text);

  if (!normalizedText) {
    return [""];
  }

  const words = normalizedText.split(/\s+/);
  const lines = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (nextLine.length <= maxWidth) {
      currentLine = nextLine;
      return;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    currentLine = word;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
};

const buildFieldLines = (label, value) => {
  const resolvedValue = getOptionalText(value);
  const prefix = `${label}:`;
  const availableWidth = SECTION_LINE_WIDTH - prefix.length - 1;

  if (availableWidth <= 0) {
    return [prefix, ...wrapText(resolvedValue)];
  }

  const wrappedValueLines = wrapText(resolvedValue, availableWidth);
  const [firstLine = "", ...remainingLines] = wrappedValueLines;

  return [
    `${prefix} ${firstLine}`.trimEnd(),
    ...remainingLines.map((line) => `${" ".repeat(prefix.length + 1)}${line}`),
  ];
};

const buildAttentionDifferentialSectionOne = (beneficiaryDetails) => [
  "ATENCION DIFERENCIAL",
  "",
  ...wrapText(DOCUMENT_TITLE, 72),
  "",
  ...buildFieldLines("CUB", beneficiaryDetails?.cub),
  ...buildFieldLines("Nombre del Titular", beneficiaryDetails?.nombre_completo),
  ...buildFieldLines("Cedula del titular", beneficiaryDetails?.identificacion),
  ...buildFieldLines(
    "Nombre del beneficiario",
    beneficiaryDetails?.nombre_completo_beneficiario
  ),
  ...buildFieldLines(
    "Cedula del beneficiario",
    beneficiaryDetails?.identificacion_beneficiario
  ),
  ...buildFieldLines("Departamento", beneficiaryDetails?.departamento),
  ...buildFieldLines("Municipio", beneficiaryDetails?.municipio),
  ...buildFieldLines("Vereda", beneficiaryDetails?.vereda),
  ...buildFieldLines("Tipo de atencion", beneficiaryDetails?.causal),
  "",
  "JUSTIFICACION",
  "",
  ...JUSTIFICATION_PARAGRAPHS.flatMap((paragraph) => [...wrapText(paragraph), ""]),
];

const buildFinancialObligationPaymentSectionOne = (beneficiaryDetails) => [
  "PAGO DE OBLIGACIONES FINANCIERAS",
  "",
  ...wrapText(DOCUMENT_TITLE, 72),
  "",
  ...buildFieldLines("CUB", beneficiaryDetails?.cub),
  ...buildFieldLines("Nombre del Titular", beneficiaryDetails?.nombre_completo),
  ...buildFieldLines("Cedula del titular", beneficiaryDetails?.identificacion),
  ...buildFieldLines(
    "Nombre del beneficiario",
    beneficiaryDetails?.nombre_completo_beneficiario
  ),
  ...buildFieldLines(
    "Cedula del beneficiario",
    beneficiaryDetails?.identificacion_beneficiario
  ),
  ...buildFieldLines("Departamento", beneficiaryDetails?.departamento),
  ...buildFieldLines("Municipio", beneficiaryDetails?.municipio),
  ...buildFieldLines("Vereda", beneficiaryDetails?.vereda),
  ...buildFieldLines("Tipo de atencion", beneficiaryDetails?.causal),
  "",
  "JUSTIFICACION",
  "",
  ...JUSTIFICATION_PARAGRAPHS.flatMap((paragraph) => [...wrapText(paragraph), ""]),
];

const buildPendingCauseDocument = ({ beneficiaryDetails, row }) => [
  "Documento de cierre PNIS",
  "",
  `CUB: ${getOptionalText(beneficiaryDetails?.cub)}`,
  `Estado titular: ${getOptionalText(row?.holderStatus)}`,
  `Causal de graduacion: ${getOptionalText(row?.graduationCause)}`,
  "",
  "La plantilla PDF para esta causal aun no ha sido implementada.",
];

export const buildClosureDocumentLines = ({ beneficiaryDetails, row }) => {
  if (
    row?.graduationCause === GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION ||
    row?.graduationCause === GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT
  ) {
    if (row?.graduationCause === GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT) {
      return buildFinancialObligationPaymentSectionOne(beneficiaryDetails);
    }

    return buildAttentionDifferentialSectionOne(beneficiaryDetails);
  }

  return buildPendingCauseDocument({ beneficiaryDetails, row });
};
