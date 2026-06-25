import { useEffect, useMemo, useState } from "react";

import { alertedProductsTableData } from "./alertedProductsTableData";
import { getAlertedProductsTableColumns } from "./getAlertedProductsTableColumns";
import {
  getManagementTypeAssignmentLabel,
  managementTypeAssignmentOptions,
} from "./managementTypeOptions";

export const useAlertedProductsTable = ({
  onRaiseAlert,
  initialDataSource = alertedProductsTableData,
  managementTypeOptions = managementTypeAssignmentOptions,
  alertCategoryOptions = [],
  alertManagementOptions = [],
} = {}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedManagementType, setSelectedManagementType] = useState(null);

  const columns = useMemo(
    () => getAlertedProductsTableColumns(managementTypeOptions, alertCategoryOptions, alertManagementOptions),
    [managementTypeOptions, alertCategoryOptions, alertManagementOptions]
  );

  useEffect(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, [initialDataSource]);

  const isSelectableRow = (row) => {
    const mgmt = (row?.alertManagement ?? "").trim().toLowerCase();
    return mgmt === "sin gestión" || mgmt === "sin gestion";
  };

  const handleRowSelectionChange = (keys, rows) => {
    const eligibleRows = rows.filter(isSelectableRow);
    setSelectedRowKeys(eligibleRows.map((row) => row.id));
    setSelectedRows(eligibleRows);
  };

  const getManagementTypeLabel = (value) =>
    managementTypeOptions.find((option) => option.value === value)?.label ||
    getManagementTypeAssignmentLabel(value);

  const buildAssignmentPayload = () => ({
    selectedRowKeys,
    selectedRows: selectedRows.map((row) => ({
      ...row,
      managementType: getManagementTypeLabel(selectedManagementType),
      managementTypeCode: selectedManagementType,
      hasAssignedManagementType: true,
    })),
    managementType: getManagementTypeLabel(selectedManagementType),
  });

  const handleAssignAndRaiseAlert = () => {
    setIsAssignmentModalOpen(false);
    onRaiseAlert?.(buildAssignmentPayload());
  };

  return {
    columns,
    handleAssignAndRaiseAlert,
    isSelectableRow,
    isAssignmentModalOpen,
    selectedManagementType,
    selectedRowKeys,
    selectedRows,
    setSelectedManagementType,
    handleRowSelectionChange,
    openAssignmentModal: () => setIsAssignmentModalOpen(true),
    closeAssignmentModal: () => setIsAssignmentModalOpen(false),
  };
};
