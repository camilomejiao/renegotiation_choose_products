import { createSimplePdfBlob } from "../../../shared/lib/pdf/createSimplePdfBlob";
import { buildClosureDocumentLines } from "./buildClosureDocumentLines";
import { buildClosureDocumentPdfPages } from "./pdf/buildClosureDocumentPdfPages";
import { buildClosureDocumentPdfViewModel } from "../model/buildClosureDocumentPdfViewModel";
import { buildSectionOneFields } from "../model/documentTemplateConfig";
import { createPdfBlobFromPages } from "./pdfPrimitives";

export const getSectionOneTableRows = buildSectionOneFields;

export const createClosureDocumentPdfBlob = ({
  beneficiaryDetails,
  beneficiaryMovements,
  row,
}) => {
  const viewModel = buildClosureDocumentPdfViewModel({
    beneficiaryDetails,
    beneficiaryMovements,
    graduationCause: row?.graduationCause,
  });

  const pages = buildClosureDocumentPdfPages(viewModel);

  if (pages) {
    return createPdfBlobFromPages(pages);
  }

  return createSimplePdfBlob({
    lines: buildClosureDocumentLines({
      beneficiaryDetails,
      row,
    }),
  });
};
