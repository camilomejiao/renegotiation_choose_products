import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
    Autocomplete,
    Button,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import {FaTrash} from "react-icons/fa";

//Suppliers
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";
//Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

const initialValues = {
    suppliers: [],
};

const validationSchema = yup.object().shape({
    suppliers: yup
        .array()
        .of(
            yup.object({
                id: yup.number().required(),
                nombre: yup.string().required(),
            })
        )
        .min(1, "Selecciona al menos un proveedor")
        .required("Selecciona al menos un proveedor"),
});

export const Suppliers = ({ id, onBack }) => {
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [saving, setSaving] = useState(false);

    // Para no recargar proveedores múltiples veces
    const loadedRef = useRef(false);

    // === Formik ===
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: async (values) => {
            try {
                setSaving(true);

                // Mapea al payload que necesite tu API (aquí ejemplo: solo IDs)
                const payload = {
                    jornada_id: id, // si aplica
                    proveedores: values.suppliers.map((s) => s.id),
                };
                // const resp = id ? await servicio.update(id, payload) : await servicio.create(payload);
                const resp = { status: ResponseStatusEnum.OK }; // mock

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(resp.status)) {
                    AlertComponent.success("Proveedores guardados correctamente");
                } else {
                    AlertComponent.warning("Error", "No se pudo guardar la información");
                }
            } catch (err) {
                console.error(err);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            } finally {
                setSaving(false);
            }
        },
    });

    // === Cargar proveedores una sola vez ===
    const loadSuppliersOnce = async () => {
        if (loadedRef.current) {
            return;
        }
        setLoadingOptions(true);
        try {
            const { data, status } = await supplierServices.getSuppliersAll();
            if (status === ResponseStatusEnum.OK) {
                const rows = normalizeSuppliers(data);
                setOptions(rows);
                loadedRef.current = true;
            } else {
                setOptions([]);
            }
        } catch (e) {
            console.error("Error cargando proveedores:", e);
            setOptions([]);
        } finally {
            setLoadingOptions(false);
        }
    };

    const normalizeSuppliers = (data) => {
        return data.map((row) => ({
            id: row?.id,
            name: row?.nombre,
        }));
    }

    useEffect(() => {
        loadSuppliersOnce();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // === Agregar proveedor seleccionado a la tabla ===
    const handleAddSupplier = () => {
        if (!selected) return;

        const alreadyExists = formik.values.suppliers.some((s) => s.id === selected.id);
        if (alreadyExists) {
            AlertComponent.info("", "Este proveedor ya está agregado.");
            return;
        }

        formik.setFieldValue("suppliers", [...formik.values.suppliers, selected]);
        setSelected(null); // limpiar el input
    };

    // === Quitar proveedor de la tabla ===
    const handleRemoveSupplier = (supplierId) => {
        const filtered = formik.values.suppliers.filter((s) => s.id !== supplierId);
        formik.setFieldValue("suppliers", filtered);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="container">
            <div className="row g-3 mt-5">
                {/* Buscador (Autocomplete + botón Agregar) */}
                <div className="col-md-9">
                    <Autocomplete
                        options={options}
                        value={selected}
                        onChange={(_, value) => setSelected(value)}
                        onOpen={loadSuppliersOnce}
                        getOptionLabel={(o) => (o?.nombre ?? "").trim()}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        loading={loadingOptions}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                {option.nombre}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Buscar proveedor"
                                placeholder="Escribe para filtrar..."
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingOptions ? <CircularProgress size={18} /> : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </div>
                <div className="col-md-3 d-grid">
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleAddSupplier}
                        disabled={!selected}
                    >
                        Agregar
                    </Button>
                </div>

                {/* Tabla de proveedores agregados */}
                <div className="col-12">
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                                    <TableCell style={{ fontWeight: 600 }}>Proveedor</TableCell>
                                    <TableCell align="right" style={{ fontWeight: 600 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formik.values.suppliers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">
                                            No has agregado proveedores aún.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    formik.values.suppliers.map((s) => (
                                        <TableRow key={s.id}>
                                            <TableCell>{s.id}</TableCell>
                                            <TableCell>{s.nombre}</TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    aria-label="Eliminar"
                                                    color="error"
                                                    onClick={() => handleRemoveSupplier(s.id)}
                                                >
                                                    <FaTrash />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Mensaje de validación Yup para la lista */}
                    {formik.touched.suppliers && formik.errors.suppliers && (
                        <div className="text-danger mt-2" style={{ fontSize: 12 }}>
                            {typeof formik.errors.suppliers === "string"
                                ? formik.errors.suppliers
                                : "Selecciona al menos un proveedor"}
                        </div>
                    )}
                </div>
            </div>

            {/* Botones Guardar / Cancelar */}
            <div className="text-end mt-4 d-flex gap-2 justify-content-end">
                <Button variant="outline-success" color="success" type="submit" disabled={saving}>
                    {saving ? "Guardando..." : "Guardar"}
                </Button>
                <Button variant="outline-danger" onClick={onBack} type="button">
                    Cancelar
                </Button>
            </div>
        </form>
    );
};
