import { Modal as AppModal } from "../../../shared/ui/modal";
import { SecondaryActionButton } from "./common.styles";

export const MissingRequirementsModal = ({ isOpen, message, onClose }) => (
  <AppModal
    title="Información requerida"
    isOpen={isOpen}
    onCloseModal={onClose}
    footer={<SecondaryActionButton onClick={onClose}>Entendido</SecondaryActionButton>}
    width={520}
    centered
  >
    <p style={{ margin: 0 }}>{message}</p>
  </AppModal>
);