import { useCallback, useMemo, useState } from "react";

// INDETERMINADO gestiona un único producto: el formulario captura solo los datos
// que Implementación / Técnica puede diligenciar. El resto (precios, valores de
// mercado) lo completa Sub. Operativa más adelante.
const EMPTY_FORM = {
  productName: "",
  technicalSpec: "",
  unit: null, // opción { value, label } de AppSelect
  brand: "",
};

const isFormComplete = (form) =>
  Boolean(
    form &&
      form.productName.trim() &&
      form.technicalSpec.trim() &&
      form.unit?.value != null &&
      form.brand.trim()
  );

export const useIndeterminateManagement = ({ row } = {}) => {
  const [observation, setObservation] = useState("");
  const [form, setForm] = useState(EMPTY_FORM);

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const isComplete = useMemo(() => isFormComplete(form), [form]);
  const canSubmit = isComplete && Boolean(observation.trim());

  // Payload listo para el consumo (firma del servicio pendiente de definir).
  const buildPayload = useCallback(
    () => ({
      observation: observation.trim(),
      orderDetailId: row?.orderDetailId ?? null,
      productId: row?.productId ?? null,
      nombre_producto: form.productName.trim(),
      especificacion_tecnica: form.technicalSpec.trim(),
      unidad_medida: form.unit?.value ?? null,
      marca: form.brand.trim(),
    }),
    [observation, row, form]
  );

  return {
    observation,
    setObservation,
    form,
    setField,
    isComplete,
    canSubmit,
    buildPayload,
  };
};