import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";
import { nextRowKey } from "../../../shared/lib/rowKey";
import { buildAlertedProductsRequestFormData } from "../model/buildAlertedProductsRequest";

const appendRepeatedQueryParams = (params, key, values = []) => {
  values
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .forEach((value) => params.append(key, value));
};

const buildAlertedProductsQuery = ({
  operationalDay,
  alertCategory,
  managementType,
  alertManagement,
  documentoTitular,
  cub,
  ordenNumero,
  department,
  municipality,
  idProducto,
  supplier = [],
  products = [],
  search = "",
  page = 1,
  pageSize = 10,
}) => {
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

  if (documentoTitular?.trim()) {
    params.set("documento_titular", documentoTitular.trim());
  }

  if (cub?.trim()) {
    params.set("cub", cub.trim());
  }

  if (ordenNumero?.trim()) {
    params.set("numero_orden", ordenNumero.trim());
  }

  if (department?.label) {
    params.set("departamento", String(department.label));
  }

  if (municipality?.label) {
    params.set("municipio", String(municipality.label));
  }

  if (idProducto?.trim()) {
    params.set("id_producto", idProducto.trim());
  }

  if (search?.trim()) {
    params.set("search", search.trim());
  }

  appendRepeatedQueryParams(
    params,
    "proveedor",
    supplier.map((s) => s?.value)
  );

  appendRepeatedQueryParams(
    params,
    "producto",
    products.map((product) => product?.value)
  );

  params.set("page", String(page));
  params.set("size", String(pageSize));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const normalizeAlertedProductRow = (row = {}) => ({
  // Key sintético para React/antd: nunca proviene del backend (evita keys
  // duplicadas). La identidad de negocio vive en orderDetailId / productId.
  id: nextRowKey(),
  // id_orden_detalle: identidad del renglón de la orden (lo que espera solicitud/).
  // Sin fallback a id_producto para no enviar un id equivocado.
  orderDetailId: String(row?.id_orden_detalle ?? ""),
  jornada: row?.nombre_jornada ?? row?.jornada ?? "",
  documentoTitular: row?.documento_titular ?? "",
  ordenNumero: row?.numero_orden ?? "",
  supplier: row?.proveedor ?? "",
  productId: String(row?.id_producto ?? ""),
  journeyProductId: String(row?.id_jornada_producto ?? ""),
  productName: row?.nombre_producto ?? "",
  unitOfMeasure: row?.unidad_medida ?? "",
  commercialBrand: row?.marca_comercial ?? "",
  minimumPrice: Number(row?.precio_minimo ?? 0),
  maximumPrice: Number(row?.precio_maximo ?? 0),
  saleUnitValue: Number(row?.valor_unitario_venta ?? 0),
  fairCatalogValue: Number(row?.valor_catalogo_jornada ?? row?.valor_catalogo_feria ?? 0),
  alertCategory: row?.categoria_alerta?.nombre ?? "",
  managementType: row?.tipo_gestion?.nombre ?? "",
  alertManagement: row?.gestion_alerta?.nombre ?? "",
  alertCategoryCode: row?.categoria_alerta?.id ?? row?.categoria_alerta?.codigo ?? null,
  managementTypeCode: row?.tipo_gestion?.id ?? row?.tipo_gestion?.codigo ?? null,
  alertManagementCode: row?.gestion_alerta?.id ?? row?.gestion_alerta?.codigo ?? null,
  hasAssignedManagementType: Boolean(row?.tipo_gestion?.id ?? row?.tipo_gestion?.codigo),
  cub: row?.cub ?? "",
});

const getNormalizedAlertedProductsRows = (rows = []) => {
  const seenOrderDetailIds = new Set();

  // Deduplica por id_orden_detalle (identidad real del renglón). Los renglones
  // sin id_orden_detalle se conservan: su key generado ya garantiza unicidad.
  return rows
    .map(normalizeAlertedProductRow)
    .filter((row) => {
      if (!row.orderDetailId) {
        return true;
      }

      if (seenOrderDetailIds.has(row.orderDetailId)) {
        return false;
      }

      seenOrderDetailIds.add(row.orderDetailId);
      return true;
    });
};

export const getAlertedProductsPage = async (filters = {}) => {
  const response = await alertedProductsServices.getProducts(
    buildAlertedProductsQuery(filters)
  );

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  const data = response?.data ?? {};
  const rows = Array.isArray(data?.productos) ? data.productos : [];

  return {
    meta: data?.meta ?? {},
    rows: getNormalizedAlertedProductsRows(rows),
  };
};

const buildProductoPayload = (row) => {
  // El contrato de gestión identifica cada renglón por id_orden_detalle
  // (igual que solicitud/), no por el id del producto.
  const producto = {
    id_orden_detalle: Number(row?.orderDetailId),
    categoria_alerta: {
      codigo: row?.alertCategoryCode != null ? Number(row.alertCategoryCode) : null,
      nombre: row?.alertCategory ?? "",
    },
  };

  // Para "Ajuste de precio", el nuevo precio reemplaza el valor unitario de venta.
  if (row?.newSalePrice != null && row?.newSalePrice !== "") {
    producto.valor_unitario_venta = Number(row.newSalePrice);
  }

  return producto;
};

export const buildAlertedProductsManagementTypeRequest = ({
  managementTypeId,
  selectedRows = [],
}) => ({
  tipo_gestion_id: Number(managementTypeId),
  productos: selectedRows.map(buildProductoPayload),
});

export const buildAlertedProductsRequestPayload = ({
  observation,
  pdf,
  selectedRows = [],
}) =>
  buildAlertedProductsRequestFormData({
    orderDetailIds: selectedRows.map((row) => row?.orderDetailId).filter(Boolean),
    observation,
    pdf,
  });

export const createAlertedProductsRequest = async ({
  observation,
  pdf,
  selectedRows = [],
}) => {
  const formData = buildAlertedProductsRequestPayload({
    observation,
    pdf,
    selectedRows,
  });

  // Diagnóstico (solo desarrollo): el multipart/form-data no se ve como JSON en Network.
  if (process.env.NODE_ENV !== "production") {
    const pdfFile = formData.get("pdf");
    // eslint-disable-next-line no-console
    console.groupCollapsed("[POST /api/alertas/productos/solicitud/] multipart/form-data");
    // eslint-disable-next-line no-console
    console.log("orden_detalle_id:", formData.getAll("orden_detalle_id"));
    // eslint-disable-next-line no-console
    console.log("observacion:", formData.get("observacion"));
    // eslint-disable-next-line no-console
    console.log(
      "pdf:",
      pdfFile instanceof File
        ? { name: pdfFile.name, type: pdfFile.type, size: pdfFile.size }
        : pdfFile
    );
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  const response = await alertedProductsServices.createProductRequest(formData);
  const isSuccess =
    response?.status === ResponseStatusEnum.OK ||
    response?.status === ResponseStatusEnum.CREATED;

  if (!isSuccess) {
    throw response;
  }

  return response?.data ?? {};
};

export const assignAlertedProductsManagementType = async ({
  managementTypeId,
  selectedRows = [],
}) => {
  const payload = buildAlertedProductsManagementTypeRequest({
    managementTypeId,
    selectedRows,
  });

  const response = await alertedProductsServices.updateProductsManagementType(payload);

  const isSuccess = response?.status === ResponseStatusEnum.OK || response?.status === ResponseStatusEnum.CREATED;
  if (!isSuccess) {
    throw response;
  }

  return response?.data ?? {};
};
