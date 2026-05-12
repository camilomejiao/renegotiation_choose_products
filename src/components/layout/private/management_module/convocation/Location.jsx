import { useRef, useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import {
    Autocomplete,
    TextField,
    CircularProgress,
} from "@mui/material";
import { Button } from "react-bootstrap";
import {FaTrash} from "react-icons/fa";
import { SmartTable } from "../../../../../shared/ui/smart-table";

//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
//Services
import { locationServices } from "../../../../../helpers/services/LocationServices";
import { convocationServices } from "../../../../../helpers/services/ConvocationServices";

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

export const Location = ({ id, onBack, refreshPage }) => {
    const [deptOptions, setDeptOptions] = useState([]);
    const [muniOptions, setMuniOptions] = useState([]);
    const [locationRegister, setLocationRegister] = useState([]);
    const [loadingDepts, setLoadingDepts] = useState(false);
    const [loadingMunis, setLoadingMunis] = useState(false);

    //cache para no repetir requests por depto
    const deptsLoadedRef = useRef(false);
    const muniCacheRef = useRef(new Map());

    //
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    jornada_id: Number(id),
                    ubicaciones: values.muni.map((s) => ({
                        municipio_id: s.id,
                        activo: "true",
                    })),
                };
                const { status } = await convocationServices.AssociateLocationToAConvocation(payload);

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(status)) {
                    AlertComponent.success("Operación realizada correctamente");
                    refreshPage();
                } else {
                    AlertComponent.warning("Error", "No se pudo guardar la información");
                }
            } catch (error) {
                console.error(error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            }
        },
    });

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
    const refreshMunicipalities = async (selectedDepts) => {
        if (!selectedDepts?.length) {
            setMuniOptions([]);
            formik.setFieldValue("muni", []);
            return;
        }
        setLoadingMunis(true);

        const lists = await Promise.all(
            selectedDepts.map(async ({ id }) => {
                if (!muniCacheRef.current.has(id)) {
                    const {data, status} = await locationServices.getMunis(id);
                    muniCacheRef.current.set(id, data);
                }
                return muniCacheRef.current.get(id);
            })
        );

        //Unir
        const union = Array.from(
            new Map(lists.flat().map(m => [m.id, m])).values()
        );
        setMuniOptions(union);

        //filtrar seleccionados que ya no existan
        const validIds = new Set(union.map(m => m.id));
        const nextSelected = (formik.values.muni || []).filter(m => validIds.has(m.id));
        if (nextSelected.length !== formik.values.muni.length) {
            formik.setFieldValue("muni", nextSelected);
        }

        setLoadingMunis(false);
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

    const fetchLocationData = async () => {
        try {
            const {data, status} = await convocationServices.getAssociateLocationToAConvocation(id);
            if (status === ResponseStatusEnum.OK) {
                setLocationRegister(data.data?.jornada_ubicaciones);
            }
        } catch (error) {
            console.error(error);
            AlertComponent.error("Hubo un error al procesar la solicitud");
        }
    }

    const handleDeleteLocation = async (locationId) => {
        try{
            const {data, status} = await convocationServices.removeAssociateLocationToAConvocation(locationId);
            if (status === ResponseStatusEnum.OK) {
                AlertComponent.success("Eliminado correctamente");
                refreshPage();
            }

            if(status !== ResponseStatusEnum.OK) {
                AlertComponent.error("Hubo un error al procesar la solicitud");
                console.log(data.data.message);
            }
        } catch (error) {
            console.error(error);
            AlertComponent.error("Hubo un error al procesar la solicitud");
        }
    }

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: 100,
        },
        {
            title: "Departamento",
            dataIndex: "ubicacion_padre_nombre",
            key: "ubicacion_padre_nombre",
            width: 220,
        },
        {
            title: "Municipio",
            dataIndex: "municipio_nombre",
            key: "municipio_nombre",
            width: 220,
        },
        {
            title: "Acciones",
            dataIndex: "actions",
            key: "actions",
            width: 140,
            render: (_, record) => (
                <div className="d-flex gap-2 justify-content-end">
                    <Button
                        variant="outline-danger"
                        onClick={() => handleDeleteLocation(record.id)}
                    >
                        <FaTrash />
                    </Button>
                </div>
            ),
        },
    ];

    const locationRows = locationRegister.map((location) => ({
        id: location?.id,
        ubicacion_padre_nombre: location?.ubicacion_padre_nombre,
        municipio_nombre: location?.ubicacion?.nombre,
    }));

    useEffect(() => {
        loadDepartmentsOnce();
        fetchLocationData();
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
                <Button variant="outline-success" type="submit">
                    Guardar
                </Button>
                <Button
                    variant="outline-secondary"
                    onClick={onBack}
                    type="button"
                    className="btn-action-back"
                >
                    Cancelar
                </Button>
            </div>

            {/* Tabla de ubicaciones */}
            <div className="col-12">
                <SmartTable
                    rowKey="id"
                    columns={columns}
                    dataSource={locationRows}
                    total={locationRows.length}
                    currentPage={1}
                    defaultPageSize={10}
                    pageSizeOptions={["10", "20", "50"]}
                    defaultText="---"
                    emptyText="No tienes ubicaciones en la lista aún."
                    enableRowSelection={false}
                    showToolbar={false}
                    showTableResize={false}
                    showColumnSettings={false}
                    scroll={{ x: 800 }}
                />
            </div>
        </form>
    );
};
