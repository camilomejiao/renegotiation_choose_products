export const parseStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (error) {
    return {};
  }
};

export const resolveCurrentUserId = ({ auth, storedUser }) =>
  auth?.seg_usuario ??
  storedUser?.seg_usuario ??
  auth?.id ??
  storedUser?.id ??
  auth?.user_id ??
  storedUser?.user_id ??
  null;

export const normalizeSuppliersRows = (payload) => {
  const rows = payload?.data?.proveedores || [];

  return rows.map((row) => ({
    id: Number(row?.id),
    nombre: `${row?.nombre ?? ""} ${row?.nit ?? ""}`.trim(),
    identificacion: row?.nit ?? "",
    email: row?.correo ?? "",
    telefono: row?.telefono ? String(row.telefono) : "",
  }));
};

export const normalizeRolesRows = (payload) => {
  const rows = payload?.data?.roles || [];

  return rows.map((row) => ({
    id: Number(row?.id),
    nombre: row?.nombre ?? "",
  }));
};

export const buildRoleOptions = (roles) =>
  roles.map((role) => ({
    value: role.id,
    label: role.nombre,
  }));

export const buildSupplierOptions = (suppliers) =>
  suppliers.map((supplier) => ({
    value: supplier.id,
    label: supplier.nombre,
    supplier,
  }));

export const mapUserToFormValues = (user) => ({
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
});

export const mapSupplierToFormOption = (supplierData) => ({
  id: Number(supplierData.id),
  nombre: supplierData?.nombre ?? "",
  identificacion: supplierData?.nit ?? "",
  email: supplierData?.correo ?? "",
  telefono: supplierData?.telefono ? String(supplierData.telefono) : "",
});
