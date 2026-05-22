import { drawPdfFilledRect, drawPdfLine, drawPdfText, PDF_COLORS, PDF_PAGE, wrapPdfTextToWidth } from "../pdfPrimitives";
import { SECTION_THREE_LAYOUT } from "./layout";

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

export const buildSectionThreeOperations = (sectionThree, startY, withBackground = true) => {
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
      text: sectionThree.title,
      x: SECTION_THREE_LAYOUT.titleX,
      y: titleY,
      font: "F2",
      fontSize: 15,
    })
  );

  const firstTable = buildSectionThreeTableOperations({
    columns: sectionThree.columns,
    rows: sectionThree.rows,
    x: SECTION_THREE_LAYOUT.firstTableX,
    topY: firstTableTopY,
    headerHeight: SECTION_THREE_LAYOUT.headerHeight,
    rowMinHeight: SECTION_THREE_LAYOUT.rowMinHeight,
    fontSize: 12,
    headerFontSize: 10,
  });
  operations.push(...firstTable.operations);

  const balanceTable = buildSectionThreeBalanceTableOperations(
    sectionThree.balanceRows,
    firstTable.bottomY - SECTION_THREE_LAYOUT.secondTableTopGap
  );
  operations.push(...balanceTable.operations);

  return {
    operations,
    nextY: balanceTable.bottomY,
  };
};
