export const buildAlertedProductsRequestFormData = ({
  orderDetailIds = [],
  observation = "",
  pdf,
}) => {
  const formData = new FormData();

  orderDetailIds.forEach((id) => {
    if (id == null || id === "") {
      return;
    }

    formData.append("orden_detalle_id", String(id));
  });

  formData.append("observacion", String(observation ?? "").trim());

  if (pdf) {
    formData.append("pdf", pdf, pdf.name);
  }

  return formData;
};
