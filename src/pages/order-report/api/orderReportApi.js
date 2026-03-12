import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { purchaseOrderServices } from "../../../helpers/services/PurchaseOrderServices";

const buildOrderReportQuery = ({ page, pageSize, searchQuery = "" }) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(pageSize),
  });

  if (searchQuery) {
    params.set("cedula", searchQuery);
  }

  return `?${params.toString()}`;
};

export const getOrderReportPage = async ({
  page = 1,
  pageSize = 100,
  searchQuery = "",
}) => {
  const response = await purchaseOrderServices.getAll(
    buildOrderReportQuery({ page, pageSize, searchQuery })
  );

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data ?? { count: 0, results: [] };
};

export const deleteOrderReportItem = async (orderId) => {
  const response = await purchaseOrderServices.removeOrder(orderId);

  if (
    response?.status !== ResponseStatusEnum.NO_CONTENT &&
    response?.status !== ResponseStatusEnum.FORBIDDEN
  ) {
    throw response;
  }

  return response;
};
