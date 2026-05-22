import { createSimplePdfBlob } from "../../../shared/lib/pdf/createSimplePdfBlob";
import {
  buildSectionOneFields,
  DOCUMENT_JUSTIFICATION_PARAGRAPHS,
  DOCUMENT_TEMPLATE_TITLE,
  getDocumentTemplateVariant,
  SECTION_TWO_M2_CHOICES,
  SECTION_TWO_M2_LABEL,
  SECTION_TWO_TITLE,
} from "../model/documentTemplateConfig";
import { resolveM2ValidationOption } from "../model/documentTemplateSelectors";
import { buildClosureDocumentLines } from "./buildClosureDocumentLines";
import {
  createPdfBlobFromPages,
  drawPdfFilledRect,
  drawPdfLine,
  drawPdfText,
  getOptionalPdfText,
  PDF_COLORS,
  PDF_PAGE,
  wrapPdfTextToWidth,
} from "./pdfPrimitives";

const SECTION_ONE_LAYOUT = {
  headingY: 734,
  titleY: 696,
  titleWidth: 360,
  titleLineStep: 20,
  tableX: 84,
  tableTopY: 636,
  tableWidth: 490,
  labelColumnWidth: 228,
  valueWidth: 246,
  minRowHeight: 18,
  rowTextY: 13,
  rowTextStep: 12,
  rowPadding: 8,
  justificationGap: 42,
  justificationTitleX: 88,
  justificationTitleGap: 26,
  paragraphWidth: 440,
  paragraphLineStep: 16,
  paragraphGap: 22,
};

const SECTION_TWO_LAYOUT = {
  containerX: 40,
  rowHeight: 32,
  labelWidth: 301,
  markWidth: 34,
  optionTextWidth: 41,
  noAplicaTextWidth: 76,
  titleGap: 20,
  labelPaddingX: 7,
  labelPaddingY: 11,
  labelLineStep: 11,
  labelWidthAvailable: 286,
  choiceLabelY: 12,
  choiceMarkY: 12,
  topGap: 18,
};

export const getSectionOneTableRows = (beneficiaryDetails, graduationCause) =>
  buildSectionOneFields(beneficiaryDetails, graduationCause);

const buildTableOperations = (rows) => {
  const {
    tableX,
    tableTopY,
    tableWidth,
    labelColumnWidth,
    valueWidth,
    minRowHeight,
    rowTextY,
    rowTextStep,
    rowPadding,
  } = SECTION_ONE_LAYOUT;
  const valueColumnX = tableX + labelColumnWidth;

  const computedRows = rows.map(({ label, value }) => {
    const valueLines = wrapPdfTextToWidth(value, valueWidth, 10);
    return {
      label,
      valueLines,
      height: Math.max(minRowHeight, valueLines.length * 14 + rowPadding),
    };
  });

  const tableHeight = computedRows.reduce((total, row) => total + row.height, 0);
  const tableBottomY = tableTopY - tableHeight;
  const operations = [
    drawPdfLine({
      x1: tableX,
      y1: tableTopY,
      x2: tableX + tableWidth,
      y2: tableTopY,
    }),
    drawPdfLine({
      x1: tableX,
      y1: tableBottomY,
      x2: tableX + tableWidth,
      y2: tableBottomY,
    }),
    drawPdfLine({
      x1: tableX,
      y1: tableTopY,
      x2: tableX,
      y2: tableBottomY,
    }),
    drawPdfLine({
      x1: tableX + tableWidth,
      y1: tableTopY,
      x2: tableX + tableWidth,
      y2: tableBottomY,
    }),
    drawPdfLine({
      x1: valueColumnX,
      y1: tableTopY,
      x2: valueColumnX,
      y2: tableBottomY,
    }),
  ];

  let currentY = tableTopY;

  computedRows.forEach((row, index) => {
    if (index > 0) {
      operations.push(
        drawPdfLine({
          x1: tableX,
          y1: currentY,
          x2: tableX + tableWidth,
          y2: currentY,
        })
      );
    }

    operations.push(
      drawPdfText({
        text: row.label,
        x: tableX + rowPadding,
        y: currentY - rowTextY,
        font: "F2",
        fontSize: 10,
      })
    );

    row.valueLines.forEach((line, lineIndex) => {
      operations.push(
        drawPdfText({
          text: line,
          x: valueColumnX + rowPadding,
          y: currentY - rowTextY - lineIndex * rowTextStep,
          font: "F3",
          fontSize: 10,
          color: PDF_COLORS.muted,
        })
      );
    });

    currentY -= row.height;
  });

  return { operations, tableBottomY };
};

const buildJustificationOperations = (tableBottomY) => {
  const {
    justificationGap,
    justificationTitleX,
    justificationTitleGap,
    paragraphGap,
    paragraphLineStep,
    paragraphWidth,
  } = SECTION_ONE_LAYOUT;
  const titleY = tableBottomY - justificationGap;
  const operations = [
    drawPdfText({
      text: "JUSTIFICACION",
      x: justificationTitleX,
      y: titleY,
      font: "F2",
      fontSize: 15,
    }),
  ];

  let paragraphY = titleY - justificationTitleGap;

  DOCUMENT_JUSTIFICATION_PARAGRAPHS.forEach((paragraph) => {
    wrapPdfTextToWidth(paragraph, paragraphWidth, 11).forEach((line) => {
      operations.push(
        drawPdfText({
          text: line,
          x: justificationTitleX,
          y: paragraphY,
          font: "F1",
          fontSize: 11,
        })
      );
      paragraphY -= paragraphLineStep;
    });
    paragraphY -= paragraphGap;
  });

  return {
    operations,
    nextY: paragraphY,
  };
};

