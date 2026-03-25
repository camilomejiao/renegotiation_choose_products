import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import { productServices } from "../../../helpers/services/ProductServices";

export const getConvocations = async () => {
  const { data, status } = await convocationProductsServices.getConvocations();
  if (status !== ResponseStatusEnum.OK) {
    return [];
  }
  return data?.data?.jornadas ?? [];
};

export const getPlansByConvocation = async (convocationId) => {
  const { data, status } = await convocationProductsServices.getPlansByConvocation(convocationId);
  if (status !== ResponseStatusEnum.OK) {
    return [];
  }
  return data?.data?.planes ?? [];
};

export const getSuppliersByConvocation = async (convocationId) => {
  const { data, status } = await convocationProductsServices.getSupplierByConvocation(convocationId);
  if (status !== ResponseStatusEnum.OK) {
    return [];
  }
  return data?.data?.proveedores ?? [];
};

export const getSupervisionProducts = async ({
  page = 1,
  pageSize = 10,
  planId,
  supplierId,
  search = "",
}) => {
  const { data, status } = await convocationProductsServices.convocationServices(
    page,
    pageSize,
    planId,
    supplierId,
    search
  );

  if (status === ResponseStatusEnum.BAD_REQUEST) {
    return { rows: [], total: 0, hasSupplierQuote: false };
  }

  if (status !== ResponseStatusEnum.OK) {
    return { rows: [], total: 0, hasSupplierQuote: true };
  }

  return {
    rows: data?.data?.productos ?? [],
    total: data?.data?.total_productos ?? 0,
    hasSupplierQuote: true,
  };
};

export const approveSupervisionProducts = async (payload) => {
  return productServices.productApprove(payload);
};
