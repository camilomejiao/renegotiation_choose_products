import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import * as yup from "yup";
import { Button, FormControlLabel, Switch, TextField } from "@mui/material";
import { useFormik } from "formik";

//Img
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";
//Components
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

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
    active: yup.number().required("El nombre es requerido"),
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
                const formattedValues = { ...values };
                console.log('formattedValues: ', formattedValues);
                const response = id
                //? await userServices.update(id, formattedValues)
                //: await userServices.create(formattedValues);

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(response.status)) {
                    AlertComponent.success("Operación realizada correctamente");
                    navigate("/admin/user-list");
                } else {
                    AlertComponent.warning("Error", response?.data?.errors?.[0]?.title);
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            }
        },
    });

    useEffect(() => {
        if (id) {

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
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Nombre de la compañia"
                                {...formik.getFieldProps("company_name")}
                                error={formik.touched.company_name && Boolean(formik.errors.company_name)}
                                helperText={formik.touched.company_name && formik.errors.company_name}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Nit"
                                {...formik.getFieldProps("nit")}
                                error={formik.touched.nit && Boolean(formik.errors.nit)}
                                helperText={formik.touched.nit && formik.errors.nit}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Email"
                                {...formik.getFieldProps("email")}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </div>

                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Telefono"
                                {...formik.getFieldProps("cellphone")}
                                error={formik.touched.cellphone && Boolean(formik.errors.cellphone)}
                                helperText={formik.touched.cellphone && formik.errors.cellphone}
                            />
                        </div>

                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Nombre del Representante legal"
                                {...formik.getFieldProps("legal_representative")}
                                error={formik.touched.legal_representative && Boolean(formik.errors.legal_representative)}
                                helperText={formik.touched.legal_representative && formik.errors.legal_representative}
                            />
                        </div>
                        <div className="col-md-6">
                            <TextField
                                fullWidth
                                label="Número de resolución"
                                {...formik.getFieldProps("resolution")}
                                error={formik.touched.resolution && Boolean(formik.errors.resolution)}
                                helperText={formik.touched.resolution && formik.errors.resolution}
                            />
                        </div>
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
                        <Button variant="outline-success" color="success" type="submit">
                            Guardar
                        </Button>

                        <Button variant="outline-danger"
                                type="button">
                            Cancelar
                        </Button>
                    </div>

                </form>

            </div>
        </>
    )
}