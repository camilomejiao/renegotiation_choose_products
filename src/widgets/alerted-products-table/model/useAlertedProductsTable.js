import { useEffect, useMemo, useState } from "react";

import { alertedProductsTableData } from "./alertedProductsTableData";
import { getAlertedProductsTableColumns } from "./getAlertedProductsTableColumns";
import {
  getManagementTypeAssignmentLabel,
  managementTypeAssignmentOptions,
} from "./managementTypeOptions";

export const useAlertedProductsTable = ({
  onAssignManagementType,
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
    managementTypeOptions.find((o) => o.value === value)?.label ||
    getManagementTypeAssignmentLabel(value);

  const handleConfirmManagementTypeAssignment = async () => {
    await onAssignManagementType?.({
      managementTypeId: selectedManagementType,
      managementType: getManagementTypeLabel(selectedManagementType),
      selectedRowKeys,
      selectedRows,
    });
    setIsAssignmentModalOpen(false);
  };

  const handleAssignAndRaiseAlert = async () => {
    await onAssignManagementType?.({
      managementTypeId: selectedManagementType,
      managementType: getManagementTypeLabel(selectedManagementType),
      selectedRowKeys,
      selectedRows,
    });
    setIsAssignmentModalOpen(false);
    onRaiseAlert?.({
      selectedRowKeys,
      selectedRows,
      managementType: getManagementTypeAssignmentLabel(selectedManagementType),
    });
  };

  const canRaiseAlert =
    selectedRowKeys.length > 0 &&
    initialDataSource
      .filter((row) => selectedRowKeys.includes(row.id))
      .every((row) => row.hasAssignedManagementType);

  const handleRaiseAlert = () => {
    if (!canRaiseAlert) {
      return;
    }

    onRaiseAlert?.({
      selectedRowKeys,
      selectedRows,
      managementType: getManagementTypeAssignmentLabel(selectedManagementType),
    });
  };

  return {
    columns,
    canRaiseAlert,
    handleAssignAndRaiseAlert,
    handleConfirmManagementTypeAssignment,
    handleRaiseAlert,
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
