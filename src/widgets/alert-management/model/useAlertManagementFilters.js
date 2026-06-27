import { useCallback, useEffect, useMemo, useState } from "react";
import AlertComponent from "../../../helpers/alert/AlertComponent";
import { getAlertedProductsJourneys, getAlertedProductsParameterCatalog } from "../../../pages/alerted-products/api/alertedProductsFiltersApi";
import { getAlertedProductsSolicitudes } from "../../../pages/alerted-products/api/alertedProductsSolicitudesApi";
import {
  ALERT_CATEGORY_PARAMETER_TYPE_ID, ALERT_MANAGEMENT_PARAMETER_TYPE_ID,
  buildManagementPillMap, buildPillMap, defaultFilters,
} from "./alertManagementConstants";

export const useAlertManagementFilters = () => {
  const [journeyOptions, setJourneyOptions] = useState([]);
  const [alertCategoryOptions, setAlertCategoryOptions] = useState([]);
  const [alertManagementOptions, setAlertManagementOptions] = useState([]);
  const [loadingJourneys, setLoadingJourneys] = useState(false);
  const [loadingAlertCategory, setLoadingAlertCategory] = useState(false);
  const [loadingAlertManagement, setLoadingAlertManagement] = useState(false);
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const loadJourneys = useCallback(async () => {
    setLoadingJourneys(true);
    try {
      const rows = await getAlertedProductsJourneys();
      setJourneyOptions(rows.map((item) => ({ value: item.id, label: item.nombre })));
    } catch { setJourneyOptions([]); } finally { setLoadingJourneys(false); }
  }, []);

  const loadAlertCategories = useCallback(async () => {
    setLoadingAlertCategory(true);
    try {
      const opts = await getAlertedProductsParameterCatalog(ALERT_CATEGORY_PARAMETER_TYPE_ID);
      setAlertCategoryOptions(opts);
    } catch { setAlertCategoryOptions([]); } finally { setLoadingAlertCategory(false); }
  }, []);

  const loadAlertManagements = useCallback(async () => {
    setLoadingAlertManagement(true);
    try {
      const opts = await getAlertedProductsParameterCatalog(ALERT_MANAGEMENT_PARAMETER_TYPE_ID);
      setAlertManagementOptions(opts);
    } catch { setAlertManagementOptions([]); } finally { setLoadingAlertManagement(false); }
  }, []);

  useEffect(() => {
    loadJourneys();
    loadAlertCategories();
    loadAlertManagements();
  }, [loadJourneys, loadAlertCategories, loadAlertManagements]);

  useEffect(() => {
    if (!appliedFilters) return;
    const fetch = async () => {
      setTableLoading(true);
      try {
        const rows = await getAlertedProductsSolicitudes(appliedFilters);
        setDataSource(rows);
      } catch {
        setDataSource([]);
        AlertComponent.error("Error", "No fue posible cargar las gestiones de alertas.");
      } finally { setTableLoading(false); }
    };
    fetch();
  }, [appliedFilters]);

  const alertCategoryPillMap   = useMemo(() => buildPillMap(alertCategoryOptions), [alertCategoryOptions]);
  const alertManagementPillMap = useMemo(() => buildManagementPillMap(alertManagementOptions), [alertManagementOptions]);

  const updateDraft  = (key) => (val) => setDraftFilters((prev) => ({ ...prev, [key]: val }));
  const handleSearch = () => setAppliedFilters({ ...draftFilters });
  const handleClear  = () => { setDraftFilters(defaultFilters); setAppliedFilters(null); setDataSource([]); };

  return {
    journeyOptions, alertCategoryOptions, alertManagementOptions,
    loadingJourneys, loadingAlertCategory, loadingAlertManagement,
    draftFilters, appliedFilters, dataSource, tableLoading,
    alertCategoryPillMap, alertManagementPillMap,
    updateDraft, handleSearch, handleClear,
  };
};