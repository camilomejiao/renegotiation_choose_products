import { Typography } from "antd";

import { AppButton } from "../../../shared/ui/button";
import {
  FormMeta,
  SecurityActionRow,
  SecurityCard,
  SecurityDescription,
  SecurityPanel,
  TabSectionHeader,
} from "./UserFormWidget.styles";

const { Title } = Typography;

export const UserSecurityTab = ({
  loadingPasswordUpdate,
  mustChangePassword,
  onOpenPasswordDialog,
  passwordValidity,
}) => {
  return (
    <SecurityPanel>
      <TabSectionHeader>
        <Title level={3}>Seguridad</Title>
        <FormMeta>
          Cambia tu contraseña.
        </FormMeta>
      </TabSectionHeader>

      <SecurityCard>
        <div>
          <Title level={5}>Cambiar contraseña</Title>
          <SecurityDescription>
            {mustChangePassword
              ? "Debes actualizar tu contraseña para continuar usando el sistema."
              : "Cuando lo necesites, puedes actualizar tu contraseña desde esta sección."}
          </SecurityDescription>
          {passwordValidity && !mustChangePassword && (
            <SecurityDescription>
              Tu sesión indica cambio obligatorio de contraseña en {passwordValidity} días.
            </SecurityDescription>
          )}
        </div>

        <SecurityActionRow>
          <AppButton loading={loadingPasswordUpdate} onClick={onOpenPasswordDialog}>
            Cambiar contraseña
          </AppButton>
        </SecurityActionRow>
      </SecurityCard>
    </SecurityPanel>
  );
};
