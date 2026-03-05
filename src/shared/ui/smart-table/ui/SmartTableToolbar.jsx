import React from "react";
import { Button, Flex, Segmented } from "antd";
import {
  ColumnHeightOutlined,
  ReloadOutlined,
  TableOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { ColumnSettings } from "./ColumnSettings";
import { DownloadMenu } from "./DownloadMenu";
import { EmptySpace, LeftToolbar, ToolbarRow } from "./SmartTable.styles";

export const SmartTableToolbar = ({
  leftToolbar,
  toolbarExtensions,
  reload,
  showTableResize,
  tableSize,
  setTableSize,
  showColumnSettings,
  columnConfig,
  setColumnConfig,
  resetColumns,
  download,
  selectedRows,
  currentData,
  allData,
  sourceColumns,
  viewMode,
  setViewMode,
  showViewToggle,
}) => {
  return (
    <ToolbarRow>
      <LeftToolbar>
        {leftToolbar?.length ? leftToolbar : <EmptySpace />}
      </LeftToolbar>

      <Flex gap={4} align="center" wrap>
        {toolbarExtensions}

        <Button type="text" icon={<ReloadOutlined />} onClick={reload}>
          Recargar
        </Button>

        {showTableResize && (
          <Segmented
            value={tableSize}
            onChange={setTableSize}
            options={[
              {
                value: "small",
                icon: <ColumnHeightOutlined />,
                label: "S",
              },
              {
                value: "middle",
                icon: <ColumnHeightOutlined />,
                label: "M",
              },
              {
                value: "large",
                icon: <ColumnHeightOutlined />,
                label: "L",
              },
            ]}
          />
        )}

        {download?.enable !== false && (
          <DownloadMenu
            config={download}
            selectedRows={selectedRows}
            currentData={currentData}
            allData={allData}
            columns={sourceColumns}
          />
        )}

        {showColumnSettings && (
          <ColumnSettings
            columns={columnConfig}
            onChange={setColumnConfig}
            resetColumns={resetColumns}
          />
        )}

        {showViewToggle && (
          <Segmented
            value={viewMode}
            onChange={setViewMode}
            options={[
              {
                value: "table",
                icon: <TableOutlined />,
              },
              {
                value: "list",
                icon: <UnorderedListOutlined />,
              },
            ]}
          />
        )}
      </Flex>
    </ToolbarRow>
  );
};
