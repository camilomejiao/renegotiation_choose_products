const APPROVAL_STATUS_LABELS = {
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
  return APPROVAL_STATUS_LABELS[normalizedStatus] ?? String(statusValue);
};

const buildBeneficiaryName = (beneficiary = {}) => {
  const fullName =
    beneficiary?.nombre_completo ||
    [beneficiary?.nombre, beneficiary?.apellido].filter(Boolean).join(" ");

  return fullName || "";
};

export const normalizeLeaderOrderRequestRows = (rows = []) =>
  rows.map((row) => {
    const order = row?.orden ?? row?.order ?? {};
    const beneficiary = order?.cub ?? row?.cub ?? row?.beneficiario ?? {};
    const supplier = row?.proveedor ?? order?.proveedor ?? {};
    const approval = row?.aprobacion ?? row?.approval ?? {};
    const approvalStatus = resolveStatusLabel(
      row?.estado_solicitud ?? row?.estado ?? row?.status
    );

    return {
      id: row?.id,
      orderId: row?.orden_id ?? order?.id ?? row?.order_id ?? "",
      cubId: beneficiary?.cub_id ?? row?.cub_id ?? "",
      beneficiary: buildBeneficiaryName(beneficiary),
      supplier: supplier?.nombre ?? row?.supplier_name ?? "",
      approvalStatus,
      approvalDate:
        approval?.fecha_aprobacion ??
        row?.fecha_aprobacion ??
        row?.approved_at ??
        "",
      approver:
        approval?.aprobador ??
        approval?.usuario ??
        row?.aprobador ??
        row?.approved_by ??
        "",
      requestType:
        row?.tipo_solicitud ??
        row?.request_type ??
        "ANULACION_ORDEN_COMPRA",
      requestTypeLabel:
        row?.tipo_solicitud_label ??
        row?.request_type_label ??
        "Anulación de Orden de compra",
      supplierId: supplier?.id ?? row?.proveedor_id ?? "",
      departmentId:
        supplier?.departamento?.id ?? row?.departamento_id ?? row?.department_id ?? "",
      municipalityId:
        supplier?.municipio?.id ?? row?.municipio_id ?? row?.municipality_id ?? "",
      approvalComment:
        approval?.comentario ??
        row?.observacion_aprobacion ??
        row?.observacion ??
        "",
      canManage: approvalStatus === "Pendiente",
    };
  });
