import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import {Autocomplete, Checkbox, CircularProgress, FormControlLabel, Switch, TextField} from "@mui/material";
import { Button, Card } from "react-bootstrap";
import { useFormik } from "formik";

//Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";

//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";

//Enum
import {ResponseStatusEnum, RolesEnum} from "../../../../../helpers/GlobalEnum";

//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Services
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
import { locationServices } from "../../../../../helpers/services/LocationServices";
import { filesServices } from "../../../../../helpers/services/FilesServices";
import { ConfirmationModal } from "../../../shared/Modals/ConfirmationModal";


//
const initialValues = {
    company_name: "",
    nit: "",
    legal_representative: "",
    cellphone: "",
    email: "",
    active: true,
    resolution: "",
    depto: null,
    muni:  null,
    rutFile: null,
    idFile: null,
    accounts: [
        {
            id: null,
            account_type: null,
            account_number: "",
            bank: null,
            bankCertFile: null,
            default_favorite: false
        },
    ],
};

//
const validationSchema = yup.object().shape({
    company_name: yup.string().required("El nombre de la compañia es requerido"),
    nit: yup.string().required("El nit o cedula es requerido"),
    legal_representative: yup.string().required("El nombre del representante es requerido"),
    cellphone: yup.number().required("El telefono es requerido"),
    email: yup.string().email().required("El email es requerido"),
    active: yup.boolean().required("Activo o Inactivo"),
    resolution: yup.string().optional("El número de resolución es opcional"),
    depto: yup
        .object({ id: yup.number().required(), nombre: yup.string().required() })
        .nullable()
        .required("Selecciona un departamento"),
    muni: yup
        .object({ id: yup.number().required(), nombre: yup.string().required() })
        .nullable()
        .required("Selecciona un municipio"),
    accounts: yup
        .array()
        .of(
            yup.object().shape({
                id: yup.mixed().nullable(),
                account_type: yup.string().nullable(),
                account_number: yup.string().nullable(),
                bank: yup.string().nullable(),
                bankCertFile: yup.mixed().nullable(),
                default_favorite: yup.boolean(),
            })
        )
        .min(1, "Debe existir al menos una cuenta bancaria"),
});

const rolesAllow = RolesEnum.ADMIN;

