import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { approvedSupplierCatalogService } from "../../../helpers/services/ApprovedSupplierCatalogService";
import { locationServices } from "../../../helpers/services/LocationServices";
import { parameterServices } from "../../../helpers/services/ParameterServices";
import { purchaseOrderServices } from "../../../helpers/services/PurchaseOrderServices";

const appendSearchParam = (params, { searchField = "", searchValue = "" }) => {
  if (searchField && searchValue) {
    params.set(searchField, searchValue);
  }
};

const buildOrderReportQuery = ({
  page,
  pageSize,
  supplierId = "",
  searchField = "",
  searchValue = "",
}) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(pageSize),
  });

  if (supplierId) {
    params.set("proveedor", supplierId);
  }

  if (searchValue) {
    params.set(searchField || "search", searchValue);
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
  searchField = "",
  searchValue = "",
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
    params.set("proveedor", supplierId);
  }

  if (departmentId) {
    params.set("departamento_id", departmentId);
  }

  if (municipalityId) {
    params.set("municipio_id", municipalityId);
  }

  appendSearchParam(params, { searchField, searchValue });

  return `?${params.toString()}`;
};

const buildLeaderApprovalRequestQuery = ({
  page,
  pageSize,
  requestType = "",
  requestStatus = "",
  supplierId = "",
  departmentId = "",
  municipalityId = "",
  searchValue = "",
}) => {
  const params = new URLSearchParams({
    page: String(page),
    size: String(pageSize),
  });

  if (requestType !== "" && requestType !== null && requestType !== undefined) {
    params.set("tipo_solicitud", String(Number(requestType)));
  }

  if (
    requestStatus !== "" &&
    requestStatus !== null &&
    requestStatus !== undefined
  ) {
    params.set("estado", String(Number(requestStatus)));
  }

  if (supplierId !== "" && supplierId !== null && supplierId !== undefined) {
    params.set("proveedor", String(Number(supplierId)));
  }

  if (
    departmentId !== "" &&
    departmentId !== null &&
    departmentId !== undefined
  ) {
    params.set("departamento", String(Number(departmentId)));
  }

  if (
    municipalityId !== "" &&
    municipalityId !== null &&
    municipalityId !== undefined
  ) {
    params.set("municipio", String(Number(municipalityId)));
  }

  if (searchValue) {
    params.set("search", searchValue);
  }

  return `?${params.toString()}`;
};

export const getOrderReportPage = async ({
  page = 1,
  pageSize = 100,
  supplierId = "",
  searchField = "",
  searchValue = "",
}) => {
  const response = await purchaseOrderServices.getAll(
    buildOrderReportQuery({
      page,
      pageSize,
      supplierId,
      searchField,
      searchValue,
    })
  );

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data ?? { count: 0, results: [] };
};

export const createOrderCancellationRequest = async (payload = {}) => {
  const response = await purchaseOrderServices.createCancellationRequest(payload);

  if (
    response?.status !== ResponseStatusEnum.OK &&
    response?.status !== ResponseStatusEnum.CREATED &&
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
  searchField = "",
  searchValue = "",
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
      searchField,
      searchValue,
    })
  );

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data ?? { count: 0, results: [] };
};

export const getLeaderOrderApprovalRequestsPage = async ({
  page = 1,
  pageSize = 10,
  requestType = "",
  requestStatus = "",
  supplierId = "",
  departmentId = "",
  municipalityId = "",
  searchValue = "",
}) => {
  const response = await purchaseOrderServices.getApprovalRequests(
    buildLeaderApprovalRequestQuery({
      page,
      pageSize,
      requestType,
      requestStatus,
      supplierId,
      departmentId,
      municipalityId,
      searchValue,
    })
  );

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return response?.data ?? { records: [] };
};

export const submitLeaderOrderApprovalRequest = async (payload = {}) => {
  const response = await purchaseOrderServices.submitApprovalRequest(payload);

  if (
    response?.status !== ResponseStatusEnum.OK &&
    response?.status !== ResponseStatusEnum.CREATED &&
    response?.status !== ResponseStatusEnum.NO_CONTENT
  ) {
    throw response;
  }

  return response;
};

export const cancelOrderCancellationRequest = async (
  payload = {}
) => {
  const response = await purchaseOrderServices.updateCancellationRequest(payload);

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

const extractApprovedSuppliers = (response) => {
  const rows =
    response?.data?.data?.proveedores ??
    response?.data?.proveedores ??
    response?.data?.results?.data?.proveedores ??
    [];

  return Array.isArray(rows) ? rows : [];
};

export const getLeaderSupplierCatalog = async () => {
  const response = await approvedSupplierCatalogService.getApprovedSuppliers();

  if (response?.status !== ResponseStatusEnum.OK) {
    throw response;
  }

  return extractApprovedSuppliers(response);
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
