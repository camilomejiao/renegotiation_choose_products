import { PlusOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { SmartTable } from "../../../../../shared/ui/smart-table";
import { AppButton } from "../../../../../shared/ui/button/AppButton";
import { AppSearchInput } from "../../../../../shared/ui/search-input/AppSearchInput";
import {
  ManagementSearchSlot,
  ManagementSectionCard,
  ManagementTableWrapper,
  ManagementToolbar,
} from "./ManagementTableSection.styles";

export const ManagementTableSection = ({
  searchQuery,
  onSearchChange,
  createLabel,
  onCreate,
  columns,
  dataSource,
  loading,
  total,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  return (
    <ManagementSectionCard>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <ManagementToolbar>
          <ManagementSearchSlot>
            <AppSearchInput
              value={searchQuery}
              onChange={onSearchChange}
              placeholder="Buscar..."
            />
          </ManagementSearchSlot>

          <AppButton type="primary" icon={<PlusOutlined />} onClick={onCreate}>
            {createLabel}
          </AppButton>
        </ManagementToolbar>

        <ManagementTableWrapper>
          <SmartTable
            rowKey="id"
            columns={columns}
            dataSource={dataSource}
            loading={loading}
            showToolbar={false}
            total={total}
            currentPage={currentPage}
            defaultPageSize={pageSize}
            onPageChange={onPageChange}
            enableRowSelection={false}
            showColumnSettings={false}
            showTableResize={false}
            download={{ enable: false }}
            scroll={{ x: 1100 }}
            pageSizeOptions={["25", "50", "100"]}
          />
        </ManagementTableWrapper>
      </Space>
    </ManagementSectionCard>
  );
};
