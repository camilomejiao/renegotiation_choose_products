import React, { useMemo, useState } from "react";
import { Table } from "antd";
import { useSmartTableModel } from "../model/useSmartTableModel";
import { SmartTableToolbar } from "./SmartTableToolbar";
import { TableContainer, TableRoot, ToolbarDivider } from "./SmartTable.styles";
import { useThemeMode } from "../../theme/ThemeProvider";
import { themeTokens } from "../../theme/tokens";

export const SmartTableView = ({
  rowKey,
  columns = [],
  dataSource = [],
  allData,
  loading = false,
  showHeader = true,
  showPagination = true,
  total,
  currentPage,
  defaultText = "---",
  defaultSelectedRows,
  rowSelectionType = "checkbox",
  enableRowSelection = true,
  showTableResize = true,
  showColumnSettings = true,
  toolbarExtensions = null,
  leftToolbar = [],
  reload,
  onSortChange,
  onPageChange,
  onRowSelectionChange,
  onRow,
  scroll = { x: 1 },
  pageSizeOptions = ["10", "15", "20", "25", "50"],
  defaultPageSize,
  download,
  showToolbar = true,
  dangerRowCondition,
  successRowCondition,
  rowDangerClassName = "shared-smart-table-danger-row",
  rowSuccessClassName = "shared-smart-table-success-row",
  showViewToggle = false,
  defaultViewMode = "table",
  listRenderer,
}) => {
  const [viewMode, setViewMode] = useState(defaultViewMode);
  const { mode } = useThemeMode();
  const colors = (themeTokens[mode] || themeTokens.light).colors;

  const {
    tableSize,
    setTableSize,
    columnConfig,
    setColumnConfig,
    visibleColumns,
    selectedRows,
    rowSelection,
    handleSort,
    pagination,
  } = useSmartTableModel({
    columns,
    defaultText,
    onSortChange,
    onPageChange,
    onRowSelectionChange,
    rowSelectionType,
    enableRowSelection,
    defaultSelectedRows,
    showPagination,
    total,
    pageSizeOptions,
    defaultPageSize,
    currentPage,
  });

  const resetColumns = () => setColumnConfig(columns);

  const rowClassName = useMemo(
    () => {
      if (
        typeof dangerRowCondition !== "function" &&
        typeof successRowCondition !== "function"
      ) {
        return undefined;
      }

      return (record) => {
        if (typeof dangerRowCondition === "function" && dangerRowCondition(record)) {
          return rowDangerClassName;
        }

        if (typeof successRowCondition === "function" && successRowCondition(record)) {
          return rowSuccessClassName;
        }

        return "";
      };
    },
    [
      dangerRowCondition,
      successRowCondition,
      rowDangerClassName,
      rowSuccessClassName,
    ]
  );

  return (
    <TableRoot vertical gap="small">
      {showToolbar && (
        <>
          <SmartTableToolbar
            leftToolbar={leftToolbar}
            toolbarExtensions={toolbarExtensions}
            reload={reload}
            showTableResize={showTableResize}
            tableSize={tableSize}
            setTableSize={setTableSize}
            showColumnSettings={showColumnSettings}
            columnConfig={columnConfig}
            setColumnConfig={setColumnConfig}
            resetColumns={resetColumns}
            download={download}
            selectedRows={selectedRows}
            currentData={dataSource}
            allData={allData || dataSource}
            sourceColumns={columns}
            viewMode={viewMode}
            setViewMode={setViewMode}
            showViewToggle={showViewToggle}
          />
          <ToolbarDivider />
        </>
      )}

      {viewMode === "list" && typeof listRenderer === "function" ? (
        listRenderer({
          dataSource,
          loading,
          rowSelection,
          selectedRows,
          tableSize,
          pagination,
        })
      ) : (
        <TableContainer
          $dangerRowBg={colors.tableDangerRowBg}
          $dangerRowBorder={colors.tableDangerRowBorder}
          $dangerRowHoverBg={colors.tableDangerRowHoverBg}
          $dangerRowAccent={colors.tableDangerRowAccent}
          $successRowBg={colors.tableSuccessRowBg}
          $successRowBorder={colors.tableSuccessRowBorder}
          $successRowHoverBg={colors.tableSuccessRowHoverBg}
          $successRowAccent={colors.tableSuccessRowAccent}
        >
          <Table
            loading={loading}
            columns={visibleColumns}
            dataSource={dataSource}
            rowKey={rowKey}
            size={tableSize}
            rowSelection={rowSelection}
            onRow={onRow}
            pagination={pagination}
            onChange={handleSort}
            scroll={scroll}
            showHeader={showHeader}
            rowClassName={rowClassName}
          />
        </TableContainer>
      )}
    </TableRoot>
  );
};
