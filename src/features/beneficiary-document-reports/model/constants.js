import { TITULAR_STATUS } from "../../../entities/beneficiary";

export const DOCUMENT_REPORTS_SECTION_TITLE = "Documentos y Reportes";
export const DOCUMENT_REPORTS_SECTION_SUBTITLE =
  "Consulta de documentos y reportes asociados al cierre de implementación del programa PNIS.";
export const DOCUMENT_REPORTS_EMPTY_TEXT = "---";
export const DOCUMENT_VIEWER_TITLE = "Documento de cierre";
export const DOCUMENT_VIEWER_SUBTITLE = "Visualización previa del PDF generado.";

export const IS_DOCUMENT_REPORTS_SECTION_TESTING_ENABLED = true;
export const IS_DOCUMENT_REPORTS_MOCK_ENABLED = true;

export const DOCUMENT_REPORTS_MOCK = {
  estado_titular: TITULAR_STATUS.ATTENTION_FINALIZED,
  descripcion: "",
  causal: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};
