import { PDF_LAYOUT, SECTION_THREE_LAYOUT, createBackgroundPageOperations } from "./layout";
import { buildSectionOnePdfOperations } from "./section-one";
import { buildSectionTwoOperations } from "./section-two";
import { buildSectionThreeChunks } from "./section-three";
import { buildSectionFourOperations, buildSectionFiveOperations } from "./section-four-five";

// Minimum space (px) needed to start section 3 title + header on the same page as section 2
const MIN_S3_INLINE = 16 + 18 + SECTION_THREE_LAYOUT.titleToTableGap + SECTION_THREE_LAYOUT.headerHeight;

export const buildClosureDocumentPdfPages = (viewModel) => {
  if (!viewModel?.sectionOne) {
    return null;
  }

  const pages = [];

  // ── Sections 1 & 2 ────────────────────────────────────────────────────────
  const s1 = buildSectionOnePdfOperations(viewModel.sectionOne);
  const s2 = buildSectionTwoOperations(viewModel.sectionTwo, s1.nextY);

  let currentPageOps;
  let s2EndY;

  if (s2.nextY >= PDF_LAYOUT.safeBottomY) {
    currentPageOps = [...s1.operations, ...s2.operations];
    s2EndY = s2.nextY;
  } else {
    pages.push(createBackgroundPageOperations(s1.operations));
    const s2Standalone = buildSectionTwoOperations(viewModel.sectionTwo, PDF_LAYOUT.sectionTwoPageStartY);
    currentPageOps = [...s2Standalone.operations];
    s2EndY = s2Standalone.nextY;
  }

  // ── Section 3 ─────────────────────────────────────────────────────────────
  const s3StartsInline = s2EndY - MIN_S3_INLINE >= PDF_LAYOUT.safeBottomY;

  const { chunks: s3Chunks, nextY: s3EndY } = s3StartsInline
    ? buildSectionThreeChunks(viewModel.sectionThree, s2EndY, 16, PDF_LAYOUT.safeBottomY, PDF_LAYOUT.sectionThreePageStartY)
    : buildSectionThreeChunks(viewModel.sectionThree, PDF_LAYOUT.sectionThreePageStartY, SECTION_THREE_LAYOUT.topGap, PDF_LAYOUT.safeBottomY, PDF_LAYOUT.sectionThreePageStartY);

  if (s3StartsInline) {
    currentPageOps.push(...(s3Chunks[0] ?? []));
    pages.push(createBackgroundPageOperations(currentPageOps));
    for (let i = 1; i < s3Chunks.length; i++) {
      pages.push(createBackgroundPageOperations(s3Chunks[i]));
    }
  } else {
    pages.push(createBackgroundPageOperations(currentPageOps));
    s3Chunks.forEach((chunk) => pages.push(createBackgroundPageOperations(chunk)));
  }

  // ── Sections 4 & 5 ────────────────────────────────────────────────────────
  // Compute section 4 at the inline position and check if it actually fits before
  // appending to the last section-3 page. A fixed pixel threshold is not enough
  // because section 4 height depends on its content length.
  const s4AtInline = buildSectionFourOperations(viewModel.sectionFour, s3EndY);
  const s4FitsInline = s4AtInline.nextY >= PDF_LAYOUT.safeBottomY;

  if (s4FitsInline) {
    const lastPage = pages[pages.length - 1];
    lastPage.push(...s4AtInline.operations);

    const s5AtInline = buildSectionFiveOperations(viewModel.sectionFive, s4AtInline.nextY);
    if (s5AtInline.nextY >= PDF_LAYOUT.safeBottomY) {
      lastPage.push(...s5AtInline.operations);
    } else {
      pages.push(createBackgroundPageOperations(
        buildSectionFiveOperations(viewModel.sectionFive, PDF_LAYOUT.sectionFivePageStartY).operations
      ));
    }
  } else {
    const s4 = buildSectionFourOperations(viewModel.sectionFour, PDF_LAYOUT.sectionFourPageStartY);
    const s5 = buildSectionFiveOperations(viewModel.sectionFive, s4.nextY);

    if (s5.nextY >= PDF_LAYOUT.safeBottomY) {
      pages.push(createBackgroundPageOperations([...s4.operations, ...s5.operations]));
    } else {
      pages.push(createBackgroundPageOperations(s4.operations));
      pages.push(createBackgroundPageOperations(
        buildSectionFiveOperations(viewModel.sectionFive, PDF_LAYOUT.sectionFivePageStartY).operations
      ));
    }
  }

  return pages;
};