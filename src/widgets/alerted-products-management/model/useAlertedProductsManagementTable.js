import { useEffect, useState } from "react";

import { getAlertedProductsPage } from "../../../pages/alerted-products/api/alertedProductsTableApi";
import { managementTypeAssignmentOptions } from "../../alerted-products-table/model/managementTypeOptions";

export const useAlertedProductsManagementTable = ({
  appliedFilters,
  managementType,
}) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const managementTypeOption = managementTypeAssignmentOptions.find(
    (opt) => opt.label === managementType
  );

  useEffect(() => {
    if (!appliedFilters || !managementTypeOption) {
      setDataSource([]);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getAlertedProductsPage({
          ...appliedFilters,
          managementType: {
            value: managementTypeOption.value,
            label: managementTypeOption.label,
          },
        });
        if (!cancelled) setDataSource(result.rows ?? []);
      } catch {
        if (!cancelled) setDataSource([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [appliedFilters, managementType]);

  return { dataSource, loading };
};