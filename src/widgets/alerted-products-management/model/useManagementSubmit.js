import { useCallback, useState } from "react";

import AlertComponent from "../../../helpers/alert/AlertComponent";

// Orquesta la validación y el envío de la solicitud de gestión.
export const useManagementSubmit = ({
  observation,
  actaFile,
  alertsData,
  managementTypeOption,
  priceAdjustment,
  homologation,
  onSubmitManagementRequest,
  onContinue,
  onMissing,
  onResult,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async () => {
    if (!observation.trim() && !actaFile) {
      onMissing(
        "Debes diligenciar la observación justificada y adjuntar el archivo PDF antes de enviar."
      );
      return;
    }
    if (!observation.trim()) {
      onMissing("Debes diligenciar la observación justificada antes de enviar.");
      return;
    }
    if (!actaFile) {
      onMissing("Debes adjuntar el archivo PDF antes de enviar.");
      return;
    }
    if (!managementTypeOption?.value || alertsData.length === 0) {
      AlertComponent.warning(
        "Información incompleta",
        "No hay productos o tipo de gestión válidos para enviar la solicitud."
      );
      return;
    }
    if (priceAdjustment.enabled && !priceAdjustment.validate(alertsData)) {
      priceAdjustment.setTouched(true);
      onMissing(
        "Debes diligenciar el Nuevo Precio de Venta de cada producto. El valor debe ser numérico, mayor o igual al Precio mínimo y menor o igual al Precio máximo."
      );
      return;
    }
    if (homologation.enabled && !homologation.validate(alertsData)) {
      homologation.setTouched(true);
      onMissing("Debes asignar un producto homologado a cada ítem antes de enviar.");
      return;
    }

    if (!onSubmitManagementRequest) {
      onContinue?.();
      return;
    }

    const selectedRows = priceAdjustment.enabled
      ? priceAdjustment.mapRows(alertsData)
      : homologation.enabled
      ? homologation.mapRows(alertsData)
      : alertsData;

    setSubmitting(true);
    try {
      const result = await onSubmitManagementRequest({
        managementTypeId: managementTypeOption.value,
        selectedRows,
        observation: observation.trim(),
        pdf: actaFile,
      });
      onResult(result);
    } finally {
      setSubmitting(false);
    }
  }, [
    observation,
    actaFile,
    alertsData,
    managementTypeOption,
    priceAdjustment,
    homologation,
    onSubmitManagementRequest,
    onContinue,
    onMissing,
    onResult,
  ]);

  return { submitting, submit };
};