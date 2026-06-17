import {
  getGraduationCause,
  getTitularStatusDescription,
  isTitularAttentionFinalized,
} from "../../../entities/beneficiary";
import {
  DOCUMENT_REPORTS_EMPTY_TEXT,
  DOCUMENT_REPORTS_MOCK,
  DOCUMENT_UNAVAILABLE_REASONS,
  IS_DOCUMENT_REPORTS_MOCK_ENABLED,
  IS_DOCUMENT_REPORTS_SECTION_TESTING_ENABLED,
} from "./constants";

export const getTextOrFallback = (value) => value || DOCUMENT_REPORTS_EMPTY_TEXT;

export const getDocumentReportsDetails = (beneficiaryDetails) => {
  if (!beneficiaryDetails) {
    return null;
  }

  if (!IS_DOCUMENT_REPORTS_MOCK_ENABLED) {
    return {
      ...beneficiaryDetails,
      estado_titular: beneficiaryDetails.estado_titular || "",
      descripcion: beneficiaryDetails.descripcion || "",
      causal: getGraduationCause(beneficiaryDetails.causal),
    };
  }

  return {
    ...beneficiaryDetails,
    estado_titular:
      beneficiaryDetails.estado_titular || DOCUMENT_REPORTS_MOCK.estado_titular,
    descripcion:
      beneficiaryDetails.descripcion || DOCUMENT_REPORTS_MOCK.descripcion,
    causal:
      getGraduationCause(beneficiaryDetails.causal) || DOCUMENT_REPORTS_MOCK.causal,
  };
};

export const canGenerateClosureDocument = (beneficiaryDetails) =>
  isTitularAttentionFinalized(beneficiaryDetails?.estado_titular);

export const getDocumentUnavailableReason = (holderStatus) =>
  DOCUMENT_UNAVAILABLE_REASONS[holderStatus] ||
  "El documento de cierre no está disponible para el estado actual del titular.";

export const shouldShowDocumentReportsSection = (beneficiaryDetails) =>
  IS_DOCUMENT_REPORTS_SECTION_TESTING_ENABLED ||
  canGenerateClosureDocument(beneficiaryDetails);

export const buildDocumentReportsRows = (beneficiaryDetails) => {
  const details = getDocumentReportsDetails(beneficiaryDetails);

  if (!details) {
    return [];
  }

  return [
    {
      id: details.cub || "document-report",
      cub: details.cub || DOCUMENT_REPORTS_EMPTY_TEXT,
      holderStatus: getTextOrFallback(details.estado_titular),
      description: getTitularStatusDescription(
        details.estado_titular,
        getTextOrFallback(details.descripcion)
      ),
      graduationCause: getTextOrFallback(details.causal),
      isDocumentEnabled: canGenerateClosureDocument(details),
    },
  ];
};
