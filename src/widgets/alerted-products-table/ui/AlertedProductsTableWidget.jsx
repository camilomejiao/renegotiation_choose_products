import { CheckSquareOutlined } from "@ant-design/icons";
import { Radio } from "antd";

import { AppSearchInput } from "../../../shared/ui/search-input";

import { Modal } from "../../../shared/ui/modal";
import { SmartTable } from "../../../shared/ui/smart-table";
import { useAlertedProductsTable } from "../model/useAlertedProductsTable";
import {
  AssignmentAndRaiseButton,
  AssignmentDescription,
  AssignmentFooter,
  AssignmentHint,
  AssignmentModalContent,
  AssignmentOptionBody,
  AssignmentOptionCard,
  AssignmentOptionDescription,
  AssignmentOptionsGroup,
  AssignmentOptionTitle,
  AssignmentSecondaryButton,
  AssignmentSummary,
  AssignManagementButton,
  RaiseAlertButton,
  TableCard,
  TableContent,
  TableDescription,
  TableHeader,
  TableHeaderActions,
  TableHeaderTopRow,
  TableTitle,
  TableWidgetRoot,
} from "./AlertedProductsTableWidget.styles";

const TABLE_SCROLL_X = 2194;

export const AlertedProductsTableWidget = ({
  assigningManagementType = false,
  dataSource = [],
  emptyText,
  loading = false,
  onRaiseAlert,
  totalRecords = 0,
  currentPage,
  pageSize,
  onPageChange,
  managementTypeOptions = [],
  alertCategoryOptions = [],
  alertManagementOptions = [],
  searchValue = "",
  onSearchChange,
}) => {
  const {
    canRaiseAlert,
    closeAssignmentModal,
    columns,
    handleAssignAndRaiseAlert,
    handleRaiseAlert,
    isSelectableRow,
    isAssignmentModalOpen,
    openAssignmentModal,
    selectedManagementType,
    selectedRowKeys,
    setSelectedManagementType,
    handleRowSelectionChange,
  } = useAlertedProductsTable({
    onRaiseAlert,
    initialDataSource: dataSource,
    managementTypeOptions,
    alertCategoryOptions,
    alertManagementOptions,
  });

  return (
    <TableCard bordered={false}>
      <TableWidgetRoot>
        <TableHeader>
          <TableHeaderTopRow>
            <div>
              <TableTitle>Productos alertados</TableTitle>
              <TableDescription>
                Selecciona los registros que harán parte de la gestión de la mesa técnica.
              </TableDescription>
            </div>

            <TableHeaderActions>
              <AssignManagementButton
                type="primary"
                icon={<CheckSquareOutlined />}
                onClick={openAssignmentModal}
                disabled={!selectedRowKeys.length || assigningManagementType || loading}
              >
                Asignar Tipo de Gestión
              </AssignManagementButton>

              <RaiseAlertButton
                onClick={handleRaiseAlert}
                disabled={!canRaiseAlert || assigningManagementType || loading}
              >
                Levantar alerta
              </RaiseAlertButton>
            </TableHeaderActions>
          </TableHeaderTopRow>
        </TableHeader>

        <TableContent>
          <SmartTable
            loading={loading}
            rowKey="id"
            columns={columns}
            columnWidthMode="fixed"
            dataSource={dataSource}
            total={totalRecords}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={onPageChange}
            showPagination
            pageSizeOptions={["10", "20", "50"]}
            defaultPageSize="10"
            enableRowSelection
            rowSelectionType="checkbox"
            rowSelectionConfig={{
              getCheckboxProps: (record) => ({
                disabled: !isSelectableRow(record),
              }),
            }}
            defaultSelectedRows={{ keys: selectedRowKeys, records: [] }}
            onRowSelectionChange={handleRowSelectionChange}
            showToolbar
            showColumnSettings={false}
            showTableResize={false}
            showReload={false}
            download={{ enable: false }}
            leftContent={
              <AppSearchInput
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Buscar por proveedor, ID producto, orden o titular"
                disabled={loading}
                style={{ width: 480 }}
              />
            }
            emptyText={emptyText}
            scroll={{ x: TABLE_SCROLL_X, y: undefined }}
          />
        </TableContent>
      </TableWidgetRoot>

      <Modal
        title="Asignar Tipo de Gestión"
        isOpen={isAssignmentModalOpen}
        onCloseModal={closeAssignmentModal}
        footer={null}
        width={720}
        centered
        maxBodyHeight="72vh"
      >
        <AssignmentModalContent>
          <AssignmentSummary>
            {selectedRowKeys.length} producto{selectedRowKeys.length === 1 ? "" : "s"} seleccionado
            {selectedRowKeys.length === 1 ? "" : "s"}
          </AssignmentSummary>

          <AssignmentDescription>
            Seleccione el tipo de gestión que aplicará a los productos seleccionados.
          </AssignmentDescription>

          <AssignmentOptionsGroup
            value={selectedManagementType}
            onChange={(event) => setSelectedManagementType(event.target.value)}
          >
            {managementTypeOptions.map((option) => (
              <AssignmentOptionCard
                key={option.value}
                $isActive={selectedManagementType === option.value}
              >
                <Radio value={option.value} />
                <AssignmentOptionBody>
                  <AssignmentOptionTitle>{option.label}</AssignmentOptionTitle>
                  <AssignmentOptionDescription>
                    {option.description}
                  </AssignmentOptionDescription>
                </AssignmentOptionBody>
              </AssignmentOptionCard>
            ))}
          </AssignmentOptionsGroup>

          <AssignmentHint>
            Todos los productos seleccionados deben tener el mismo tipo de gestión para continuar con una única solicitud.
          </AssignmentHint>

          <AssignmentFooter>
            <AssignmentSecondaryButton onClick={closeAssignmentModal}>
              Cancelar
            </AssignmentSecondaryButton>
            <AssignmentAndRaiseButton
              type="primary"
              onClick={handleAssignAndRaiseAlert}
              loading={assigningManagementType}
              disabled={assigningManagementType || !selectedManagementType}
            >
              Asignar y Levantar Alerta
            </AssignmentAndRaiseButton>
          </AssignmentFooter>
        </AssignmentModalContent>
      </Modal>
    </TableCard>
  );
};
