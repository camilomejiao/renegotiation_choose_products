import { normalizeParameterOptions } from "../../../entities/parameter";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { approvedSupplierCatalogService } from "../../../helpers/services/ApprovedSupplierCatalogService";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";
import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import { locationServices } from "../../../helpers/services/LocationServices";
import { parameterServices } from "../../../helpers/services/ParameterServices";

export const getAlertedProductsOptions = async (jornada) => {
  if (!jornada) return [];

  const params = new URLSearchParams({
    jornada: String(jornada),
    page: "1",
    size: "1000000",
  });

  const response = await alertedProductsServices.getProducts(`?${params.toString()}`);

  if (response?.status !== ResponseStatusEnum.OK) return [];

  const productos = response?.data?.productos ?? [];

  const seen = new Set();
  return productos
    .filter((p) => p.id_producto != null)
    .filter((p) => {
      if (seen.has(p.id_producto)) return false;
      seen.add(p.id_producto);
      return true;
    })
    .map((p) => ({
      value: p.id_producto,
      label: `${p.id_producto} - ${p.nombre_producto}`,
    }));
};

export const getAlertedProductsJourneys = async () => {
  const { data, status } = await convocationProductsServices.getConvocations();

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data?.data?.jornadas ?? [];
};

export const getAlertedProductsParameterCatalog = async (parameterTypeId) => {
  const response = await parameterServices.getByTypeId(parameterTypeId);

  if (response?.status !== ResponseStatusEnum.OK) {
    return [];
  }

  return normalizeParameterOptions(response?.data ?? []);
};

export const getAlertedProductsDocumentFileNames = async () => {
  const response = await parameterServices.getByTypeId(38);

  if (response?.status !== ResponseStatusEnum.OK) {
    return { pdf: null, excel: null };
  }

  const options = normalizeParameterOptions(response?.data ?? []);
  return {
    pdf: options[0]?.label ?? null,
    excel: options[1]?.label ?? null,
  };
};

export const getAlertedProductsHistoryTabNames = async () => {
  const response = await parameterServices.getByTypeId(38);

  if (response?.status !== ResponseStatusEnum.OK) {
    return { pdf: "Historial PDF", excel: "Historial Excel" };
  }

  const options = normalizeParameterOptions(response?.data ?? []);
  return {
    pdf: options[0]?.label ?? "Historial PDF",
    excel: options[1]?.label ?? "Historial Excel",
  };
};

const normalizeSupplierOptions = (rows = []) =>
  rows
    .map((row) => {
      const supplierName = String(row?.nombre ?? row?.label ?? "").trim();
      const supplierNit = String(row?.nit ?? "").trim();
      const supplierId = row?.id ?? row?.value ?? null;

      if (!supplierId || !supplierName) {
        return null;
      }

      return {
        value: supplierId,
        label: supplierNit
          ? `${supplierName} — ${supplierNit}`
          : supplierName,
        supplierName,
        nit: supplierNit,
      };
    })
    .filter(Boolean);

export const getAlertedProductsSuppliers = async () => {
  const response = await approvedSupplierCatalogService.getApprovedSuppliers();

  if (response?.status !== ResponseStatusEnum.OK) {
    return [];
  }

  const rows =
    response?.data?.data?.proveedores ??
    response?.data?.proveedores ??
    response?.data?.results?.data?.proveedores ??
    [];

  return normalizeSupplierOptions(Array.isArray(rows) ? rows : []);
};

export const getAlertedProductsDepartments = async () => {
  const response = await locationServices.getDeptos();

  if (response?.status !== ResponseStatusEnum.OK) {
    return [];
  }

  return normalizeParameterOptions(response?.data ?? []);
};

export const getAlertedProductsMunicipalities = async (departmentId) => {
  if (!departmentId) {
    return [];
  }

  const response = await locationServices.getMunis(departmentId);

  if (response?.status !== ResponseStatusEnum.OK) {
    return [];
  }

  return normalizeParameterOptions(response?.data ?? []);
};
