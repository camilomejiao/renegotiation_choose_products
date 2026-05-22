import { createSimplePdfBlob } from "../../../shared/lib/pdf/createSimplePdfBlob";
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
} from "../model/documentTemplateConfig";
import {
  buildSectionThreeBalanceRows,
  buildSectionThreeComponentRows,
  buildSectionThreeRowsFromAccountStatement,
  resolveM2ValidationOption,
} from "../model/documentTemplateSelectors";
import { buildClosureDocumentLines } from "./buildClosureDocumentLines";
import {
  createPdfBlobFromPages,
  drawPdfFilledRect,
  drawPdfJustifiedText,
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

const SECTION_THREE_LAYOUT = {
  titleX: 26,
  topGap: 34,
  titleToTableGap: 34,
  firstTableX: 25,
  headerHeight: 48,
  rowMinHeight: 30,
  cellPaddingX: 6,
  cellPaddingY: 8,
  lineStep: 11,
  secondTableX: 84,
  secondTableTopGap: 10,
  secondTableWidth: 444,
  secondTableLabelWidth: 190,
  secondTableRowHeight: 24,
  secondTableValueWidth: 238,
};

const SECTION_FOUR_LAYOUT = {
  titleX: 88,
  paragraphX: 88,
  paragraphWidth: 440,
  titleWidth: 440,
  paragraphTopGap: 24,
  paragraphLineStep: 19,
  paragraphGap: 22,
  subtitleTopGap: 20,
  subtitleParagraphTopGap: 28,
  tableTopGap: 18,
  topGap: 2,
  titleLineStep: 18,
  nextSectionGap: 22,
};

const PDF_LAYOUT = {
  safeBottomY: 44,
  sectionTwoPageStartY: 704,
  sectionThreePageStartY: 768,
  sectionFourPageStartY: 754,
  sectionFivePageStartY: 726,
};

const createBackgroundPageOperations = (operations = []) => [
  drawPdfFilledRect({
    x: 0,
    y: 0,
    width: PDF_PAGE.width,
    height: PDF_PAGE.height,
    color: PDF_COLORS.background,
  }),
  ...operations,
];

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
    const lines = wrapPdfTextToWidth(paragraph, paragraphWidth, 11);

    lines.forEach((line, index) => {
      operations.push(
        index < lines.length - 1
          ? drawPdfJustifiedText({
              text: line,
              x: justificationTitleX,
              y: paragraphY,
              width: paragraphWidth,
              font: "F1",
              fontSize: 11,
              color: PDF_COLORS.white,
            })
          : drawPdfText({
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

const buildParagraphBlockOperations = ({
  paragraphs,
  x,
  startY,
  width,
  lineStep,
  paragraphGap,
}) => {
  const operations = [];
  let currentY = startY;

  paragraphs.forEach((paragraph) => {
    const lines = wrapPdfTextToWidth(paragraph, width, 11);

    lines.forEach((line, index) => {
      operations.push(
        index < lines.length - 1
          ? drawPdfJustifiedText({
              text: line,
              x,
              y: currentY,
              width,
              font: "F1",
              fontSize: 11,
              color: PDF_COLORS.white,
            })
          : drawPdfText({
              text: line,
              x,
              y: currentY,
              font: "F1",
              fontSize: 11,
            })
      );
      currentY -= lineStep;
    });
    currentY -= paragraphGap;
  });

  return {
    operations,
    nextY: currentY,
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

const buildSectionThreeTableOperations = ({
  columns,
  rows,
  x,
  topY,
  headerHeight,
  rowMinHeight,
  fontSize = 12,
  headerFontSize = 10,
  valueColor = PDF_COLORS.muted,
}) => {
  const tableWidth = columns.reduce((total, column) => total + column.width, 0);
  const headerLinesByColumn = columns.map((column) =>
    wrapPdfTextToWidth(
      column.label,
      column.width - SECTION_THREE_LAYOUT.cellPaddingX * 2,
      headerFontSize
    )
  );
  const computedHeaderHeight = Math.max(
    headerHeight,
    Math.max(...headerLinesByColumn.map((lines) => lines.length)) *
      SECTION_THREE_LAYOUT.lineStep +
      SECTION_THREE_LAYOUT.cellPaddingY * 2 +
      headerFontSize
  );
  const computedRows = rows.map((row) => {
    const cellLines = columns.map((column) =>
      wrapPdfTextToWidth(
        row?.[column.key] ?? "",
        column.width - SECTION_THREE_LAYOUT.cellPaddingX * 2,
        fontSize
      )
    );
    const maxLines = Math.max(1, ...cellLines.map((lines) => lines.length));

    return {
      row,
      cellLines,
      height: Math.max(
        rowMinHeight,
        maxLines * SECTION_THREE_LAYOUT.lineStep +
          SECTION_THREE_LAYOUT.cellPaddingY * 2 +
          fontSize
      ),
    };
  });

  const bodyHeight = computedRows.reduce((total, row) => total + row.height, 0);
  const bottomY = topY - computedHeaderHeight - bodyHeight;
  const operations = [
    drawPdfLine({ x1: x, y1: topY, x2: x + tableWidth, y2: topY }),
    drawPdfLine({
      x1: x,
      y1: topY - computedHeaderHeight,
      x2: x + tableWidth,
      y2: topY - computedHeaderHeight,
    }),
    drawPdfLine({ x1: x, y1: bottomY, x2: x + tableWidth, y2: bottomY }),
    drawPdfLine({ x1: x, y1: topY, x2: x, y2: bottomY }),
    drawPdfLine({
      x1: x + tableWidth,
      y1: topY,
      x2: x + tableWidth,
      y2: bottomY,
    }),
  ];

  let currentX = x;
  columns.forEach((column, index) => {
    const centerX = currentX + column.width / 2;

    headerLinesByColumn[index].forEach((line, lineIndex) => {
      operations.push(
        drawPdfText({
          text: line,
          x: centerX,
          y:
            topY -
            SECTION_THREE_LAYOUT.cellPaddingY -
            headerFontSize -
            lineIndex * SECTION_THREE_LAYOUT.lineStep,
          font: "F2",
          fontSize: headerFontSize,
          align: "center",
        })
      );
    });

    currentX += column.width;
    if (index < columns.length - 1) {
      operations.push(
        drawPdfLine({
          x1: currentX,
          y1: topY,
          x2: currentX,
          y2: bottomY,
        })
      );
    }
  });

  let currentY = topY - computedHeaderHeight;
  computedRows.forEach((computedRow, rowIndex) => {
    if (rowIndex > 0) {
      operations.push(
        drawPdfLine({
          x1: x,
          y1: currentY,
          x2: x + tableWidth,
          y2: currentY,
        })
      );
    }

    let columnX = x;
    columns.forEach((column, columnIndex) => {
      const cellX =
        column.align === "center"
          ? columnX + column.width / 2
          : columnX + SECTION_THREE_LAYOUT.cellPaddingX;

      computedRow.cellLines[columnIndex].forEach((line, lineIndex) => {
        operations.push(
          drawPdfText({
            text: line,
            x: cellX,
            y:
              currentY -
              SECTION_THREE_LAYOUT.cellPaddingY -
              fontSize -
              lineIndex * SECTION_THREE_LAYOUT.lineStep,
            font: line ? "F3" : "F1",
            fontSize,
            color: line ? valueColor : PDF_COLORS.white,
            align: column.align === "center" ? "center" : "left",
          })
        );
      });
      columnX += column.width;
    });

    currentY -= computedRow.height;
  });

  return { operations, bottomY };
};

const buildSectionThreeBalanceTableOperations = (rows, topY) => {
  const {
    secondTableX,
    secondTableWidth,
    secondTableLabelWidth,
    secondTableRowHeight,
    secondTableValueWidth,
  } = SECTION_THREE_LAYOUT;
  const valueColumnX = secondTableX + secondTableLabelWidth;
  const computedRows = rows.map((row) => {
    const valueLines = wrapPdfTextToWidth(row.value, secondTableValueWidth - 16, 12);

    return {
      ...row,
      valueLines,
      height: Math.max(
        secondTableRowHeight,
        valueLines.length * SECTION_THREE_LAYOUT.lineStep +
          SECTION_THREE_LAYOUT.cellPaddingY * 2 +
          12
      ),
    };
  });
  const bottomY = topY - computedRows.reduce((total, row) => total + row.height, 0);
  const operations = [
    drawPdfLine({
      x1: secondTableX,
      y1: topY,
      x2: secondTableX + secondTableWidth,
      y2: topY,
    }),
    drawPdfLine({
      x1: secondTableX,
      y1: bottomY,
      x2: secondTableX + secondTableWidth,
      y2: bottomY,
    }),
    drawPdfLine({
      x1: secondTableX,
      y1: topY,
      x2: secondTableX,
      y2: bottomY,
    }),
    drawPdfLine({
      x1: secondTableX + secondTableWidth,
      y1: topY,
      x2: secondTableX + secondTableWidth,
      y2: bottomY,
    }),
    drawPdfLine({
      x1: valueColumnX,
      y1: topY,
      x2: valueColumnX,
      y2: bottomY,
    }),
  ];

  let currentY = topY;
  computedRows.forEach((row, index) => {
    if (index > 0) {
      operations.push(
        drawPdfLine({
          x1: secondTableX,
          y1: currentY,
          x2: secondTableX + secondTableWidth,
          y2: currentY,
        })
      );
    }

    operations.push(
      drawPdfText({
        text: row.label,
        x: secondTableX + 8,
        y: currentY - SECTION_THREE_LAYOUT.cellPaddingY - 12,
        font: "F2",
        fontSize: 12,
      })
    );

    row.valueLines.forEach((line, lineIndex) => {
      operations.push(
        drawPdfText({
          text: line,
          x: valueColumnX + 8,
          y:
            currentY -
            SECTION_THREE_LAYOUT.cellPaddingY -
            12 -
            lineIndex * SECTION_THREE_LAYOUT.lineStep,
          font: "F3",
          fontSize: 12,
          color: PDF_COLORS.muted,
        })
      );
    });

    currentY -= row.height;
  });

  return { operations, bottomY };
};

const buildSectionThreeOperations = (
  beneficiaryDetails,
  beneficiaryMovements,
  startY,
  withBackground = true
) => {
  const componentRows =
    buildSectionThreeComponentRows(beneficiaryDetails?.pai_family_components) ||
    [];
  const derivedComponentRows = buildSectionThreeRowsFromAccountStatement(
    beneficiaryMovements?.estado_cuenta
  );
  const rowsToRender =
    componentRows.length > 0 ? componentRows : derivedComponentRows;
  const titleY = startY - SECTION_THREE_LAYOUT.topGap;
  const firstTableTopY = titleY - SECTION_THREE_LAYOUT.titleToTableGap;
  const operations = [];

  if (withBackground) {
    operations.push(
      drawPdfFilledRect({
        x: 0,
        y: 0,
        width: PDF_PAGE.width,
        height: PDF_PAGE.height,
        color: PDF_COLORS.background,
      })
    );
  }

  operations.push(
    drawPdfText({
      text: SECTION_THREE_TITLE,
      x: SECTION_THREE_LAYOUT.titleX,
      y: titleY,
      font: "F2",
      fontSize: 15,
    })
  );

  const firstTable = buildSectionThreeTableOperations({
    columns: SECTION_THREE_COMPONENT_COLUMNS,
    rows: rowsToRender,
    x: SECTION_THREE_LAYOUT.firstTableX,
    topY: firstTableTopY,
    headerHeight: SECTION_THREE_LAYOUT.headerHeight,
    rowMinHeight: SECTION_THREE_LAYOUT.rowMinHeight,
    fontSize: 12,
    headerFontSize: 10,
  });
  operations.push(...firstTable.operations);

  const balanceTable = buildSectionThreeBalanceTableOperations(
    buildSectionThreeBalanceRows(
      beneficiaryDetails,
      SECTION_THREE_BALANCE_FIELDS,
      beneficiaryMovements?.estado_cuenta
    ),
    firstTable.bottomY - SECTION_THREE_LAYOUT.secondTableTopGap
  );
  operations.push(...balanceTable.operations);

  return {
    operations,
    nextY: balanceTable.bottomY,
  };
};

const buildSectionFiveOperations = (startY) => {
  const table = buildSectionThreeTableOperations({
    columns: SECTION_FIVE_SUPPORT_COLUMNS,
    rows: SECTION_FIVE_SUPPORT_ROWS,
    x: 26,
    topY: startY,
    headerHeight: 18,
    rowMinHeight: 22,
    fontSize: 10,
    valueColor: PDF_COLORS.white,
  });

  return {
    operations: table.operations,
    nextY: table.bottomY,
  };
};

const buildSectionFourOperations = (startY) => {
  const {
    titleX,
    paragraphX,
    paragraphWidth,
    titleWidth,
    paragraphTopGap,
    paragraphLineStep,
    paragraphGap,
    subtitleTopGap,
    subtitleParagraphTopGap,
    tableTopGap,
    topGap,
    titleLineStep,
    nextSectionGap,
  } = SECTION_FOUR_LAYOUT;
  const titleY = startY - topGap;
  const operations = [];

  wrapPdfTextToWidth(SECTION_FOUR_TITLE, titleWidth, 15).forEach(
    (line, index) => {
      operations.push(
        drawPdfText({
          text: line,
          x: titleX,
          y: titleY - index * titleLineStep,
          font: "F2",
          fontSize: 15,
        })
      );
    }
  );

  let currentY =
    titleY -
    wrapPdfTextToWidth(SECTION_FOUR_TITLE, titleWidth, 15).length *
      titleLineStep -
    paragraphTopGap +
    4;
  const mainParagraphs = buildParagraphBlockOperations({
    paragraphs: SECTION_FOUR_PARAGRAPHS,
    x: paragraphX,
    startY: currentY,
    width: paragraphWidth,
    lineStep: paragraphLineStep,
    paragraphGap,
  });
  operations.push(...mainParagraphs.operations);
  currentY = mainParagraphs.nextY;

  currentY -= subtitleTopGap;
  const subtitleLines = wrapPdfTextToWidth(SECTION_FOUR_SUBTITLE, titleWidth, 15);
  subtitleLines.forEach((line, index) => {
    operations.push(
      drawPdfText({
        text: line,
        x: titleX,
        y: currentY - index * titleLineStep,
        font: "F2",
        fontSize: 15,
      })
    );
  });

  currentY = currentY - subtitleLines.length * titleLineStep - subtitleParagraphTopGap + 4;
  const subtitleParagraphs = buildParagraphBlockOperations({
    paragraphs: SECTION_FOUR_SUBTITLE_PARAGRAPHS,
    x: paragraphX,
    startY: currentY,
    width: paragraphWidth,
    lineStep: paragraphLineStep,
    paragraphGap,
  });
  operations.push(...subtitleParagraphs.operations);
  currentY = subtitleParagraphs.nextY;

  return {
    operations,
    nextY: currentY - nextSectionGap,
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

export const createClosureDocumentPdfBlob = ({
  beneficiaryDetails,
  beneficiaryMovements,
  row,
}) => {
  const visualPdfOperations = buildSectionOnePdfOperations(
    beneficiaryDetails,
    row?.graduationCause
  );

  if (visualPdfOperations) {
    const sectionTwoBlock = buildSectionTwoOperations(beneficiaryDetails, visualPdfOperations.nextY);
    const firstPageOperations =
      sectionTwoBlock.nextY >= PDF_LAYOUT.safeBottomY
        ? [...visualPdfOperations.operations, ...sectionTwoBlock.operations]
        : [...visualPdfOperations.operations];
    const extraPages = [];

    if (sectionTwoBlock.nextY < PDF_LAYOUT.safeBottomY) {
      const sectionTwoStandalonePage = buildSectionTwoOperations(
        beneficiaryDetails,
        PDF_LAYOUT.sectionTwoPageStartY
      );
      extraPages.push(createBackgroundPageOperations(sectionTwoStandalonePage.operations));
    }

  const sectionThreeBlock = buildSectionThreeOperations(
      beneficiaryDetails,
      beneficiaryMovements,
      PDF_LAYOUT.sectionThreePageStartY,
      true
    );
    const sectionFourBlock = buildSectionFourOperations(PDF_LAYOUT.sectionFourPageStartY);
    const sectionFiveBlock = buildSectionFiveOperations(sectionFourBlock.nextY);
    const lastPageOperations =
      sectionFiveBlock.nextY >= PDF_LAYOUT.safeBottomY
        ? createBackgroundPageOperations([
            ...sectionFourBlock.operations,
            ...sectionFiveBlock.operations,
          ])
        : createBackgroundPageOperations([...sectionFourBlock.operations]);

    if (sectionFiveBlock.nextY < PDF_LAYOUT.safeBottomY) {
      extraPages.push(
        createBackgroundPageOperations(
          buildSectionFiveOperations(PDF_LAYOUT.sectionFivePageStartY).operations
        )
      );
    }

    return createPdfBlobFromPages([
      createBackgroundPageOperations(firstPageOperations),
      ...extraPages,
      [...sectionThreeBlock.operations],
      lastPageOperations,
    ]);
  }

  return createSimplePdfBlob({
    lines: buildClosureDocumentLines({
      beneficiaryDetails,
      row,
    }),
  });
};
