import { useCallback, useEffect, useRef, useState } from "react";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import {
  getAlertedProductsJourneyDocuments,
  getAlertedProductsPage,
  getAlertedProductsParameterCatalog,
} from "../../../entities/alerted-product";

const EMPTY_HISTORY = { pdf: [], excel: [] };
const PARAM_MANAGEMENT_TYPE = 39;
const PARAM_ALERT_CATEGORY = 35;
const PARAM_ALERT_MANAGEMENT = 36;
const SEARCH_DEBOUNCE_MS = 400;

// Encapsula la carga de catálogos, filtros, documentos de jornada y la tabla
// paginada de productos alertados.
export const useAlertedProductsData = () => {
  const [managementTypeOptions, setManagementTypeOptions] = useState([]);
  const [alertCategoryOptions, setAlertCategoryOptions] = useState([]);
  const [alertManagementOptions, setAlertManagementOptions] = useState([]);

  const [appliedFilters, setAppliedFilters] = useState(null);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [historyByCategory, setHistoryByCategory] = useState(EMPTY_HISTORY);

  const [tableDataSource, setTableDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchDebounceRef = useRef(null);

  useEffect(() => {
    getAlertedProductsParameterCatalog(PARAM_MANAGEMENT_TYPE)
      .then((options) =>
        setManagementTypeOptions(
          options.filter((o) => o.label?.trim().toLowerCase() !== "sin tipo de gestión")
        )
      )
      .catch(() => setManagementTypeOptions([]));
    getAlertedProductsParameterCatalog(PARAM_ALERT_CATEGORY)
      .then(setAlertCategoryOptions)
      .catch(() => setAlertCategoryOptions([]));
    getAlertedProductsParameterCatalog(PARAM_ALERT_MANAGEMENT)
      .then(setAlertManagementOptions)
      .catch(() => setAlertManagementOptions([]));
  }, []);

  useEffect(() => {
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchValue]);

  useEffect(() => {
    if (!appliedFilters) return undefined;

    let cancelled = false;
    const fetchTable = async () => {
      setTableLoading(true);
      try {
        const result = await getAlertedProductsPage({
          ...appliedFilters,
          search: debouncedSearch,
          page: currentPage,
          pageSize,
        });
        if (cancelled) return;
        setTableDataSource(result.rows);
        setTotalRecords(result.meta?.total_registros ?? 0);
      } catch {
        if (cancelled) return;
        setTableDataSource([]);
        AlertComponent.error("Error", "No fue posible cargar los productos alertados");
      } finally {
        if (!cancelled) setTableLoading(false);
      }
    };

    fetchTable();
    return () => {
      cancelled = true;
    };
  }, [appliedFilters, currentPage, pageSize, refreshKey, debouncedSearch]);

  const loadJourneyDocuments = useCallback(async (journeyId) => {
    const documentsResult = await getAlertedProductsJourneyDocuments(journeyId);
    setHistoryByCategory(documentsResult.historyByCategory);
  }, []);

  const applyFilters = useCallback(
    async (nextFilters) => {
      if (!nextFilters?.operationalDay?.value) return;
      setAppliedFilters(nextFilters);
      setCurrentPage(1);
      try {
        await loadJourneyDocuments(nextFilters.operationalDay.value);
      } catch {
        setHistoryByCategory(EMPTY_HISTORY);
        AlertComponent.error("Error", "No fue posible cargar el historial de documentos");
      }
    },
    [loadJourneyDocuments]
  );

  const changeJourney = useCallback(
    async (journey) => {
      setSelectedJourney(journey);
      if (!journey?.value) {
        setHistoryByCategory(EMPTY_HISTORY);
        return;
      }
      try {
        await loadJourneyDocuments(journey.value);
      } catch {
        setHistoryByCategory(EMPTY_HISTORY);
      }
    },
    [loadJourneyDocuments]
  );

  const resetFilters = useCallback(() => {
    setAppliedFilters(null);
    setTableDataSource([]);
    setTotalRecords(0);
    setCurrentPage(1);
    setHistoryByCategory(EMPTY_HISTORY);
    setSearchValue("");
    setDebouncedSearch("");
  }, []);

  const changePage = useCallback((page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  }, []);

  const triggerRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return {
    managementTypeOptions,
    alertCategoryOptions,
    alertManagementOptions,
    appliedFilters,
    selectedJourney,
    historyByCategory,
    tableDataSource,
    tableLoading,
    totalRecords,
    currentPage,
    pageSize,
    searchValue,
    setSearchValue,
    applyFilters,
    changeJourney,
    resetFilters,
    changePage,
    reloadJourneyDocuments: loadJourneyDocuments,
    triggerRefresh,
  };
};