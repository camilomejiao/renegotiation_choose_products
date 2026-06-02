import { useEffect, useMemo, useState } from "react";

import { alertedProductsTableData } from "./alertedProductsTableData";
import { getAlertedProductsTableColumns } from "./getAlertedProductsTableColumns";
import {
  getManagementTypeAssignmentLabel,
  managementTypeAssignmentOptions,
} from "./managementTypeOptions";

const ELIGIBLE_ALERT_CATEGORY = "SIN ALERTA";
const ELIGIBLE_ALERT_MANAGEMENT = "SIN GESTIÓN";

export const useAlertedProductsTable = ({
  onAssignManagementType,
  onRaiseAlert,
  initialDataSource = alertedProductsTableData,
} = {}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedManagementType, setSelectedManagementType] = useState(
    managementTypeAssignmentOptions[0]?.value || ""
  );

  const columns = useMemo(() => getAlertedProductsTableColumns(), []);

  useEffect(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, [initialDataSource]);

  const isSelectableRow = (row) =>
    row?.alertCategory !== ELIGIBLE_ALERT_CATEGORY &&
    row?.alertManagement === ELIGIBLE_ALERT_MANAGEMENT;

  const handleRowSelectionChange = (keys, rows) => {
    const eligibleRows = rows.filter(isSelectableRow);
    setSelectedRowKeys(eligibleRows.map((row) => row.id));
    setSelectedRows(eligibleRows);
  };

  const handleConfirmManagementTypeAssignment = async () => {
    await onAssignManagementType?.({
      managementTypeId: selectedManagementType,
      managementType: getManagementTypeAssignmentLabel(selectedManagementType),
      selectedRowKeys,
      selectedRows,
    });
    setIsAssignmentModalOpen(false);
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
