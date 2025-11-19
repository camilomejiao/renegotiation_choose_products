import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import * as yup from "yup";
import { FormControlLabel, Switch, TextField } from "@mui/material";
import { Button, Spinner } from "react-bootstrap";
import { useFormik } from "formik";

//Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";
import supplierIcon from "../../../../../assets/image/icons/frame.png";
//Components
import { ModernBanner } from "../../../../shared/ModernBanner";
//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import {supplierServices} from "../../../../../helpers/services/SupplierServices";

const baseInitialValues = {
    company_name: "",
    nit: "",
    legal_representative: "",
    cellphone: "",
    email: "",
    active: true,
    resolution: "",
};

const validationSchema = yup.object().shape({
    company_name: yup.string().required("El nombre de la compañia es requerido"),
    nit: yup.number().required("El nit o cedula es requerido"),
    legal_representative: yup.string().required("El nombre del representante es requerido"),
    cellphone: yup.number().required("El telefono es requerido"),
    email: yup.string().email().required("El email es requerido"),
    active: yup.boolean().required("Activo o Inactivo"),
    resolution: yup.string().optional("El número de resolución es opcional"),
});

export const CreateSuppliers = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState(baseInitialValues);

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const formattedValues = {
                    nombre: values.company_name,
                    nit: values.nit,
                    correo: values.email,
                    aprobado: values.active,
                    resolucion_aprobacion: values.resolution,
                    fecha_registro: new Date().toISOString().slice(0, 10),
                };
                
                const response = id
                ? await supplierServices.updateSupplier(id, formattedValues)
                : await supplierServices.createSupplier(formattedValues);

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(response.status)) {
                    AlertComponent.success(isEdit ? "Proveedor actualizado correctamente" : "Proveedor creado correctamente");
                    navigate("/admin/management");
                } else {
                    AlertComponent.warning("Error", response?.data?.errors?.[0]?.title ?? "No se pudo guardar");
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            } finally {
                setLoading(false);
            }
        },
    });

    const fetchSupplierData = useCallback(async (supplierId) => {
        try {
            setLoading(true);
            const {data, status} = await supplierServices.getSupplierById(supplierId);
            
            if(status === ResponseStatusEnum.OK) {
                const resp = data?.data?.proveedor;
                setInitialValues({
                    company_name: resp?.nombre ?? "",
                    nit: resp?.nit ?? "",
                    email: resp?.correo ?? "",
                    cellphone: resp?.telefono ?? "",
                    resolution: resp?.resolucion_aprobacion ?? "",
                    active: Boolean(resp?.aprobado),
                    legal_representative: resp?.representante ?? "",
                });
            }
        } catch (error) {
            console.error("Error cargando proveedor:", error);
            AlertComponent.error("Error cargando proveedor");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchSupplierData(id)
        }
    }, [fetchSupplierData, id]);

    return(
        <>
            <ModernBanner
                imageHeader={imgPeople}
                titleHeader={isEdit ? "Editar proveedor" : "¡Registra tus proveedores!"}
                bannerIcon={supplierIcon}
                backgroundIconColor="#2148C0"
                bannerInformation={isEdit ? "Actualiza la información del proveedor" : "Completa todos los campos requeridos"}
                backgroundInformationColor="#F66D1F"
            />

            {loading && (
                <div className="overlay">
                    <div className="loader">
                        <Spinner animation="border" variant="success" />
                        <div className="spinner-text">Cargando...</div>
                    </div>
                </div>
            )}

            <div className="page-content">
                <div className="form-container">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="row g-3">

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

                            {/* Teléfono */}
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
                        
                        <div className="text-end mt-4 d-flex gap-2 justify-content-end">
                            <Button variant="outline-success"
                                    color="success"
                                    type="submit"
                                    disabled={loading}
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
            </div>
        </>
    )
}
