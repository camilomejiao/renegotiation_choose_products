import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCatalogConvocations,
  getCatalogPlansByConvocation,
  getCatalogReportProducts,
  getCatalogSuppliersByConvocation,
} from "../api/catalogReportApi";
import { normalizeCatalogReportRows } from "./normalizeCatalogReportRows";

const toSearchable = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return Object.values(value)
      .map((item) => toSearchable(item))
      .join(" ");
  }

  return String(value);
};

export const useCatalogReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [convocations, setConvocations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [selectedConvocation, setSelectedConvocation] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const [productList, setProductList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const convocationOptions = useMemo(
    () => convocations.map((item) => ({ value: item.id, label: item.nombre })),
    [convocations]
  );

  const planOptions = useMemo(
    () => plans.map((item) => ({ value: item.id, label: item.plan_nombre })),
    [plans]
  );

  const supplierOptions = useMemo(
    () => suppliers.map((item) => ({ value: item.id, label: item.nombre })),
    [suppliers]
  );

  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) {
      return productList;
    }

    const query = searchQuery.toLowerCase().trim();

    return productList.filter((row) =>
      Object.values(row).some((value) => toSearchable(value).toLowerCase().includes(query))
    );
  }, [productList, searchQuery]);

  const loadConvocations = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await getCatalogConvocations();
      setConvocations(rows);
    } catch (error) {
      console.error("Error al obtener convocatorias:", error);
      setConvocations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadConvocationDependencies = useCallback(async (convocationId) => {
    try {
      setLoading(true);
      const [plansResponse, suppliersResponse] = await Promise.all([
        getCatalogPlansByConvocation(convocationId),
        getCatalogSuppliersByConvocation(convocationId),
      ]);

      setPlans(plansResponse);
      setSuppliers(suppliersResponse);
    } catch (error) {
      console.error("Error al cargar planes/proveedores:", error);
      setPlans([]);
      setSuppliers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadReport = useCallback(async () => {
    if (!selectedPlan?.value) {
      setProductList([]);
      return;
    }

    try {
      setLoadingTable(true);
      const rows = await getCatalogReportProducts({
        planId: selectedPlan.value,
        supplierId: selectedSupplier?.value || "",
      });
      setProductList(normalizeCatalogReportRows(rows));
    } catch (error) {
      console.error("Error al cargar reporte:", error);
      setProductList([]);
    } finally {
      setLoadingTable(false);
    }
  }, [selectedPlan, selectedSupplier]);

  const handleConvocationChange = useCallback(
    async (option) => {
      setSelectedConvocation(option);
      setSelectedPlan(null);
      setSelectedSupplier(null);
      setProductList([]);

      if (!option?.value) {
        setPlans([]);
        setSuppliers([]);
        return;
      }

      await loadConvocationDependencies(option.value);
    },
    [loadConvocationDependencies]
  );

  const handlePlanChange = useCallback((option) => {
    setSelectedPlan(option);
    setProductList([]);
  }, []);

  const handleSupplierChange = useCallback((option) => {
    setSelectedSupplier(option);
  }, []);

  const handleSearchQueryChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  useEffect(() => {
    loadConvocations();
  }, [loadConvocations]);

  return {
    loading,
    loadingTable,
    selectedConvocation,
    selectedPlan,
    selectedSupplier,
    convocationOptions,
    planOptions,
    supplierOptions,
    searchQuery,
    filteredRows,
    loadReport,
    handleConvocationChange,
    handlePlanChange,
    handleSupplierChange,
    handleSearchQueryChange,
  };
};