export const CreateSuppliers = () => {

    const { userAuth } = useOutletContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [deptOptions, setDeptOptions] = useState([]);
    const [muniOptions, setMuniOptions] = useState([]);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingMunis, setLoadingMunis] = useState(false);
    const [acountsType, setAcountsType] = useState([]);
    const [banksList, setBanksList] = useState([]);

    //check
    const [showAccountDefaultModal, setShowAccountDefaultModal] = useState(false);
    const [pendingDefault, setPendingDefault] = useState(null);

    //cache para no repetir requests por depto
    const deptsLoadedRef = useRef(false);
    const muniCacheRef = useRef(new Map());

    //
    const loadDepartmentsOnce = async () => {
        if (deptsLoadedRef.current && deptOptions.length) {
            return deptOptions;
        }

        try {
            setLoadingDepts(true);
            const {data, status} = await locationServices.getDeptos();
            if(status === ResponseStatusEnum.OK) {
                setDeptOptions(data);
                deptsLoadedRef.current = true;
                return data;
            }
            return [];
        } catch (error) {
            console.error(error);
            AlertComponent.error("Hubo un error al procesar la solicitud");
        } finally {
            setLoadingDepts(false);
        }
    };

    //
    const refreshMunicipalities = async (selectedDept) => {
        if (!selectedDept) {
            setMuniOptions([]);
            formik.setFieldValue("muni", null);
            return [];
        }

        try {
            setLoadingMunis(true);
            const { data, status } = await locationServices.getMunis(selectedDept.id);
            if (status === ResponseStatusEnum.OK) {
                muniCacheRef.current.set(selectedDept.id, data);
            } else {
                muniCacheRef.current.set(selectedDept.id, []);
            }

            const list = muniCacheRef.current.get(selectedDept.id) || [];
            setMuniOptions(list);

            // si el municipio seleccionado ya no pertenece al nuevo depto, límpialo
            const current = formik.values.muni;
            if (!current || !list.some(m => m.id === current.id)) {
                formik.setFieldValue("muni", null);
            }

            return list;
        } catch (error) {
            console.log(error);
        }  finally {
            setLoadingMunis(false);
        }
    };

    //
    const handleDeptChange = async (_evt, value) => {
        formik.setFieldValue("depto", value);
        await refreshMunicipalities(value);
    };

    //
    const handleMuniChange = (_evt, value) => {
        formik.setFieldValue("muni", value);
    };

    //
    const loadAcountsType = async () => {
        try {
            setLoading(true);
            const {data, status} = await supplierServices.getAcountsType();
            if(status === ResponseStatusEnum.OK) {
                setAcountsType(data);
                return data;
            }
            return [];
        } catch (error) {
            console.error(error);
            AlertComponent.error("Hubo un error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    }

    //
    const loadBanks = async () => {
        try {
            setLoading(true);
            const {data, status} = await supplierServices.getBanks();
            if(status === ResponseStatusEnum.OK) {
                setBanksList(data || []);
                return data || [];
            }
            return [];
        } catch (error) {
            console.error(error);
            AlertComponent.error("Hubo un error al cargar la lista de bancos");
        } finally {
            setLoading(false);
        }
    }

    //
    const handleRemoveAccount = async (index, account) => {
        //Si no teine id quiere decir q es nueva
        console.log(index, account);
        if (!account.id) {
            const next = [...formik.values.accounts];
            next.splice(index, 1);
            formik.setFieldValue("accounts", next);
            return;
        }

        try {
            if (!window.confirm("¿Seguro que deseas eliminar esta cuenta bancaria?")) return;

            setLoading(true);
            setInformationLoadingText("Validando eliminación de la cuenta bancaria...");

            const { status, data } = await supplierServices.validateOrDeleteBankAccount(id, account.id);

            if (status === ResponseStatusEnum.OK) {
                const next = [...formik.values.accounts];
                next.splice(index, 1);
                formik.setFieldValue("accounts", next);
                AlertComponent.success("Cuenta bancaria eliminada correctamente.");
            } else {
                AlertComponent.warning(
                    "No se puede eliminar la cuenta bancaria.",
                    data?.message || "La cuenta está asociada a información de pagos."
                );
            }
        } catch (error) {
            console.error(error);
            AlertComponent.error("Error al validar la eliminación de la cuenta bancaria.");
        } finally {
            setLoading(false);
            setInformationLoadingText("");
        }
    };


    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                setInformationLoadingText('Validando datos');
                let response;

                //CREAR (JSON)
                if (!isEdit) {
                    const payload = {
                        company_name: values.company_name,
                        legal_representative: values.legal_representative,
                        nit: values.nit,
                        correo: values.email,
                        cellphone: values.cellphone,
                        aprobado: values.active,
                        resolucion_aprobacion: values.resolution,
                        fecha_registro: new Date().toISOString().slice(0, 10),
                        depto_id: values.depto?.id ?? null,
                        muni_id: values.muni?.id ?? null,
                    };

                    console.log("payload:", payload);
                    response = await supplierServices.createSupplier(payload);
                }

                //EDITAR (FORMDATA)
                if (isEdit) {
                    const formData = new FormData();

                    // 1. Datos generales
                    formData.append("nombre", values.company_name);
                    formData.append("correo", values.email);
                    formData.append("nit", values.nit);
                    formData.append("nombre_representante",values.legal_representative || "");
                    formData.append("telefono_representante",values.cellphone || "");
                    formData.append("cedula_representante", values.nit || "");
                    formData.append("aprobado", values.active ? "true" : "false");
                    formData.append("resolucion_aprobacion",values.resolution || "");

                    if (values.muni?.id) {
                        formData.append("ubicacion_id", String(values.muni.id));
                    }

                    //VALIDACIÓN: al menos una cuenta favorita
                    const hasFavoriteAccount = (values.accounts).some((acc) => acc.default_favorite === true);

                    if (!hasFavoriteAccount) {
                        AlertComponent.warning("Debe marcar al menos una cuenta bancaria como cuenta favorita por defecto.");
                        return;
                    }

                    // 2. Bancos
                    const bancos = (values.accounts).map((acc) => ({
                        banco_id: acc.id,
                        tipo_cuenta: acc.account_type,
                        numero_cuenta: acc.account_number || "",
                        banco: acc.bank || null,
                        favorita: acc.default_favorite || false
                    }));

                    formData.append("bancos", JSON.stringify(bancos));

                    // 3. Archivos por cuenta
                    (values.accounts || []).forEach((acc, index) => {
                        if (acc.bankCertFile) {
                            formData.append(`certificado_bancario_pdf_${index}`,acc.bankCertFile);
                        }
                    });

                    if (values.rutFile) {
                        formData.append("rut_pdf", values.rutFile);
                    }

                    if (values.idFile) {
                        formData.append("cedula_representante_pdf", values.idFile);
                    }

                    //Debug
                    for (let [key, val] of formData.entries()) {
                        console.log("FORMDATA:", key, val);
                    }

                    setInformationLoadingText('Enviando información');

                    response = await supplierServices.updateSupplier(id, formData);
                }

                if (response && [ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(response.status)) {
                    AlertComponent.success("Operación realizada correctamente");

                    if(userAuth?.rol_id === RolesEnum.SUPPLIER) {
                        window.location.reload()
                    }

                    if(userAuth?.rol_id !== RolesEnum.SUPPLIER) {
                        navigate("/admin/management");
                    }
                } else {
                    AlertComponent.warning("Error",response?.data?.errors?.[0]?.title);
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            } finally {
                setLoading(false);
                setInformationLoadingText('Información enviada');
            }
        },
    });

    //
    const fetchSupplierData = async (id) => {
        try {
            setLoading(true);
            setInformationLoadingText("Cargando Información...");
            const {data, status} = await supplierServices.getSupplierById(id);

            if(status === ResponseStatusEnum.OK) {
                const resp = data?.data?.proveedor;

                //Cargamos los deptos
                const deptos = await loadDepartmentsOnce();

                //Buscamos el apto
                const deptoObj = deptos.find((d) => d.nombre === resp?.depto_name || null);
                //Cargamos los munis
                const munis  = await refreshMunicipalities(deptoObj);
                //Buscamos el muni
                const muniObj = munis.find((m) => m.nombre === resp?.municipio_name || null);

                await formik.setValues({
                    company_name: resp?.nombre,
                    nit: resp?.nit,
                    email: resp?.correo,
                    cellphone: resp?.telefono_representante ?? "",
                    resolution: resp?.resolucion_aprobacion,
                    active: resp?.aprobado,
                    legal_representative: resp?.nombre_representante ?? "",
                    depto: deptoObj, //Pasamos el objeto
                    muni: muniObj, //Pasamos el objeto
                    rutFile: resp?.ruta_rut,
                    idFile: resp?.ruta_cedula_representante,
                    accounts: (resp?.bancos || []).map((c) => ({
                        id: c.id,
                        account_type: c.tipo_cuenta ? parseInt(c.tipo_cuenta) : null,
                        account_number: c.numero_cuenta ?? "",
                        bank: c.banco ? parseInt(c.banco) : null,
                        bankCertFile: c?.ruta_certificado_bancario,
                        default_favorite: c?.favorita,
                    })),
                });
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            AlertComponent.error("Hubo un error al procesar la solicitud");
        } finally {
            setLoading(false);
            setInformationLoadingText("");
        }
    };

    //
    const handleViewFile = async (pdfUrl) => {
        if (!pdfUrl) {
            AlertComponent.error('Error', 'No hay un archivo cargado para esta entrega.');
            return;
        }
        setLoading(true);
        try {
            setInformationLoadingText("Obteniendo archivo");

            const { blob, status, type } = await filesServices.downloadFile(pdfUrl);

            if (status === ResponseStatusEnum.OK && blob instanceof Blob) {
                const mime = (type || blob.type || '').toLowerCase();

                // Solo PDF o imágenes
                if (mime.includes('pdf') || mime.startsWith('image/')) {
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL, '_blank');
                }
            }

            if (status === ResponseStatusEnum.NOT_FOUND) {
                AlertComponent.error('Error', 'No se puede descargar el archivo, archivo no encontrado.');
            }
        } catch (error) {
            console.error("Error al descargar archivo:", error);
        } finally {
            setLoading(false);
        }
    };

    const disabledEdit = () => {
        return userAuth?.rol_id === rolesAllow;
    }

    //check
    const handleAskSetDefaultAccount = (index, account) => {
        //console.log('index: ', index, 'account: ',account);
        if (formik.values.accounts?.[index]?.default_favorite) return;

        setPendingDefault({ index, account });
        setShowAccountDefaultModal(true);
    };

    const handleCancelSetDefault = () => {
        setShowAccountDefaultModal(false);
        setPendingDefault(null);
    };

    const setOnlyOneFavorite = (selectedIndex) => {
        const next = (formik.values.accounts || []).map((acc, idx) => ({
            ...acc,
            default_favorite: idx === selectedIndex,
        }));
        formik.setFieldValue("accounts", next);
    };

    const handleConfirmSetDefault = async () => {
        if (!pendingDefault) return;

        const { index, account } = pendingDefault;

        try {
            setLoading(true);
            setInformationLoadingText("Actualizando cuenta por defecto...");

            setOnlyOneFavorite(index);

            if (!account?.id) {
                AlertComponent.success("", "Cuenta marcada como favorita, dale guardar para confirmar la selección.");

            }
        } catch (error) {
            console.error(error);
            AlertComponent.error("Error al actualizar la cuenta por defecto.");
        } finally {
            setLoading(false);
            setInformationLoadingText("");
            setShowAccountDefaultModal(false);
            setPendingDefault(null);
        }
    };

    useEffect(() => {
        loadAcountsType();
        loadBanks();
        if (id) {
            fetchSupplierData(id);
        }
    }, []);

    return(
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={"¡Registra tus proveedores!"}
                    bannerIcon={''}
                    backgroundIconColor={''}
                    bannerInformation={''}
                    backgroundInformationColor={''}
                />

                {loading && (
                    <div className="overlay">
                        <div className="loader">{informationLoadingText}</div>
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="container">
                    <div className="row g-3 mt-5">

                        {/* Nombre */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Nombre de la compañia"
                                {...formik.getFieldProps("company_name")}
                                error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                                helperText={formik.touched.company_name && formik.errors.company_name}
                                disabled={!disabledEdit()}
                            />
                        </div>

                        {/* Nit */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Nit"
                                {...formik.getFieldProps("nit")}
                                error={formik.touched.nit && Boolean(formik.errors.nit)}
                                helperText={formik.touched.nit && formik.errors.nit}
                                disabled={!disabledEdit()}
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
                                disabled={!disabledEdit()}
                            />
                        </div>

                        {/* fullWidth */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Telefono"
                                {...formik.getFieldProps("cellphone")}
                                error={formik.touched.cellphone && Boolean(formik.errors.cellphone)}
                                helperText={formik.touched.cellphone && formik.errors.cellphone}
                            />
                        </div>

                        {/* Representante */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Nombre del Representante legal"
                                {...formik.getFieldProps("legal_representative")}
                                error={formik.touched.legal_representative && Boolean(formik.errors.legal_representative)}
                                helperText={formik.touched.legal_representative && formik.errors.legal_representative}
                            />
                        </div>

                        {/* Número de resolución */}
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Número de resolución"
                                {...formik.getFieldProps("resolution")}
                                error={formik.touched.resolution && Boolean(formik.errors.resolution)}
                                helperText={formik.touched.resolution && formik.errors.resolution}
                                disabled={!disabledEdit()}
                            />
                        </div>

                        {/* Departamentos (único) */}
                        <div className="col-md-6">
                            <Autocomplete
                                options={deptOptions}
                                value={formik.values.depto}
                                onOpen={loadDepartmentsOnce}
                                onChange={handleDeptChange}
                                getOptionLabel={(o) => o?.nombre ?? ""}
                                isOptionEqualToValue={(o, v) => o.id === v?.id}
                                loading={loadingDepts}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Departamento"
                                        placeholder="Selecciona un departamento"
                                        error={formik.touched.depto && Boolean(formik.errors.depto)}
                                        helperText={formik.touched.depto && formik.errors.depto}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingDepts ? <CircularProgress size={18} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </div>

                        {/* Municipios (único) */}
                        <div className="col-md-6">
                            <Autocomplete
                                options={muniOptions}
                                value={formik.values.muni}
                                onChange={handleMuniChange}
                                getOptionLabel={(o) => o?.nombre ?? ""}
                                isOptionEqualToValue={(o, v) => o.id === v?.id}
                                loading={loadingMunis}
                                disabled={!formik.values.depto}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Municipio"
                                        placeholder={formik.values.depto ? "Selecciona un municipio" : "Primero elige un departamento"}
                                        error={formik.touched.muni && Boolean(formik.errors.muni)}
                                        helperText={formik.touched.muni && formik.errors.muni}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <>
                                                    {loadingMunis ? <CircularProgress size={18} /> : null}
                                                    {params.InputProps.endAdornment}
                                                </>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </div>

                        {/* Activo */}
                        <div className="col-md-12 mb-4">
                            <FormControlLabel
                                label="Activo"
                                labelPlacement="start"
                                control={
                                    <Switch
                                        color="success"
                                        checked={formik.values.active}
                                        onChange={(e) => formik.setFieldValue("active", e.target.checked)}
                                        disabled={!disabledEdit()}
                                    />
                                }
                            />
                        </div>
                    </div>

                    {/* Campos nuevos SOLO en edición */}
                    {isEdit && (
                        <>
                            <Card className="p-3 p-md-4 shadow-sm mb-4">
                                <h4 className="text-primary fw-bold text-center text-md-start">Información para Cuenta de Cobro</h4>
                                <Card className="p-3 p-md-4 shadow-sm mb-4">
                                    <div className="row g-3 mt-2">
                                        {/* Archivos adjuntos RUT */}
                                        <div className="col-md-6 mt-3">
                                            <label className="form-label d-block">RUT (PDF)</label>
                                            <div className="d-flex gap-2 align-items-center">
                                            <input
                                                type="file"
                                                accept="application/pdf,image/*"
                                                className="form-control"
                                                onChange={(e) => formik.setFieldValue("rutFile", e.currentTarget.files[0])}
                                            />
                                            {typeof formik.values.rutFile === "string" &&
                                                formik.values.rutFile && (
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        type="button"
                                                        onClick={() => handleViewFile(formik.values.rutFile)}
                                                    >
                                                        Ver documento
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Archivos adjuntos CEDULA */}
                                        <div className="col-md-6 mt-3">
                                            <label className="form-label d-block">Cédula representante (PDF/imagen)</label>
                                            <div className="d-flex gap-2 align-items-center">
                                                <input
                                                    type="file"
                                                    accept="application/pdf,image/*"
                                                    className="form-control"
                                                    onChange={(e) =>
                                                        formik.setFieldValue("idFile", e.currentTarget.files?.[0] ?? null)
                                                    }
                                                />
                                                {typeof formik.values.idFile === "string" &&
                                                    formik.values.idFile && (
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            type="button"
                                                            onClick={() => handleViewFile(formik.values.idFile)}
                                                        >
                                                            Ver documento
                                                        </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                {formik.values.accounts.map((account, index) => {
                                    const isEditable = !account.id;

                                    return (
                                        <Card key={index} className="p-3 p-md-4 shadow-sm mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h3 className="mb-0 fw-semibold">
                                                    Cuenta bancaria #{index + 1}
                                                    {!isEditable && (
                                                        <span className="ms-2 badge bg-secondary">
                                                            Solo lectura
                                                        </span>
                                                    )}
                                                </h3>

                                                <FormControlLabel
                                                    label="Cuenta por defecto"
                                                    control={
                                                        <Checkbox
                                                            checked={Boolean(account.default_favorite)}
                                                            onChange={() => handleAskSetDefaultAccount(index, account)}
                                                        />
                                                    }
                                                />

                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => handleRemoveAccount(index, account)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>

                                            <div className="row g-3 mt-2">
                                                {/* Tipo de cuenta */}
                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">
                                                        Tipo de cuenta <span className="text-danger">*</span>
                                                    </label>
                                                    <TextField
                                                        fullWidth
                                                        select
                                                        SelectProps={{ native: true }}
                                                        label="Tipo de cuenta"
                                                        value={account.account_type || ""}
                                                        onChange={(e) =>
                                                            formik.setFieldValue(
                                                                `accounts[${index}].account_type`,
                                                                e.target.value ? parseInt(e.target.value) : null
                                                            )
                                                        }
                                                        helperText="Selecciona el tipo de cuenta"
                                                        disabled={!isEditable}
                                                    >
                                                        <option value=""></option>
                                                        {acountsType.map((as) => (
                                                            <option key={as.id} value={as.id}>
                                                                {as.nombre}
                                                            </option>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                {/* Número de cuenta */}
                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">
                                                        Número de cuenta <span className="text-danger">*</span>
                                                    </label>
                                                    <TextField
                                                        fullWidth
                                                        label="Número de cuenta"
                                                        value={account.account_number}
                                                        onChange={(e) =>
                                                            formik.setFieldValue(
                                                                `accounts[${index}].account_number`,
                                                                e.target.value
                                                            )
                                                        }
                                                        disabled={!isEditable}
                                                    />
                                                </div>

                                                {/* Banco */}
                                                <div className="col-md-6">
                                                    <label className="form-label fw-semibold">
                                                        Banco <span className="text-danger">*</span>
                                                    </label>
                                                    <TextField
                                                        fullWidth
                                                        select
                                                        SelectProps={{ native: true }}
                                                        label="Banco"
                                                        value={account.bank || ""}
                                                        onChange={(e) =>
                                                            formik.setFieldValue(
                                                                `accounts[${index}].bank`,
                                                                e.target.value ? parseInt(e.target.value) : null
                                                            )
                                                        }
                                                        helperText="Selecciona el banco"
                                                        disabled={!isEditable}
                                                    >
                                                        <option value=""></option>
                                                        {banksList.map((bank) => (
                                                            <option key={bank.id} value={bank.id}>
                                                                {bank.nombre}
                                                            </option>
                                                        ))}
                                                    </TextField>
                                                </div>

                                                {/* Certificado bancario */}
                                                <div className="col-md-6 mt-3">
                                                    <label className="form-label fw-semibold">
                                                        Certificado bancario <span className="text-danger">*</span>
                                                    </label>
                                                    <div className="d-flex gap-2 align-items-center">
                                                        <input
                                                            type="file"
                                                            accept="application/pdf,image/*"
                                                            className="form-control"
                                                            onChange={(e) =>
                                                                formik.setFieldValue(
                                                                    `accounts[${index}].bankCertFile`,
                                                                    e.currentTarget.files?.[0] ?? null
                                                                )
                                                            }
                                                        />

                                                        {/* Ver documento si existe ruta en cuentas viejas o nuevas guardadas */}
                                                        {typeof account.bankCertFile === "string" &&
                                                            account.bankCertFile && (
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    type="button"
                                                                    onClick={() => handleViewFile(account.bankCertFile)}
                                                                >
                                                                    Ver documento
                                                                </Button>
                                                            )}
                                                    </div>
                                                </div>
                                            </div>

                                            <h6 className="mb-0 fw-semibold mt-2">
                                                Nota: El certificado bancario debe haber sido expedido dentro de los últimos 90 días al momento de generar la cuenta de cobro.
                                            </h6>
                                        </Card>
                                    );
                                })}

                                {/* Botón para agregar nueva cuenta */}
                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() =>
                                            formik.setFieldValue("accounts", [
                                                ...formik.values.accounts,
                                                {
                                                    id: null,
                                                    account_type: null,
                                                    account_number: "",
                                                    bank: null,
                                                    bankCertFile: null,
                                                },
                                            ])
                                        }
                                    >
                                        + Agregar cuenta
                                    </Button>
                                </div>
                            </Card>
                        </>
                    )}

                    <div className="text-end mt-4 d-flex gap-2 justify-content-end">
                        <Button variant="outline-success"
                                color="success"
                                type="submit"
                        >
                            Guardar
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

            <ConfirmationModal
                show={showAccountDefaultModal}
                title={"Confirmar cuenta por defecto"}
                message={"¿Estás seguro de que deseas dejar esta cuenta como cuenta por defecto?"}
                onConfirm={handleConfirmSetDefault}
                onClose={handleCancelSetDefault}
                cancelLabel={"Cancelar"}
                confirmLabel={"Sí, dejar por defecto"}
            />
        </>
    )
}