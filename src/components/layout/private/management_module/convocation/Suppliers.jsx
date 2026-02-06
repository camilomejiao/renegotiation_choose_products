import { useEffect, useRef, useState, useMemo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
    Autocomplete,
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
import { Button } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";

// Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

// Helpers
import AlertComponent from "../../../../../helpers/alert/AlertComponent";

// Services
import { supplierServices } from "../../../../../helpers/services/SupplierServices";
import { convocationServices } from "../../../../../helpers/services/ConvocationServices";

/**
 * @typedef {Object} SupplierRow
 * @property {number} id
 * @property {string} name
 * @property {boolean} persisted   // true si viene de BD (ya asociado)
 */

const initialValues = {
    /** @type {SupplierRow[]} */
    suppliers: [],
};

const validationSchema = yup.object().shape({
    suppliers: yup
        .array()
        .of(
            yup.object({
                id: yup.number().required(),
                name: yup.string().required(),
                persisted: yup.boolean().required(),
            })
        )
        .min(0),
});

export const Suppliers = ({ id, onBack, refreshPage }) => {
    /** Catálogo de proveedores activos (para el Autocomplete) */
    const [options, setOptions] = useState([]);
    /** Opción seleccionada en Autocomplete */
    const [selected, setSelected] = useState(null);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [saving, setSaving] = useState(false);

    //Para no recargar el catálogo múltiples veces
    const loadedRef = useRef(false);

    const formik = useFormik({
        initialValues,
        validationSchema,
        enableReinitialize: false,
        onSubmit: async (values) => {
            try {
                setSaving(true);
                // Solo enviamos los NUEVOS (persisted: false)
                const nuevos = values.suppliers.filter((s) => !s.persisted);
                if (nuevos.length === 0) {
                    AlertComponent.info("", "No hay proveedores nuevos para guardar.");
                    return;
                }

                const payload = {
                    jornada_id: Number(id),
                    proveedores: nuevos.map((s) => ({
                        proveedor_id: s.id,
                        activo: "true",
                    })),
                };

                const { status } = await convocationServices.AssociateSupplierToAConvocation(payload);

                if ([ResponseStatusEnum.OK, ResponseStatusEnum.CREATED].includes(status)) {

                    // Actualizamos los recién guardados a persisted:true
                    const actualizados = values.suppliers.map((s) =>
                        s.persisted ? s : { ...s, persisted: true }
                    );
                    formik.setFieldValue("suppliers", actualizados, false);

                    AlertComponent.success("Proveedores guardados correctamente");
                    refreshPage();
                } else {
                    AlertComponent.warning("Error", "No se pudo guardar la información");
                }
            } catch (error) {
                console.error(error);
                AlertComponent.error("Hubo un error al procesar la solicitud");
            } finally {
                setSaving(false);
            }
        },
    });

    //
    const normalizeCatalogSuppliers = (data) => {
        const rows =  data?.data?.proveedores;
        return rows.map((row) => ({
            id: Number(row?.id),
            name: row?.nombre,
            nit: row?.nit,
            persisted: false,
        }));
    }

    //Ajusta estos campos según tu respuesta real del backend de asociados
    const normalizeAssociatedSuppliers = (data) => {
        const payload = data?.data?.jornada_proveedores;
        return payload.map((row) => ({
            id: Number(row?.id),
            name: String(row?.proveedor?.nombre),
            persisted: true,
        }));
    }

    // === Carga catálogo (activos) una sola vez ===
    const loadSuppliersOnce = async () => {
        if (loadedRef.current) return;
        setLoadingOptions(true);
        try {
            const { data, status } = await supplierServices.getSuppliers();
            if (status === ResponseStatusEnum.OK) {
                setOptions(normalizeCatalogSuppliers(data));
                loadedRef.current = true;
            } else {
                setOptions([]);
            }
        } catch (e) {
            console.error("Error cargando proveedores (catálogo):", e);
            setOptions([]);
        } finally {
            setLoadingOptions(false);
        }
    };

    // === Carga los asociados a la jornada (ya guardados en BD) ===
    const fetchAssociatedSuppliers = async () => {
        try {
            const { data, status } = await convocationServices.getAssociateSupplierToAConvocation(id);
            if (status === ResponseStatusEnum.OK) {
                const asociados = normalizeAssociatedSuppliers(data);
                formik.setFieldValue("suppliers", asociados, false);
            }
        } catch (error) {
            console.error("Error cargando proveedores asociados:", error);
        }
    };

    // === Agregar proveedor (evita duplicados) ===
    const handleAddSupplier = () => {
        if (!selected) return;

        const current = formik.values.suppliers;
        const exists = current.some((s) => s.id === selected.id);
        if (exists) {
            AlertComponent.info("", "Este proveedor ya está en la lista.");
            setSelected(null);
            return;
        }

        const nuevo = {
            id: selected.id,
            name: selected.name,
            persisted: false,
        };
        formik.setFieldValue("suppliers", [...current, nuevo]);
        setSelected(null);
    };

    // === Quitar proveedor (temporal) del array ===
    const handleRemoveSupplierTransient = (supplierId) => {
        const filtered = formik.values.suppliers.filter((s) => s.id !== supplierId);
        formik.setFieldValue("suppliers", filtered);
    };

    // === Quitar proveedor (guardado en BD) ===
    const handleDeleteSupplierPersisted = async (supplierId) => {
        try {
            const { status} = await convocationServices.removeAssociateSupplierToAConvocation(supplierId);

            if (status === ResponseStatusEnum.OK) {
                //Eliminamos de la tabla
                const filtered = formik.values.suppliers.filter((supp) => supp.id !== supplierId);
                formik.setFieldValue("suppliers", filtered);

                AlertComponent.success("Proveedor eliminado de la convocatoria.");
            } else {
                AlertComponent.warning("No se pudo eliminar el proveedor.");
            }
        } catch (error) {
            console.error("Error eliminando proveedor en BD:", error);
            AlertComponent.error("Error eliminando el proveedor en BD.");
        }
    };

    // Opciones del Autocomplete excluyendo las ya listadas
    const filteredOptions = useMemo(() => {
        const inList = new Set(formik.values.suppliers.map((s) => s.id));
        return options.filter((o) => !inList.has(o.id));
    }, [options, formik.values.suppliers]);

    useEffect(() => {
        loadSuppliersOnce();
        fetchAssociatedSuppliers();
    }, [id]);

    return (
        <form onSubmit={formik.handleSubmit} className="container">
            <div className="row g-3 mt-5">

                {/* Buscador (Autocomplete + botón Agregar) */}
                <div className="col-md-9">
                    <Autocomplete
                        options={filteredOptions}
                        value={selected}
                        onChange={(_, value) => setSelected(value)}
                        onOpen={loadSuppliersOnce}
                        getOptionLabel={(opt) => (`${opt?.name} - ${opt?.nit}` ?? "").trim()}
                        isOptionEqualToValue={(opt, variable) => opt.id === variable.id}
                        loading={loadingOptions}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                {`${option.name} - ${option.nit}`}
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
                {/* */}
                <div className="col-md-3 d-grid">
                    <Button variant="outline-primary" onClick={handleAddSupplier} disabled={!selected}>
                        Agregar
                    </Button>
                </div>

                {/* Botones Guardar / Cancelar */}
                <div className="text-end mt-4 d-flex gap-2 justify-content-end">
                    <Button
                        variant="outline-success"
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? "Guardando..." : "Guardar"}
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

                {/* Tabla de proveedores (mezcla guardados + temporales) */}
                <div className="col-12">
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 600 }}>ID</TableCell>
                                    <TableCell style={{ fontWeight: 600 }}>Proveedor</TableCell>
                                    <TableCell style={{ fontWeight: 600 }}>Estado</TableCell>
                                    <TableCell style={{ fontWeight: 600 }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {formik.values.suppliers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No tienes proveedores en la lista aún.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    formik.values.suppliers.map((supplier) => (
                                        <TableRow key={supplier.id}>
                                            <TableCell>{supplier.id}</TableCell>
                                            <TableCell>{supplier.name}</TableCell>
                                            <TableCell>
                                                {supplier.persisted ? (
                                                    <span className="badge text-bg-info">Guardado</span>
                                                ) : (
                                                    <span className="badge text-bg-success">Nuevo</span>
                                                )}
                                            </TableCell>
                                            <TableCell align="right" className="d-flex gap-2 justify-content-end">
                                                {supplier.persisted ? (
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDeleteSupplierPersisted(supplier.id)}
                                                    >
                                                        Desasociar
                                                    </Button>
                                                ) : (
                                                    <IconButton
                                                        aria-label="Eliminar"
                                                        color="error"
                                                        onClick={() => handleRemoveSupplierTransient(supplier.id)}
                                                    >
                                                        <FaTrash />
                                                    </IconButton>
                                                )}
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
        </form>
    );
};
