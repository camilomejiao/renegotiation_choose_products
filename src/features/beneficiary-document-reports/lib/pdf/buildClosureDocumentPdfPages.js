import { PDF_LAYOUT, createBackgroundPageOperations } from "./layout";
import { buildSectionOnePdfOperations } from "./section-one";
import { buildSectionTwoOperations } from "./section-two";
import { buildSectionThreeOperations } from "./section-three";
import { buildSectionFourOperations, buildSectionFiveOperations } from "./section-four-five";

export const buildClosureDocumentPdfPages = (viewModel) => {
  if (!viewModel?.sectionOne) {
    return null;
  }

  const sectionOneBlock = buildSectionOnePdfOperations(viewModel.sectionOne);
  const sectionTwoBlock = buildSectionTwoOperations(
    viewModel.sectionTwo,
    sectionOneBlock.nextY
  );
  const firstPageOperations =
    sectionTwoBlock.nextY >= PDF_LAYOUT.safeBottomY
      ? [...sectionOneBlock.operations, ...sectionTwoBlock.operations]
      : [...sectionOneBlock.operations];
  const pages = [createBackgroundPageOperations(firstPageOperations)];

  if (sectionTwoBlock.nextY < PDF_LAYOUT.safeBottomY) {
    const sectionTwoStandalonePage = buildSectionTwoOperations(viewModel.sectionTwo, PDF_LAYOUT.sectionTwoPageStartY);
    pages.push(createBackgroundPageOperations(sectionTwoStandalonePage.operations));
  }

  const sectionThreeBlock = buildSectionThreeOperations(
    viewModel.sectionThree,
    PDF_LAYOUT.sectionThreePageStartY,
    true
  );
  pages.push([...sectionThreeBlock.operations]);

  const sectionFourBlock = buildSectionFourOperations(
    viewModel.sectionFour,
    PDF_LAYOUT.sectionFourPageStartY
  );
  const sectionFiveBlock = buildSectionFiveOperations(
    viewModel.sectionFive,
    sectionFourBlock.nextY
  );

  pages.push(
    sectionFiveBlock.nextY >= PDF_LAYOUT.safeBottomY
      ? createBackgroundPageOperations([
          ...sectionFourBlock.operations,
          ...sectionFiveBlock.operations,
        ])
      : createBackgroundPageOperations([...sectionFourBlock.operations])
  );

  if (sectionFiveBlock.nextY < PDF_LAYOUT.safeBottomY) {
    pages.push(createBackgroundPageOperations(buildSectionFiveOperations(viewModel.sectionFive, PDF_LAYOUT.sectionFivePageStartY).operations));
  }

  return pages;
};
