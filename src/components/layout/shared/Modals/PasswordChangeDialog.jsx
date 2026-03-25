import { useEffect, useMemo, useState } from "react";
import { Typography } from "antd";
import { AppInput } from "../../../../shared/ui/input";
import { Modal } from "../../../../shared/ui/modal";
import { AppButton } from "../../../../shared/ui/button";
import {
  PasswordField,
  PasswordFieldsStack,
  PasswordModalFooter,
} from "./PasswordChangeDialog.styles";

const { Text } = Typography;

export const PasswordChangeDialog = ({
  open,
  onClose,
  onSave,
  loading = false,
  minLength = 8,
}) => {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({ pwd: "", confirm: "" });

  useEffect(() => {
    if (!open) {
      return;
    }

    setPwd("");
    setConfirm("");
    setErrors({ pwd: "", confirm: "" });
  }, [open]);

  const isSubmitDisabled = useMemo(() => {
    return !pwd || !confirm || pwd !== confirm || pwd.length < minLength;
  }, [confirm, minLength, pwd]);

  const validate = () => {
    const nextErrors = { pwd: "", confirm: "" };

    if (!pwd) {
      nextErrors.pwd = "La contraseña es requerida";
    } else if (pwd.length < minLength) {
      nextErrors.pwd = `Mínimo ${minLength} caracteres`;
    }

    if (!confirm) {
      nextErrors.confirm = "Confirma la contraseña";
    } else if (confirm !== pwd) {
      nextErrors.confirm = "Las contraseñas no coinciden";
    }

    setErrors(nextErrors);
    return !nextErrors.pwd && !nextErrors.confirm;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    await onSave?.(pwd);
  };

  return (
    <Modal
      title="Cambiar contraseña"
      subTitle="La nueva contraseña se aplicará cuando confirmes esta operación."
      isOpen={open}
      onCloseModal={onClose}
      centered
      destroyOnClose
      footer={(
        <PasswordModalFooter>
          <AppButton variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </AppButton>
          <AppButton
            variant="primary"
            onClick={handleSave}
            disabled={isSubmitDisabled}
            loading={loading}
          >
            Guardar contraseña
          </AppButton>
        </PasswordModalFooter>
      )}
    >
      <PasswordFieldsStack>
        <Text type="secondary">
          Debe contener al menos {minLength} caracteres.
        </Text>

        <PasswordField>
          <AppInput
            type="password"
            value={pwd}
            onChange={(event) => setPwd(event.target.value)}
            placeholder="Nueva contraseña"
            status={errors.pwd ? "error" : undefined}
          />
          {errors.pwd && <Text type="danger">{errors.pwd}</Text>}
        </PasswordField>

        <PasswordField>
          <AppInput
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            placeholder="Confirmar contraseña"
            status={errors.confirm ? "error" : undefined}
          />
          {errors.confirm && <Text type="danger">{errors.confirm}</Text>}
        </PasswordField>
      </PasswordFieldsStack>
    </Modal>
  );
};
