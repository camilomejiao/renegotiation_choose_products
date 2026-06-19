import { drawPdfLine, drawPdfText, wrapPdfTextToWidth } from "../pdfPrimitives";
import { SECTION_TWO_LAYOUT } from "./layout";

export const buildSectionTwoOperations = (
  { title, label, choices, selectedOption },
  startY
) => {
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
    { width: optionTextWidth, label: choices[0].label },
    { width: markWidth, optionId: choices[0].id, isMarkCell: true },
    { width: optionTextWidth, label: choices[1].label },
    { width: markWidth, optionId: choices[1].id, isMarkCell: true },
    { width: noAplicaTextWidth, label: choices[2].label },
    { width: markWidth, optionId: choices[2].id, isMarkCell: true },
  ];
  const containerWidth = columns.reduce((total, column) => total + column.width, 0);

  let currentX = containerX;
  const operations = [
    drawPdfText({
      text: title,
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

  wrapPdfTextToWidth(label, labelWidthAvailable, 10).forEach((line, index) => {
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
