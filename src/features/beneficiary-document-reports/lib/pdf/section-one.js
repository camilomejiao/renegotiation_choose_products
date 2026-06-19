import {
  drawPdfJustifiedText,
  drawPdfLine,
  drawPdfText,
  getOptionalPdfText,
  PDF_COLORS,
  wrapPdfTextToWidth,
} from "../pdfPrimitives";
import { SECTION_ONE_LAYOUT } from "./layout";

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
    drawPdfLine({ x1: tableX, y1: tableTopY, x2: tableX + tableWidth, y2: tableTopY }),
    drawPdfLine({ x1: tableX, y1: tableBottomY, x2: tableX + tableWidth, y2: tableBottomY }),
    drawPdfLine({ x1: tableX, y1: tableTopY, x2: tableX, y2: tableBottomY }),
    drawPdfLine({ x1: tableX + tableWidth, y1: tableTopY, x2: tableX + tableWidth, y2: tableBottomY }),
    drawPdfLine({ x1: valueColumnX, y1: tableTopY, x2: valueColumnX, y2: tableBottomY }),
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

const buildJustificationOperations = (tableBottomY, justificationParagraphs) => {
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

  justificationParagraphs.forEach((paragraph) => {
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

export const buildSectionOnePdfOperations = ({
  heading,
  title,
  rows,
  justificationParagraphs,
}) => {
  const operations = [];

  wrapPdfTextToWidth(title, SECTION_ONE_LAYOUT.titleWidth, 13).forEach(
    (line, index) => {
      operations.push(
        drawPdfText({
          text: line,
          x: 306,
          y: SECTION_ONE_LAYOUT.titleY - index * SECTION_ONE_LAYOUT.titleLineStep,
          font: "F2",
          fontSize: 13,
          align: "center",
        })
      );
    }
  );

  const { operations: tableOperations, tableBottomY } = buildTableOperations(
    rows
  );

  operations.push(...tableOperations);
  const justificationBlock = buildJustificationOperations(
    tableBottomY,
    justificationParagraphs
  );
  operations.push(...justificationBlock.operations);

  return {
    operations,
    nextY: justificationBlock.nextY,
  };
};
