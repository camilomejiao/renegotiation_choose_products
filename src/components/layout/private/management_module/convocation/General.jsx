import { useCallback, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {Autocomplete, CircularProgress, FormControlLabel, Switch, TextField} from "@mui/material";
import { Button } from "react-bootstrap";

//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Services
import { convocationServices } from "../../../../../helpers/services/ConvocationServices";


const initialValues = {
    name: "",
    startDate: "",
    endDate: "",
    plans: [],
    active: true,
};

const validationSchema = yup.object().shape({
    name: yup.string().required("El nombre es requerido"),
    startDate: yup
        .date()
        .typeError("Fecha inicial inválida")
        .required("La fecha inicial es requerida"),
    endDate: yup
        .date()
        .typeError("Fecha final inválida")
        .min(yup.ref("startDate"), "La fecha final no puede ser menor que la inicial")
        .required("La fecha final es requerida"),
    plans: yup
        .array()
        .of(
            yup
                .number()
                .transform((val, orig) => (orig === '' ? NaN : Number(orig)))
                .typeError('El plan debe ser un ID numérico')
                .integer()
                .positive()
        )
        .min(1, 'Selecciona al menos un plan')
        .required('Selecciona al menos un plan'),
    active: yup.boolean().required("Activo o Inactivo"),
});

export const General = ({id, onBack}) => {

    const [plansOptions, setPlansOptions] = useState([]);
    const [loadingPlans, setLoadingPlans] = useState(false);

    //
    const plansLoadedRef = useRef(false);

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const formattedValues = {
                    nombre: values.name,
                    fecha_inicio: values.startDate,
                    fecha_fin: values.endDate,
                    abierto: values.active,
                    planes: values.plans,
                };

                const response = id
                    ? await convocationServices.update(id, formattedValues)
                    : await convocationServices.create(formattedValues);

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(response.status)) {
                    AlertComponent.success("Jornada creada correctamente!");
                    onBack();
                } else {
                    AlertComponent.warning("Error", response?.data?.message);
                }
            } catch (error) {
                console.error("Error al enviar el formulario:", error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            }
        },
    });

    const loadPlansOnce = useCallback(async () => {
        if (plansLoadedRef.current) {
            return;
        }

        try {
            setLoadingPlans(true);
            const {data, status} = await convocationServices.getCategoriesConvocation();
            if(status === ResponseStatusEnum.OK) {
                setPlansOptions(data);
                setLoadingPlans(false);
                plansLoadedRef.current = true;
            }
        } catch (error) {
            console.error(error);
            AlertComponent.error("Hubo un error al procesar la solicitud");
        }
    }, []);

    const fetchConvocationData = useCallback(async (convocationId) => {
        try {
            const {data, status} = await convocationServices.getById(convocationId);
            const resp = data.data.jornada;
            if (status === ResponseStatusEnum.OK) {
                await formik.setValues({
                   name: resp.nombre,
                   startDate: resp.fecha_inicio,
                   endDate: resp.fecha_fin,
                   active: resp.abierto,
                   plans: resp.planes ?? [],
                });
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            AlertComponent.warning("No se pudieron cargar los datos de la jornada.");
        }
    }, [formik]);

    useEffect(() => {
        loadPlansOnce();
        if (id) {
            fetchConvocationData(id);
        }
    }, [fetchConvocationData, id, loadPlansOnce]);

    return (
        <>
            <form onSubmit={async (e) => {
                e.preventDefault();
                const errs = await formik.validateForm();
                if (Object.keys(errs).length) {
                    formik.setTouched(Object.fromEntries(Object.keys(errs).map(k => [k, true])));
                    console.log("Errores de validación:", errs);
                    AlertComponent.warning("Revisa los campos obligatorios.");
                    return;
                }
                formik.handleSubmit(e);
            }} className="container">
                <div className="row g-3 mt-5">

                    {/* Nombre de la jornada */}
                    <div className="col-md-12">
                        <TextField
                            fullWidth
                            label="Nombre de la jornada"
                            {...formik.getFieldProps("name")}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </div>

                    {/* Fecha Inicial */}
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            type="date"
                            label="Fecha Inicial"
                            InputLabelProps={{ shrink: true }}
                            {...formik.getFieldProps("startDate")}
                            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                            helperText={formik.touched.startDate && formik.errors.startDate}
                        />
                    </div>

                    {/* Fecha final */}
                    <div className="col-md-6">
                        <TextField
                            fullWidth
                            type="date"
                            label="Fecha final"
                            InputLabelProps={{ shrink: true }}
                            {...formik.getFieldProps("endDate")}
                            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                            helperText={formik.touched.endDate && formik.errors.endDate}
                        />
                    </div>

                    <div className="col-md-6">
                        <Autocomplete
                            multiple
                            options={plansOptions}
                            value={plansOptions.filter(opt => (formik.values.plans || []).includes(opt.id))}
                            onOpen={loadPlansOnce}
                            onChange={(_, selected) => formik.setFieldValue("plans", selected.map(o => o.id))}
                            onBlur={() => formik.setFieldTouched("plans", true)}
                            getOptionLabel={(o) => o?.nombre ?? ""}
                            isOptionEqualToValue={(o, v) => o.id === v.id}
                            loading={loadingPlans}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Planes"
                                    placeholder="Selecciona un plan"
                                    error={formik.touched.plans && Boolean(formik.errors.plans)}
                                    helperText={formik.touched.plans && formik.errors.plans}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loadingPlans ? <CircularProgress size={18} /> : null}
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
                                    checked={!!formik.values.active}
                                    onChange={(e) => formik.setFieldValue("active", e.target.checked)}
                                />
                            }
                        />
                    </div>


                </div>

                <div className="text-end mt-4 d-flex gap-2 justify-content-end">
                    <Button variant="outline-success" type="submit">
                        Guardar
                    </Button>
                    <Button variant="outline-danger" onClick={onBack} type="button">
                        Cancelar
                    </Button>
                </div>
            </form>
        </>
    )
}
