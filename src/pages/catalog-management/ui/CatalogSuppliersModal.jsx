import { Button, Typography } from "antd";
import styled from "@emotion/styled";
import { Modal } from "../../../shared/ui/modal";
import { SmartTable } from "../../../shared/ui/smart-table";
import { suppliersModalColumns } from "../model/suppliersModalColumns";

export const CatalogSuppliersModal = ({ isOpen, onClose, dataSource }) => {
  return (
    <Modal
      isOpen={isOpen}
      onCloseModal={onClose}
      centered
      width="min(92vw, 720px)"
      maxBodyHeight="65vh"
      footer={<Button onClick={onClose}>Cerrar</Button>}
      title={<ModalTitle level={5}>Proveedores</ModalTitle>}
    >
      <SmartTable
        rowKey="index"
        columns={suppliersModalColumns}
        dataSource={dataSource}
        defaultText="---"
        emptyText="No hay proveedores registrados."
        showToolbar={false}
        showPagination={false}
        enableRowSelection={false}
        showColumnSettings={false}
        showTableResize={false}
        scroll={{ x: 520 }}
      />
    </Modal>
  );
};

const ModalTitle = styled(Typography.Title)`
  && {
    margin: 0;
  }
`;
