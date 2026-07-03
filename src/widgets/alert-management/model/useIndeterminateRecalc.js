import { useCallback, useMemo, useState } from "react";

// Resultados posibles del recálculo de Sub. Operativa para PRODUCTO INDETERMINADO.
// La evaluación compara "Valor catálogo nuevo" contra el rango [precio mín, precio máx].
export const RECALC_RESULT = {
  within: {
    code: "0",
    label: "0 - Sin alerta",
    tone: "green",
    message:
      "Valores dentro del rango permitido. El nuevo producto queda dentro del rango. " +
      "Al aprobar se insertará en el catálogo de la jornada, se actualizará el ID Producto " +
      "de la orden y podrá utilizarse en futuras órdenes.",
  },
  above: {
    code: "2",
    label: "2 - Por encima máximo",
    tone: "amber",
    message:
      "El valor catálogo nuevo supera el precio máximo permitido. Ajuste los valores o " +
      "devuelva la solicitud a subsanación antes de aprobar.",
  },
  below: {
    code: "3",
    label: "3 - Por debajo mínimo",
    tone: "red",
    message:
      "El valor catálogo nuevo está por debajo del precio mínimo permitido. Ajuste los valores o " +
      "devuelva la solicitud a subsanación antes de aprobar.",
  },
};

const toNumber = (value) => {
  if (value == null || value === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const EMPTY_VALUES = {
  precioMinimo: null,
  precioMaximo: null,
  valorVentaNuevo: null,
  valorCatalogoNuevo: null,
};

export const useIndeterminateRecalc = () => {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [observacion, setObservacion] = useState("");
  const [result, setResult] = useState(null);

  // Editar cualquier valor invalida el resultado previo (obliga a recalcular).
  const setField = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  }, []);

  const canCalculate = useMemo(
    () =>
      [
        values.precioMinimo,
        values.precioMaximo,
        values.valorVentaNuevo,
        values.valorCatalogoNuevo,
      ].every((value) => toNumber(value) != null),
    [values]
  );

  const calculate = useCallback(() => {
    const min = toNumber(values.precioMinimo);
    const max = toNumber(values.precioMaximo);
    const catalogo = toNumber(values.valorCatalogoNuevo);
    if (min == null || max == null || catalogo == null) return null;

    let key = "within";
    if (catalogo < min) key = "below";
    else if (catalogo > max) key = "above";

    const nextResult = RECALC_RESULT[key];
    setResult(nextResult);
    return nextResult;
  }, [values]);

  return { values, setField, observacion, setObservacion, result, canCalculate, calculate };
};