const DOCUMENT_TYPE_BY_CATEGORY = {
  excel: 1,
  pdf: 2,
};

const toDocumentMetadata = (category, file) => {
  if (!file) {
    return null;
  }

  return {
    campo: category,
    tipo_archivo: DOCUMENT_TYPE_BY_CATEGORY[category],
    nombre_archivo: file.name || "",
  };
};

export const buildAlertedProductsDocumentsPayload = ({
  filesByCategory = {},
  context = {},
}) => {
  const documents = Object.entries(filesByCategory)
    .map(([category, file]) => toDocumentMetadata(category, file))
    .filter(Boolean);

  return {
    documentos: documents,
  };
};

export const buildAlertedProductsDocumentsFormData = ({
  filesByCategory = {},
  payload,
  context = {},
}) => {
  const formData = new FormData();

  formData.append("jornada_id", String(context?.journeyId ?? ""));
  formData.append("metadata", JSON.stringify(payload));

  Object.entries(filesByCategory).forEach(([category, file]) => {
    if (!file) {
      return;
    }

    formData.append(category, file, file.name);
  });

  return formData;
};
