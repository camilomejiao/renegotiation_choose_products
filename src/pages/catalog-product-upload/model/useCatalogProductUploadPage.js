import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { handleError, showAlert } from "../../../helpers/utils/utils";
import {
  getEnvironmentalCategoryKeys,
  getPlansByConvocation,
  getProductsByPlan,
  loadProductUploadDependencies,
  saveProductsByConvocation,
} from "../api/catalogProductUploadApi";
import { buildProductUploadPayload } from "./buildProductUploadPayload";
import { parseProductUploadClipboard } from "./parseProductUploadClipboard";

const filterRows = (rows, query) => {
  const normalizedQuery = String(query || "").trim().toLowerCase();

  if (!normalizedQuery) {
    return rows;
  }

  return rows.filter((row) =>
    Object.values(row).some((value) => String(value ?? "").toLowerCase().includes(normalizedQuery))
  );
};

export const useCatalogProductUploadPage = () => {
  const navigate = useNavigate();

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [saving, setSaving] = useState(false);

  const [convocations, setConvocations] = useState([]);
  const [plans, setPlans] = useState([]);
  const [unitOptions, setUnitOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);

  const [selectedConvocation, setSelectedConvocation] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const loadInitialData = useCallback(async () => {
    try {
      setLoadingInitial(true);
      const { units, categories, convocations: convocationsRows } = await loadProductUploadDependencies();

      setUnitOptions(units);
      setCategoryOptions(categories);
      setConvocations(convocationsRows);
    } catch (error) {
      handleError(error, "Error cargando los datos iniciales.");
    } finally {
      setLoadingInitial(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const convocationOptions = useMemo(
    () => convocations.map((item) => ({ value: item.id, label: item.nombre })),
    [convocations]
  );

  const planOptions = useMemo(
    () => plans.map((item) => ({ value: item.id, label: item.plan_nombre })),
    [plans]
  );

  const filteredRows = useMemo(() => filterRows(rows, searchQuery), [rows, searchQuery]);

  const handleSelectedConvocation = useCallback(async (option) => {
    setSelectedConvocation(option ?? null);
    setSelectedPlan(null);
    setPlans([]);
    setRows([]);
    setSelectedRows([]);

    if (!option?.value) {
      return;
    }

    try {
      setLoadingPlans(true);
      const plansRows = await getPlansByConvocation(option.value);
      setPlans(plansRows);
    } catch (error) {
      handleError(error, "Error cargando planes de la jornada.");
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  const handleSelectedPlan = useCallback((option) => {
    setSelectedPlan(option ?? null);
    setSelectedRows([]);
  }, []);

  const loadProductsByPlan = useCallback(async (planId) => {
    if (!planId) {
      setRows([]);
      return;
    }

    try {
      setLoadingTable(true);
      const { products } = await getProductsByPlan({ planId, page: 1, pageSize: 100 });
      const normalizedRows = products.map((product, index) => ({
        rowKey: String(product?.id ?? `${Date.now()}-${index + 1}`),
        id: product?.id ?? `${index + 1}`,
        category: product?.categoria_producto?.id ?? product?.categoria_producto ?? null,
        categoryLabel:
          product?.categoria_producto?.nombre ?? String(product?.categoria_producto ?? ""),
        name: product?.nombre ?? "",
        unit: product?.unidad_medida?.id ?? product?.unidad_medida ?? null,
        unitLabel: product?.unidad_medida?.nombre ?? String(product?.unidad_medida ?? ""),
        price_min: Number(product?.precio_min ?? 0),
        price_max: Number(product?.precio_max ?? 0),
      }));
      setRows(normalizedRows);
      setSelectedRows([]);
    } catch (error) {
      handleError(error, "Error cargando productos del plan.");
      setRows([]);
      setSelectedRows([]);
    } finally {
      setLoadingTable(false);
    }
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleResetTable = useCallback(() => {
    setRows([]);
    setSelectedRows([]);
    setSearchQuery("");
  }, []);

  const handleRowSelectionChange = useCallback((_keys, records) => {
    setSelectedRows(records || []);
  }, []);

  const handleBack = useCallback(() => {
    navigate("/admin/list-products-by-convocation");
  }, [navigate]);

  const handleSaveProducts = useCallback(async () => {
    if (!selectedPlan?.value) {
      handleError("Error", "Selecciona un plan para guardar los productos.");
      return;
    }

    if (!rows.length) {
      handleError("Error", "No hay productos para guardar.");
      return;
    }

    if (!selectedRows.length) {
      AlertComponent.warning("Validacion", "Selecciona al menos un producto.");
      return;
    }

    try {
      setSaving(true);

      const environmentalKeys = await getEnvironmentalCategoryKeys();
      const productos = buildProductUploadPayload({ rows: selectedRows, environmentalKeys });

      const response = await saveProductsByConvocation({
        jornada_plan: Number(selectedPlan.value),
        productos,
      });

      const { data, status } = response;

      if (status === ResponseStatusEnum.BAD_REQUEST) {
        const perItemErrors = data?.data?.errores?.productos ?? [];
        const messages = perItemErrors
          .map((itemErrors, index) => {
            if (!itemErrors || Object.keys(itemErrors).length === 0) {
              return null;
            }

            const errorLines = Object.entries(itemErrors).flatMap(([field, value]) => {
              const values = Array.isArray(value) ? value : [value];
              return values.map((message) =>
                field === "non_field_errors" ? `${message}` : `${field}: ${message}`
              );
            });

            return `Producto #${index + 1}: ${errorLines.join(" | ")}`;
          })
          .filter(Boolean);

        if (messages.length) {
          AlertComponent.warning("Errores de validacion", messages.join("\n"));
        } else {
          AlertComponent.warning(
            "Errores de validacion",
            data?.message ?? "Revisa los datos enviados."
          );
        }

        return;
      }

      if (status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
        handleError("Error", data?.data?.errores ?? "Error interno del servidor");
        return;
      }

      if (status === ResponseStatusEnum.CREATED) {
        showAlert("", "Todos los productos se han creado exitosamente");
        setRows([]);
        setSelectedRows([]);
        setSearchQuery("");
      }
    } catch (error) {
      handleError("Error", error?.message || "Error al guardar productos");
    } finally {
      setSaving(false);
    }
  }, [rows, selectedPlan?.value, selectedRows]);

  const handleClipboard = useCallback(
    (event) => {
      const clipboardText = event?.clipboardData?.getData("text") || "";

      if (!clipboardText.trim()) {
        return;
      }

      const { rows: parsedRows, hasValidSeparator } = parseProductUploadClipboard({
        clipboardText,
        unitOptions,
        categoryOptions,
      });

      if (!hasValidSeparator) {
        handleError(
          "Error",
          "No se detecto un separador valido en los datos pegados. Usa tabulacion o coma."
        );
        return;
      }

      setRows(parsedRows);
      setSelectedRows([]);
    },
    [categoryOptions, unitOptions]
  );

  useEffect(() => {
    document.addEventListener("paste", handleClipboard);
    return () => {
      document.removeEventListener("paste", handleClipboard);
    };
  }, [handleClipboard]);

  useEffect(() => {
    loadProductsByPlan(selectedPlan?.value);
  }, [loadProductsByPlan, selectedPlan?.value]);

  return {
    loadingInitial,
    loadingPlans,
    loadingTable,
    saving,
    convocationOptions,
    planOptions,
    selectedConvocation,
    selectedPlan,
    unitOptions,
    categoryOptions,
    rows: filteredRows,
    selectedRows,
    searchQuery,
    handleSelectedConvocation,
    handleSelectedPlan,
    handleRowSelectionChange,
    handleSearchChange,
    handleResetTable,
    handleBack,
    handleSaveProducts,
  };
};
