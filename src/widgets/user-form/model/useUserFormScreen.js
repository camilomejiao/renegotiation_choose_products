import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
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

const baseInitialValues = {
  isSupplier: false,
  supplier: null,
  supplier_id: "",
  name: "",
  last_name: "",
  identification_number: "",
  cellphone: "",
  email: "",
  role: null,
  username: "",
  password: "",
  active: true,
};

const buildValidationSchema = ({ isEdit }) =>
  yup.object().shape({
    isSupplier: yup.boolean().optional(),
    supplier_id: yup
      .string()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .when("isSupplier", {
        is: true,
        then: (schema) => schema.required("Selecciona un proveedor"),
        otherwise: (schema) => schema.notRequired().strip(),
      }),
    username: yup.string().trim().required("El usuario es requerido"),
    password: yup
      .string()
      .trim()
      .when([], (_, schema) =>
        isEdit ? schema.notRequired() : schema.required("La contraseña es requerida")
      ),
    identification_number: yup
      .string()
      .trim()
      .when("isSupplier", {
        is: true,
        then: (schema) =>
          schema.matches(/^[0-9-]+$/, "Solo dígitos o guiones").notRequired(),
        otherwise: (schema) =>
          schema
            .matches(/^\d+$/, "Solo dígitos")
            .required("La cédula/NIT es requerida"),
      }),
    name: yup.string().trim().when("isSupplier", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("El nombre es requerido"),
    }),
    last_name: yup.string().trim().when("isSupplier", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("El apellido es requerido"),
    }),
    email: yup.string().trim().email("Email inválido").when("isSupplier", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("El email es requerido"),
    }),
    cellphone: yup.string().trim().matches(/^\d+$/, "Solo dígitos").when("isSupplier", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("El telefono es requerido"),
    }),
    role: yup
      .number()
      .transform((value, originalValue) =>
        originalValue === "" || originalValue == null ? NaN : Number(originalValue)
      )
      .typeError("Selecciona un rol")
      .required("Selecciona un rol"),
    active: yup.boolean().required("Activo o inactivo"),
  });

const parseStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    return {};
  }
};

const normalizeSuppliersRows = (payload) => {
  const rows = payload?.data?.proveedores || [];

  return rows.map((row) => ({
    id: Number(row?.id),
    nombre: `${row?.nombre ?? ""} ${row?.nit ?? ""}`.trim(),
    identificacion: row?.nit ?? "",
    email: row?.correo ?? "",
    telefono: row?.telefono ? String(row.telefono) : "",
  }));
};

const normalizeRolesRows = (payload) => {
  const rows = payload?.data?.roles || [];

  return rows.map((row) => ({
    id: Number(row?.id),
    nombre: row?.nombre ?? "",
  }));
};

const buildRoleOptions = (roles) =>
  roles.map((role) => ({
    value: role.id,
    label: role.nombre,
  }));

const buildSupplierOptions = (suppliers) =>
  suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.nombre,
    supplier,
  }));

