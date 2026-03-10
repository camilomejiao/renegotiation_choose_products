import { Alert, Col, Row, Tag, Typography } from "antd";
import { Link } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { PasswordChangeDialog } from "../../../components/layout/shared/Modals/PasswordChangeDialog";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { AppButton } from "../../../shared/ui/button";
import { AppInput } from "../../../shared/ui/input";
import { Page } from "../../../shared/ui/page";
import { AppSelect } from "../../../shared/ui/select";
import { AppSwitch } from "../../../shared/ui/switch";
import { useUserFormScreen } from "../model/useUserFormScreen";
import { UserFormSkeleton } from "./UserFormSkeleton";
import {
  ActionsRow,
  FieldContent,
  FieldControl,
  FieldError,
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
} from "./UserFormWidget.styles";

const { Title } = Typography;

export const UserFormWidget = () => {
  const {
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
    loadingFormData,
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
  } = useUserFormScreen();

  const shouldHideRestrictedProfileSections = isEdit && !canEditAllFields && !showManagementActions;
  const formTitle = isEdit ? (showManagementActions ? "Editar usuario" : "Mi perfil") : "Crear usuario";
  const pageHeader = showManagementActions
    ? {
        title: "Usuarios",
        breadcrumbs: [
          { title: <Link to="/admin">Inicio</Link> },
          { title: <Link to="/admin/management">Usuarios</Link> },
          { title: formTitle },
        ],
      }
    : {
        title: "Mi perfil",
        breadcrumbs: [
          { title: <Link to="/admin">Inicio</Link> },
          { title: "Mi perfil" },
        ],
      };

  return (
    <Page
      showPageHeader
      header={pageHeader}
      contentPadding="0"
      minHeight="auto"
      headerPaddingTop="36px"
      headerMarginBottom="12px"
    >
      <MainContainer>
        <HeaderImage
          imageHeader={imgPeople}
          titleHeader={isEdit ? (showManagementActions ? "Editar usuario" : "Mi perfil") : "Registra tus usuarios"}
          bannerIcon=""
          backgroundIconColor=""
          bannerInformation=""
          backgroundInformationColor=""
        />

        {loadingFormData ? (
          <UserFormSkeleton
            isEdit={isEdit}
            showLockedHint={isEdit && !canEditAllFields}
          />
        ) : (
          <FormCard>
            <FormHeader>
              <Row gutter={[16, 16]} align="top">
                <Col xs={24} sm={24} md={24} lg={14} xl={16} xxl={18}>
                  <div>
                    <Title level={3}>{isEdit ? "Configuración del usuario" : "Nuevo usuario"}</Title>
                    <FormMeta>
                      {isEdit
                        ? "Aquí puedes actualizar tu información personal y cambiar tu contraseña."
                        : "Crea un usuario nuevo con la configuración requerida."}
                    </FormMeta>
                  </div>
                </Col>

                {isEdit && !canEditAllFields && (
                  <Col xs={24} sm={24} md={24} lg={10} xl={8} xxl={6}>
                    <LockedFieldHint>
                      Puedes editar solo tu nombre, apellido, teléfono y contraseña.
                    </LockedFieldHint>
                  </Col>
                )}
              </Row>
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
                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
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

                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
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

                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
                      <FieldControl>
                        <FieldLabel>Número de identificación</FieldLabel>
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
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
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
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
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

                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
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
                    </Col>

                    <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
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
                      <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
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

                    {isEdit && (
                      <Col xs={24} sm={24} md={12} lg={12} xl={8} xxl={8}>
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
                      </Col>
                    )}
                  </Row>
                </FormSection>

                <Row gutter={[12, 12]} justify="end">
                  <Col xs={24} sm={12} md="auto" lg="auto" xl="auto" xxl="auto">
                    <ActionsRow>
                      <AppButton variant="secondary" onClick={handleCancel}>
                        Cancelar
                      </AppButton>
                    </ActionsRow>
                  </Col>
                  <Col xs={24} sm={12} md="auto" lg="auto" xl="auto" xxl="auto">
                    <ActionsRow>
                      <AppButton htmlType="submit" loading={loadingUser}>
                        {isEdit ? "Actualizar" : "Guardar"}
                      </AppButton>
                    </ActionsRow>
                  </Col>
                </Row>
              </form>
            )}
          </FormCard>
        )}

        <PasswordChangeDialog
          open={pwdOpen}
          onClose={() => setPwdOpen(false)}
          onSave={handlePasswordSaved}
          minLength={8}
        />
      </MainContainer>
    </Page>
  );
};
