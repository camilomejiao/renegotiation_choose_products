import { useCallback, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { ResponseStatusEnum } from "../../../helpers/GlobalEnum";
import { handleError, showAlert } from "../../../helpers/utils/utils";
import {
  getProductPriceQuotePlans,
  getProductPriceQuotes,
  saveProductPriceQuotes,
} from "../api/productPriceQuotesApi";
import { filterProductPriceQuotes } from "../lib/filterProductPriceQuotes";
import {
  isProductPriceQuoteLocked,
  normalizeProductPriceQuoteRows,
} from "../lib/normalizeProductPriceQuoteRows";

const toPlanOptions = (plans) => {
  return plans.map((plan) => ({
    value: plan.id,
    label: plan.plan_nombre,
  }));
};

const upsertEditedRow = (editedRows, nextRow) => {
  const currentIndex = editedRows.findIndex((row) => row.id === nextRow.id);

  if (currentIndex === -1) {
    return [...editedRows, nextRow];
  }

  const nextEditedRows = [...editedRows];
  nextEditedRows[currentIndex] = nextRow;
  return nextEditedRows;
};

export const useProductPriceQuotesPage = () => {
  const { userAuth } = useOutletContext();

  const [rows, setRows] = useState([]);
  const [editedProducts, setEditedProducts] = useState([]);
  const [planOptions, setPlanOptions] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [onlyMine, setOnlyMine] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [loadingTable, setLoadingTable] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPlans = useCallback(async () => {
    try {
      setLoadingPlans(true);
      const plans = await getProductPriceQuotePlans();
      setPlanOptions(toPlanOptions(plans));
    } catch (error) {
      console.error("Error al obtener los planes:", error);
      setPlanOptions([]);
    } finally {
      setLoadingPlans(false);
    }
  }, []);

  const loadProductList = useCallback(
    async (planId, onlyMineValue) => {
      if (!planId || !userAuth?.id) {
        setRows([]);
        setEditedProducts([]);
        return;
      }

      try {
        setLoadingTable(true);
        const payload = await getProductPriceQuotes({
          supplierId: userAuth.id,
          jornadaPlanId: planId,
          onlyMine: onlyMineValue,
        });

        const normalizedRows = normalizeProductPriceQuoteRows(payload);
        setRows(normalizedRows);
        setEditedProducts([]);
      } catch (error) {
        console.error("Error al obtener la lista de productos:", error);
        setRows([]);
        setEditedProducts([]);
      } finally {
        setLoadingTable(false);
      }
    },
    [userAuth?.id]
  );

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const handleSelectedPlan = useCallback(
    async (option) => {
      setSelectedPlan(option);
      setSearchQuery("");

      if (!option?.value) {
        setRows([]);
        setEditedProducts([]);
        return;
      }

      await loadProductList(option.value, onlyMine);
    },
    [loadProductList, onlyMine]
  );

  const handleToggleOnlyMine = useCallback(
    async (checked) => {
      setOnlyMine(checked);

      if (selectedPlan?.value) {
        await loadProductList(selectedPlan.value, checked);
      }
    },
    [loadProductList, selectedPlan]
  );

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleRowChange = useCallback((rowId, patch) => {
    setRows((previousRows) => {
      let updatedRow = null;

      const nextRows = previousRows.map((row) => {
        if (row.id !== rowId) {
          return row;
        }

        if (isProductPriceQuoteLocked(row)) {
          updatedRow = row;
          return row;
        }

        updatedRow = { ...row, ...patch };
        return updatedRow;
      });

      if (updatedRow && !isProductPriceQuoteLocked(updatedRow)) {
        setEditedProducts((previousEditedRows) => upsertEditedRow(previousEditedRows, updatedRow));
      }

      return nextRows;
    });
  }, []);

  const refresh = useCallback(async () => {
    if (!selectedPlan?.value) {
      return;
    }

    await loadProductList(selectedPlan.value, onlyMine);
  }, [loadProductList, onlyMine, selectedPlan]);

  const handleSave = useCallback(async () => {
    try {
      setSaving(true);

      const hasEmptyFields = editedProducts.some((row) => {
        return !row.description || !row.brand || !row.price;
      });

      if (hasEmptyFields) {
        handleError(
          "Revisa campos",
          "La descripción, marca y precio son obligatorios, por favor revisa algún producto modificado."
        );
        return;
      }

      const payload = {
        proveedor_id: userAuth.id,
        productos: editedProducts.map((product) => ({
          jornada_producto_id: product.id,
          descripcion: product.description,
          marca: product.brand,
          price: Number(product.price),
        })),
      };

      const { status } = await saveProductPriceQuotes(payload);

      if (
        status === ResponseStatusEnum.BAD_REQUEST ||
        status === ResponseStatusEnum.INTERNAL_SERVER_ERROR
      ) {
        handleError("Error", "Error en el formato de productos");
        return;
      }

      if (status === ResponseStatusEnum.CREATED) {
        showAlert("Bien hecho!", "Productos actualizados con éxito.");
        await refresh();
      }
    } catch (error) {
      handleError("Error", "Error al guardar los productos.");
    } finally {
      setSaving(false);
    }
  }, [editedProducts, refresh, userAuth?.id]);

  const filteredRows = useMemo(() => {
    return filterProductPriceQuotes(rows, searchQuery);
  }, [rows, searchQuery]);

  return {
    rows: filteredRows,
    planOptions,
    selectedPlan,
    onlyMine,
    searchQuery,
    loadingPlans,
    loadingTable,
    saving,
    hasSelectedPlan: Boolean(selectedPlan?.value),
    canSave: Boolean(selectedPlan?.value) && !saving && !loadingPlans && !loadingTable,
    handleSelectedPlan,
    handleToggleOnlyMine,
    handleSearchChange,
    handleRowChange,
    handleSave,
    refresh,
  };
};
