import { Descriptions } from "antd";

import { Modal } from "../../../shared/ui/modal";

export const OrderRequestApprovalViewModal = ({
  isOpen,
  onClose,
  request,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onCloseModal={onClose}
      title="Detalle de aprobación"
      footer={null}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Orden de compra">
          {request?.orderId || "---"}
        </Descriptions.Item>
        <Descriptions.Item label="CUB">
          {request?.cubId || "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Titular">
          {request?.beneficiary || "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Proveedor">
          {request?.supplier || "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Estado de aprobación">
          {request?.approvalStatus || "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de aprobación">
          {request?.approvalDate || "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Aprobador">
          {request?.approver || "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Motivo de la solicitud">
          {request?.requestReason || "---"}
        </Descriptions.Item>
        <Descriptions.Item label="Observación del líder">
          {request?.leaderObservation || "---"}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
