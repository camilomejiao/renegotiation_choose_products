import { Alert } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { WarningAlertWrapper } from "./UserFormWidget.styles";

export const UserFormAlerts = ({
  handleCancel,
  loadError,
  mustChangePassword,
  passwordValidity,
  showManagementActions,
  showPasswordValidityWarning,
}) => {
  return (
    <>
      {loadError && (
        <Alert
          type="error"
          showIcon
          message="No fue posible cargar esta vista"
          description={loadError}
          action={(
            <AppButton variant="secondary" onClick={handleCancel}>
              Volver
            </AppButton>
          )}
        />
      )}

      {mustChangePassword && !showManagementActions && (
        <WarningAlertWrapper>
          <Alert
            type="warning"
            showIcon
            message="Debes cambiar tu contraseña para continuar"
            description={
              passwordValidity
                ? `Tu sesión indica cambio obligatorio de contraseña. Vigencia recibida en token: ${passwordValidity} días.`
                : "Tu sesión indica que debes actualizar la contraseña antes de continuar usando el sistema."
            }
          />
        </WarningAlertWrapper>
      )}

      {showPasswordValidityWarning && !showManagementActions && (
        <WarningAlertWrapper>
          <Alert
            type="warning"
            showIcon
            message="Debes cambiar la contraseña para continuar"
            description={`Tu sesión indica cambio obligatorio de contraseña en ${passwordValidity} días.`}
          />
        </WarningAlertWrapper>
      )}
    </>
  );
};
