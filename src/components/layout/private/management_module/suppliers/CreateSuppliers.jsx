import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { Autocomplete, CircularProgress, FormControlLabel, Switch, TextField } from "@mui/material";
import {Button, Card} from "react-bootstrap";
import { useFormik } from "formik";

//Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";
//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
//Services
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
import { locationServices } from "../../../../../helpers/services/LocationServices";

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
            account_type: "",
            account_number: "",
            bank: "",
            bankCertFile: null,
        },
    ],
};

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
                account_type: yup.string().nullable(),
                account_number: yup.string().nullable(),
                bank: yup.string().nullable(),
                bankCertFile: yup.mixed().nullable(),
            })
        )
        .min(1, "Debe existir al menos una cuenta bancaria"),
});

export const CreateSuppliers = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [deptOptions, setDeptOptions] = useState([]);
    const [muniOptions, setMuniOptions] = useState([]);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingMunis, setLoadingMunis] = useState(false);

    //cache para no repetir requests por depto
    const deptsLoadedRef = useRef(false);
    const muniCacheRef = useRef(new Map());

    //
    const loadDepartmentsOnce = async () => {
        if (deptsLoadedRef.current) {
            return;
        }

        try {
            setLoadingDepts(true);
            const {data, status} = await locationServices.getDeptos();
            if(status === ResponseStatusEnum.OK) {
                setDeptOptions(data);
                setLoadingDepts(false);
                deptsLoadedRef.current = true;
            }
        } catch (error) {
            console.error(error);
            AlertComponent.error("Hubo un error al procesar la solicitud");
        }
    };

    //
    const refreshMunicipalities = async (selectedDept) => {
        console.log(selectedDept);
        if (!selectedDept) {
            setMuniOptions([]);
            formik.setFieldValue("muni", null);
            return;
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
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                //1. Cuentas bancarias (solo en edición)
                let cuentas_bancarias = [];
                if (isEdit && Array.isArray(values.accounts)) {
                    cuentas_bancarias = values.accounts.map(acc => ({
                        tipo_cuenta: acc.account_type || null,
                        numero_cuenta: acc.account_number || null,
                        banco: acc.bank || null,
                    }));
                }

                // 2. Datos base
                const formattedValues = {
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
                    ...(isEdit && { cuentas_bancarias }),
                };

                let response;

                console.log('formattedValues: ', formattedValues);

                // =========  EDICIÓN   ======
                if (isEdit) {
                    const formData = new FormData();

                    // Datos simples + cuentas bancarias
                    Object.entries(formattedValues).forEach(([key, val]) => {
                        if (key === "cuentas_bancarias") {
                            formData.append(key, JSON.stringify(val)); // backend espera JSON
                        } else if (val !== null && val !== undefined) {
                            formData.append(key, val);
                        }
                    });

                    // Archivos por cuenta
                    if (Array.isArray(values.accounts)) {
                        values.accounts.forEach((acc, index) => {
                            if (acc.bankCertFile) {
                                formData.append(
                                    `cuentas_bancarias[${index}][certificado_bancario]`,
                                    acc.bankCertFile
                                );
                            }
                        });
                    }

                    // Si tienes archivos adicionales:
                    if (values.rutFile) formData.append("rut_file", values.rutFile);
                    if (values.idFile) formData.append("id_file", values.idFile);

                    for (let [key, value] of formData.entries()) {
                        console.log("KEY:", key, "VALUE:", value);
                    }

                    response = await supplierServices.updateSupplier(id, formData);
                }
                else {
                    response = await supplierServices.createSupplier(formattedValues);
                }

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(response.status)) {
                    AlertComponent.success("Operación realizada correctamente");
                    navigate("/admin/management");
                } else {
                    AlertComponent.warning("Error", response?.data?.errors?.[0]?.title);
                }

            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            }
        },
    });

    const fetchSupplierData = async (id) => {
        try {
            const {data, status} = await supplierServices.getSupplierById(id);
            if(status === ResponseStatusEnum.OK) {
                const resp = data?.data?.proveedor;

                // si backend trae depto/muni como objetos con id/nombre
                const deptoObj = resp?.depto ?? null;
                const muniObj  = resp?.muni ?? null;

                await formik.setValues({
                    company_name: resp?.nombre,
                    nit: resp?.nit,
                    email: resp?.correo,
                    cellphone: resp?.telefono ?? "",
                    resolution: resp?.resolucion_aprobacion,
                    active: resp?.aprobado,
                    legal_representative: resp?.representante ?? "",
                    depto: deptoObj,
                    muni: muniObj,
                    rutFile: null,
                    idFile: null,
                    accounts: (resp?.cuentas_bancarias || []).map((c) => ({
                        account_type: c.tipo_cuenta ?? "",
                        account_number: c.numero_cuenta ?? "",
                        bank: c.banco ?? "",
                        bankCertFile: null,
                    })),
                });

                // si tienes depto, puedes precargar municipios:
                if (deptoObj) {
                    await refreshMunicipalities(deptoObj);
                }
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            AlertComponent.error("Hubo un error al procesar la solicitud");
        }
    };

    useEffect(() => {
        loadDepartmentsOnce();
        if (id) {
            fetchSupplierData(id)
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
                                            <input
                                                type="file"
                                                accept="application/pdf,image/*"
                                                className="form-control"
                                                onChange={(e) => formik.setFieldValue("rutFile", e.currentTarget.files[0])}
                                            />
                                        </div>

                                        {/* Archivos adjuntos CEDULA */}
                                        <div className="col-md-6 mt-3">
                                            <label className="form-label d-block">Cédula representante (PDF/imagen)</label>
                                            <input
                                                type="file"
                                                accept="application/pdf,image/*"
                                                className="form-control"
                                                onChange={(e) => formik.setFieldValue("idFile", e.currentTarget.files[0])}
                                            />
                                        </div>
                                    </div>
                                </Card>

                                {formik.values.accounts.map((account, index) => (
                                    <Card key={index} className="p-3 p-md-4 shadow-sm mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className="mb-0">Cuenta bancaria #{index + 1}</h5>
                                            {formik.values.accounts.length > 1 && (
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        const next = [...formik.values.accounts];
                                                        next.splice(index, 1);
                                                        formik.setFieldValue("accounts", next);
                                                    }}
                                                >
                                                    Eliminar
                                                </Button>
                                            )}
                                        </div>

                                        <div className="row g-3 mt-2">
                                            {/* Tipo de cuenta */}
                                            <div className="col-md-6">
                                                <TextField
                                                    fullWidth
                                                    select
                                                    SelectProps={{ native: true }}
                                                    label="Tipo de cuenta"
                                                    value={account.account_type}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(`accounts[${index}].account_type`, e.target.value)
                                                    }
                                                    helperText="Selecciona el tipo de cuenta"
                                                >
                                                    <option value=""></option>
                                                    <option value="AHORROS">Ahorros</option>
                                                    <option value="CORRIENTE">Corriente</option>
                                                </TextField>
                                            </div>

                                            {/* Número de cuenta */}
                                            <div className="col-md-6">
                                                <TextField
                                                    fullWidth
                                                    label="Número de cuenta"
                                                    value={account.account_number}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(`accounts[${index}].account_number`, e.target.value)
                                                    }
                                                />
                                            </div>

                                            {/* Banco */}
                                            <div className="col-md-6">
                                                <TextField
                                                    fullWidth
                                                    select
                                                    SelectProps={{ native: true }}
                                                    label="Entidad bancaria"
                                                    value={account.bank}
                                                    onChange={(e) =>
                                                        formik.setFieldValue(`accounts[${index}].bank`, e.target.value)
                                                    }
                                                >
                                                    <option value=""></option>
                                                    <option value="BANCOLOMBIA">Bancolombia</option>
                                                    <option value="BANCO_CAJA_SOCIAL">Banco Caja Social</option>
                                                    <option value="DAVIVIENDA">Davivienda</option>
                                                </TextField>
                                            </div>

                                            {/* Certificado bancario */}
                                            <div className="col-md-6 mt-3">
                                                <label className="form-label d-block">Certificado bancario</label>
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
                                            </div>
                                        </div>
                                    </Card>
                                ))}

                                {/* Botón para agregar nueva cuenta */}
                                <div className="d-flex justify-content-end">
                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() =>
                                            formik.setFieldValue("accounts", [
                                                ...formik.values.accounts,
                                                {
                                                    account_type: "",
                                                    account_number: "",
                                                    bank: "",
                                                    bankCertFile: null,
                                                },
                                            ])
                                        }
                                    >
                                        + Agregar otra cuenta
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
        </>
    )
}