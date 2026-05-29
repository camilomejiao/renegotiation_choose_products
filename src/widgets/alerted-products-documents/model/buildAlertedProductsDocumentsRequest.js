const toSerializableFile = (category, file) => {
  if (!file) {
    return null;
  }

  return {
    category,
    fileName: file.name || "",
    mimeType: file.type || "",
    size: file.size || 0,
    lastModified: file.lastModified || null,
  };
};

const toSerializableHistoryEntry = (category, item) => ({
  category,
  fileName: item?.name || "",
  uploadedAt: item?.uploadedAt || null,
  uploadedBy: item?.user || "",
  size: item?.size || 0,
});

export const buildAlertedProductsDocumentsPayload = ({
  filesByCategory = {},
  historyByCategory = {},
  currentUser = {},
  context = {},
}) => {
  const currentDocuments = Object.entries(filesByCategory)
    .map(([category, file]) => toSerializableFile(category, file))
    .filter(Boolean);

  const uploadHistory = Object.entries(historyByCategory).flatMap(
    ([category, items]) =>
      (items || []).map((item) => toSerializableHistoryEntry(category, item))
  );

  return {
    context: {
      journeyId: context?.journeyId ?? null,
      journeyName: context?.journeyName ?? "",
      alertedProductsIds: context?.alertedProductsIds ?? [],
    },
    requestedBy: {
      id: currentUser?.id ?? currentUser?.user_id ?? null,
      name: currentUser?.nombre || currentUser?.name || "Usuario actual",
      roleId: currentUser?.rol_id ?? null,
    },
    requestedAt: new Date().toISOString(),
    documents: currentDocuments,
    history: uploadHistory,
  };
};

export const buildAlertedProductsDocumentsFormData = ({
  filesByCategory = {},
  payload,
}) => {
  const formData = new FormData();

  formData.append("metadata", JSON.stringify(payload));

  Object.entries(filesByCategory).forEach(([category, file]) => {
    if (!file) {
      return;
    }

    formData.append(category, file, file.name);
  });

  return formData;
};
