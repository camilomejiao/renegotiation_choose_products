import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AlertComponent from "../../../../../../helpers/alert/AlertComponent";
import {
  ResponseStatusEnum,
  RolesEnum,
} from "../../../../../../helpers/GlobalEnum";
import { supplierServices } from "../../../../../../helpers/services/SupplierServices";
import { userServices } from "../../../../../../helpers/services/UserServices";
import useAuth from "../../../../../../hooks/useAuth";

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
          schema.matches(/^[0-9-]+$/, "Solo digitos o guiones").notRequired(),
        otherwise: (schema) =>
          schema
            .matches(/^\d+$/, "Solo digitos")
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
    email: yup.string().trim().email("Email invalido").when("isSupplier", {
      is: true,
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.required("El email es requerido"),
    }),
    cellphone: yup.string().trim().matches(/^\d+$/, "Solo digitos").when("isSupplier", {
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
    active: yup.boolean().required("Activo o Inactivo"),
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

export const useCreateUserForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { auth, logout } = useAuth();

  const isSelfEditRoute = location.pathname.endsWith("/edit-user");
  const isEdit = Boolean(id) || isSelfEditRoute;
  const isAdmin = auth?.rol_id === RolesEnum.ADMIN;
  const storedUser = useMemo(() => parseStoredUser(), []);
  const currentUserId =
    auth?.seg_usuario ??
    storedUser?.seg_usuario ??
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
            "Actualizacion parcial",
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

    return roleOptions.find((role) => role.value === formik.values.role) || null;
  }, [formik.values.role, roleOptions]);

  const upsertSupplierOption = (supplier) => {
    if (!supplier) {
      return;
    }

    setSuppliersOptions((previous) => {
      const exists = previous.some((item) => Number(item.id) === Number(supplier.id));
      return exists ? previous : [...previous, supplier];
    });
  };

  const validateBeforeSubmit = async () => {
    const errors = await formik.validateForm();

    if (!Object.keys(errors).length) {
      return false;
    }

    formik.setTouched(Object.fromEntries(Object.keys(errors).map((key) => [key, true])));
    AlertComponent.warning("Validacion", "Revisa los campos obligatorios.");
    return true;
  };

  const loadSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const { data, status } = await supplierServices.getSuppliers();

      if (status !== ResponseStatusEnum.OK) {
        setSuppliersOptions([]);
        return;
      }

      setSuppliersOptions(normalizeSuppliersRows(data));
    } catch (error) {
      console.error("Error cargando proveedores:", error);
      setSuppliersOptions([]);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  const getRoles = async () => {
    try {
      setLoadingRoles(true);
      const { data, status } = await userServices.getRoles();

      if (status !== ResponseStatusEnum.OK) {
        setRoleOptions([]);
        return;
      }

      setRoleOptions(buildRoleOptions(normalizeRolesRows(data)));
    } catch (error) {
      console.error("Error cargando roles:", error);
      setRoleOptions([]);
    } finally {
      setLoadingRoles(false);
    }
  };

  const fetchUserData = async (userId) => {
    if (!userId) {
      setLoadError("No se encontro el usuario autenticado para editar.");
      return;
    }

    try {
      setLoadingUser(true);
      setLoadError("");

      const { data, status } = await userServices.getUserById(userId);
      const user = data?.data?.usuario;

      if (status !== ResponseStatusEnum.OK || !user) {
        setLoadError("No fue posible cargar la informacion del usuario.");
        return;
      }

      setInitialValues({
        isSupplier: Boolean(user?.proveedor_id),
        supplier: null,
        supplier_id: user?.proveedor_id ? String(user.proveedor_id) : "",
        name: user?.nombre ?? "",
        last_name: user?.apellido ?? "",
        identification_number: user?.numero_identificacion || user?.proveedor_nit || "",
        cellphone: user?.telefono ? String(user.telefono) : "",
        email: user?.email ?? "",
        username: user?.usuario ?? "",
        password: "",
        role: user?.rol_id ?? null,
        active: Boolean(user?.activo),
      });

      setPendingPassword("");

      if (!user?.proveedor_id) {
        formik.setFieldValue("supplier", null, false);
        formik.setFieldValue("supplier_id", "", false);
        return;
      }

      const { data: supplierData, status: supplierStatus } =
        await supplierServices.getSupplierById(user.proveedor_id);

      if (supplierStatus !== ResponseStatusEnum.OK || !supplierData?.data?.proveedor) {
        return;
      }

      const supplier = {
        id: Number(supplierData.data.proveedor.id),
        nombre: supplierData.data.proveedor.nombre ?? "",
        identificacion: supplierData.data.proveedor.nit ?? "",
        email: supplierData.data.proveedor.correo ?? "",
        telefono: supplierData.data.proveedor.telefono
          ? String(supplierData.data.proveedor.telefono)
          : "",
      };

      upsertSupplierOption(supplier);
      formik.setFieldValue("supplier", supplier, false);
      formik.setFieldValue("supplier_id", String(supplier.id), false);
    } catch (error) {
      console.error(error);
      setLoadError("Error cargando usuario.");
      AlertComponent.error("Error", "Error cargando usuario");
    } finally {
      setLoadingUser(false);
    }
  };

  const handleSelectSupplier = (option) => {
    const supplier = option?.supplier || null;

    formik.setFieldValue("supplier", supplier);
    formik.setFieldValue("supplier_id", supplier ? String(supplier.id) : "");
    formik.setFieldTouched("supplier_id", true, false);

    if (!supplier) {
      formik.setFieldValue("role", null);
      return;
    }

    formik.setFieldValue("identification_number", supplier.identificacion || "");
    formik.setFieldValue("name", supplier.nombre || "");
    formik.setFieldValue("last_name", supplier.nombre || "");
    formik.setFieldValue("email", supplier.email || "");
    formik.setFieldValue("cellphone", supplier.telefono || "");
    formik.setFieldValue("role", Number(RolesEnum.SUPPLIER));
    AlertComponent.info("", "Proveedor seleccionado. Completa usuario y contraseña.");
  };

  const handleToggleSupplier = async (checked) => {
    formik.setFieldValue("isSupplier", checked);

    if (checked) {
      if (suppliersOptions.length === 0) {
        await loadSuppliers();
      }

      handleSelectSupplier(null);
      return;
    }

    formik.setFieldValue("supplier", null);
    formik.setFieldValue("supplier_id", "");
    formik.setFieldTouched("supplier_id", false);
    formik.setFieldError("supplier_id", undefined);
    formik.setFieldValue("identification_number", "");
    formik.setFieldValue("name", "");
    formik.setFieldValue("last_name", "");
    formik.setFieldValue("email", "");
    formik.setFieldValue("cellphone", "");
  };

  const handlePasswordSaved = (newPassword) => {
    setPendingPassword(newPassword);
    formik.setFieldValue("password", newPassword, false);
    setPwdOpen(false);
  };

  const handleCancel = () => {
    if (showManagementActions) {
      navigate("/admin/management");
      return;
    }

    navigate("/admin");
  };

  const getFieldStatus = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName] ? "error" : undefined;

  const handleSubmit = async (event) => {
    event.preventDefault();
    const hasErrors = await validateBeforeSubmit();

    if (hasErrors) {
      return;
    }

    formik.handleSubmit(event);
  };

  useEffect(() => {
    if (id && !isAdmin) {
      navigate("/admin/edit-user", { replace: true });
    }
  }, [id, isAdmin, navigate]);

  useEffect(() => {
    getRoles();
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setLoadError("");
      setInitialValues(baseInitialValues);
      setPendingPassword("");
      return;
    }

    if (id && !isAdmin) {
      return;
    }

    fetchUserData(targetUserId);
  }, [id, isAdmin, isEdit, targetUserId]);

  return {
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
    supplierOptions: buildSupplierOptions(suppliersOptions),
  };
};
