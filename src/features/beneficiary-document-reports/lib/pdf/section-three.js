import { drawPdfLine, drawPdfText, wrapPdfTextToWidth, PDF_COLORS } from "../pdfPrimitives";
import { SECTION_THREE_LAYOUT } from "./layout";

const S3 = SECTION_THREE_LAYOUT;
const BODY_FONT = 9;
const HEADER_FONT = 9;

// ── helpers ──────────────────────────────────────────────────────────────────

const wrapWidth = (colWidth) => Math.max(20, colWidth - S3.cellPaddingX * 2 - 14);

const computeHeaderMeta = (columns) => {
  const linesByCol = columns.map((col) =>
    wrapPdfTextToWidth(col.label, wrapWidth(col.width), HEADER_FONT)
  );
  const maxLines = Math.max(...linesByCol.map((l) => l.length));
  const height = Math.max(
    S3.headerHeight,
    (maxLines - 1) * S3.lineStep + HEADER_FONT + S3.cellPaddingY * 2
  );
  return { linesByCol, height };
};

const computeRowsMeta = (columns, rows) =>
  rows.map((row) => {
    const cellLines = columns.map((col) =>
      wrapPdfTextToWidth(row?.[col.key] ?? "", wrapWidth(col.width), BODY_FONT)
    );
    const maxLines = Math.max(1, ...cellLines.map((l) => l.length));
    return {
      cellLines,
      height: Math.max(
        S3.rowMinHeight,
        (maxLines - 1) * S3.lineStep + BODY_FONT + S3.cellPaddingY * 2
      ),
    };
  });

const tableWidth = (columns) => columns.reduce((s, c) => s + c.width, 0);

// Draws the header row (top line + bottom line + vertical separators + labels).
// Returns ops array. Does NOT draw the outer left/right borders (those span rows too).
const drawHeader = (columns, x, topY, linesByCol, height) => {
  const tw = tableWidth(columns);
  const bottomY = topY - height;
  const ops = [
    drawPdfLine({ x1: x, y1: topY, x2: x + tw, y2: topY }),
    drawPdfLine({ x1: x, y1: bottomY, x2: x + tw, y2: bottomY }),
    drawPdfLine({ x1: x, y1: topY, x2: x, y2: bottomY }),
    drawPdfLine({ x1: x + tw, y1: topY, x2: x + tw, y2: bottomY }),
  ];

  let cx = x;
  columns.forEach((col, i) => {
    const lines = linesByCol[i];
    const blockH = (lines.length - 1) * S3.lineStep + HEADER_FONT;
    const topOffset = (height - blockH) / 2;
    const centerX = cx + col.width / 2;

    lines.forEach((line, li) => {
      ops.push(
        drawPdfText({
          text: line,
          x: centerX,
          y: topY - topOffset - HEADER_FONT - li * S3.lineStep,
          font: "F2",
          fontSize: HEADER_FONT,
          align: "center",
        })
      );
    });

    cx += col.width;
    if (i < columns.length - 1) {
      ops.push(drawPdfLine({ x1: cx, y1: topY, x2: cx, y2: bottomY }));
    }
  });

  return ops;
};

// Draws a contiguous slice of data rows between topY and topY-totalHeight.
// Draws outer left/right/bottom borders + column separators + row separators + cell text.
const drawRowsSegment = (columns, computedRows, x, topY) => {
  if (computedRows.length === 0) return [];
  const tw = tableWidth(columns);
  const segHeight = computedRows.reduce((s, r) => s + r.height, 0);
  const bottomY = topY - segHeight;

  const ops = [
    drawPdfLine({ x1: x, y1: topY, x2: x, y2: bottomY }),
    drawPdfLine({ x1: x + tw, y1: topY, x2: x + tw, y2: bottomY }),
    drawPdfLine({ x1: x, y1: bottomY, x2: x + tw, y2: bottomY }),
  ];

  // vertical column separators
  let sepX = x;
  columns.forEach((col, i) => {
    sepX += col.width;
    if (i < columns.length - 1) {
      ops.push(drawPdfLine({ x1: sepX, y1: topY, x2: sepX, y2: bottomY }));
    }
  });

  let currentY = topY;
  computedRows.forEach((row, rowIdx) => {
    if (rowIdx > 0) {
      ops.push(drawPdfLine({ x1: x, y1: currentY, x2: x + tw, y2: currentY }));
    }

    let colX = x;
    columns.forEach((col, colIdx) => {
      const lines = row.cellLines[colIdx];
      const blockH = (lines.length - 1) * S3.lineStep + BODY_FONT;
      const topOffset = (row.height - blockH) / 2;
      const textX =
        col.align === "center"
          ? colX + col.width / 2
          : colX + S3.cellPaddingX;

      lines.forEach((line, li) => {
        ops.push(
          drawPdfText({
            text: line,
            x: textX,
            y: currentY - topOffset - BODY_FONT - li * S3.lineStep,
            font: line ? "F3" : "F1",
            fontSize: BODY_FONT,
            color: line ? PDF_COLORS.muted : PDF_COLORS.white,
            align: col.align === "center" ? "center" : "left",
          })
        );
      });

      colX += col.width;
    });

    currentY -= row.height;
  });

  return ops;
};

