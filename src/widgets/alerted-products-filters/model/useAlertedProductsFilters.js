import { useCallback, useEffect, useState } from "react";

import {
  getAlertedProductsDepartments,
  getAlertedProductsJourneys,
  getAlertedProductsMunicipalities,
  getAlertedProductsParameterCatalog,
  getAlertedProductsSuppliers,
} from "../../../pages/alerted-products/api/alertedProductsFiltersApi";
import { defaultAlertedProductsFilters } from "./filterOptions";

const ALERT_CATEGORY_PARAMETER_TYPE_ID = 35;
const ALERT_MANAGEMENT_PARAMETER_TYPE_ID = 36;
const MANAGEMENT_TYPE_PARAMETER_TYPE_ID = 39;

export const useAlertedProductsFilters = () => {
  const [journeyOptions, setJourneyOptions] = useState([]);
  const [alertCategoryOptions, setAlertCategoryOptions] = useState([]);
  const [alertManagementOptions, setAlertManagementOptions] = useState([]);
  const [managementTypeOptions, setManagementTypeOptions] = useState([]);
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [municipalityOptions, setMunicipalityOptions] = useState([]);
  const [loadingJourneys, setLoadingJourneys] = useState(false);
  const [loadingAlertCategoryOptions, setLoadingAlertCategoryOptions] = useState(false);
  const [loadingAlertManagementOptions, setLoadingAlertManagementOptions] = useState(false);
  const [loadingManagementTypeOptions, setLoadingManagementTypeOptions] = useState(false);
  const [loadingSupplierOptions, setLoadingSupplierOptions] = useState(false);
  const [loadingDepartmentOptions, setLoadingDepartmentOptions] = useState(false);
  const [loadingMunicipalityOptions, setLoadingMunicipalityOptions] = useState(false);
  const [filters, setFilters] = useState(defaultAlertedProductsFilters);

  const updateFilter = (key) => (nextValue) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: nextValue,
    }));
  };

  const loadJourneys = useCallback(async () => {
    try {
      setLoadingJourneys(true);
      const rows = await getAlertedProductsJourneys();
      const nextOptions = rows.map((item) => ({
        value: item.id,
        label: item.nombre,
      }));

      setJourneyOptions(nextOptions);
    } catch (error) {
      console.error("Error cargando jornadas para productos alertados:", error);
      setJourneyOptions([]);
    } finally {
      setLoadingJourneys(false);
    }
  }, []);

  useEffect(() => {
    loadJourneys();
  }, [loadJourneys]);

  const loadAlertCategoryOptions = useCallback(async () => {
    try {
      setLoadingAlertCategoryOptions(true);
      const nextOptions = await getAlertedProductsParameterCatalog(
        ALERT_CATEGORY_PARAMETER_TYPE_ID
      );

      setAlertCategoryOptions(nextOptions);
    } catch (error) {
      console.error("Error cargando categorías de alerta:", error);
      setAlertCategoryOptions([]);
    } finally {
      setLoadingAlertCategoryOptions(false);
    }
  }, []);

  const loadAlertManagementOptions = useCallback(async () => {
    try {
      setLoadingAlertManagementOptions(true);
      const nextOptions = await getAlertedProductsParameterCatalog(
        ALERT_MANAGEMENT_PARAMETER_TYPE_ID
      );

      setAlertManagementOptions(nextOptions);
    } catch (error) {
      console.error("Error cargando gestiones de alerta:", error);
      setAlertManagementOptions([]);
    } finally {
      setLoadingAlertManagementOptions(false);
    }
  }, []);

  const loadManagementTypeOptions = useCallback(async () => {
    try {
      setLoadingManagementTypeOptions(true);
      const nextOptions = await getAlertedProductsParameterCatalog(
        MANAGEMENT_TYPE_PARAMETER_TYPE_ID
      );

      setManagementTypeOptions(nextOptions);
    } catch (error) {
      console.error("Error cargando tipos de gestión:", error);
      setManagementTypeOptions([]);
    } finally {
      setLoadingManagementTypeOptions(false);
    }
  }, []);

  useEffect(() => {
    loadAlertCategoryOptions();
    loadAlertManagementOptions();
    loadManagementTypeOptions();
  }, [
    loadAlertCategoryOptions,
    loadAlertManagementOptions,
    loadManagementTypeOptions,
  ]);

  const loadSupplierOptions = useCallback(async () => {
    try {
      setLoadingSupplierOptions(true);
      const nextOptions = await getAlertedProductsSuppliers();

      setSupplierOptions(nextOptions);
    } catch (error) {
      console.error("Error cargando proveedores:", error);
      setSupplierOptions([]);
    } finally {
      setLoadingSupplierOptions(false);
    }
  }, []);

  useEffect(() => {
    loadSupplierOptions();
  }, [loadSupplierOptions]);

  const loadDepartmentOptions = useCallback(async () => {
    try {
      setLoadingDepartmentOptions(true);
      const nextOptions = await getAlertedProductsDepartments();

      setDepartmentOptions(nextOptions);
    } catch (error) {
      console.error("Error cargando departamentos:", error);
      setDepartmentOptions([]);
    } finally {
      setLoadingDepartmentOptions(false);
    }
  }, []);

  useEffect(() => {
    loadDepartmentOptions();
  }, [loadDepartmentOptions]);

  const loadMunicipalityOptions = useCallback(async (departmentId) => {
    if (!departmentId) {
      setMunicipalityOptions([]);
      setFilters((currentFilters) => ({
        ...currentFilters,
        municipality: null,
      }));
      return;
    }

    try {
      setLoadingMunicipalityOptions(true);
      const nextOptions = await getAlertedProductsMunicipalities(departmentId);

      setMunicipalityOptions(nextOptions);
    } catch (error) {
      console.error("Error cargando municipios:", error);
      setMunicipalityOptions([]);
    } finally {
      setLoadingMunicipalityOptions(false);
    }
  }, []);

  useEffect(() => {
    loadMunicipalityOptions(filters.department?.value);
  }, [filters.department?.value, loadMunicipalityOptions]);

  const resetFilters = () => {
    setFilters({
      ...defaultAlertedProductsFilters,
      supplier: null,
      products: [],
    });
  };

  return {
    alertCategoryOptions,
    alertManagementOptions,
    departmentOptions,
    filters,
    journeyOptions,
    loadingManagementTypeOptions,
    loadingSupplierOptions,
    loadingDepartmentOptions,
    loadingMunicipalityOptions,
    loadingAlertCategoryOptions,
    loadingAlertManagementOptions,
    loadingJourneys,
    managementTypeOptions,
    municipalityOptions,
    supplierOptions,
    resetFilters,
    updateAlertCategory: updateFilter("alertCategory"),
    updateAlertManagement: updateFilter("alertManagement"),
    updateDepartment: (nextValue) => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        department: nextValue,
        municipality: null,
      }));
    },
    updateManagementType: updateFilter("managementType"),
    updateMunicipality: updateFilter("municipality"),
    updateOperationalDay: updateFilter("operationalDay"),
    updateProducts: updateFilter("products"),
    updateSupplier: updateFilter("supplier"),
  };
};
