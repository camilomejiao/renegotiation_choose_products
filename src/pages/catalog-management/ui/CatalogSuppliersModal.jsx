import { Button, Table, Typography } from "antd";
import styled from "@emotion/styled";
import { Modal } from "../../../shared/ui/modal";
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
      <Table
        columns={suppliersModalColumns}
        dataSource={dataSource}
        pagination={false}
        locale={{ emptyText: "No hay proveedores registrados." }}
        size="small"
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
