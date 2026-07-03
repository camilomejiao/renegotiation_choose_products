import { normalizeParameterOptions } from "../../../entities/parameter";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { approvedSupplierCatalogService } from "../../../helpers/services/ApprovedSupplierCatalogService";
import { alertedProductsServices } from "../../../helpers/services/AlertedProductsServices";
import { convocationProductsServices } from "../../../helpers/services/ConvocationProductsServices";
import { locationServices } from "../../../helpers/services/LocationServices";
import { parameterServices } from "../../../helpers/services/ParameterServices";

export const getAlertedProductsOptions = async (jornada) => {
  if (!jornada) return [];

  const params = new URLSearchParams({
    jornada: String(jornada),
    page: "1",
    size: "1000000",
  });

  const response = await alertedProductsServices.getProducts(`?${params.toString()}`);

  if (response?.status !== ResponseStatusEnum.OK) return [];

  const productos = response?.data?.productos ?? [];

  const seen = new Set();
  return productos
    .filter((p) => p.id_producto != null)
    .filter((p) => {
      if (seen.has(p.id_producto)) return false;
      seen.add(p.id_producto);
      return true;
    })
    .map((p) => ({
      value: p.id_producto,
      label: `${p.id_producto} - ${p.nombre_producto}`,
    }));
};

export const getAlertedProductsJourneys = async () => {
  const { data, status } = await convocationProductsServices.getConvocations();

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  return data?.data?.jornadas ?? [];
};

// Jornadas abiertas como opciones { value, label } (GET jornadas/abiertas/).
export const getAlertedProductsJourneyOptions = async () => {
  const journeys = await getAlertedProductsJourneys();

  return journeys
    .filter((item) => item?.id != null)
    .map((item) => ({ value: item.id, label: item.nombre ?? String(item.id) }));
};

// Planes activos de una jornada (GET jornadas/planes/?jornada_id=X&activo=true).
export const getAlertedProductsPlanOptions = async (jornadaId) => {
  if (jornadaId == null || jornadaId === "") {
    return [];
  }

  const { data, status } = await convocationProductsServices.getPlansByConvocation(jornadaId);

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  const planes = data?.data?.planes ?? [];

  return planes
    .filter((item) => item?.id != null)
    .map((item) => ({
      value: item.id,
      label: item.plan_nombre ?? item.nombre ?? String(item.id),
    }));
};

// Proveedores de una jornada (GET jornadas/proveedores-por-jornada/?jornada_id=X).
export const getAlertedProductsSuppliersByJourney = async (jornadaId) => {
  if (jornadaId == null || jornadaId === "") {
    return [];
  }

  const { data, status } = await convocationProductsServices.getSupplierByConvocation(jornadaId);

  if (status !== ResponseStatusEnum.OK) {
    return [];
  }

  const proveedores = data?.data?.proveedores ?? [];

  return proveedores
    .filter((item) => item?.id != null)
    .map((item) => ({ value: item.id, label: item.nombre ?? String(item.id) }));
};

export const getAlertedProductsParameterCatalog = async (parameterTypeId) => {
  const response = await parameterServices.getByTypeId(parameterTypeId);

  if (response?.status !== ResponseStatusEnum.OK) {
    return [];
  }

  return normalizeParameterOptions(response?.data ?? []);
};

export const getAlertedProductsDocumentFileNames = async () => {
  const response = await parameterServices.getByTypeId(38);

  if (response?.status !== ResponseStatusEnum.OK) {
    return { pdf: null, excel: null };
  }

  const options = normalizeParameterOptions(response?.data ?? []);
  return {
    pdf: options[0]?.label ?? null,
    excel: options[1]?.label ?? null,
  };
};

export const getAlertedProductsHistoryTabNames = async () => {
  const response = await parameterServices.getByTypeId(38);

  if (response?.status !== ResponseStatusEnum.OK) {
    return { pdf: "Historial PDF", excel: "Historial Excel" };
  }

  const options = normalizeParameterOptions(response?.data ?? []);
  return {
    pdf: options[0]?.label ?? "Historial PDF",
    excel: options[1]?.label ?? "Historial Excel",
  };
};

const normalizeSupplierOptions = (rows = []) =>
  rows
    .map((row) => {
      const supplierName = String(row?.nombre ?? row?.label ?? "").trim();
      const supplierNit = String(row?.nit ?? "").trim();
      const supplierId = row?.id ?? row?.value ?? null;

      if (!supplierId || !supplierName) {
        return null;
      }

      return {
        value: supplierId,
        label: supplierNit
          ? `${supplierName} — ${supplierNit}`
          : supplierName,
        supplierName,
        nit: supplierNit,
      };
    })
    .filter(Boolean);

export const getAlertedProductsSuppliers = async () => {
  const response = await approvedSupplierCatalogService.getApprovedSuppliers();

  if (response?.status !== ResponseStatusEnum.OK) {
    return [];
  }

  const rows =
    response?.data?.data?.proveedores ??
    response?.data?.proveedores ??
    response?.data?.results?.data?.proveedores ??
    [];

  return normalizeSupplierOptions(Array.isArray(rows) ? rows : []);
};

export const getAlertedProductsDepartments = async () => {
  const response = await locationServices.getDeptos();

  if (response?.status !== ResponseStatusEnum.OK) {
    return [];
  }

  return normalizeParameterOptions(response?.data ?? []);
};

export const getAlertedProductsMunicipalities = async (departmentId) => {
  if (!departmentId) {
    return [];
  }

  const response = await locationServices.getMunis(departmentId);

  if (response?.status !== ResponseStatusEnum.OK) {
    return [];
  }

  return normalizeParameterOptions(response?.data ?? []);
};
