import { PlusOutlined } from "@ant-design/icons";
import { Col, Row, Space } from "antd";
import { SmartTable } from "../../../../../shared/ui/smart-table";
import { AppButton } from "../../../../../shared/ui/button/AppButton";
import { AppSearchInput } from "../../../../../shared/ui/search-input/AppSearchInput";
import {
  ManagementSearchSlot,
  ManagementSectionCard,
  ManagementTableWrapper,
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
        <Row gutter={[12, 12]} align="middle" justify="space-between">
          <Col xs={24} sm={24} md={14} lg={12} xl={10} xxl={8}>
            <ManagementSearchSlot>
              <AppSearchInput
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Buscar..."
              />
            </ManagementSearchSlot>
          </Col>

          <Col xs={24} sm={24} md={10} lg={12} xl={14} xxl={16}>
            <Row justify="end">
              <Col xs={24} sm={24} md="auto" lg="auto" xl="auto" xxl="auto">
                <AppButton type="primary" icon={<PlusOutlined />} onClick={onCreate}>
                  {createLabel}
                </AppButton>
              </Col>
            </Row>
          </Col>
        </Row>

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