// ── balance table (second table) ──────────────────────────────────────────────

const buildBalanceTableOps = (rows, topY) => {
  const { secondTableX: x, secondTableWidth: tw, secondTableLabelWidth: labelW,
    secondTableValueWidth: valueW, secondTableRowHeight, cellPaddingY, lineStep } = S3;
  const fontSize = 9;
  const valueColumnX = x + labelW;

  const computedRows = rows.map((row) => {
    const valueLines = wrapPdfTextToWidth(row.value, valueW - S3.cellPaddingX * 2, fontSize);
    return {
      ...row,
      valueLines,
      height: Math.max(
        secondTableRowHeight,
        (valueLines.length - 1) * lineStep + fontSize + cellPaddingY * 2
      ),
    };
  });

  const totalH = computedRows.reduce((s, r) => s + r.height, 0);
  const bottomY = topY - totalH;

  const ops = [
    drawPdfLine({ x1: x, y1: topY, x2: x + tw, y2: topY }),
    drawPdfLine({ x1: x, y1: bottomY, x2: x + tw, y2: bottomY }),
    drawPdfLine({ x1: x, y1: topY, x2: x, y2: bottomY }),
    drawPdfLine({ x1: x + tw, y1: topY, x2: x + tw, y2: bottomY }),
    drawPdfLine({ x1: valueColumnX, y1: topY, x2: valueColumnX, y2: bottomY }),
  ];

  let currentY = topY;
  computedRows.forEach((row, idx) => {
    if (idx > 0) {
      ops.push(drawPdfLine({ x1: x, y1: currentY, x2: x + tw, y2: currentY }));
    }

    const blockH = (row.valueLines.length - 1) * lineStep + fontSize;
    const offset = (row.height - blockH) / 2;

    ops.push(
      drawPdfText({
        text: row.label,
        x: x + S3.cellPaddingX,
        y: currentY - offset - fontSize,
        font: "F2",
        fontSize,
      })
    );

    row.valueLines.forEach((line, li) => {
      ops.push(
        drawPdfText({
          text: line,
          x: valueColumnX + S3.cellPaddingX,
          y: currentY - offset - fontSize - li * lineStep,
          font: "F3",
          fontSize,
          color: PDF_COLORS.muted,
        })
      );
    });

    currentY -= row.height;
  });

  return { ops, bottomY };
};

// ── main export ───────────────────────────────────────────────────────────────

/**
 * Builds section-3 content split into page chunks.
 * Each chunk is a plain array of PDF operation strings (no background rect).
 * Caller wraps with createBackgroundPageOperations.
 *
 * @param sectionThree  view-model object with { title, columns, rows, balanceRows }
 * @param startY        Y to start drawing on the first chunk's page
 * @param topGap        space above the title (use smaller value when continuing same page)
 * @param safeBottomY   minimum Y before a page break is forced
 * @param newPageTopY   Y to restart on continuation pages
 */
export const buildSectionThreeChunks = (
  sectionThree,
  startY,
  topGap,
  safeBottomY,
  newPageTopY
) => {
  const { linesByCol: headerLinesByCol, height: headerH } = computeHeaderMeta(sectionThree.columns);
  const allRows = computeRowsMeta(sectionThree.columns, sectionThree.rows);

  const chunks = [];
  let currentOps = [];

  // ── start first chunk ──────────────────────────────────────────────────────
  const titleY = startY - topGap;
  currentOps.push(
    drawPdfText({
      text: sectionThree.title,
      x: S3.titleX,
      y: titleY,
      font: "F2",
      fontSize: 13,
    })
  );

  let currentY = titleY - S3.titleToTableGap;

  // draw header on current page
  currentOps.push(...drawHeader(sectionThree.columns, S3.firstTableX, currentY, headerLinesByCol, headerH));
  currentY -= headerH;

  // ── distribute rows across pages ──────────────────────────────────────────
  let chunkStartY = currentY; // top of first rows segment on this page
  let chunkRows = [];

  const flushChunk = () => {
    if (chunkRows.length > 0) {
      currentOps.push(...drawRowsSegment(sectionThree.columns, chunkRows, S3.firstTableX, chunkStartY));
    }
  };

  const startNewPage = () => {
    flushChunk();
    chunks.push(currentOps);
    currentOps = [];
    chunkRows = [];

    currentY = newPageTopY - S3.topGap;
    currentOps.push(
      drawPdfText({
        text: sectionThree.title,
        x: S3.titleX,
        y: currentY,
        font: "F2",
        fontSize: 13,
      })
    );
    currentY -= S3.titleToTableGap;
    currentOps.push(...drawHeader(sectionThree.columns, S3.firstTableX, currentY, headerLinesByCol, headerH));
    currentY -= headerH;
    chunkStartY = currentY;
  };

  allRows.forEach((row) => {
    // Check if this row (plus some margin for balance table) fits
    if (currentY - row.height < safeBottomY) {
      startNewPage();
    }
    chunkRows.push(row);
    currentY -= row.height;
  });

  // Flush last rows segment
  flushChunk();

  chunks.push(currentOps);

  return { chunks, nextY: currentY };
};