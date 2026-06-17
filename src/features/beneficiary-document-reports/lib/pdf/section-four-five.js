import { drawPdfJustifiedText, drawPdfLine, drawPdfText, PDF_COLORS, wrapPdfTextToWidth } from "../pdfPrimitives";
import { SECTION_FOUR_LAYOUT } from "./layout";

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

const buildSupportTableOperations = ({
  columns,
  rows,
  x,
  topY,
  headerHeight,
  rowMinHeight,
  fontSize = 10,
  centerContent = false,
}) => {
  const tableWidth = columns.reduce((total, column) => total + column.width, 0);
  const headerLinesByColumn = columns.map((column) =>
    wrapPdfTextToWidth(column.label, column.width - 16, fontSize)
  );
  const maxHeaderLines = Math.max(...headerLinesByColumn.map((lines) => lines.length));
  const computedHeaderHeight = Math.max(
    headerHeight,
    (maxHeaderLines - 1) * 11 + fontSize + 18
  );
  const computedRows = rows.map((row) => {
    const cellLines = columns.map((column) =>
      wrapPdfTextToWidth(row?.[column.key] ?? "", column.width - 16, fontSize)
    );
    const maxLines = Math.max(1, ...cellLines.map((lines) => lines.length));

    return {
      cellLines,
      height: Math.max(rowMinHeight, (maxLines - 1) * 11 + fontSize + 16),
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
    drawPdfLine({ x1: x + tableWidth, y1: topY, x2: x + tableWidth, y2: bottomY }),
  ];

  let currentX = x;
  columns.forEach((column, index) => {
    const lines = headerLinesByColumn[index];
    const blockH = (lines.length - 1) * 11 + fontSize;
    const topOffset = (computedHeaderHeight - blockH) / 2;
    const centerX = currentX + column.width / 2;

    lines.forEach((line, lineIndex) => {
      operations.push(
        drawPdfText({
          text: line,
          x: centerX,
          y: topY - topOffset - fontSize - lineIndex * 11,
          font: "F2",
          fontSize,
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
      const isCenter = centerContent || column.align === "center";
      const cellX = isCenter ? columnX + column.width / 2 : columnX + 8;
      const cellLines = computedRow.cellLines[columnIndex];
      const blockH = (cellLines.length - 1) * 11 + fontSize;
      const topOffset = (computedRow.height - blockH) / 2;

      cellLines.forEach((line, lineIndex) => {
        operations.push(
          drawPdfText({
            text: line,
            x: cellX,
            y: currentY - topOffset - fontSize - lineIndex * 11,
            font: "F3",
            fontSize,
            color: PDF_COLORS.white,
            align: isCenter ? "center" : "left",
          })
        );
      });
      columnX += column.width;
    });

    currentY -= computedRow.height;
  });

  return { operations, bottomY };
};

export const buildSectionFourOperations = (sectionFour, startY) => {
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
    topGap,
    titleLineStep,
    nextSectionGap,
  } = SECTION_FOUR_LAYOUT;
  const titleY = startY - topGap;
  const operations = [];

  wrapPdfTextToWidth(sectionFour.title, titleWidth, 15).forEach((line, index) => {
    operations.push(
      drawPdfText({
        text: line,
        x: titleX,
        y: titleY - index * titleLineStep,
        font: "F2",
        fontSize: 15,
      })
    );
  });

  let currentY = titleY - wrapPdfTextToWidth(sectionFour.title, titleWidth, 15).length * titleLineStep - paragraphTopGap + 4;
  const mainParagraphs = buildParagraphBlockOperations({
    paragraphs: sectionFour.paragraphs,
    x: paragraphX,
    startY: currentY,
    width: paragraphWidth,
    lineStep: paragraphLineStep,
    paragraphGap,
  });
  operations.push(...mainParagraphs.operations);
  currentY = mainParagraphs.nextY;

  currentY -= subtitleTopGap;
  const subtitleLines = wrapPdfTextToWidth(sectionFour.subtitle, titleWidth, 15);
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
    paragraphs: sectionFour.subtitleParagraphs,
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

export const buildSectionFiveOperations = (sectionFive, startY) => {
  const table = buildSupportTableOperations({
    columns: sectionFive.columns,
    rows: sectionFive.rows,
    x: 26,
    topY: startY,
    headerHeight: 18,
    rowMinHeight: 22,
    fontSize: 10,
    centerContent: false,
  });

  return {
    operations: table.operations,
    nextY: table.bottomY,
  };
};
