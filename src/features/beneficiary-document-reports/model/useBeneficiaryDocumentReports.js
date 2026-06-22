import { useState } from "react";
import { buildClosureDocumentPdfViewModel } from "./buildClosureDocumentPdfViewModel";
import {
  DOCUMENT_UNAVAILABLE_MODAL_TITLE,
  DOCUMENT_VIEWER_TITLE,
  DOCUMENT_VIEWER_SUBTITLE,
} from "./constants";
import {
  buildDocumentReportsRows,
  getDocumentReportsDetails,
  getDocumentUnavailableReason,
  shouldShowDocumentReportsSection,
} from "./selectors";

export const useBeneficiaryDocumentReports = ({
  beneficiaryDetails,
  beneficiaryMovements,
}) => {
  const [documentViewer, setDocumentViewer] = useState({
    isOpen: false,
    fileName: "",
    viewModel: null,
  });

  const [documentUnavailableModal, setDocumentUnavailableModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const resolvedBeneficiaryDetails = getDocumentReportsDetails(beneficiaryDetails);
  const rows = buildDocumentReportsRows(beneficiaryDetails);
  const shouldShowSection = shouldShowDocumentReportsSection(resolvedBeneficiaryDetails);

  const closeDocumentViewer = () =>
    setDocumentViewer({ isOpen: false, fileName: "", viewModel: null });

  const handleCloseDocumentUnavailableModal = () =>
    setDocumentUnavailableModal({ isOpen: false, title: "", message: "" });

  const handleOpenDocumentViewer = (row) => {
    if (!row?.isDocumentEnabled) {
      setDocumentUnavailableModal({
        isOpen: true,
        title: DOCUMENT_UNAVAILABLE_MODAL_TITLE,
        message: getDocumentUnavailableReason(row?.holderStatus),
      });
      return;
    }

    const fileName = `documento-cierre-${row?.cub || resolvedBeneficiaryDetails?.cub || "titular"}.pdf`;
    const viewModel = buildClosureDocumentPdfViewModel({
      beneficiaryDetails: resolvedBeneficiaryDetails,
      beneficiaryMovements,
      graduationCause: row?.graduationCause,
    });

    setDocumentViewer({ isOpen: true, fileName, viewModel });
  };

  return {
    rows,
    shouldShowSection,
    documentViewer,
    documentUnavailableModal,
    viewerTitle: DOCUMENT_VIEWER_TITLE,
    viewerSubtitle: DOCUMENT_VIEWER_SUBTITLE,
    handleOpenDocumentViewer,
    handleCloseDocumentViewer: closeDocumentViewer,
    handleCloseDocumentUnavailableModal,
    handleDownloadViewerFile: () => {},
  };
};
