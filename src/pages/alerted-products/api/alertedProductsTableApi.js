import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";
import {
  alertedProductsTableResponseMock,
} from "../../../widgets/alerted-products-table/model/alertedProductsTableData";
import { getManagementTypeAssignmentLabel } from "../../../widgets/alerted-products-table/model/managementTypeOptions";

// Mantiene operativa la vista mientras el backend real de productos alertados
// no exista o responda sin datos.
const ENABLE_ALERTED_PRODUCTS_TABLE_MOCK_FALLBACK = true;
const createMockAlertedProductsResponseState = () =>
  JSON.parse(JSON.stringify(alertedProductsTableResponseMock));

let alertedProductsTableResponseState = createMockAlertedProductsResponseState();

const appendRepeatedQueryParams = (params, key, values = []) => {
  values
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .forEach((value) => params.append(key, value));
};

const buildAlertedProductsQuery = ({
  operationalDay,
  alertCategory,
  alertManagement,
  department,
  municipality,
  supplier,
  products = [],
}) => {
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

  if (department?.label) {
    params.set("departamento", String(department.label));
  }

  if (municipality?.label) {
    params.set("municipio", String(municipality.label));
  }

  if (supplier?.supplierName || supplier?.label) {
    params.append("proveedor", String(supplier.supplierName || supplier.label));
  }

  appendRepeatedQueryParams(
    params,
    "producto",
    products.map((product) => product?.label || product?.value)
  );

  params.set("pagina", "1");
  params.set("tamano_pagina", "100");

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const normalizeAlertedProductRow = (row = {}) => ({
  id: String(row?.id_producto ?? ""),
  supplier: row?.proveedor ?? "",
  productId: String(row?.id_producto ?? ""),
  productName: row?.nombre_producto ?? "",
  unitOfMeasure: row?.unidad_medida ?? "",
  commercialBrand: row?.marca_comercial ?? "",
  minimumPrice: Number(row?.precio_minimo ?? 0),
  maximumPrice: Number(row?.precio_maximo ?? 0),
  saleUnitValue: Number(row?.valor_unitario_venta ?? 0),
  fairCatalogValue: Number(row?.valor_catalogo_feria ?? 0),
  alertCategory: row?.categoria_alerta?.nombre ?? "",
  managementType: row?.tipo_gestion?.nombre ?? "",
  alertManagement: row?.gestion_alerta?.nombre ?? "",
  alertCategoryCode: row?.categoria_alerta?.id ?? row?.categoria_alerta?.codigo ?? null,
  managementTypeCode: row?.tipo_gestion?.id ?? row?.tipo_gestion?.codigo ?? null,
  alertManagementCode: row?.gestion_alerta?.id ?? row?.gestion_alerta?.codigo ?? null,
  hasAssignedManagementType: Boolean(row?.tipo_gestion?.id ?? row?.tipo_gestion?.codigo),
});

const getNormalizedAlertedProductsRows = (rows = []) =>
  rows.map(normalizeAlertedProductRow).filter((row) => row.id);

const normalizeText = (value) => String(value ?? "").trim().toLowerCase();

const matchesSingleValue = (currentValue, expectedValue) => {
  if (!expectedValue) {
    return true;
  }

  return normalizeText(currentValue) === normalizeText(expectedValue);
};

const matchesAnyValue = (currentValue, expectedValues = []) => {
  if (!Array.isArray(expectedValues) || expectedValues.length === 0) {
    return true;
  }

  const normalizedCurrentValue = normalizeText(currentValue);
  return expectedValues.some((value) => normalizeText(value) === normalizedCurrentValue);
};

const getMockAlertedProductsRows = (filters = {}) =>
  getNormalizedAlertedProductsRows(alertedProductsTableResponseState.productos).filter((row) => {
    const selectedProducts = (filters.products ?? []).map(
      (product) => product?.label || product?.value
    );

    return (
      matchesSingleValue(row.supplier, filters.supplier?.supplierName || filters.supplier?.label) &&
      matchesSingleValue(row.alertCategory, filters.alertCategory?.label) &&
      matchesSingleValue(row.managementType, filters.managementType?.label) &&
      matchesSingleValue(row.alertManagement, filters.alertManagement?.label) &&
      matchesAnyValue(row.productName, selectedProducts)
    );
  });

const buildMockAlertedProductsPage = (filters = {}) => {
  const rows = getMockAlertedProductsRows(filters);

  return {
    meta: { ...alertedProductsTableResponseMock.meta, size: rows.length, total_registros: rows.length, total_pages: rows.length > 0 ? 1 : 0, source: "mock" },
    rows,
  };
};

export const getAlertedProductsPage = async (filters = {}) => {
  try {
    const response = await alertedProductsServices.getProducts(
      buildAlertedProductsQuery(filters)
    );

    if (response?.status !== ResponseStatusEnum.OK) {
      if (ENABLE_ALERTED_PRODUCTS_TABLE_MOCK_FALLBACK) {
        return buildMockAlertedProductsPage(filters);
      }

      throw response;
    }

    const data = response?.data ?? {};
    const rows = Array.isArray(data?.productos) ? data.productos : [];
    const normalizedRows = getNormalizedAlertedProductsRows(rows);

    if (
      ENABLE_ALERTED_PRODUCTS_TABLE_MOCK_FALLBACK &&
      normalizedRows.length === 0
    ) {
      return buildMockAlertedProductsPage(filters);
    }

    return {
      meta: data?.meta ?? {},
      rows: normalizedRows,
    };
  } catch (error) {
    if (ENABLE_ALERTED_PRODUCTS_TABLE_MOCK_FALLBACK) {
      return buildMockAlertedProductsPage(filters);
    }

    throw error;
  }
};

export const buildAlertedProductsManagementTypeRequest = ({
  managementTypeId,
  selectedRows = [],
}) => ({
  tipo_gestion_id: Number(managementTypeId),
  productos: selectedRows.map((row) => ({
    id_producto: Number(row?.productId ?? row?.id),
    categoria_alerta: {
      codigo: Number(row?.alertCategoryCode),
      nombre: row?.alertCategory ?? "",
    },
  })),
});

const updateMockAlertedProductsManagementType = ({
  managementTypeId,
  selectedRows = [],
}) => {
  const managementTypeLabel = getManagementTypeAssignmentLabel(Number(managementTypeId));

  alertedProductsTableResponseState = {
    ...alertedProductsTableResponseState,
    productos: (alertedProductsTableResponseState.productos ?? []).map((row) => {
      const matchesSelectedRow = selectedRows.some(
        (selectedRow) => Number(selectedRow?.productId ?? selectedRow?.id) === Number(row?.id_producto)
      );

      if (!matchesSelectedRow) {
        return row;
      }

      return {
        ...row,
        tipo_gestion: {
          codigo: Number(managementTypeId),
          id: Number(managementTypeId),
          nombre: managementTypeLabel,
        },
      };
    }),
  };

  return {
    tipo_gestion_id: Number(managementTypeId),
    total_productos_recibidos: selectedRows.length,
    total_productos_actualizados: selectedRows.length,
    mensaje: "Tipo de gestión actualizado correctamente.",
    source: "mock",
  };
};

export const assignAlertedProductsManagementType = async ({
  managementTypeId,
  selectedRows = [],
}) => {
  const payload = buildAlertedProductsManagementTypeRequest({
    managementTypeId,
    selectedRows,
  });

  try {
    const response = await alertedProductsServices.updateProductsManagementType(payload);

    if (response?.status !== ResponseStatusEnum.OK) {
      if (ENABLE_ALERTED_PRODUCTS_TABLE_MOCK_FALLBACK) {
        return updateMockAlertedProductsManagementType({
          managementTypeId,
          selectedRows,
        });
      }

      throw response;
    }

    return response?.data ?? {};
  } catch (error) {
    if (ENABLE_ALERTED_PRODUCTS_TABLE_MOCK_FALLBACK) {
      return updateMockAlertedProductsManagementType({
        managementTypeId,
        selectedRows,
      });
    }

    throw error;
  }
};

export const __resetAlertedProductsTableMockStateForTests = () => {
  alertedProductsTableResponseState = createMockAlertedProductsResponseState();
};
