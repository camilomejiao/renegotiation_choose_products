import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";

export const getCatalogConvocations = async () => {
  const { data, status } = await convocationProductsServices.getConvocationInformation();

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data?.data ?? [];
};

export const getCatalogPlansByConvocation = async (convocationId) => {
  const { data, status } = await convocationProductsServices.getPlansByConvocation(convocationId);

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data?.data?.planes ?? [];
};

export const getCatalogSuppliersByConvocation = async (convocationId) => {
  const { data, status } = await convocationProductsServices.getSupplierByConvocation(convocationId);

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data?.data?.proveedores ?? [];
};

export const getCatalogReportProducts = async ({ planId, supplierId = "", search = "" }) => {
  const { data, status } = await convocationProductsServices.convocationServices(
    1,
    100,
    planId,
    supplierId,
    search
  );

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data?.data?.productos ?? [];
};
