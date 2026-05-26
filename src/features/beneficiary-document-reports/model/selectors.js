import {
  canGenerateDocumentFromGraduationCause,
  getTitularStatusDescription,
  isTitularAttentionFinalized,
} from "../../../entities/beneficiary";
import {
  DOCUMENT_REPORTS_EMPTY_TEXT,
  DOCUMENT_REPORTS_MOCK,
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
      causal: beneficiaryDetails.causal || "",
    };
  }

  return {
    ...beneficiaryDetails,
    estado_titular:
      beneficiaryDetails.estado_titular || DOCUMENT_REPORTS_MOCK.estado_titular,
    descripcion:
      beneficiaryDetails.descripcion || DOCUMENT_REPORTS_MOCK.descripcion,
    causal: beneficiaryDetails.causal || "",
  };
};

export const canGenerateClosureDocument = (beneficiaryDetails) =>
  isTitularAttentionFinalized(beneficiaryDetails?.estado_titular) &&
  canGenerateDocumentFromGraduationCause(beneficiaryDetails?.causal);

export const shouldShowDocumentReportsSection = (beneficiaryDetails) =>
  IS_DOCUMENT_REPORTS_SECTION_TESTING_ENABLED ||
  isTitularAttentionFinalized(beneficiaryDetails?.estado_titular);

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
