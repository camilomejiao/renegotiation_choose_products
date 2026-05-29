import { normalizeParameterOptions } from "../../../entities/parameter";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { approvedSupplierCatalogService } from "../../../helpers/services/ApprovedSupplierCatalogService";
import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import { locationServices } from "../../../helpers/services/LocationServices";
import { parameterServices } from "../../../helpers/services/ParameterServices";

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
