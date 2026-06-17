import { Button } from "antd";
import { Typography } from "antd";
import { Modal } from "../../../shared/ui/modal";

const { Text } = Typography;

export const DocumentUnavailableModal = ({ isOpen, title, message, onClose }) => (
  <Modal
    isOpen={isOpen}
    onCloseModal={onClose}
    title={title}
    centered
    destroyOnClose
    footer={<Button onClick={onClose}>Cerrar</Button>}
  >
    <Text>{message}</Text>
  </Modal>
);