import { Button, Input, Space } from "antd";
import { Modal } from "../../../shared/ui/modal";
import { FullWidthSelect, ModalFields } from "./EnvironmentalApprovalModal.styles";

const ACTION_OPTIONS = [
  { value: "approve", label: "Aprobar" },
  { value: "deny", label: "Denegar" },
];

export const EnvironmentalApprovalModal = ({
  isOpen,
  action,
  comment,
  submitting,
  onActionChange,
  onCommentChange,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onCloseModal={onCancel}
      title="Confirmar Accion"
      footer={
        <Space>
          <Button onClick={onCancel}>Cancelar</Button>
          <Button type="primary" onClick={onConfirm} loading={submitting}>
            Confirmar
          </Button>
        </Space>
      }
    >
      <ModalFields direction="vertical" size={12}>
        <FullWidthSelect
          value={action}
          options={ACTION_OPTIONS}
          onChange={onActionChange}
        />

        <Input.TextArea
          rows={4}
          value={comment}
          onChange={(event) => onCommentChange(event.target.value)}
          placeholder="Comentario"
        />
      </ModalFields>
    </Modal>
  );
};
