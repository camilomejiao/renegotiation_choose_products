import * as yup from "yup";
import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import {
    FormControlLabel,
    Switch,
    TextField,
    Autocomplete,
    CircularProgress,
} from "@mui/material";
import {Button, Spinner} from "react-bootstrap";

// Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";
// Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import { PasswordChangeDialog } from "../../../shared/Modals/PasswordChangeDialog";

// Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Enums
import { ResponseStatusEnum, RolesEnum } from "../../../../../helpers/GlobalEnum";

//Services
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
import { userServices } from "../../../../../helpers/services/UserServices";

//
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
            .transform((v, o) => (o === "" ? undefined : v))
            .when("isSupplier", {
                is: true,
                then: (schema) => schema.required("Selecciona un proveedor"),
                otherwise: (schema) => schema.notRequired().strip(),
            }),

        username: yup.string().trim().required("El username es requerido"),
        password: yup
            .string()
            .trim()
            .when([], (__, schema) =>
                isEdit ? schema.notRequired() : schema.required("La contraseña es requerida")
            ),

        identification_number: yup
            .string()
            .trim()
            .when("isSupplier", {
                is: true,
                then: (s) => s.matches(/^[0-9-]+$/, "Solo dígitos o guiones").notRequired(),
                otherwise: (s) => s.matches(/^\d+$/, "Solo dígitos").required("La cédula/NIT es requerida"),
            }),
        name: yup
            .string()
            .trim()
            .when("isSupplier", {
                is: true,
                then: (s) => s.notRequired(),
                otherwise: (s) => s.required("El nombre es requerido"),
            }),
        last_name: yup
            .string()
            .trim()
            .when("isSupplier", {
                is: true,
                then: (s) => s.notRequired(),
                otherwise: (s) => s.required("El apellido es requerido"),
            }),
        email: yup
            .string()
            .trim()
            .email("Email inválido")
            .when("isSupplier", {
                is: true,
                then: (s) => s.notRequired(),
                otherwise: (s) => s.required("El email es requerido"),
            }),
        cellphone: yup
            .string()
            .trim()
            .matches(/^\d+$/, "Solo dígitos")
            .when("isSupplier", {
                is: true,
                then: (s) => s.notRequired(),
                otherwise: (s) => s.required("El teléfono es requerido"),
            }),

        role: yup
            .number()
            .transform((v, o) => (o === "" || o == null ? NaN : Number(o)))
            .typeError("Selecciona un rol")
            .required("Selecciona un rol"),

        active: yup.boolean().required("Activo o Inactivo"),
    });

