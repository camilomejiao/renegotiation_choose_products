import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";
import { nextRowKey } from "../../../shared/lib/rowKey";

const buildSolicitudesQuery = ({
  operationalDay,
  alertCategory,
  managementType,
  alertManagement,
  page = 1,
  pageSize = 10,
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

  params.set("page", String(page));
  params.set("size", String(pageSize));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const normalizeSolicitudRow = (row = {}, index) => ({
  id: row?.id_encabezado ?? row?.id ?? `${row?.jornada ?? ""}-${row?.fecha_registro ?? ""}-${row?.tipo_gestion?.codigo ?? ""}-${index}`,
  jornadaId: row?.jornada_id ?? null,
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

const normalizeProductoAsociado = (producto = {}) => ({
  ...producto,
  // Key sintético para la tabla; la identidad real sigue en id_orden_detalle.
  rowKey: nextRowKey(),
  id_orden_detalle:
    producto?.id_orden_detalle ??
    producto?.orden_detalle_id ??
    producto?.id_detalle ??
    producto?.id ??
    null,
});

const normalizeDocumento = (doc = {}) => {
  const isPdf = Number(doc?.tipo_archivo) === 2
    || String(doc?.nombre_archivo ?? "").toLowerCase().endsWith(".pdf");
  return {
    id: doc?.id,
    nombre: doc?.nombre_archivo ?? "",
    descripcion: doc?.descripcion ?? "",
    usuarioCreador: doc?.usuario_creador ?? "",
    fechaCreacion: doc?.fecha_creacion ?? "",
    rutaArchivo: doc?.ruta_archivo ?? "",
    esPdf: isPdf,
    puedeVer: isPdf,
    puedeDescargar: true,
  };
};

export const subsanarAlertedProductsSolicitud = async ({ idEncabezado, observacion, documento = null }) => {
  const formData = new FormData();
  formData.append("id_encabezado", String(idEncabezado));
  formData.append("observacion", observacion);
  if (documento) formData.append("documento", documento);

  const response = await alertedProductsServices.subsanarSolicitud(formData);

  if (
    response?.status !== ResponseStatusEnum.OK &&
    response?.status !== ResponseStatusEnum.CREATED
  ) {
    throw response;
  }

  return response?.data ?? {};
};

export const agregarProductoAlertedProductsSolicitud = async ({ idEncabezado, idOrdenDetalle }) => {
  const response = await alertedProductsServices.agregarProductoSolicitud({
    id_encabezado: idEncabezado,
    id_orden_detalle: idOrdenDetalle,
  });

  if (
    response?.status !== ResponseStatusEnum.OK &&
    response?.status !== ResponseStatusEnum.CREATED
  ) {
    throw response;
  }

  return response?.data ?? {};
};

export const eliminarProductoAlertedProductsSolicitud = async ({ idEncabezado, idOrdenDetalle }) => {
  const response = await alertedProductsServices.eliminarProductoSolicitud({
    id_encabezado: idEncabezado,
    id_orden_detalle: idOrdenDetalle,
  });

  if (
    response?.status !== ResponseStatusEnum.OK &&
    response?.status !== ResponseStatusEnum.CREATED &&
    response?.status !== ResponseStatusEnum.NO_CONTENT
  ) {
    throw response;
  }

  return response?.data ?? {};
};

export const gestionarAlertedProductsSolicitud = async ({ idEncabezado, idEstado, observacion, documento = null }) => {
  const formData = new FormData();
  formData.append("id_encabezado", String(idEncabezado));
  formData.append("id_estado", String(idEstado));
  formData.append("observacion", observacion);
  if (documento) formData.append("documento_observacion", documento);

  const response = await alertedProductsServices.gestionarSolicitud(formData);

  if (
    response?.status !== ResponseStatusEnum.OK &&
    response?.status !== ResponseStatusEnum.CREATED
  ) {
    throw response;
  }

  return response?.data ?? {};
};

export const getAlertedProductsSolicitudDetalle = async (idEncabezado) => {
  const response = await alertedProductsServices.getSolicitudDetalle(idEncabezado);

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  const data = response?.data ?? {};
  return {
    idEncabezado: data?.id_encabezado,
    resumen: data?.resumen ?? "",
    estadoSolicitud: data?.estado_solicitud ?? null,
    usuarioOrigen: data?.usuario_origen ?? "",
    fechaImplementacion: data?.fecha_implementacion ?? "",
    // El backend enviará jornada como objeto { id, nombre }. Mientras tanto puede
    // llegar como primitivo (ej. jornada: 43); en ese caso el id es ese valor y el
    // nombre queda como "---".
    jornada:
      data?.jornada && typeof data.jornada === "object"
        ? { id: data.jornada.id ?? null, nombre: data.jornada.nombre ?? "---" }
        : { id: data?.jornada ?? null, nombre: "---" },
    observacionJustificativa: data?.observacion_justificativa ?? "",
    documentos: Array.isArray(data?.documentos) ? data.documentos.map(normalizeDocumento) : [],
    trazaEventos: Array.isArray(data?.traza_eventos) ? data.traza_eventos : [],
    productosAsociados: Array.isArray(data?.productos_asociados)
      ? data.productos_asociados.map(normalizeProductoAsociado)
      : [],
  };
};

export const getAlertedProductsSolicitudes = async (filters = {}) => {
  const response = await alertedProductsServices.getSolicitudes(
    buildSolicitudesQuery(filters)
  );

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  const data = response?.data ?? {};
  const solicitudes = Array.isArray(data?.solicitudes) ? data.solicitudes : [];

  return {
    meta: data?.meta ?? {},
    rows: solicitudes.map(normalizeSolicitudRow),
  };
};
