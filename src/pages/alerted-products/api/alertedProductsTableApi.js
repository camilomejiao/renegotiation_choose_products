import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";

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

  appendRepeatedQueryParams(
    params,
    "proveedor",
    supplier.map((s) => s?.supplierName || s?.label)
  );

  appendRepeatedQueryParams(
    params,
    "producto",
    products.map((product) => product?.label || product?.value)
  );

  params.set("pagina", String(page));
  params.set("tamano_pagina", String(pageSize));

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const normalizeAlertedProductRow = (row = {}) => ({
  id: String(row?.id_orden_detalle ?? ""),
  jornada: row?.nombre_jornada ?? row?.jornada ?? "",
  documentoTitular: row?.documento_titular ?? "",
  ordenNumero: row?.numero_orden ?? "",
  supplier: row?.proveedor ?? "",
  productId: String(row?.id_producto ?? ""),
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

const getNormalizedAlertedProductsRows = (rows = []) =>
  rows.map(normalizeAlertedProductRow).filter((row) => row.id);

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

export const buildAlertedProductsManagementTypeRequest = ({
  managementTypeId,
  selectedRows = [],
}) => ({
  tipo_gestion_id: Number(managementTypeId),
  productos: selectedRows.map((row) => ({
    id_producto: Number(row?.id),
    categoria_alerta: {
      codigo: Number(row?.alertCategoryCode),
      nombre: row?.alertCategory ?? "",
    },
  })),
});

export const assignAlertedProductsManagementType = async ({
  managementTypeId,
  selectedRows = [],
}) => {
  const payload = buildAlertedProductsManagementTypeRequest({
    managementTypeId,
    selectedRows,
  });

  const response = await alertedProductsServices.updateProductsManagementType(payload);

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data ?? {};
};