import { Modal as AntdModal } from "antd";

import { SmartTable } from "../../../shared/ui/smart-table";
import { ModalInfoBanner, SecondaryActionButton } from "./common.styles";

export const AddAlertModal = ({ isOpen, onClose, columns, dataSource, loading }) => (
  <AntdModal
    open={isOpen}
    onCancel={onClose}
    title="Añadir item a la gestión"
    footer={<SecondaryActionButton onClick={onClose}>Cerrar</SecondaryActionButton>}
    width={1100}
    destroyOnClose
  >
    <ModalInfoBanner>
      Solo se listan registros de Productos Alertados que coinciden con la misma
      categoría de alerta de la gestión actual y cuyo estado de gestión de alerta es{" "}
      <strong>Sin Gestión</strong>.
    </ModalInfoBanner>
    <SmartTable
      rowKey="id"
      columns={columns}
      columnWidthMode="fixed"
      dataSource={dataSource}
      total={dataSource.length}
      loading={loading}
      showPagination
      pageSizeOptions={["10", "20", "50"]}
      defaultPageSize="10"
      showToolbar={false}
      showColumnSettings={false}
      showTableResize={false}
      showReload={false}
      scroll={{ x: 1200, y: 400 }}
      emptyText="No hay productos disponibles para añadir."
    />
  </AntdModal>
);