import {
  buildAlertedProductsDocumentsFormData,
  buildAlertedProductsDocumentsPayload,
} from "../../../widgets/alerted-products-documents/model/buildAlertedProductsDocumentsRequest";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";

const normalizeDocumentHistoryItem = (row = {}) => ({
  uid: row?.id ?? `${row?.tipo_archivo ?? "doc"}-${row?.nombre_archivo ?? ""}`,
  name: row?.nombre_archivo ?? "",
  uploadedAt: row?.fecha_creacion ?? null,
  user: row?.usuario_creador ?? "",
  description: row?.descripcion ?? "",
  route: row?.ruta_archivo ?? "",
  active: Boolean(row?.activo),
});

export const getAlertedProductsJourneyDocuments = async (journeyId) => {
  if (!journeyId) {
    return {
      journeyId: null,
      historyByCategory: { pdf: [], excel: [] },
      hasDocuments: false,
    };
  }

  const response = await alertedProductsServices.getJourneyDocuments(journeyId);

  if (response?.status === ResponseStatusEnum.NOT_FOUND) {
    return {
      journeyId,
      historyByCategory: { pdf: [], excel: [] },
      hasDocuments: false,
    };
  }

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  const documents = Array.isArray(response?.data?.documentos)
    ? response.data.documentos
    : [];

  const historyByCategory = documents.reduce(
    (accumulator, row) => {
      const category = Number(row?.tipo_archivo) === 2 ? "pdf" : "excel";
      accumulator[category].push(normalizeDocumentHistoryItem(row));
      return accumulator;
    },
    { pdf: [], excel: [] }
  );

  return {
    journeyId: response?.data?.jornada_id ?? journeyId,
    historyByCategory,
    hasDocuments: documents.length > 0,
  };
};

export const persistAlertedProductsJourneyDocuments = async (formData) => {
  const response = await alertedProductsServices.saveJourneyDocuments(formData);

  if (response?.status !== ResponseStatusEnum.CREATED) {
    throw response;
  }

  return response?.data ?? {};
};

export const createAlertedProductsDocumentsRequest = ({
  filesByCategory,
  context,
}) => {
  const payload = buildAlertedProductsDocumentsPayload({
    filesByCategory,
    context,
  });

  const formData = buildAlertedProductsDocumentsFormData({
    filesByCategory,
    payload,
    context,
  });

  return {
    payload,
    formData,
  };
};
