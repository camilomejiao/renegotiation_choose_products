import { useRef, useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { Autocomplete, TextField, CircularProgress, Button } from "@mui/material";

//
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";


const initialValues = {
    depto: [],
    muni:  [],
};

const validationSchema = yup.object({
    depto: yup.array().of(
        yup.object({ id: yup.number().required(), nombre: yup.string().required() })
    ).min(1, "Selecciona al menos un departamento").required(),
    muni: yup.array().of(
        yup.object({ id: yup.number().required(), nombre: yup.string().required() })
    ).min(1, "Selecciona al menos un municipio").required(),
});

// -------------------- Mock de servicios (reemplaza por los tuyos) --------------------
async function getDepartments() {
    return [
        { id: 1, nombre: "Antioquia" },
        { id: 2, nombre: "Cundinamarca" },
        { id: 3, nombre: "Valle del Cauca" },
    ];
}
async function getMunicipalitiesByDepartment(deptId) {
    const db = {
        1: [{ id: 101, nombre: "Medellín" }, { id: 102, nombre: "Envigado" }],
        2: [{ id: 201, nombre: "Bogotá D.C." }, { id: 202, nombre: "Chía" }],
        3: [{ id: 301, nombre: "Cali" }, { id: 302, nombre: "Palmira" }],
    };
    return db[deptId] || [];
}

// -------------------- Componente --------------------
export const Location = ({ id, onBack }) => {
    const [deptOptions, setDeptOptions] = useState([]);
    const [muniOptions, setMuniOptions] = useState([]);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingMunis, setLoadingMunis] = useState(false);

    //cache para no repetir requests por depto
    const muniCacheRef = useRef(new Map());// deptId -> municipios[]
    const deptsLoadedRef = useRef(false);// para cargar depts solo una vez (onOpen)


    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    departamentos: values.depto.map(d => d.id),
                    municipios:    values.muni.map(m => m.id),
                };
                // const resp = id ? await service.update(id, payload) : await service.create(payload);
                const resp = { status: ResponseStatusEnum.OK }; // mock
                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(resp.status)) {
                    AlertComponent.success("Operación realizada correctamente");
                } else {
                    AlertComponent.warning("Error", "No se pudo guardar la información");
                }
            } catch (err) {
                console.error(err);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            }
        },
    });


    const loadDepartmentsOnce = async () => {
        if (deptsLoadedRef.current) {
            return;
        }
        setLoadingDepts(true);
        const deps = await getDepartments();
        setDeptOptions(deps);
        setLoadingDepts(false);
        deptsLoadedRef.current = true;
    };

    const refreshMunicipalities = async (selectedDepts) => {
        if (!selectedDepts?.length) {
            setMuniOptions([]);
            formik.setFieldValue("muni", []);
            return;
        }
        setLoadingMunis(true);

        //trae/usa cache por cada depto
        const lists = await Promise.all(
            selectedDepts.map(async ({ id }) => {
                if (!muniCacheRef.current.has(id)) {
                    const munis = await getMunicipalitiesByDepartment(id);
                    muniCacheRef.current.set(id, munis);
                }
                return muniCacheRef.current.get(id);
            })
        );

        //unir y deduplicar por id
        const union = Array.from(
            new Map(lists.flat().map(m => [m.id, m])).values()
        );
        setMuniOptions(union);

        // filtrar seleccionados que ya no existan
        const validIds = new Set(union.map(m => m.id));
        const nextSelected = (formik.values.muni || []).filter(m => validIds.has(m.id));
        if (nextSelected.length !== formik.values.muni.length) {
            formik.setFieldValue("muni", nextSelected);
        }

        setLoadingMunis(false);
    };

    const handleDeptChange = async (_evt, value) => {
        formik.setFieldValue("depto", value);
        await refreshMunicipalities(value);
    };

    const handleMuniChange = (_evt, value) => {
        formik.setFieldValue("muni", value);
    };

    useEffect(() => {
        loadDepartmentsOnce();
    }, [id]);

    // -------------------- Render --------------------
    return (
        <form onSubmit={formik.handleSubmit} className="container">
            <div className="row g-3 mt-5">
                {/* Departamentos */}
                <div className="col-md-6">
                    <Autocomplete
                        multiple
                        options={deptOptions}
                        value={formik.values.depto}
                        onOpen={loadDepartmentsOnce}
                        onChange={handleDeptChange}
                        onBlur={() => formik.setFieldTouched("depto", true)}
                        getOptionLabel={(o) => o?.nombre ?? ""}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        loading={loadingDepts}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Departamentos"
                                placeholder="Selecciona departamentos"
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

                {/* Municipios */}
                <div className="col-md-6">
                    <Autocomplete
                        multiple
                        options={muniOptions}
                        value={formik.values.muni}
                        onChange={handleMuniChange}
                        onBlur={() => formik.setFieldTouched("muni", true)}
                        getOptionLabel={(o) => o?.nombre ?? ""}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        loading={loadingMunis}
                        disabled={(formik.values.depto || []).length === 0}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Municipios"
                                placeholder={
                                    (formik.values.depto || []).length
                                        ? "Selecciona municipios"
                                        : "Primero elige departamentos"
                                }
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
            </div>

            <div className="text-end mt-4 d-flex gap-2 justify-content-end">
                <Button variant="outline-success" color="success" type="submit">
                    Guardar
                </Button>
                <Button variant="outline-danger" onClick={onBack} type="button">
                    Cancelar
                </Button>
            </div>
        </form>
    );
};
