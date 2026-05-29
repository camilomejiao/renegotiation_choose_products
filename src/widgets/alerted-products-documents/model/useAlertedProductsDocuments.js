import { useState } from "react";
import { createAlertedProductsDocumentsRequest } from "../../../pages/alerted-products/api/alertedProductsDocumentsApi";

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

export const useAlertedProductsDocuments = ({ currentUser } = {}) => {
  const [filesByCategory, setFilesByCategory] = useState({
    pdf: null,
    excel: null,
  });
  const [historyByCategory, setHistoryByCategory] = useState({
    pdf: [],
    excel: [],
  });
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const handleBeforeUpload = (expectedCategory) => (file) => {
    const category = getFileCategory(file);

    if (!category || category !== expectedCategory) {
      return false;
    }

    setFilesByCategory((currentFiles) => ({
      ...currentFiles,
      [category]: file,
    }));

    return false;
  };

  const handleRemoveFile = (category) => {
    setFilesByCategory((currentFiles) => ({
      ...currentFiles,
      [category]: null,
    }));
  };

  return {
    buildPersistDocumentsRequest: (context) =>
      createAlertedProductsDocumentsRequest({
        filesByCategory,
        historyByCategory,
        currentUser,
        context,
      }),
    filesByCategory,
    isHistoryModalOpen,
    historyByCategory,
    handleBeforeUpload,
    handleRemoveFile,
    openHistoryModal: () => setIsHistoryModalOpen(true),
    closeHistoryModal: () => setIsHistoryModalOpen(false),
  };
};
