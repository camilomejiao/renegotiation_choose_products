import { Col, Row, Typography } from "antd";

import { AppButton } from "../../../shared/ui/button";
import { AppInput } from "../../../shared/ui/input";
import { AppSelect } from "../../../shared/ui/select";
import { AppSwitch } from "../../../shared/ui/switch";
import {
  ActionsRow,
  FieldContent,
  FieldControl,
  FieldError,
  FieldLabel,
  FormMeta,
  FormSection,
  FormSwitchRow,
  HelperText,
  LockedFieldHint,
  SectionTitle,
  TabPanelContent,
  TabSectionHeader,
} from "./UserFormWidget.styles";

const { Title } = Typography;

export const UserPersonalInfoForm = ({
  canEditAllFields,
  formik,
  formTitle,
  formDescription,
  getFieldStatus,
  handleCancel,
  handleSelectSupplier,
  handleSubmit,
  handleToggleSupplier,
  isEdit,
  loadingRoles,
  loadingSuppliers,
  loadingUser,
  mustChangePassword,
  roleOptions,
  selectedRoleOption,
  selectedSupplierOption,
  showInlinePasswordAction,
  showLockedHint,
  showManagementActions,
  supplierOptions,
  onOpenPasswordDialog,
}) => {
  const isRestrictedProfile = isEdit && !canEditAllFields && !showManagementActions;
  const shouldHideRestrictedProfileSections = isRestrictedProfile;

  return (
    <form onSubmit={handleSubmit}>
      <TabPanelContent>
        <TabSectionHeader>
          <Row gutter={[16, 16]} align="top">
            <Col xs={24} sm={24} md={24} lg={14} xl={16} xxl={18}>
              <div>
                <Title level={3}>{formTitle}</Title>
                <FormMeta>{formDescription}</FormMeta>
              </div>
            </Col>

            {showLockedHint && (
              <Col xs={24} sm={24} md={24} lg={10} xl={8} xxl={6}>
                <LockedFieldHint>
                  Puedes editar solo tu nombre, apellido, teléfono y contraseña.
                </LockedFieldHint>
              </Col>
            )}
          </Row>
        </TabSectionHeader>

        {!shouldHideRestrictedProfileSections && (
          <FormSection>
            <SectionTitle>Configuración general</SectionTitle>
            <Row gutter={[18, 18]}>
              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
              </Col>

              <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={12}>
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
              </Col>
            </Row>
          </FormSection>
        )}

        {!shouldHideRestrictedProfileSections && formik.values.isSupplier && (
          <FormSection>
            <SectionTitle>Proveedor asociado</SectionTitle>
            <Row gutter={[18, 18]}>
              <Col xs={24} sm={24} md={24} lg={16} xl={14} xxl={12}>
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
              </Col>
            </Row>
          </FormSection>
        )}

        <FormSection>
          <SectionTitle>Datos principales</SectionTitle>
          <Row gutter={[18, 18]}>
            <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
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
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
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
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
              <FieldControl>
                <FieldLabel>Número de identificación</FieldLabel>
                <AppInput
                  name="identification_number"
                  value={formik.values.identification_number}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  status={getFieldStatus("identification_number")}
                  readOnly={isRestrictedProfile}
                  disabled={isEdit && !canEditAllFields && !isRestrictedProfile}
                />
                {formik.touched.identification_number &&
                  formik.errors.identification_number && (
                    <FieldError>{formik.errors.identification_number}</FieldError>
                  )}
              </FieldControl>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
              <FieldControl>
                <FieldLabel>Email</FieldLabel>
                <AppInput
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  status={getFieldStatus("email")}
                  readOnly={isRestrictedProfile}
                  disabled={isEdit && !canEditAllFields && !isRestrictedProfile}
                />
                {formik.touched.email && formik.errors.email && (
                  <FieldError>{formik.errors.email}</FieldError>
                )}
              </FieldControl>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
              <FieldControl>
                <FieldLabel>Teléfono</FieldLabel>
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
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
              <FieldControl>
                <FieldLabel>Usuario</FieldLabel>
                <AppInput
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  status={getFieldStatus("username")}
                  readOnly={isRestrictedProfile}
                  disabled={isEdit && !canEditAllFields && !isRestrictedProfile}
                />
                {formik.touched.username && formik.errors.username && (
                  <FieldError>{formik.errors.username}</FieldError>
                )}
              </FieldControl>
            </Col>

            <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
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
            </Col>

            {!isEdit && (
              <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
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
              </Col>
            )}

            {showInlinePasswordAction && (
              <Col xs={24} sm={24} md={24} lg={12} xl={8} xxl={8}>
                <FieldControl>
                  <FieldLabel>Cambiar contraseña</FieldLabel>
                  <AppButton onClick={onOpenPasswordDialog}>
                    Cambiar contraseña
                  </AppButton>
                </FieldControl>
              </Col>
            )}
          </Row>
        </FormSection>

        <ActionsRow>
          {!mustChangePassword && (
            <AppButton variant="secondary" onClick={handleCancel}>
              Cancelar
            </AppButton>
          )}
          <AppButton htmlType="submit" loading={loadingUser}>
            {isEdit ? "Actualizar" : "Guardar"}
          </AppButton>
        </ActionsRow>
      </TabPanelContent>
    </form>
  );
};
