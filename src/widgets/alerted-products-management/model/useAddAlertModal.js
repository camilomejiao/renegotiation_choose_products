import { useEffect, useState } from "react";

import { getAlertedProductsPage } from "../../../pages/alerted-products/api/alertedProductsTableApi";

export const useAddAlertModal = ({ isOpen, appliedFilters }) => {
  const [allRows, setAllRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAllRows([]);
      return;
    }
    if (!appliedFilters) return;

    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getAlertedProductsPage(appliedFilters);
        if (!cancelled) setAllRows(result.rows ?? []);
      } catch {
        if (!cancelled) setAllRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();
    return () => { cancelled = true; };
  }, [isOpen, appliedFilters]);

  return { allRows, loading };
};