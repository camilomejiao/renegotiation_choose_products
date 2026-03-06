import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import { getEnvironmentalCategories } from "../../../helpers/utils/ValidateProductColumns";

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

export const getProductsByPlan = async ({ page = 1, pageSize = 100, planId, search = "" }) => {
  const { data, status } = await convocationProductsServices.getProductByConvocationAndPlan(
    page,
    pageSize,
    planId,
    search
  );

  if (status !== ResponseStatusEnum.OK) {
    return { rows: [], total: 0 };
  }

  return {
    rows: data?.data?.productos ?? [],
    total: data?.data?.total_productos ?? 0,
  };
};

export const getEnvironmentalDefinitions = async () => {
  return getEnvironmentalCategories();
};

export const updateEnvironmentalValidation = async (payload) => {
  return convocationProductsServices.updateValidationEnvironmental(payload);
};

export const approveOrDenyEnvironmental = async (payload) => {
  return convocationProductsServices.approveOrDennyEnvironmental(payload);
};
