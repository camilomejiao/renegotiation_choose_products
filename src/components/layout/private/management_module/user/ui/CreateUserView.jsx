import { Alert, Tag, Typography } from "antd";

import imgPeople from "../../../../../../assets/image/addProducts/people1.jpg";
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import { PasswordChangeDialog } from "../../../../shared/Modals/PasswordChangeDialog";
import { Loading } from "../../../../shared/loading/Loading";
import { AppButton } from "../../../../../../shared/ui/button";
import { AppInput } from "../../../../../../shared/ui/input";
import { AppSelect } from "../../../../../../shared/ui/select";
import { AppSwitch } from "../../../../../../shared/ui/switch";
import {
  ActionsRow,
  FieldContent,
  FieldControl,
  FieldError,
  FieldGrid,
  FieldLabel,
  FormCard,
  FormHeader,
  FormMeta,
  FormSection,
  FormSwitchRow,
  HelperText,
  LockedFieldHint,
  MainContainer,
  PasswordStatus,
  SectionTitle,
} from "./CreateUserView.styles";

const { Title } = Typography;

export const CreateUserView = ({
  canEditAllFields,
  formik,
  getFieldStatus,
  handleCancel,
  handlePasswordSaved,
  handleSelectSupplier,
  handleSubmit,
  handleToggleSupplier,
  isEdit,
  loadError,
  loadingRoles,
  loadingSuppliers,
  loadingUser,
  pendingPassword,
  pwdOpen,
  roleOptions,
  selectedRoleOption,
  selectedSupplierOption,
  setPwdOpen,
  showManagementActions,
  supplierOptions,
}) => {
  const shouldHideRestrictedProfileSections = isEdit && !canEditAllFields && !showManagementActions;

  return (
    <MainContainer>
      <HeaderImage
        imageHeader={imgPeople}
        titleHeader={isEdit ? (showManagementActions ? "Editar usuario" : "Mi perfil") : "Registra tus usuarios"}
        bannerIcon=""
        backgroundIconColor=""
        bannerInformation=""
        backgroundInformationColor=""
      />

      {loadingUser && <Loading fullScreen text="Cargando..." />}

      <FormCard>
        <FormHeader>
          <div>
            <Title level={3}>{isEdit ? "Configuracion del usuario" : "Nuevo usuario"}</Title>
            <FormMeta>
              {isEdit
                ? "Aqui puedes actualizar tu informacion personal y cambiar tu contraseña."
                : "Crea un usuario nuevo con la configuracion requerida."}
            </FormMeta>
          </div>

          {isEdit && !canEditAllFields && (
            <LockedFieldHint>
              Puedes editar solo tu Nombre, Apellido, telefono y contraseña.
            </LockedFieldHint>
          )}
        </FormHeader>

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

        {!loadError && (
          <form onSubmit={handleSubmit}>
            {!shouldHideRestrictedProfileSections && (
              <FormSection>
                <SectionTitle>Configuracion general</SectionTitle>
                <FieldGrid>
                  <FieldControl>
                    <FormSwitchRow>
                      <FieldContent>
                        <FieldLabel>Usuario asociado a proveedor</FieldLabel>
                        <HelperText>
                          Define si el usuario toma datos base del proveedor.
                        </HelperText>
                      </FieldContent>
                      <AppSwitch
                        checked={formik.values.isSupplier}
                        onChange={handleToggleSupplier}
                        disabled={isEdit && !canEditAllFields}
                      />
                    </FormSwitchRow>
                  </FieldControl>

                  <FieldControl>
                    <FormSwitchRow>
                      <FieldContent>
                        <FieldLabel>Estado</FieldLabel>
                        <HelperText>
                          Controla si el usuario permanece activo en el sistema.
                        </HelperText>
                      </FieldContent>
                      <AppSwitch
                        checked={formik.values.active}
                        onChange={(checked) => formik.setFieldValue("active", checked)}
                        disabled={isEdit && !canEditAllFields}
                      />
                    </FormSwitchRow>
                  </FieldControl>
                </FieldGrid>
              </FormSection>
            )}

            {!shouldHideRestrictedProfileSections && formik.values.isSupplier && (
              <FormSection>
                <SectionTitle>Proveedor asociado</SectionTitle>
                <FieldControl>
                  <FieldLabel>Selecciona proveedor</FieldLabel>
                  <AppSelect
                    value={selectedSupplierOption}
                    options={supplierOptions}
                    onChange={handleSelectSupplier}
                    placeholder="Busca un proveedor"
                    isDisabled={isEdit && !canEditAllFields}
                    isLoading={loadingSuppliers}
                  />
                  {formik.touched.supplier_id && formik.errors.supplier_id && (
                    <FieldError>{formik.errors.supplier_id}</FieldError>
                  )}
                </FieldControl>
              </FormSection>
            )}

            <FormSection>
              <SectionTitle>Datos principales</SectionTitle>
              <FieldGrid>
                <FieldControl>
                  <FieldLabel>Nombre</FieldLabel>
                  <AppInput
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    status={getFieldStatus("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <FieldError>{formik.errors.name}</FieldError>
                  )}
                </FieldControl>

                <FieldControl>
                  <FieldLabel>Apellido</FieldLabel>
                  <AppInput
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    status={getFieldStatus("last_name")}
                  />
                  {formik.touched.last_name && formik.errors.last_name && (
                    <FieldError>{formik.errors.last_name}</FieldError>
                  )}
                </FieldControl>

                <FieldControl>
                  <FieldLabel>Numero de identificacion</FieldLabel>
                  <AppInput
                    name="identification_number"
                    value={formik.values.identification_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    status={getFieldStatus("identification_number")}
                    disabled={isEdit && !canEditAllFields}
                  />
                  {formik.touched.identification_number &&
                    formik.errors.identification_number && (
                      <FieldError>{formik.errors.identification_number}</FieldError>
                    )}
                </FieldControl>

                <FieldControl>
                  <FieldLabel>Email</FieldLabel>
                  <AppInput
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    status={getFieldStatus("email")}
                    disabled={isEdit && !canEditAllFields}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <FieldError>{formik.errors.email}</FieldError>
                  )}
                </FieldControl>

                <FieldControl>
                  <FieldLabel>Telefono</FieldLabel>
                  <AppInput
                    name="cellphone"
                    value={formik.values.cellphone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    status={getFieldStatus("cellphone")}
                  />
                  {formik.touched.cellphone && formik.errors.cellphone && (
                    <FieldError>{formik.errors.cellphone}</FieldError>
                  )}
                </FieldControl>

                <FieldControl>
                  <FieldLabel>Usuario</FieldLabel>
                  <AppInput
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    status={getFieldStatus("username")}
                    disabled={isEdit && !canEditAllFields}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <FieldError>{formik.errors.username}</FieldError>
                  )}
                </FieldControl>

                <FieldControl>
                  <FieldLabel>Selecciona rol</FieldLabel>
                  <AppSelect
                    value={selectedRoleOption}
                    options={roleOptions}
                    onChange={(option) => formik.setFieldValue("role", option?.value ?? null)}
                    placeholder="Selecciona un rol"
                    isDisabled={isEdit && !canEditAllFields}
                    isLoading={loadingRoles}
                  />
                  {formik.touched.role && formik.errors.role && (
                    <FieldError>{formik.errors.role}</FieldError>
                  )}
                </FieldControl>

                {!isEdit && (
                  <FieldControl>
                    <FieldLabel>Contraseña</FieldLabel>
                    <AppInput
                      type="password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      status={getFieldStatus("password")}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <FieldError>{formik.errors.password}</FieldError>
                    )}
                  </FieldControl>
                )}

                {isEdit && (
                  <FieldControl>
                    <FieldLabel>Cambiar contraseña</FieldLabel>
                    <PasswordStatus>
                      <AppButton onClick={() => setPwdOpen(true)}>
                        Cambiar contraseña
                      </AppButton>
                      <Tag color={pendingPassword ? "success" : "default"}>
                        {pendingPassword ? "Nueva contraseña lista" : "Sin cambios"}
                      </Tag>
                    </PasswordStatus>
                  </FieldControl>
                )}
              </FieldGrid>
            </FormSection>

            <ActionsRow>
              <AppButton variant="secondary" onClick={handleCancel}>
                Cancelar
              </AppButton>
              <AppButton htmlType="submit" loading={loadingUser}>
                {isEdit ? "Actualizar" : "Guardar"}
              </AppButton>
            </ActionsRow>
          </form>
        )}
      </FormCard>

      <PasswordChangeDialog
        open={pwdOpen}
        onClose={() => setPwdOpen(false)}
        onSave={handlePasswordSaved}
        minLength={8}
      />
    </MainContainer>
  );
};
