import { useEffect, useMemo, useRef, useState } from "react";
import {
  createAlertedProductsDocumentsRequest,
  getAlertedProductsDocumentFileNames,
  persistAlertedProductsJourneyDocuments,
} from "../../../entities/alerted-product";

const getFileCategory = (file) => {
  const extension = file.name?.split(".").pop()?.toLowerCase();

  if (extension === "pdf") {
    return "pdf";
  }

  if (extension === "xlsx" || extension === "xls") {
    return "excel";
  }

  return null;
};

const EMPTY_HISTORY = {
  pdf: [],
  excel: [],
};

export const useAlertedProductsDocuments = ({
  historyByCategory: externalHistoryByCategory,
  journey,
} = {}) => {
  const [filesByCategory, setFilesByCategory] = useState({
    pdf: null,
    excel: null,
  });
  const [historyByCategory, setHistoryByCategory] = useState(EMPTY_HISTORY);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [savingDocuments, setSavingDocuments] = useState(false);
  const documentFileNamesRef = useRef({ pdf: null, excel: null });

  useEffect(() => {
    getAlertedProductsDocumentFileNames()
      .then((names) => { documentFileNamesRef.current = names; })
      .catch(() => {});
  }, []);

  const normalizedExternalHistory = useMemo(
    () => externalHistoryByCategory ?? EMPTY_HISTORY,
    [externalHistoryByCategory]
  );

  useEffect(() => {
    setHistoryByCategory(normalizedExternalHistory);
  }, [normalizedExternalHistory]);

  useEffect(() => {
    setFilesByCategory({
      pdf: null,
      excel: null,
    });
  }, [journey?.value]);

  const handleBeforeUpload = (expectedCategory) => (file) => {
    const category = getFileCategory(file);

    if (!category || category !== expectedCategory) {
      return false;
    }

    const baseName = documentFileNamesRef.current[category];
    const ext = file.name.split(".").pop();
    const renamedFile = baseName
      ? new File([file], `${baseName}.${ext}`, { type: file.type })
      : file;

    setFilesByCategory((currentFiles) => ({
      ...currentFiles,
      [category]: renamedFile,
    }));

    return false;
  };

  const handleRemoveFile = (category) => {
    setFilesByCategory((currentFiles) => ({
      ...currentFiles,
      [category]: null,
    }));
  };

  const hasRequiredFiles = Boolean(filesByCategory.pdf && filesByCategory.excel);
  const canPersistDocuments = Boolean(journey?.value && hasRequiredFiles);

  return {
    buildPersistDocumentsRequest: (context) =>
      createAlertedProductsDocumentsRequest({
        filesByCategory,
        context: {
          journeyId: journey?.value ?? context?.journeyId ?? null,
          journeyName: journey?.label ?? context?.journeyName ?? "",
        },
      }),
    persistDocuments: async (context) => {
      setSavingDocuments(true);

      try {
        const request = createAlertedProductsDocumentsRequest({
          filesByCategory,
          context: {
            journeyId: journey?.value ?? context?.journeyId ?? null,
            journeyName: journey?.label ?? context?.journeyName ?? "",
          },
        });

        return await persistAlertedProductsJourneyDocuments(request.formData);
      } finally {
        setSavingDocuments(false);
      }
    },
    canPersistDocuments,
    filesByCategory,
    hasRequiredFiles,
    isHistoryModalOpen,
    historyByCategory,
    handleBeforeUpload,
    handleRemoveFile,
    savingDocuments,
    openHistoryModal: () => setIsHistoryModalOpen(true),
    closeHistoryModal: () => setIsHistoryModalOpen(false),
  };
};
