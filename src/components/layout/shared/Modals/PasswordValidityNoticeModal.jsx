import { Typography } from "antd";
import { Modal } from "../../../../shared/ui/modal";
import { AppButton } from "../../../../shared/ui/button";
import {
  PasswordValidityNoticeBody,
  PasswordValidityNoticeFooter,
} from "./PasswordValidityNoticeModal.styles";

const { Text } = Typography;

export const PasswordValidityNoticeModal = ({
  open,
  daysRemaining,
  onClose,
  onGoToProfile,
}) => {
  return (
    <Modal
      title="Tu contraseña vencerá pronto"
      subTitle={`En ${daysRemaining} días deberás actualizar tu contraseña para seguir usando el sistema.`}
      isOpen={open}
      onCloseModal={onClose}
      centered
      destroyOnClose
      footer={(
        <PasswordValidityNoticeFooter>
          <AppButton variant="secondary" onClick={onClose}>
            Más tarde
          </AppButton>
          <AppButton variant="primary" onClick={onGoToProfile}>
            Cambiar mi contraseña
          </AppButton>
        </PasswordValidityNoticeFooter>
      )}
    >
      <PasswordValidityNoticeBody>
        <Text>
          Tu sesión indica que el cambio de contraseña será obligatorio en{" "}
          {daysRemaining} días.
        </Text>
        <Text type="secondary">
          Puedes actualizarla ahora desde tu perfil para evitar interrupciones
          en un próximo ingreso.
        </Text>
      </PasswordValidityNoticeBody>
    </Modal>
  );
};
