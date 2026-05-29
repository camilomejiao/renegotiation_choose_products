import { useMemo, useState } from "react";

import { alertedProductsTableData } from "./alertedProductsTableData";
import { getAlertedProductsTableColumns } from "./getAlertedProductsTableColumns";
import {
  getManagementTypeAssignmentLabel,
  managementTypeAssignmentOptions,
} from "./managementTypeOptions";

export const useAlertedProductsTable = ({ onRaiseAlert } = {}) => {
  const [dataSource, setDataSource] = useState(alertedProductsTableData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedManagementType, setSelectedManagementType] = useState(
    managementTypeAssignmentOptions[0]?.value || ""
  );

  const columns = useMemo(() => getAlertedProductsTableColumns(), []);

  const handleRowSelectionChange = (keys, rows) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  const handleConfirmManagementTypeAssignment = () => {
    const nextManagementTypeLabel = getManagementTypeAssignmentLabel(selectedManagementType);

    setDataSource((currentRows) =>
      currentRows.map((row) =>
        selectedRowKeys.includes(row.id)
          ? {
              ...row,
              managementType: nextManagementTypeLabel,
              hasAssignedManagementType: true,
            }
          : row
      )
    );

    setSelectedRows((currentRows) =>
      currentRows.map((row) => ({
        ...row,
        managementType: nextManagementTypeLabel,
        hasAssignedManagementType: true,
      }))
    );
    setIsAssignmentModalOpen(false);
  };

  const canRaiseAlert =
    selectedRowKeys.length > 0 &&
    dataSource
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
    dataSource,
    handleConfirmManagementTypeAssignment,
    handleRaiseAlert,
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
