const REQUEST_STATUS_LABELS = {
  PENDIENTE: "Pendiente",
  APROBADO: "Aprobado",
  APROBADA: "Aprobado",
  RECHAZADO: "Rechazado",
  RECHAZADA: "Rechazado",
  CANCELADO: "Cancelado",
};

const resolveStatusLabel = (statusValue) => {
  if (!statusValue) {
    return "Pendiente";
  }

  const normalizedStatus = String(statusValue).trim().toUpperCase();
  return REQUEST_STATUS_LABELS[normalizedStatus] ?? String(statusValue);
};

export const normalizeOrderCancellationRequestRows = (rows = []) =>
  rows.map((row) => {
    const order = row?.orden ?? row?.order ?? {};
    const cub = row?.cub ?? order?.cub ?? {};
    const status = resolveStatusLabel(
      row?.estado_solicitud ?? row?.estado ?? row?.status
    );

    return {
      id: row?.id ?? row?.solicitud_id,
      orderId: row?.orden_id ?? order?.id ?? row?.order_id ?? "",
      requestDate:
        row?.fecha_solicitud ??
        row?.fecha_registro ??
        row?.created_at ??
        row?.created ??
        "",
      cubId:
        (typeof cub === "string" ? cub : cub?.cub_id) ?? row?.cub_id ?? "",
      document:
        cub?.identificacion ?? row?.cub_identificacion ?? row?.documento ?? "",
      requestType:
        row?.tipo_solicitud ??
        row?.request_type ??
        "ANULACION_ORDEN_COMPRA",
      requestTypeLabel:
        row?.tipo_solicitud_label ??
        row?.request_type_label ??
        "Anulación de Orden de compra",
      status,
      observation:
        row?.observacion_aprobacion ??
        row?.observacion ??
        row?.comentario ??
        "",
      canCancel: status === "Pendiente",
    };
  });
