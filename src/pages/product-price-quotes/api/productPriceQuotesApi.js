import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import { supplierServices } from "../../../helpers/services/SupplierServices";

export const getActiveSupplierConvocationId = () => {
  return supplierServices.getIdActiveConvocationOfSupplier();
};

export const getProductPriceQuotePlans = async () => {
  const convocationId = getActiveSupplierConvocationId();

  if (!convocationId) {
    return [];
  }

  const { data, status } = await convocationProductsServices.getPlansByConvocation(convocationId);

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data?.data?.planes || [];
};

export const getProductPriceQuotes = async ({ supplierId, jornadaPlanId, onlyMine }) => {
  const { data, status } = await convocationProductsServices.getProductsBySupplier(
    supplierId,
    jornadaPlanId,
    onlyMine
  );

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data;
};

export const saveProductPriceQuotes = async (payload) => {
  return convocationProductsServices.saveProductBySupplier(payload);
};
