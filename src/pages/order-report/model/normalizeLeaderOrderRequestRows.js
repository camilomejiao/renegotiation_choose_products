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

const formatDateToDayMonthYear = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(dateValue);
  }

  const formatter = new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });

  return formatter.format(parsedDate);
};

const buildBeneficiaryName = (beneficiary = {}) => {
  if (typeof beneficiary === "string") {
    return beneficiary;
  }

  const fullName =
    beneficiary?.nombre_completo ||
    [beneficiary?.nombre, beneficiary?.apellido].filter(Boolean).join(" ");

  return fullName || "";
};

export const normalizeLeaderOrderRequestRows = (rows = []) =>
  rows.map((row) => {
    const order = row?.orden ?? row?.order ?? {};
    const cub =
      row?.cub ??
      row?.cubId ??
      row?.cub_id ??
      row?.CUB ??
      order?.cub ??
      order?.cubId ??
      order?.cub_id ??
      {};
    const beneficiary = row?.beneficiario ?? order?.beneficiario ?? {};
    const supplier = row?.proveedor ?? order?.proveedor ?? {};
    const approval = row?.aprobacion ?? row?.approval ?? {};
    const approvalStatus = resolveStatusLabel(
      row?.estado_aprobacion ??
        row?.estado_solicitud ??
        row?.estado ??
        row?.status
    );
    const requestType =
      row?.tipo_solicitud ??
      row?.request_type ??
      row?.motivo_solicitud ??
      "ANULACION_ORDEN_COMPRA";
    const requestReason =
      row?.motivo_solicitud ??
      row?.observacion ??
      row?.comentario ??
      "";

    return {
      id:
        row?.id ??
        row?.id_solicitud ??
        row?.solicitud_id ??
        row?.request_id ??
        row?.numero_orden_compra ??
        row?.orden_id ??
        order?.id ??
        row?.order_id ??
        "",
      orderId:
        row?.numero_orden_compra ??
        row?.orden_id ??
        order?.id ??
        row?.order_id ??
        "",
      requestDate: formatDateToDayMonthYear(
        row?.fecha_solicitud ??
          row?.fecha_registro ??
          row?.created_at ??
          row?.created ??
          ""
      ),
      cubId:
        ((typeof cub === "string" || typeof cub === "number")
          ? String(cub)
          : cub?.cub_id ?? cub?.id ?? cub?.codigo) ||
        row?.cubId ||
        row?.cub_id ||
        row?.CUB ||
        "",
      beneficiary: buildBeneficiaryName(beneficiary),
      supplier:
        (typeof supplier === "string" ? supplier : supplier?.nombre) ??
        row?.supplier_name ??
        "",
      department:
        supplier?.departamento?.nombre ??
        row?.departamento ??
        row?.department_name ??
        "",
      municipality:
        supplier?.municipio?.nombre ??
        row?.municipio ??
        row?.municipality_name ??
        "",
      approvalStatus,
      approvalDate:
        formatDateToDayMonthYear(
          approval?.fecha_aprobacion ??
            row?.fecha_aprobacion ??
            row?.approved_at ??
            ""
        ),
      approver:
        approval?.aprobador ??
        approval?.usuario ??
        row?.aprobador ??
        row?.approved_by ??
        "",
      requestType,
      requestTypeLabel:
        row?.tipo_solicitud_label ??
        row?.request_type_label ??
        requestType,
      supplierId:
        (typeof supplier === "string" ? "" : supplier?.id) ??
        row?.proveedor_id ??
        "",
      departmentId:
        supplier?.departamento?.id ?? row?.departamento_id ?? row?.department_id ?? "",
      municipalityId:
        supplier?.municipio?.id ?? row?.municipio_id ?? row?.municipality_id ?? "",
      approvalComment:
        approval?.comentario ??
        row?.observacion_aprobacion ??
        row?.approval_comment ??
        "",
      requestReason,
      supplierObservation: requestReason,
      leaderObservation:
        row?.observacion_lider ??
        row?.leader_observation ??
        "",
      canManage: approvalStatus === "Pendiente",
    };
  });
