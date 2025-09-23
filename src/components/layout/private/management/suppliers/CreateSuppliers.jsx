import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import * as yup from "yup";
import { FormControlLabel, Switch, TextField } from "@mui/material";
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
import {supplierServices} from "../../../../../helpers/services/SupplierServices";

const initialValues = {
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