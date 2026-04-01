import {
  GeneralStatusDeliveryProductEnum,
  RolesEnum,
  StatusTeamProductEnum,
} from "../../../helpers/GlobalEnum";

const formatCurrency = (value) => {
  const numeric = Number(value ?? 0);
  return `$ ${numeric.toLocaleString()}`;
};

const getProductState = (approvalDate, approvalList) => {
  const isEmpty = !Array.isArray(approvalList) || approvalList.length === 0;

  if (isEmpty) {
    return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;
  }

  const approvedId = Number(StatusTeamProductEnum.APPROVED.id);
  const deniedId = Number(StatusTeamProductEnum.DENIED.id);

  const allApproved = approvalList.every(
    (item) => Number(item.estado) === approvedId && item.rol === RolesEnum.SUPERVISION
  );
  const hasRejected = approvalList.some(
    (item) => Number(item.estado) === deniedId && item.rol === RolesEnum.SUPERVISION
  );

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
    [RolesEnum.ENVIRONMENTAL]: {
      observationKey: "observations_environmental",
      statusKey: "status_environmental",
    },
    [RolesEnum.SUPERVISION]: {
      observationKey: "observations_supervision",
      statusKey: "status_supervision",
    },
  };

  const statusMap = Object.values(StatusTeamProductEnum).reduce((acc, current) => {
    acc[current.id] = current.label;
    return acc;
  }, {});

  return approvals.reduce((acc, current) => {
    const role = roleMap[current.rol];

    if (!role) {
      return acc;
    }

    acc[role.statusKey] = statusMap[current.estado] ?? StatusTeamProductEnum.UNREVIEWED.label;
    acc[role.observationKey] = {
      comentario: current.comentario,
      funcionario: current.funcionario,
      fecha: current.fecha,
    };

    return acc;
  }, {});
};

export const normalizeCatalogReportRows = (rows = []) => {
  return rows.map((row) => ({
    id: row?.id,
    category: row?.categoria_producto,
    name: row?.nombre,
    description: row?.especificacion_tecnicas,
    brand: row?.marca_comercial,
    unit: row?.unidad_medida,
    price_min: formatCurrency(row?.precio_min),
    price_max: formatCurrency(row?.precio_max),
    price: formatCurrency(row?.precio),
    state: getProductState(row?.fecha_aprobado, row?.aprobados),
    ...extractObservations(row?.aprobados),
  }));
};
