import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";

const buildSolicitudesQuery = ({ operationalDay, alertCategory, alertManagement } = {}) => {
  const params = new URLSearchParams();

  if (operationalDay?.value) {
    params.set("jornada", String(operationalDay.value));
  }

  if (alertCategory?.value != null) {
    params.set("categoria_alerta", String(alertCategory.value));
  }

  if (alertManagement?.value != null) {
    params.set("gestion_alerta", String(alertManagement.value));
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const normalizeSolicitudRow = (row = {}, index) => ({
  id: `${row?.jornada ?? ""}-${row?.fecha_registro ?? ""}-${row?.tipo_gestion?.codigo ?? ""}-${index}`,
  jornada: row?.jornada ?? "",
  tipoGestion: row?.tipo_gestion?.nombre ?? "",
  tipoGestionCodigo: row?.tipo_gestion?.codigo ?? null,
  categoriaAlerta: row?.categoria_alerta?.nombre ?? "",
  categoriaAlertaCodigo: row?.categoria_alerta?.codigo ?? null,
  fechaRegistro: row?.fecha_registro ?? "",
  observacionJustificativa: row?.observacion_justificativa ?? "",
  observacionRevisor: row?.observacion_revisor ?? "",
  rolRevisor: row?.rol_revisor ?? "",
  gestionAlerta: row?.gestion_alerta?.nombre ?? "",
  gestionAlertaCodigo: row?.gestion_alerta?.codigo ?? null,
});

export const getAlertedProductsSolicitudes = async (filters = {}) => {
  const response = await alertedProductsServices.getSolicitudes(
    buildSolicitudesQuery(filters)
  );

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  const solicitudes = Array.isArray(response?.data?.solicitudes) ? response.data.solicitudes : [];
  return solicitudes.map(normalizeSolicitudRow);
};