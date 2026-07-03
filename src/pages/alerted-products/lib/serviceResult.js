export const MANAGEMENT_ERROR_MESSAGES = {
  SOLICITUD_INVALIDA: "Se requieren tipo_gestion_id y al menos un producto.",
  PRODUCTOS_NO_ENCONTRADOS:
    "Uno o más productos no existen o no pertenecen a la jornada consultada.",
  CAMBIO_GESTION_NO_PERMITIDO:
    "El cambio de tipo de gestión no está permitido para uno o más productos.",
  ERROR_INTERNO: "Ocurrió un error inesperado al actualizar el tipo de gestión.",
};

export const REQUEST_ERROR_MESSAGES = {
  SOLICITUD_INVALIDA: "Se requieren orden_detalle_id, observacion y pdf.",
  ORDEN_DETALLE_NO_ENCONTRADO:
    "No existen items alertados asociados a los identificadores enviados.",
  DOCUMENTO_YA_REGISTRADO:
    "Ya existe una solicitud registrada para uno o más items enviados.",
  ARCHIVO_DEMASIADO_GRANDE: "El archivo PDF supera el tamaño máximo permitido.",
  TIPO_ARCHIVO_NO_SOPORTADO: "El archivo pdf no tiene un content-type permitido.",
  ARCHIVO_INVALIDO:
    "El archivo PDF está corrupto o no corresponde a los items indicados.",
  ERROR_INTERNO: "No se pudo registrar la solicitud.",
};

// Construye el resultado de error de un servicio con un mensaje legible.
export const buildServiceResult = (label, response, fallbackMessages) => {
  const code = response?.data?.codigo || null;
  const message =
    response?.data?.mensaje ||
    (code ? fallbackMessages[code] : null) ||
    (response?.status === 404
      ? "El endpoint aún no está disponible en el backend."
      : "Ocurrió un error inesperado al procesar la solicitud.");

  return {
    label,
    ok: false,
    status: response?.status ?? null,
    code,
    message,
  };
};