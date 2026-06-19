import {
  GRADUATION_CAUSE,
  TITULAR_STATUS,
} from "../../../entities/beneficiary";

export const DOCUMENT_REPORTS_SECTION_TITLE = "Documentos y Reportes";
export const DOCUMENT_REPORTS_SECTION_SUBTITLE =
  "Consulta de documentos y reportes asociados al cierre de implementación del programa PNIS.";
export const DOCUMENT_REPORTS_EMPTY_TEXT = "---";
export const DOCUMENT_VIEWER_TITLE = "Documento de cierre";
export const DOCUMENT_VIEWER_SUBTITLE = "Visualización previa del PDF generado.";

export const DOCUMENT_UNAVAILABLE_MODAL_TITLE = "Documento no disponible";
export const DOCUMENT_UNAVAILABLE_REASONS = {
  [TITULAR_STATUS.RETIRED]:
    "El titular se encuentra en estado Retirado. El documento de cierre solo puede generarse cuando la implementación del programa ha sido finalizada.",
  [TITULAR_STATUS.NOT_RENEGOTIATED]:
    "El titular no cuenta con Plan de Inversión activo (No renegociado). El documento de cierre no está disponible para este estado.",
  [TITULAR_STATUS.IN_ATTENTION_PROCESS]:
    "El titular se encuentra En proceso de atención. El documento de cierre estará disponible una vez finalizada la implementación del programa.",
  [TITULAR_STATUS.SUSPENDED]:
    "El titular presenta novedades en estado Suspendido. No es posible generar el documento de cierre en este momento.",
};

export const IS_DOCUMENT_REPORTS_SECTION_TESTING_ENABLED = true;
export const IS_DOCUMENT_REPORTS_MOCK_ENABLED = true;

export const DOCUMENT_REPORTS_MOCK = {
  estado_titular: TITULAR_STATUS.ATTENTION_FINALIZED,
  descripcion: "",
  causal: GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
};