export const useUserFormScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { auth, loading: authLoading, logout } = useAuth();

  const isSelfEditRoute = location.pathname.endsWith("/edit-user");
  const isEdit = Boolean(id) || isSelfEditRoute;
  const isAdmin = auth?.rol_id === RolesEnum.ADMIN;
  const storedUser = useMemo(() => parseStoredUser(), []);
  const currentUserId =
    auth?.seg_usuario ??
    storedUser?.seg_usuario ??
    auth?.id ??
    storedUser?.id ??
    auth?.user_id ??
    storedUser?.user_id ??
    null;
  const targetUserId = id || (isSelfEditRoute ? currentUserId : null);
  const canEditAllFields = !isEdit || isAdmin;
  const showManagementActions = !isSelfEditRoute;

  const [initialValues, setInitialValues] = useState(baseInitialValues);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [suppliersOptions, setSuppliersOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [pendingPassword, setPendingPassword] = useState("");

  const validationSchema = useMemo(
    () => buildValidationSchema({ isEdit }),
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

        let passwordUpdated = true;
        if (isEdit && pendingPassword) {
          const passwordResponse = await userServices.updatePassword(targetUserId, {
            password_nueva: pendingPassword,
            password_confirmacion: pendingPassword,
          });

          passwordUpdated = passwordResponse?.status === ResponseStatusEnum.OK;
        }

        if (passwordUpdated) {
          AlertComponent.success(
            isEdit ? "Usuario actualizado correctamente" : "Usuario creado correctamente"
          );
        } else {
          AlertComponent.warning(
            "Actualización parcial",
            "Los datos se guardaron, pero la contraseña no pudo actualizarse."
          );
        }

        if (isSelfEditRoute) {
          if (pendingPassword && passwordUpdated) {
            logout();
            navigate("/login", { replace: true });
            return;
          }

          setPendingPassword("");
          formik.setFieldValue("password", "", false);
          await fetchUserData(targetUserId);
          return;
        }

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

  const upsertSupplierOption = (supplier) => {
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
  };

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

  const fetchUserData = async (userId) => {
    if (!userId) {
      setLoadError("No se encontró el usuario autenticado para editar.");
      return;
    }

    try {
      setLoadingUser(true);
      setLoadError("");
      const response = await userServices.getUserById(userId);
      const user = response?.data?.data?.usuario;

      if (response?.status !== ResponseStatusEnum.OK || !user) {
        setLoadError("No fue posible cargar la información del usuario.");
        return;
      }

      const nextValues = {
        isSupplier: Boolean(user?.proveedor_id),
        supplier: null,
        supplier_id: user?.proveedor_id ? String(user.proveedor_id) : "",
        name: user?.nombre ?? "",
        last_name: user?.apellido ?? "",
        identification_number: user?.numero_identificacion || user?.proveedor_nit || "",
        cellphone: user?.telefono ? String(user.telefono) : "",
        email: user?.email ?? "",
        role: user?.rol_id ? Number(user.rol_id) : null,
        username: user?.usuario ?? "",
        password: "",
        active: Boolean(user?.activo),
      };

      setInitialValues(nextValues);
      setPendingPassword("");

      if (!user?.proveedor_id) {
        return;
      }

      const supplierResponse = await supplierServices.getSupplierById(user.proveedor_id);
      const supplierData = supplierResponse?.data?.data?.proveedor;

      if (supplierResponse?.status !== ResponseStatusEnum.OK || !supplierData) {
        return;
      }

      const supplier = {
        id: Number(supplierData.id),
        nombre: supplierData?.nombre ?? "",
        identificacion: supplierData?.nit ?? "",
        email: supplierData?.correo ?? "",
        telefono: supplierData?.telefono ? String(supplierData.telefono) : "",
      };

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
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (isEdit) {
      fetchUserData(targetUserId);
      return;
    }

    setInitialValues(baseInitialValues);
    setLoadError("");
    setPendingPassword("");
  }, [authLoading, isEdit, targetUserId]);

  const handleToggleSupplier = (checked) => {
    formik.setFieldValue("isSupplier", checked);

    if (!checked) {
      formik.setValues((prev) => ({
        ...prev,
        supplier: null,
        supplier_id: "",
        role: canEditAllFields ? prev.role : Number(RolesEnum.SUPPLIER),
      }));
      return;
    }

    formik.setFieldValue("role", Number(RolesEnum.SUPPLIER));
  };

  const handleSelectSupplier = (option) => {
    const supplier = option?.supplier ?? null;
    formik.setFieldValue("supplier", supplier);
    formik.setFieldValue("supplier_id", option?.value ?? "");

    if (supplier) {
      hydrateSupplierFields(supplier);
    }
  };

  const handlePasswordSaved = (password) => {
    setPendingPassword(password);
    setPwdOpen(false);
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
    handlePasswordSaved,
    handleSelectSupplier,
    handleSubmit: formik.handleSubmit,
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
    supplierOptions: suppliersOptions,
  };
};