const buildSectionTwoOperations = (beneficiaryDetails, startY) => {
  const selectedOption = resolveM2ValidationOption(beneficiaryDetails?.tiene_m2);
  const {
    containerX,
    rowHeight,
    labelWidth,
    markWidth,
    optionTextWidth,
    noAplicaTextWidth,
    titleGap,
    labelPaddingX,
    labelPaddingY,
    labelLineStep,
    labelWidthAvailable,
    choiceLabelY,
    choiceMarkY,
    topGap,
  } = SECTION_TWO_LAYOUT;
  const containerTopY = startY - topGap;
  const bottomY = containerTopY - rowHeight;
  const titleY = containerTopY + titleGap;
  const columns = [
    { width: labelWidth },
    { width: optionTextWidth, label: SECTION_TWO_M2_CHOICES[0].label },
    { width: markWidth, optionId: SECTION_TWO_M2_CHOICES[0].id, isMarkCell: true },
    { width: optionTextWidth, label: SECTION_TWO_M2_CHOICES[1].label },
    { width: markWidth, optionId: SECTION_TWO_M2_CHOICES[1].id, isMarkCell: true },
    { width: noAplicaTextWidth, label: SECTION_TWO_M2_CHOICES[2].label },
    { width: markWidth, optionId: SECTION_TWO_M2_CHOICES[2].id, isMarkCell: true },
  ];
  const containerWidth = columns.reduce((total, column) => total + column.width, 0);

  let currentX = containerX;
  const operations = [
    drawPdfText({
      text: SECTION_TWO_TITLE,
      x: containerX,
      y: titleY,
      font: "F2",
      fontSize: 15,
    }),
    drawPdfLine({
      x1: containerX,
      y1: containerTopY,
      x2: containerX + containerWidth,
      y2: containerTopY,
    }),
    drawPdfLine({
      x1: containerX,
      y1: bottomY,
      x2: containerX + containerWidth,
      y2: bottomY,
    }),
    drawPdfLine({
      x1: containerX,
      y1: containerTopY,
      x2: containerX,
      y2: bottomY,
    }),
    drawPdfLine({
      x1: containerX + containerWidth,
      y1: containerTopY,
      x2: containerX + containerWidth,
      y2: bottomY,
    }),
  ];

  wrapPdfTextToWidth(SECTION_TWO_M2_LABEL, labelWidthAvailable, 10).forEach((line, index) => {
    operations.push(
      drawPdfText({
        text: line,
        x: containerX + labelPaddingX,
        y: containerTopY - labelPaddingY - index * labelLineStep,
        font: "F2",
        fontSize: 10,
      })
    );
  });

  columns.forEach((column) => {
    currentX += column.width;
    if (currentX < containerX + containerWidth) {
      operations.push(
        drawPdfLine({
          x1: currentX,
          y1: containerTopY,
          x2: currentX,
          y2: bottomY,
        })
      );
    }
  });

  currentX = containerX;
  columns.forEach((column) => {
    const centerX = currentX + column.width / 2;

    if (column.label) {
      operations.push(
        drawPdfText({
          text: column.label,
          x: centerX,
          y: containerTopY - choiceLabelY,
          font: "F2",
          fontSize: 10,
          align: "center",
        })
      );
    }

    if (column.isMarkCell && column.optionId === selectedOption) {
      operations.push(
        drawPdfText({
          text: "X",
          x: centerX,
          y: containerTopY - choiceMarkY,
          font: "F2",
          fontSize: 13,
          align: "center",
        })
      );
    }

    currentX += column.width;
  });

  return {
    operations,
    nextY: bottomY,
  };
};

const buildSectionOnePdfOperations = (beneficiaryDetails, graduationCause) => {
  const variant = getDocumentTemplateVariant(graduationCause);

  if (!variant) {
    return null;
  }

  const operations = [
    drawPdfFilledRect({
      x: 0,
      y: 0,
      width: PDF_PAGE.width,
      height: PDF_PAGE.height,
      color: PDF_COLORS.background,
    }),
    drawPdfText({
      text: getOptionalPdfText(variant.heading).toUpperCase(),
      x: PDF_PAGE.width / 2,
      y: SECTION_ONE_LAYOUT.headingY,
      font: "F2",
      fontSize: 15,
      align: "center",
    }),
  ];

  wrapPdfTextToWidth(DOCUMENT_TEMPLATE_TITLE, SECTION_ONE_LAYOUT.titleWidth, 13).forEach(
    (line, index) => {
      operations.push(
        drawPdfText({
          text: line,
          x: PDF_PAGE.width / 2,
          y: SECTION_ONE_LAYOUT.titleY - index * SECTION_ONE_LAYOUT.titleLineStep,
          font: "F2",
          fontSize: 13,
          align: "center",
        })
      );
    }
  );

  const { operations: tableOperations, tableBottomY } = buildTableOperations(
    getSectionOneTableRows(beneficiaryDetails, graduationCause)
  );

  operations.push(...tableOperations);
  const justificationBlock = buildJustificationOperations(tableBottomY);
  operations.push(...justificationBlock.operations);

  return {
    operations,
    nextY: justificationBlock.nextY,
  };
};

export const createClosureDocumentPdfBlob = ({ beneficiaryDetails, row }) => {
  const visualPdfOperations = buildSectionOnePdfOperations(
    beneficiaryDetails,
    row?.graduationCause
  );

  if (visualPdfOperations) {
    const sectionTwoBlock = buildSectionTwoOperations(
      beneficiaryDetails,
      visualPdfOperations.nextY
    );

    return createPdfBlobFromPages([
      [...visualPdfOperations.operations, ...sectionTwoBlock.operations],
    ]);
  }

  return createSimplePdfBlob({
    lines: buildClosureDocumentLines({
      beneficiaryDetails,
      row,
    }),
  });
};
