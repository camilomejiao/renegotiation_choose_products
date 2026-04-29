import { Link } from "react-router-dom";

import imgPeople from "../../../assets/image/addProducts/people1.jpg";
import { PasswordChangeDialog } from "../../../components/layout/shared/Modals/PasswordChangeDialog";
import { HeaderImage } from "../../../components/layout/shared/header_image/HeaderImage";
import { AppTabs } from "../../../shared/ui/tabs";
import { Page } from "../../../shared/ui/page";
import { useUserFormScreen } from "../model/useUserFormScreen";
import { UserFormSkeleton } from "./UserFormSkeleton";
import { UserFormAlerts } from "./UserFormAlerts";
import { UserPersonalInfoForm } from "./UserPersonalInfoForm";
import { UserSecurityTab } from "./UserSecurityTab";
import { FormCard, MainContainer } from "./UserFormWidget.styles";

export const UserFormWidget = () => {
  const {
    activeProfileTab,
    canEditAllFields,
    formik,
    getFieldStatus,
    handleCancel,
    handleOpenPasswordDialog,
    handlePasswordSaved,
    handleProfileTabChange,
    handleSelectSupplier,
    handleSubmit,
    handleToggleSupplier,
    isEdit,
    loadError,
    loadingFormData,
    loadingPasswordUpdate,
    loadingRoles,
    loadingSuppliers,
    loadingUser,
    mustChangePassword,
    passwordValidity,
    pwdOpen,
    roleOptions,
    selectedRoleOption,
    selectedSupplierOption,
    setPwdOpen,
    showManagementActions,
    showPasswordValidityWarning,
    shouldForcePasswordScreen,
    supplierOptions,
  } = useUserFormScreen();

  const formTitle = isEdit ? (showManagementActions ? "Editar usuario" : "Mi perfil") : "Crear usuario";
  const formDescription = isEdit
    ? showManagementActions
      ? "Aquí puedes actualizar la información del usuario."
      : "Actualiza tu información personal."
    : "Crea un usuario nuevo con la configuración requerida.";

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

  const personalInfoContent = (
    <UserPersonalInfoForm
      canEditAllFields={canEditAllFields}
      formik={formik}
      formTitle={showManagementActions ? "Configuración del usuario" : "Información personal"}
      formDescription={formDescription}
      getFieldStatus={getFieldStatus}
      handleCancel={handleCancel}
      handleSelectSupplier={handleSelectSupplier}
      handleSubmit={handleSubmit}
      handleToggleSupplier={handleToggleSupplier}
      isEdit={isEdit}
      loadingRoles={loadingRoles}
      loadingSuppliers={loadingSuppliers}
      loadingUser={loadingUser}
      mustChangePassword={mustChangePassword}
      roleOptions={roleOptions}
      selectedRoleOption={selectedRoleOption}
      selectedSupplierOption={selectedSupplierOption}
      showInlinePasswordAction={isEdit && showManagementActions}
      showLockedHint={isEdit && !canEditAllFields}
      showManagementActions={showManagementActions}
      supplierOptions={supplierOptions}
      onOpenPasswordDialog={handleOpenPasswordDialog}
    />
  );

  const profileTabs = [
    {
      key: "personal",
      label: "Información personal",
      children: personalInfoContent,
    },
    {
      key: "security",
      label: "Seguridad",
      children: (
        <UserSecurityTab
          loadingPasswordUpdate={loadingPasswordUpdate}
          mustChangePassword={mustChangePassword}
          onOpenPasswordDialog={handleOpenPasswordDialog}
          passwordValidity={passwordValidity}
        />
      ),
    },
  ];

  return (
    <Page
      showPageHeader
      header={pageHeader}
      contentPadding="0"
      minHeight="auto"
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
          <>
            <UserFormAlerts
              handleCancel={handleCancel}
              loadError={loadError}
              mustChangePassword={mustChangePassword}
              passwordValidity={passwordValidity}
              showManagementActions={showManagementActions}
              showPasswordValidityWarning={showPasswordValidityWarning}
            />

            {!loadError && (
              showManagementActions ? (
                <FormCard>{personalInfoContent}</FormCard>
              ) : shouldForcePasswordScreen ? (
                <FormCard>
                  <UserSecurityTab
                    loadingPasswordUpdate={loadingPasswordUpdate}
                    mustChangePassword={mustChangePassword}
                    onOpenPasswordDialog={handleOpenPasswordDialog}
                    passwordValidity={passwordValidity}
                  />
                </FormCard>
              ) : (
                <AppTabs
                  tabsProps={{
                    activeKey: activeProfileTab,
                    onChange: handleProfileTabChange,
                    items: profileTabs,
                  }}
                />
              )
            )}
          </>
        )}

        <PasswordChangeDialog
          open={pwdOpen}
          onClose={() => setPwdOpen(false)}
          onSave={handlePasswordSaved}
          loading={loadingPasswordUpdate}
          minLength={8}
        />
      </MainContainer>
    </Page>
  );
};

export default UserFormWidget;
