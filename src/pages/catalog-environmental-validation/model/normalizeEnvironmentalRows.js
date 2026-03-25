import {
  GeneralStatusDeliveryProductEnum,
  StatusTeamProductEnum,
} from "../../../helpers/GlobalEnum";

const toISODate = (value) => {
  return typeof value === "string" ? value.split("T")[0] : "";
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeAmbientalObject = (rawAmbiental) => {
  if (!rawAmbiental) {
    return {};
  }

  if (typeof rawAmbiental === "object") {
    return rawAmbiental;
  }

  try {
    const payload = String(rawAmbiental);
    const start = payload.indexOf("{");
    const end = payload.lastIndexOf("}");

    if (start === -1 || end === -1 || end < start) {
      return {};
    }

    return JSON.parse(payload.slice(start, end + 1));
  } catch {
    return {};
  }
};

const resolveProductState = ({ approvedByUser, approvedAt, status }) => {
  const approvedId = Number(StatusTeamProductEnum.APPROVED.id);
  const deniedId = Number(StatusTeamProductEnum.DENIED.id);
  const normalizedStatus = toNumber(status);

  if (normalizedStatus === approvedId && approvedByUser && approvedAt) {
    return GeneralStatusDeliveryProductEnum.APPROVED;
  }

  if (normalizedStatus === deniedId && approvedByUser && approvedAt) {
    return GeneralStatusDeliveryProductEnum.REFUSED;
  }

  return GeneralStatusDeliveryProductEnum.PENDING_APPROVAL;
};

export const normalizeEnvironmentalRows = ({ rows = [], categories = [] }) => {
  return rows.map((row, index) => {
    const ambiental = normalizeAmbientalObject(row?.ambiental);
    const categoryMap = categories.reduce((acc, category) => {
      const key = String(category?.codigo || "");
      if (!key) {
        return acc;
      }

      acc[key] = String(ambiental[key] ?? 0);
      return acc;
    }, {});

    const state = resolveProductState({
      approvedByUser: row?.uaprobado,
      approvedAt: row?.faprobado,
      status: row?.aprobado,
    });

    const statusLabel =
      state === GeneralStatusDeliveryProductEnum.APPROVED
        ? StatusTeamProductEnum.APPROVED.label
        : state === GeneralStatusDeliveryProductEnum.REFUSED
          ? StatusTeamProductEnum.DENIED.label
          : "Pendiente";

    return {
      rowKey: String(row?.id ?? `${Date.now()}-${index + 1}`),
      id: row?.id ?? "-",
      category: row?.categoria_producto?.nombre ?? "-",
      name: row?.nombre ?? "-",
      description: row?.especificacion_tecnicas ?? "-",
      brand: row?.marca_comercial ?? "-",
      unit: row?.unidad_medida?.nombre ?? "-",
      price_min: Number(row?.precio_min ?? 0),
      price_max: Number(row?.precio_max ?? 0),
      price: Number(row?.precio ?? 0),
      state,
      status_environmental: statusLabel,
      observations_environmental: {
        comentario: row?.motivo_aprobacion ?? "",
        funcionario: row?.uaprobado ?? "",
        fecha: toISODate(row?.faprobado),
      },
      customValue: row?.cantidad_ambiental?.cant ?? "",
      selectedCategory: row?.cantidad_ambiental?.ambiental_key ?? "",
      ...categoryMap,
    };
  });
};
