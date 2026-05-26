import { useEffect, useState } from "react";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { createClosureDocumentPdfBlob } from "../lib/createClosureDocumentPdfBlob";
import {
  DOCUMENT_VIEWER_TITLE,
  DOCUMENT_VIEWER_SUBTITLE,
} from "./constants";
import {
  buildDocumentReportsRows,
  getDocumentReportsDetails,
  shouldShowDocumentReportsSection,
} from "./selectors";

export const useBeneficiaryDocumentReports = ({
  beneficiaryDetails,
  beneficiaryMovements,
}) => {
  const [documentViewer, setDocumentViewer] = useState({
    isOpen: false,
    fileName: "",
    url: "",
  });

  const resolvedBeneficiaryDetails = getDocumentReportsDetails(beneficiaryDetails);
  const rows = buildDocumentReportsRows(beneficiaryDetails);
  const shouldShowSection = shouldShowDocumentReportsSection(resolvedBeneficiaryDetails);

  const closeDocumentViewer = () => {
    setDocumentViewer((current) => {
      if (current.url) {
        URL.revokeObjectURL(current.url);
      }

      return {
        isOpen: false,
        fileName: "",
        url: "",
      };
    });
  };

  const handleDownloadViewerFile = () => {
    if (!documentViewer.url) {
      return;
    }

    const link = document.createElement("a");
    link.href = documentViewer.url;
    link.download = documentViewer.fileName || "documento-cierre.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenDocumentViewer = (row) => {
    if (!row?.isDocumentEnabled) {
      AlertComponent.info(
        "Documento no disponible",
        "El documento de cierre solo se habilita para titulares con estado Atención Finalizada y causal UNDOC_FAMILIES o RECOLECTOR."
      );
      return;
    }

    const fileName = `documento-cierre-${row?.cub || resolvedBeneficiaryDetails?.cub || "titular"}.pdf`;
    const blob = createClosureDocumentPdfBlob({
      beneficiaryDetails: resolvedBeneficiaryDetails,
      beneficiaryMovements,
      row,
    });
    const url = URL.createObjectURL(blob);

    setDocumentViewer((current) => {
      if (current.url) {
        URL.revokeObjectURL(current.url);
      }

      return {
        isOpen: true,
        fileName,
        url,
      };
    });
  };

  useEffect(() => {
    return () => {
      if (documentViewer.url) {
        URL.revokeObjectURL(documentViewer.url);
      }
    };
  }, [documentViewer.url]);

  return {
    rows,
    shouldShowSection,
    documentViewer,
    viewerTitle: DOCUMENT_VIEWER_TITLE,
    viewerSubtitle: DOCUMENT_VIEWER_SUBTITLE,
    handleOpenDocumentViewer,
    handleCloseDocumentViewer: closeDocumentViewer,
    handleDownloadViewerFile,
  };
};
