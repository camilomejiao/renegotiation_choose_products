import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import {Autocomplete, CircularProgress, FormControlLabel, Switch, TextField} from "@mui/material";
import { Button } from "react-bootstrap";
import { useFormik } from "formik";

//Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";
//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
import {locationServices} from "../../../../../helpers/services/LocationServices";

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
});

export const CreateSuppliers = () => {

    const navigate = useNavigate();
    const { id } = useParams();
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
                const formattedValues = {
                    nombre: values.company_name,
                    nit: values.nit,
                    correo: values.email,
                    aprobado: values.active,
                    resolucion_aprobacion: values.resolution,
                    fecha_registro: new Date().toISOString().slice(0, 10),
                    depto_id: formik.values.depto?.id ?? null,
                    muni_id: formik.values.muni?.id ?? null,
                };
                console.log('formattedValues: ', formattedValues);
                const response = id
                ? await supplierServices.updateSupplier(id, formattedValues)
                : await supplierServices.createSupplier(formattedValues);

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
            console.log(data);
            if(status === ResponseStatusEnum.OK) {
                const resp = data?.data?.proveedor;
                await formik.setValues({
                    company_name: resp?.nombre,
                    nit: resp?.nit,
                    email: resp?.correo,
                    cellphone: resp?.telefono ?? "",
                    resolution: resp?.resolucion_aprobacion,
                    active: resp?.aprobado,
                    legal_representative: resp?.representante ?? "",
                });
            }
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            AlertComponent.error("Hubo un error al procesar la solicitud");
        }
    }

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
                                onBlur={() => formik.setFieldTouched("depto", true)}
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
                                onBlur={() => formik.setFieldTouched("muni", true)}
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
                        <div className="col-md-6">
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