import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";

const buildSolicitudesQuery = ({
  operationalDay,
  alertCategory,
  managementType,
  alertManagement,
} = {}) => {
  const params = new URLSearchParams();

  if (operationalDay?.value) {
    params.set("jornada", String(operationalDay.value));
  }

  if (alertCategory?.value != null) {
    params.set("categoria_alerta", String(alertCategory.value));
  }

  if (managementType?.value != null) {
    params.set("tipo_gestion", String(managementType.value));
  }

  if (alertManagement?.value != null) {
    params.set("gestion_alerta", String(alertManagement.value));
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const normalizeSolicitudRow = (row = {}, index) => ({
  id: row?.id ?? `${row?.jornada ?? ""}-${row?.fecha_registro ?? ""}-${row?.tipo_gestion?.codigo ?? ""}-${index}`,
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

const normalizeDocumento = (doc = {}) => {
  const isPdf = String(doc?.nombre_archivo ?? "").toLowerCase().endsWith(".pdf");
  const acciones = Array.isArray(doc?.acciones_disponibles) ? doc.acciones_disponibles : [];
  return {
    id: doc?.id,
    nombre: doc?.nombre_archivo ?? "",
    descripcion: doc?.descripcion ?? "",
    usuarioCreador: doc?.usuario_creador ?? "",
    fechaCreacion: doc?.fecha_creacion ?? "",
    rutaArchivo: doc?.ruta_archivo ?? "",
    esPdf: isPdf,
    puedeVer: acciones.includes("ver"),
    puedeDescargar: acciones.includes("descargar"),
  };
};

export const getAlertedProductsSolicitudDetalle = async (idSolicitud) => {
  const response = await alertedProductsServices.getSolicitudDetalle(idSolicitud);

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  const data = response?.data ?? {};
  return {
    idSolicitud: data?.id_solicitud,
    resumen: data?.resumen ?? "",
    estadoSolicitud: data?.estado_solicitud ?? null,
    usuarioOrigen: data?.usuario_origen ?? "",
    fechaImplementacion: data?.fecha_implementacion ?? "",
    jornada: data?.jornada ?? "",
    observacionJustificativa: data?.observacion_justificativa ?? "",
    documentos: Array.isArray(data?.documentos) ? data.documentos.map(normalizeDocumento) : [],
    trazaEventos: Array.isArray(data?.traza_eventos) ? data.traza_eventos : [],
    productosAsociados: Array.isArray(data?.productos_asociados) ? data.productos_asociados : [],
  };
};

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
