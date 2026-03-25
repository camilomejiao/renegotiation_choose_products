import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import {
  getCategoryOptions,
  getEnvironmentalCategories,
  getUnitOptions,
} from "../../../helpers/utils/ValidateProductColumns";

export const loadCatalogEditDependencies = async () => {
  const [units, categories] = await Promise.all([getUnitOptions(), getCategoryOptions()]);
  return { units, categories };
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
    return { products: [], total: 0 };
  }

  return {
    products: data?.data?.productos ?? [],
    total: data?.data?.total_productos ?? 0,
  };
};

export const deleteCatalogProduct = async (productId) => {
  return convocationProductsServices.deleteProduct(productId);
};

export const updateCatalogProducts = async (payload) => {
  return convocationProductsServices.updateValidationEnvironmental(payload);
};

export const getEnvironmentalCategoryKeys = async () => {
  const categories = await getEnvironmentalCategories();
  return categories.map((category) => category.codigo);
};
