import {
  buildAlertedProductsDocumentsFormData,
  buildAlertedProductsDocumentsPayload,
} from "../../../widgets/alerted-products-documents/model/buildAlertedProductsDocumentsRequest";

export const createAlertedProductsDocumentsRequest = ({
  filesByCategory,
  historyByCategory,
  currentUser,
  context,
}) => {
  const payload = buildAlertedProductsDocumentsPayload({
    filesByCategory,
    historyByCategory,
    currentUser,
    context,
  });

  const formData = buildAlertedProductsDocumentsFormData({
    filesByCategory,
    payload,
  });

  return {
    payload,
    formData,
  };
};
