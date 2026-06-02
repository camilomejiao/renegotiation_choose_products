import { CheckSquareOutlined } from "@ant-design/icons";
import { Radio } from "antd";

import { Modal } from "../../../shared/ui/modal";
import { SmartTable } from "../../../shared/ui/smart-table";
import { managementTypeAssignmentOptions } from "../model/managementTypeOptions";
import { useAlertedProductsTable } from "../model/useAlertedProductsTable";
import {
  AssignmentDescription,
  AssignmentFooter,
  AssignmentHint,
  AssignmentModalContent,
  AssignmentOptionBody,
  AssignmentOptionCard,
  AssignmentOptionDescription,
  AssignmentOptionsGroup,
  AssignmentOptionTitle,
  AssignmentPrimaryButton,
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

const TABLE_SCROLL_X = 1800;

export const AlertedProductsTableWidget = ({
  assigningManagementType = false,
  dataSource = [],
  emptyText,
  loading = false,
  onAssignManagementType,
  onRaiseAlert,
}) => {
  const {
    canRaiseAlert,
    closeAssignmentModal,
    columns,
    handleConfirmManagementTypeAssignment,
    handleRaiseAlert,
    isSelectableRow,
    isAssignmentModalOpen,
    openAssignmentModal,
    selectedManagementType,
    selectedRowKeys,
    setSelectedManagementType,
    handleRowSelectionChange,
  } = useAlertedProductsTable({
    onAssignManagementType,
    onRaiseAlert,
    initialDataSource: dataSource,
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
            total={dataSource.length}
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
            showToolbar={false}
            showColumnSettings={false}
            showTableResize={false}
            showReload={false}
            emptyText={emptyText}
            scroll={{ x: TABLE_SCROLL_X, y: 520 }}
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
            {managementTypeAssignmentOptions.map((option) => (
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
            <AssignmentPrimaryButton
              type="primary"
              onClick={handleConfirmManagementTypeAssignment}
              loading={assigningManagementType}
              disabled={assigningManagementType}
            >
              Confirmar asignación
            </AssignmentPrimaryButton>
          </AssignmentFooter>
        </AssignmentModalContent>
      </Modal>
    </TableCard>
  );
};
