import {
  GeneralStatusDeliveryProductEnum,
  RolesEnum,
  StatusTeamProductEnum,
} from "../../../helpers/GlobalEnum";

const getProductState = (approvalDate, approvalList) => {
  const isEmpty = !Array.isArray(approvalList) || approvalList.length === 0;

  if (isEmpty) {
    return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;
  }

  const allApproved = approvalList.every((item) => item.aprobado === true);
  const hasRejected = approvalList.some((item) => item.aprobado === false);

  if (hasRejected) {
    return GeneralStatusDeliveryProductEnum.REFUSED;
  }

  if (allApproved && approvalDate) {
    return GeneralStatusDeliveryProductEnum.APPROVED;
  }

  return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;
};

const extractObservations = (approvals = []) => {
  const roleMap = {
    [RolesEnum.SUPERVISION]: {
      observationKey: "observations_supervision",
      statusKey: "status_supervision",
    },
  };

  const statusMap = {
    [StatusTeamProductEnum.DENIED.id]: StatusTeamProductEnum.DENIED.label,
    [StatusTeamProductEnum.APPROVED.id]: StatusTeamProductEnum.APPROVED.label,
    [StatusTeamProductEnum.UNREVIEWED.id]: "Sin revisar",
  };

  return approvals.reduce((accumulator, approval) => {
    const role = roleMap[approval?.rol_id];

    if (!role) {
      return accumulator;
    }

    const approvedValue = approval?.aprobado === true ? 1 : approval?.aprobado === false ? 0 : 9;

    accumulator[role.statusKey] = statusMap[approvedValue] ?? "Sin revisar";
    accumulator[role.observationKey] = {
      comentario: approval?.comentario,
      funcionario: approval?.usuario_modificacion,
      fecha: approval?.fecha_aprobacion,
    };

    return accumulator;
  }, {});
};

export const isApprovedBySupervision = (row) => {
  return (
    String(row?.status_supervision || "").toLowerCase() ===
    StatusTeamProductEnum.APPROVED.label.toLowerCase()
  );
};

export const isBlockedByMaxRetries = (row) => {
  return row?.maximo_reintentos === true;
};

export const isProductPriceQuoteLocked = (row) => {
  return isApprovedBySupervision(row) || isBlockedByMaxRetries(row);
};

export const normalizeProductPriceQuoteRows = (payload) => {
  const rows = payload?.data?.productos ?? [];

  return rows.map((row) => {
    const maximoReintentos = row?.maximo_reintentos === true;

    return {
      key: row?.id,
      id: row?.id,
      category: row?.categoria_producto?.nombre,
      name: row?.nombre,
      unit: row?.unidad_medida?.nombre,
      description: row?.producto_especificaciones ?? "",
      brand: row?.producto_marca_comercial ?? "",
      price: row?.producto_valor_unitario ?? 0,
      price_min: Number(row?.precio_min),
      price_max: Number(row?.precio_max),
      maximo_reintentos: maximoReintentos,
      state: getProductState(row?.faprobado, row?.producto_aprobaciones),
      ...extractObservations(row?.producto_aprobaciones),
    };
  });
};
