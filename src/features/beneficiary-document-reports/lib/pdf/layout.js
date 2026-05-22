import { drawPdfFilledRect, PDF_COLORS, PDF_PAGE } from "../pdfPrimitives";

export const SECTION_ONE_LAYOUT = {
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

export const SECTION_TWO_LAYOUT = {
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

export const SECTION_THREE_LAYOUT = {
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

export const SECTION_FOUR_LAYOUT = {
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

export const PDF_LAYOUT = {
  safeBottomY: 44,
  sectionTwoPageStartY: 704,
  sectionThreePageStartY: 768,
  sectionFourPageStartY: 754,
  sectionFivePageStartY: 726,
};

export const createBackgroundPageOperations = (operations = []) => [
  drawPdfFilledRect({
    x: 0,
    y: 0,
    width: PDF_PAGE.width,
    height: PDF_PAGE.height,
    color: PDF_COLORS.background,
  }),
  ...operations,
];