export const CreateUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [initialValues, setInitialValues] = useState(baseInitialValues);
    const [loadingUser, setLoadingUser] = useState(false);

    // catálogo de proveedores
    const [suppliersOptions, setSuppliersOptions] = useState([]);
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);

    const [roleOptions, setRoleOptions] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);

    const [pwdOpen, setPwdOpen] = useState(false);

    const validationSchema = useMemo(() => buildValidationSchema({ isEdit }), [isEdit]);

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                let proveedor_id = values.isSupplier ? Number(values.supplier_id) : undefined;
                const formattedValues = {
                    nombre: values.name?.trim(),
                    apellido: values.last_name?.trim(),
                    email: values.email?.trim(),
                    telefono: values.cellphone?.trim(),
                    numero_identificacion: values.identification_number?.trim(),
                    usuario: values.username?.trim(),
                    password: values.password?.trim() || undefined, // evita mandar vacío
                    rol_id: values.role,
                    activo: Boolean(values.active),
                    proveedor_id,
                };

                 const response= isEdit
                   ? await userServices.updateUser(id, formattedValues)
                   : await userServices.createUser(formattedValues);

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(response.status)) {
                    AlertComponent.success(isEdit ? "Usuario actualizado correctamente" : "Usuario creado correctamente");
                    navigate("/admin/management");
                } else {
                    AlertComponent.warning("Error", response?.data?.errors?.[0]?.title ?? "No se pudo guardar");
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            }
        },
    });

    //Cargar proveedores
    const loadSuppliers = async () => {
        try {
            setLoadingSuppliers(true);
            const { data, status } = await supplierServices.getSuppliers();
            if (status === ResponseStatusEnum.OK) {
                const resp = await normalizeSuppliersRows(data);
                setSuppliersOptions(resp);
            } else {
                setSuppliersOptions([]);
            }
        } catch (error) {
            console.error("Error cargando proveedores:", error);
            setSuppliersOptions([]);
        } finally {
            setLoadingSuppliers(false);
        }
    }

    const normalizeSuppliersRows = async (payload) => {
        const rows = payload?.data?.proveedores;
        return rows.map((row) => ({
            id: Number(row?.id),
            nombre:  `${row?.nombre ?? ""} ${row?.nit ?? ""}`.trim(),
            identificacion: row?.nit,
            email: row?.correo,
        }));
    }

    const getRoles = async () => {
        try {
            setLoadingRoles(true);
            const {data, status} = await userServices.getRoles();
            if (status === ResponseStatusEnum.OK) {
                const resp = await normalizeRolesRows(data);
                setRoleOptions(resp);
            } else {
                setRoleOptions([]);
            }
        } catch (error) {
            console.error("Error cargando proveedores:", error);
            setRoleOptions([]);
        } finally {
            setLoadingRoles(false);
        }
    }

    const normalizeRolesRows = async (payload) => {
        const rows = payload?.data?.roles;
        return rows.map((row) => ({
            id: Number(row?.id),
            nombre: row?.nombre,
        }));
    }

    //Buscamos el proveedor
    const upsertSupplierOption = (prov) => {
        if (!prov) return;
        setSuppliersOptions((prev) => {
            const exists = prev.some((p) => Number(p.id) === Number(prov.id));
            return exists ? prev : [...prev, prov];
        });
    };

    // Edición: cargar usuario
    const fetchUserData = async (id) => {
        try {
            setLoadingUser(true);
            const { data, status } = await userServices.getUserById(id);
            const datResp = data?.data?.usuario;

            if (status === ResponseStatusEnum.OK && datResp) {
                setInitialValues({
                    isSupplier: Boolean(datResp?.proveedor_id),
                    supplier: null,
                    supplier_id: datResp?.proveedor_id ? String(datResp?.proveedor_id) : "",
                    name: datResp?.nombre ?? "",
                    last_name: datResp?.apellido ?? "",
                    identification_number: datResp?.numero_identificacion
                        ? datResp?.numero_identificacion
                        : (datResp?.proveedor_nit ?? ""),
                    cellphone: datResp?.telefono ? String(datResp?.telefono) : "",
                    email: datResp?.email ?? "",
                    username: datResp?.usuario ?? "",
                    password: "",
                    role: datResp?.rol_id ?? null,
                    active: Boolean(datResp?.activo),
                });

                // Si este usuario está asociado a proveedor, trae el proveedor y selecciónalo
                if (datResp?.proveedor_id) {
                    //Traemos el provvedor por id
                    const { data: provData, status: provStatus } = await supplierServices.getSupplierById(datResp.proveedor_id);

                    if (provStatus === ResponseStatusEnum.OK && provData) {
                        //
                        const prov = {
                            id: Number(provData?.data?.proveedor?.id),
                            nombre: provData?.data?.proveedor?.nombre ?? "",
                            identificacion: provData?.data?.proveedor?.nit ?? "",
                            email: provData?.data?.proveedor?.correo ?? "",
                        };

                        //Enviamos la data del proveedor
                        formik.setFieldValue("supplier", prov, false);
                        formik.setFieldValue("supplier_id", String(prov.id), false);
                        upsertSupplierOption(prov);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            AlertComponent.error("Error cargando usuario");
        } finally {
            setLoadingUser(false);
        }
    };

    // Al seleccionar proveedor del Autocomplete
    const handleSelectSupplier = (prov) => {
        formik.setFieldValue("supplier", prov);
        formik.setFieldValue("supplier_id", prov ? String(prov.id) : undefined);
        formik.setFieldTouched("supplier_id", true, false);

        if (prov) {
            formik.setFieldValue("identification_number", prov.identificacion || "");
            formik.setFieldValue("name", prov.nombre || "");
            formik.setFieldValue("last_name", prov.nombre || "");
            formik.setFieldValue("email", prov.email || "");
            formik.setFieldValue("cellphone", prov.telefono || "");
            formik.setFieldValue("role", Number(RolesEnum.SUPPLIER));
            AlertComponent.info("", "Proveedor seleccionado. Completa usuario y contraseña.");
        } else {
            formik.setFieldValue("role", null);
        }
    };

    // Toggle proveedor: muestra/oculta select y limpia campos si se apaga
    const handleToggleSupplier = async (checked) => {
        formik.setFieldValue("isSupplier", checked);

        if (checked) {
            if (suppliersOptions.length === 0) await loadSuppliers();
            handleSelectSupplier(null); // limpia selección previa
        } else {
            // limpia campos dependientes
            formik.setFieldValue("supplier", null);
            formik.setFieldValue("supplier_id", undefined); // mejor undefined que ""
            formik.setFieldTouched("supplier_id", false);
            formik.setFieldError("supplier_id", undefined);

            formik.setFieldValue("identification_number", "");
            formik.setFieldValue("name", "");
            formik.setFieldValue("last_name", "");
            formik.setFieldValue("email", "");
            formik.setFieldValue("cellphone", "");
        }
    };

    const handlePasswordSaved = async (newPwd) => {
        formik.setFieldValue("password", newPwd);
        setPwdOpen(false);
        try {
            setLoadingUser(true);
            const payload =  {
                password_nueva: newPwd,
                password_confirmacion: newPwd
            }
            const { status} = await userServices.updatePassword(id, payload);
            if (status === ResponseStatusEnum.OK) {
                AlertComponent.success("Contraseña modificada exitosamente!");
            }

            if (status !== ResponseStatusEnum.OK) {
                AlertComponent.error("Hubo un error al realizar el cambio de contraseña");
            }
        } catch (error) {
            console.log(error);
            AlertComponent.error("Hubo un error al realizar el cambio de contraseña");
        } finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        getRoles();
        if (isEdit) {
            fetchUserData(id);
        }
    }, [isEdit]);

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={isEdit ? "Editar usuario" : "¡Registra tus usuarios!"}
                    bannerIcon={""}
                    backgroundIconColor={""}
                    bannerInformation={""}
                    backgroundInformationColor={""}
                />

                {loadingUser && (
                    <div className="overlay">
                        <Spinner animation="border" variant="success" />
                        <div className="loader">Cargando...</div>
                    </div>
                )}

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        const errs = await formik.validateForm();
                        if (Object.keys(errs).length) {
                            formik.setTouched(Object.fromEntries(Object.keys(errs).map(k => [k, true])));
                            console.log("Errores de validación:", errs);
                            AlertComponent.warning("Revisa los campos obligatorios.");
                            return;
                        }
                        formik.handleSubmit(e);
                    }}
                  className="container"
                >
                    <div className="row g-3 mt-4">
                        {/* Switch proveedor */}
                        <div className="col-md-12 d-flex align-items-center">
                            <FormControlLabel
                                label="¿Usuario es proveedor?"
                                labelPlacement="start"
                                control={
                                    <Switch
                                        color="warning"
                                        checked={formik.values.isSupplier}
                                        onChange={(e) => handleToggleSupplier(e.target.checked)}
                                    />
                                }
                            />
                        </div>

                        {/* Select/Autocomplete de proveedores (solo si esSupplier) */}
                        {formik.values.isSupplier && (
                            <div className="col-12">
                                <Autocomplete
                                    multiple={false}
                                    options={suppliersOptions}
                                    value={formik.values.supplier}
                                    onChange={(_, value) => handleSelectSupplier(value)}
                                    openOnFocus
                                    getOptionLabel={(o) => (o?.nombre ?? "").trim()}
                                    isOptionEqualToValue={(o, v) => o?.id === v?.id}
                                    loading={loadingSuppliers}
                                    noOptionsText={loadingSuppliers ? "Cargando..." : "Sin resultados"}
                                    loadingText="Cargando..."
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Selecciona proveedor"
                                            placeholder="Escribe para filtrar..."
                                            error={Boolean(formik.touched.supplier_id && formik.errors.supplier_id)}
                                            helperText={formik.touched.supplier_id && formik.errors.supplier_id}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loadingSuppliers ? <CircularProgress size={18} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />

                            </div>
                        )}

                        {/* Nombre */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Nombre"
                                {...formik.getFieldProps("name")}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                InputProps={{
                                    readOnly: false,
                                }}
                            />
                        </div>

                        {/* Número de identificación */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Número de identificación"
                                {...formik.getFieldProps("identification_number")}
                                error={formik.touched.identification_number && Boolean(formik.errors.identification_number)}
                                helperText={formik.touched.identification_number && formik.errors.identification_number}
                            />
                        </div>

                        {/* Apellido */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Apellido"
                                {...formik.getFieldProps("last_name")}
                                error={formik.touched.last_name && Boolean(formik.errors.last_name)}
                                helperText={formik.touched.last_name && formik.errors.last_name}
                            />
                        </div>

                        {/* Email */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Email"
                                {...formik.getFieldProps("email")}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Teléfono"
                                {...formik.getFieldProps("cellphone")}
                                error={formik.touched.cellphone && Boolean(formik.errors.cellphone)}
                                helperText={formik.touched.cellphone && formik.errors.cellphone}
                            />
                        </div>

                        {/* Username */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Usuario"
                                {...formik.getFieldProps("username")}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                helperText={formik.touched.username && formik.errors.username}
                            />
                        </div>

                        {/* Password: botón en edición / input en creación */}
                        {isEdit ? (
                            <div className="col-md-6 d-flex align-items-end gap-2">
                                <Button
                                    variant="outline-primary"
                                    type="button"
                                    onClick={() => setPwdOpen(true)}
                                >
                                    Cambiar contraseña
                                </Button>
                                {formik.values.password ? (
                                    <span className="badge bg-success">Nueva contraseña lista</span>
                                ) : (
                                    <span className="badge bg-secondary">Sin cambios</span>
                                )}
                            </div>
                        ) : (
                            <div className="col-md-6">
                                <TextField
                                    type="password"
                                    fullWidth
                                    label="Contraseña"
                                    {...formik.getFieldProps("password")}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </div>
                        )}

                        <div className="col-md-6">
                            <Autocomplete
                                options={roleOptions}
                                value={roleOptions.find(o => o.id === formik.values.role) || null}
                                onChange={(_, value) => formik.setFieldValue("role", value?.id ?? null)}
                                getOptionLabel={(o) => (o?.nombre ?? "").trim()}
                                isOptionEqualToValue={(o, v) => o?.id === v?.id}
                                loading={loadingRoles}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Selecciona Rol"
                                        placeholder="Escribe para filtrar..."
                                        error={Boolean(formik.touched.role && formik.errors.role)}
                                        helperText={formik.touched.role && formik.errors.role}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingRoles ? <CircularProgress size={18} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </div>

                        {/* Activo */}
                        <div className="col-md-6 d-flex align-items-center">
                            <FormControlLabel
                                label="Activo"
                                labelPlacement="start"
                                control={
                                    <Switch
                                        color="success"
                                        checked={formik.values.active}
                                        onChange={(e) => formik.setFieldValue("active", e.target.checked)}
                                    />
                                }
                            />
                        </div>
                    </div>

                    {/* Modal de contraseña */}
                    <PasswordChangeDialog
                        open={pwdOpen}
                        onClose={() => setPwdOpen(false)}
                        onSave={handlePasswordSaved}
                        minLength={8}
                    />

                    <div className="text-end mt-4 d-flex gap-2 justify-content-end">
                        <Button variant="outline-success"
                                color="success"
                                type="submit"
                                disabled={loadingUser}
                        >
                            {isEdit ? "Actualizar" : "Guardar"}
                        </Button>
                        <Button variant="outline-danger"
                                type="button"
                                onClick={() => navigate("/admin/management")}
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};
