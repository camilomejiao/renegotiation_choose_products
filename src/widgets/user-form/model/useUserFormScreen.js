import { useCallback, useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AlertComponent from "../../../helpers/alert/AlertComponent";
import {
  ResponseStatusEnum,
  RolesEnum,
} from "../../../helpers/GlobalEnum";
import { supplierServices } from "../../../helpers/services/SupplierServices";
import { userServices } from "../../../helpers/services/UserServices";
import useAuth from "../../../hooks/useAuth";
import {
  hasPasswordValidityWarning,
} from "../../../shared/auth/lib/authSession";
import { getClientPublicIp } from "../../../shared/lib/network";
import {
  buildRoleOptions,
  buildSupplierOptions,
  mapSupplierToFormOption,
  mapUserToFormValues,
  normalizeRolesRows,
  normalizeSuppliersRows,
  resolveCurrentUserId,
} from "../lib/userFormMappers";
import {
  baseInitialValues,
  buildUserFormValidationSchema,
} from "../lib/userFormSchema";
import { buildPasswordUpdatePayload } from "./buildPasswordUpdatePayload";

export const useUserFormScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const {
    auth,
    loading: authLoading,
    logout,
    markPasswordChangeComplete,
  } = useAuth();

  const isSelfEditRoute = location.pathname.endsWith("/edit-user");
  const isEdit = Boolean(id) || isSelfEditRoute;
  const isAdmin = auth?.rol_id === RolesEnum.ADMIN;
  const currentUserId = resolveCurrentUserId({ auth });
  const targetUserId = id || (isSelfEditRoute ? currentUserId : null);
  const canEditAllFields = !isEdit || (isAdmin && !isSelfEditRoute);
  const showManagementActions = !isSelfEditRoute;
  const mustChangePassword = auth?.must_change_password === true;
  const shouldForcePasswordScreen = isSelfEditRoute && mustChangePassword;

  const [initialValues, setInitialValues] = useState(baseInitialValues);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingFormData, setLoadingFormData] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [suppliersOptions, setSuppliersOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [loadingPasswordUpdate, setLoadingPasswordUpdate] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [activeProfileTab, setActiveProfileTab] = useState("personal");

  const validationSchema = useMemo(
    () => buildUserFormValidationSchema({ isEdit }),
    [isEdit]
  );

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const supplierId = values.isSupplier ? Number(values.supplier_id) : undefined;
      const formattedValues = {
        nombre: values.name?.trim(),
        apellido: values.last_name?.trim(),
        email: values.email?.trim(),
        telefono: values.cellphone?.trim(),
        numero_identificacion: values.identification_number?.trim(),
        usuario: values.username?.trim(),
        password: !isEdit ? values.password?.trim() : undefined,
        rol_id: values.role,
        activo: Boolean(values.active),
        proveedor_id: supplierId,
      };

      try {
        setLoadingUser(true);
        setLoadError("");

        const response = isEdit
          ? await userServices.updateUser(targetUserId, formattedValues)
          : await userServices.createUser(formattedValues);

        if (![ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(response?.status)) {
          AlertComponent.warning(
            "Error",
            response?.data?.errors?.[0]?.title ?? "No se pudo guardar"
          );
          return;
        }

        if (isSelfEditRoute) {
          setLoadingUser(false);
          await AlertComponent.success("Usuario actualizado correctamente");
          await fetchUserData(targetUserId);
          return;
        }

        setLoadingUser(false);
        await AlertComponent.success(
          isEdit ? "Usuario actualizado correctamente" : "Usuario creado correctamente"
        );

        navigate("/admin/management");
      } catch (error) {
        console.error("Error al enviar el formulario:", error);
        AlertComponent.error("Error", "Hubo un error al procesar la solicitud");
      } finally {
        setLoadingUser(false);
      }
    },
  });

  const selectedSupplierOption = useMemo(() => {
    if (!formik.values.supplier) {
      return null;
    }

    return {
      value: formik.values.supplier.id,
      label: formik.values.supplier.nombre,
      supplier: formik.values.supplier,
    };
  }, [formik.values.supplier]);

  const selectedRoleOption = useMemo(() => {
    if (formik.values.role == null) {
      return null;
    }

    return roleOptions.find((option) => Number(option.value) === Number(formik.values.role)) ?? null;
  }, [formik.values.role, roleOptions]);

  const upsertSupplierOption = useCallback((supplier) => {
    if (!supplier) {
      return;
    }

    setSuppliersOptions((previous) => {
      const exists = previous.some((item) => Number(item.value) === Number(supplier.id));
      if (exists) {
        return previous;
      }

      return [
        ...previous,
        {
          value: supplier.id,
          label: supplier.nombre,
          supplier,
        },
      ];
    });
  }, []);

  const hydrateSupplierFields = (supplier) => {
    if (!supplier) {
      return;
    }

    formik.setValues((prev) => ({
      ...prev,
      supplier,
      supplier_id: supplier.id,
      name: supplier.nombre || "",
      last_name: "",
      identification_number: supplier.identificacion || "",
      email: supplier.email || "",
      cellphone: supplier.telefono || "",
      username: prev.username,
      role: Number(RolesEnum.SUPPLIER),
    }));
  };

  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const response = await supplierServices.getSuppliers(1, 1000);
      const rows = normalizeSuppliersRows(response?.data);
      setSuppliersOptions(buildSupplierOptions(rows));
    } catch (error) {
      console.error("Error cargando proveedores:", error);
      AlertComponent.error("Error", "No fue posible cargar los proveedores");
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const response = await userServices.getRoles();
      const rows = normalizeRolesRows(response?.data);
      setRoleOptions(buildRoleOptions(rows));
    } catch (error) {
      console.error("Error cargando roles:", error);
      AlertComponent.error("Error", "No fue posible cargar los roles");
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchUserData = useCallback(async (userId) => {
    if (!userId) {
      setLoadError("No se encontró el usuario autenticado para editar.");
      return;
    }

    try {
      setLoadingFormData(true);
      setLoadError("");
      const response = await userServices.getUserById(userId);
      const user = response?.data?.data?.usuario;

      if (response?.status !== ResponseStatusEnum.OK || !user) {
        setLoadError("No fue posible cargar la información del usuario.");
        return;
      }

      const nextValues = mapUserToFormValues(user);

      setInitialValues(nextValues);

      if (!user?.proveedor_id) {
        return;
      }

      const supplierResponse = await supplierServices.getSupplierById(user.proveedor_id);
      const supplierData = supplierResponse?.data?.data?.proveedor;

      if (supplierResponse?.status !== ResponseStatusEnum.OK || !supplierData) {
        return;
      }

      const supplier = mapSupplierToFormOption(supplierData);

      upsertSupplierOption(supplier);
      setInitialValues((previous) => ({
        ...previous,
        supplier,
        supplier_id: String(supplier.id),
      }));
    } catch (error) {
      console.error("Error cargando usuario:", error);
      setLoadError("No fue posible cargar la información del usuario.");
    } finally {
      setLoadingFormData(false);
    }
  }, [upsertSupplierOption]);

  useEffect(() => {
    if (shouldForcePasswordScreen) {
      return;
    }

    fetchRoles();
    fetchSuppliers();
  }, [shouldForcePasswordScreen]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (shouldForcePasswordScreen) {
      setInitialValues(baseInitialValues);
      setLoadError("");
      setLoadingFormData(false);
      return;
    }

    if (isEdit) {
      fetchUserData(targetUserId);
      return;
    }

    setInitialValues(baseInitialValues);
    setLoadError("");
  }, [authLoading, fetchUserData, isEdit, shouldForcePasswordScreen, targetUserId]);

  useEffect(() => {
    if (!shouldForcePasswordScreen) {
      return;
    }

    setActiveProfileTab((currentTab) =>
      currentTab === "personal" ? "security" : currentTab
    );
    setPwdOpen(true);
  }, [shouldForcePasswordScreen]);

  const handleToggleSupplier = (checked) => {
    const nextValues = {
      ...formik.values,
      isSupplier: checked,
    };

    if (!checked) {
      formik.setValues({
        ...nextValues,
        supplier: null,
        supplier_id: "",
      });
      return;
    }

    formik.setValues({
      ...nextValues,
      role: Number(RolesEnum.SUPPLIER),
    });
  };

  const handleSelectSupplier = (option) => {
    const supplier = option?.supplier ?? null;
    formik.setFieldValue("supplier", supplier);
    formik.setFieldValue("supplier_id", option?.value ?? "");

    if (supplier) {
      hydrateSupplierFields(supplier);
    }
  };

  const handlePasswordSaved = async (password) => {
    if (!targetUserId) {
      AlertComponent.warning(
        "Usuario no disponible",
        "No fue posible determinar el usuario para actualizar la contraseña."
      );
      return;
    }

    try {
      setLoadingPasswordUpdate(true);
      const clientIp = await getClientPublicIp();
      const response = await userServices.updatePassword(
        targetUserId,
        buildPasswordUpdatePayload({
          nextPassword: password,
          clientIp,
        })
      );

      if (response?.status !== ResponseStatusEnum.OK) {
        AlertComponent.warning(
          "Error",
          response?.data?.errors?.[0]?.title ?? "No se pudo actualizar la contraseña"
        );
        return;
      }

      setPwdOpen(false);

      if (isSelfEditRoute) {
        markPasswordChangeComplete();
        await AlertComponent.success(
          "Contraseña actualizada",
          "Tu contraseña se actualizó correctamente. Cerraremos tu sesión para que vuelvas a ingresar."
        );
        logout();
        navigate("/login", { replace: true });
        return;
      }

      await AlertComponent.success("Contraseña actualizada correctamente");
    } catch (error) {
      console.error("Error actualizando contraseña:", error);
      AlertComponent.error("Error", "Hubo un error al actualizar la contraseña");
    } finally {
      setLoadingPasswordUpdate(false);
    }
  };

  const handleOpenPasswordDialog = () => {
    setPwdOpen(true);
  };

  const handleProfileTabChange = (activeKey) => {
    setActiveProfileTab(activeKey);
  };

  const handleCancel = () => {
    if (isSelfEditRoute) {
      navigate("/admin");
      return;
    }

    navigate("/admin/management");
  };

  const getFieldStatus = (fieldName) => {
    if (!formik.touched[fieldName]) {
      return "";
    }

    return formik.errors[fieldName] ? "error" : "";
  };

  return {
    canEditAllFields,
    formik,
    getFieldStatus,
    handleCancel,
    handleOpenPasswordDialog,
    handleProfileTabChange,
    handlePasswordSaved,
    handleSelectSupplier,
    handleSubmit: formik.handleSubmit,
    handleToggleSupplier,
    isEdit,
    loadError,
    loadingFormData,
    loadingRoles,
    loadingSuppliers,
    loadingUser,
    loadingPasswordUpdate,
    mustChangePassword,
    passwordValidity: auth?.password_validity,
    showPasswordValidityWarning:
      !mustChangePassword && hasPasswordValidityWarning(auth),
    shouldForcePasswordScreen,
    activeProfileTab,
    pwdOpen,
    roleOptions,
    selectedRoleOption,
    selectedSupplierOption,
    setPwdOpen,
    showManagementActions,
    supplierOptions: suppliersOptions,
  };
};
