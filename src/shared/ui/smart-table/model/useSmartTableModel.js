import { useCallback, useMemo, useState, useEffect } from "react";
import { mapToAntdColumns } from "../lib/mapToAntdColumns";

export const useSmartTableModel = ({
  columns = [],
  defaultText = "---",
  onSortChange,
  onPageChange,
  onRowSelectionChange,
  rowSelectionType = "checkbox",
  enableRowSelection = true,
  defaultSelectedRows,
  showPagination = true,
  total,
  pageSizeOptions = ["10", "15", "20", "25", "50"],
  defaultPageSize,
  currentPage,
}) => {
  const [tableSize, setTableSize] = useState("middle");
  const [columnConfig, setColumnConfig] = useState(columns);
  const [selectedRowKeys, setSelectedRowKeys] = useState(defaultSelectedRows?.keys || []);
  const [selectedRows, setSelectedRows] = useState(defaultSelectedRows?.records || []);

  useEffect(() => {
    setColumnConfig(columns);
  }, [columns]);

  useEffect(() => {
    setSelectedRowKeys(defaultSelectedRows?.keys || []);
    setSelectedRows(defaultSelectedRows?.records || []);
  }, [defaultSelectedRows]);

  const onSelectChange = useCallback(
    (keys, records) => {
      setSelectedRowKeys(keys);
      setSelectedRows(records);
      onRowSelectionChange?.(keys, records);
    },
    [onRowSelectionChange]
  );

  const resetSelection = useCallback(() => {
    onSelectChange([], []);
  }, [onSelectChange]);

  const handleSort = useCallback(
    (_pagination, _filters, sorter, extra) => {
      if (extra?.action !== "sort") {
        return;
      }

      const sortOrder =
        sorter?.order === "ascend"
          ? "asc"
          : sorter?.order === "descend"
            ? "desc"
            : undefined;

      resetSelection();
      onSortChange?.(sorter?.field, sortOrder);
    },
    [onSortChange, resetSelection]
  );

  const handlePageChange = useCallback(
    (pageNo, pageSize) => {
      onPageChange?.(pageNo, pageSize);
      resetSelection();
    },
    [onPageChange, resetSelection]
  );

  const rowSelection = useMemo(() => {
    if (!enableRowSelection) {
      return undefined;
    }

    return {
      type: rowSelectionType,
      selectedRowKeys,
      onChange: onSelectChange,
    };
  }, [enableRowSelection, onSelectChange, rowSelectionType, selectedRowKeys]);

  const antdColumns = useMemo(
    () => mapToAntdColumns({ columns: columnConfig, defaultText }),
    [columnConfig, defaultText]
  );

  const visibleColumns = useMemo(
    () => antdColumns.filter((column) => !column.hidden),
    [antdColumns]
  );

  const pagination = useMemo(() => {
    if (!showPagination) {
      return false;
    }

    const normalizedPageSizeOptions = pageSizeOptions.map((size) => Number(size));
    const normalizedDefaultPageSize = Number(
      defaultPageSize || normalizedPageSizeOptions[0]
    );

    return {
      total: total ?? 0,
      current: currentPage,
      showSizeChanger: true,
      hideOnSinglePage: false,
      pageSizeOptions: normalizedPageSizeOptions,
      defaultPageSize: normalizedDefaultPageSize,
      showTotal: (itemsTotal, range) => `${range[0]} - ${range[1]} de ${itemsTotal} registros`,
      onChange: handlePageChange,
    };
  }, [
    showPagination,
    total,
    currentPage,
    pageSizeOptions,
    defaultPageSize,
    handlePageChange,
  ]);

  return {
    tableSize,
    setTableSize,
    columnConfig,
    setColumnConfig,
    visibleColumns,
    selectedRows,
    selectedRowKeys,
    selectedCount: selectedRowKeys.length,
    rowSelection,
    handleSort,
    pagination,
    resetSelection,
  };
};
