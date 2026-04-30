import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { locationServices } from "../../../helpers/services/LocationServices";
import { parameterServices } from "../../../helpers/services/ParameterServices";
import { purchaseOrderServices } from "../../../helpers/services/PurchaseOrderServices";
import { supplierServices } from "../../../helpers/services/SupplierServices";

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

const buildOrderRequestQuery = ({
  page,
  pageSize,
  requestType = "",
  requestStatus = "",
  supplierId = "",
  departmentId = "",
  municipalityId = "",
}) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(pageSize),
  });

  if (requestType) {
    params.set("tipo_solicitud", requestType);
  }

  if (requestStatus) {
    params.set("estado", requestStatus);
  }

  if (supplierId) {
    params.set("proveedor_id", supplierId);
  }

  if (departmentId) {
    params.set("departamento_id", departmentId);
  }

  if (municipalityId) {
    params.set("municipio_id", municipalityId);
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

export const deleteOrderReportItem = async (orderId, payload = {}) => {
  const response = await purchaseOrderServices.removeOrder(orderId, payload);

  if (
    response?.status !== ResponseStatusEnum.NO_CONTENT &&
    response?.status !== ResponseStatusEnum.FORBIDDEN
  ) {
    throw response;
  }

  return response;
};

export const getOrderCancellationRequestsPage = async ({
  page = 1,
  pageSize = 100,
  requestType = "",
  requestStatus = "",
  supplierId = "",
  departmentId = "",
  municipalityId = "",
}) => {
  const response = await purchaseOrderServices.getCancellationRequests(
    buildOrderRequestQuery({
      page,
      pageSize,
      requestType,
      requestStatus,
      supplierId,
      departmentId,
      municipalityId,
    })
  );

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data ?? { count: 0, results: [] };
};

export const cancelOrderCancellationRequest = async (
  requestId,
  payload = {}
) => {
  const response = await purchaseOrderServices.cancelCancellationRequest(
    requestId,
    payload
  );

  if (
    response?.status !== ResponseStatusEnum.OK &&
    response?.status !== ResponseStatusEnum.NO_CONTENT
  ) {
    throw response;
  }

  return response;
};

export const getOrderRequestFilterCatalog = async (parameterTypeId) => {
  const response = await parameterServices.getByTypeId(parameterTypeId);

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data ?? [];
};

export const getLeaderSupplierCatalog = async () => {
  const response = await supplierServices.getSuppliers();

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data?.data?.proveedores ?? response?.data ?? [];
};

export const getDepartmentCatalog = async () => {
  const response = await locationServices.getDeptos();

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data ?? [];
};

export const getMunicipalityCatalog = async (departmentId) => {
  const response = await locationServices.getMunis(departmentId);

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data ?? [];
};
