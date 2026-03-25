import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";

export const getCatalogItems = async () => {
  const { data, status } = await convocationProductsServices.getConvocationInformation();

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data;
};
