import {
  GeneralStatusDeliveryProductEnum,
  RolesEnum,
  StatusTeamProductEnum,
} from "../../../helpers/GlobalEnum";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toDateOnly = (value) => {
  return typeof value === "string" ? value.split("T")[0] : "";
};

const resolveStatusByApprovals = ({ approvalDate, approvals = [] }) => {
  if (!Array.isArray(approvals) || approvals.length === 0) {
    return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;
  }

  const approvedId = Number(StatusTeamProductEnum.APPROVED.id);
  const deniedId = Number(StatusTeamProductEnum.DENIED.id);

  const supervisionApprovals = approvals.filter(
    (item) => Number(item?.rol) === Number(RolesEnum.SUPERVISION)
  );

  if (!supervisionApprovals.length) {
    return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;
  }

  const hasRejected = supervisionApprovals.some(
    (item) => Number(item?.estado) === deniedId
  );

  if (hasRejected) {
    return GeneralStatusDeliveryProductEnum.REFUSED;
  }

  const allApproved = supervisionApprovals.every(
    (item) => Number(item?.estado) === approvedId
  );

  if (allApproved && approvalDate) {
    return GeneralStatusDeliveryProductEnum.APPROVED;
  }

  return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;
};

const extractSupervisionObservation = (approvals = []) => {
  const statusMap = Object.values(StatusTeamProductEnum).reduce((acc, entry) => {
    acc[String(entry.id)] = entry.label;
    return acc;
  }, {});

  const target = approvals.find(
    (item) => Number(item?.rol) === Number(RolesEnum.SUPERVISION)
  );

  if (!target) {
    return {
      status_supervision: "Sin revisar",
      observations_supervision: {
        comentario: "",
        funcionario: "",
        fecha: "",
      },
    };
  }

  return {
    status_supervision: statusMap[String(target?.estado)] ?? "Sin revisar",
    observations_supervision: {
      comentario: target?.comentario ?? "",
      funcionario: target?.funcionario ?? "",
      fecha: toDateOnly(target?.fecha),
    },
  };
};

export const normalizeSupervisionRows = (rows = []) => {
  return rows.map((row, index) => {
    const priceMinValue = toNumber(row?.precio_min);
    const priceMaxValue = toNumber(row?.precio_max);
    const priceValue = toNumber(row?.precio);

    const state = resolveStatusByApprovals({
      approvalDate: row?.fecha_aprobado,
      approvals: row?.aprobados,
    });

    return {
      rowKey: String(row?.id ?? `${Date.now()}-${index + 1}`),
      id: row?.id ?? "-",
      cod_id: row?.jornada_producto_id ?? "-",
      category: row?.categoria_producto ?? "-",
      name: row?.nombre ?? "-",
      description: row?.especificacion_tecnicas ?? "-",
      brand: row?.marca_comercial ?? "-",
      unit: row?.unidad_medida ?? "-",
      price_min: priceMinValue,
      price_max: priceMaxValue,
      price: priceValue,
      priceMinValue,
      priceMaxValue,
      priceValue,
      isPriceMaxValue: priceValue > priceMaxValue,
      isOutOfRange: priceValue < priceMinValue || priceValue > priceMaxValue,
      state,
      ...extractSupervisionObservation(row?.aprobados || []),
    };
  });
};
