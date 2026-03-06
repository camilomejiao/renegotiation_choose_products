import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import {
  getCategoryOptions,
  getEnvironmentalCategories,
  getUnitOptions,
} from "../../../helpers/utils/ValidateProductColumns";

export const loadProductUploadDependencies = async () => {
  const [units, categories, convocationsResponse] = await Promise.all([
    getUnitOptions(),
    getCategoryOptions(),
    convocationProductsServices.getConvocations(),
  ]);

  const convocations =
    convocationsResponse?.status === ResponseStatusEnum.OK
      ? convocationsResponse?.data?.data?.jornadas ?? []
      : [];

  return {
    units,
    categories,
    convocations,
  };
};

export const getPlansByConvocation = async (convocationId) => {
  const { data, status } = await convocationProductsServices.getPlansByConvocation(convocationId);

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data?.data?.planes ?? [];
};

export const getProductsByPlan = async ({ planId, page = 1, pageSize = 100, search = "" }) => {
  const { data, status } = await convocationProductsServices.getProductByConvocationAndPlan(
    page,
    pageSize,
    planId,
    search
  );

  if (status !== ResponseStatusEnum.OK) {
    return { products: [] };
  }

  return {
    products: data?.data?.productos ?? [],
  };
};

export const saveProductsByConvocation = async (payload) => {
  return convocationProductsServices.saveProductsByConvocation(payload);
};

export const getEnvironmentalCategoryKeys = async () => {
  const categories = await getEnvironmentalCategories();
  return categories.map((category) => category.codigo);
};
