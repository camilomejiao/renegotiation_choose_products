import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { FaBackspace, FaBroom, FaSave } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

//
import { HeaderImage } from "../../../shared/header_image/HeaderImage";
import imgPeople from "../../../../../assets/image/addProducts/people1.jpg";

//Utils
import { getNewCatalogBaseColumns, getDeleteActionsColumns } from "../../../../../helpers/utils/ConvocationProductColumns";
import {
    getCategoryOptions,
    getEnvironmentalCategories,
    getUnitOptions
} from "../../../../../helpers/utils/ValidateProductColumns";
import { handleError, showAlert } from "../../../../../helpers/utils/utils";

//Enum
import { ResponseStatusEnum } from "../../../../../helpers/GlobalEnum";

//Services
import { convocationProductsServices } from "../../../../../helpers/services/ConvocationProductsServices";
import AlertComponent from "../../../../../helpers/alert/AlertComponent";
import { Loading } from "../../../shared/loading/Loading";

export const ProductUploadTechnical = () => {

    const navigate = useNavigate();

    const [convocations, setConvocations] = useState([]);
    const [selectedConvocation, setSelectedConvocation] = useState(null);

    const [planRaw, setPlanRaw] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);

    // Si mantienes formFields en otro lado:
    const [formFields, setFormFields] = useState({typeCall: "", typePlan: ""});

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);


    const loadData = async () => {
        try {
            const [unitData, categoryData] = await Promise.all([
                getUnitOptions(),
                getCategoryOptions(),
            ]);

            setUnitOptions(unitData);
            setCategoryOptions(categoryData);
        } catch (error) {
            handleError(error, "Error cargando los datos iniciales.");
        }
    };

    //Obtener la lista de jornadas
    const getConvocations = async () => {
        setLoading(true);
        try {
            const {data, status} = await convocationProductsServices.getConvocations();
            if (status === ResponseStatusEnum.OK) {
                setConvocations(data.data.jornadas);
            }
        } catch (error) {
            console.error("Error al obtener la lista de proveedores:", error);
        } finally {
            setLoading(false);
        }
    }

    // Cargar planes
    const getPlans = async (convocationId) => {
        try {
            setLoading(true);
            const { data, status } = await convocationProductsServices.getPlansByConvocation(convocationId);
            if (status === ResponseStatusEnum.OK) {
                setPlanRaw(data?.data?.planes ?? []);
            }
        } catch (error) {
            console.log(error);
            setPlanRaw([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectedConvocation = async (option) => {
        setSelectedConvocation(option ?? null);
        setSelectedPlan(null);
        setFormFields(prev => ({
            ...prev,
            typeCall: option?.value ?? "", // API
            typePlan: ""
        }));
        setPlanRaw([]);
        if (option?.value) await getPlans(option.value);
    };

    const handleSelectedPlan = (option) => {
        setSelectedPlan(option ?? null);
        setFormFields(prev => ({
            ...prev,
            typePlan: option?.value ?? ""
        }));
    };

    //
    const handleRowUpdate = (newRow) => {
        setRows(prevRows => {
            const updated = prevRows.map((row) => row.id === newRow.id ? newRow : row);
            setFilteredRows(updated);
            return updated;
        });
        return newRow;
    };

    // Función para eliminar un elemento de la tabla
    const handleDeleteClick = (id) => {
        setRows(prevRows => {
            const updated = prevRows.filter(row => row.id !== id);
            setFilteredRows(updated);
            return updated;
        });
    };

    const baseColumns = getNewCatalogBaseColumns(unitOptions, categoryOptions, handleRowUpdate, true);
    const actionsColumns = getDeleteActionsColumns(handleDeleteClick)

    const columns = [...baseColumns, ...actionsColumns];

    //
    const handleClipboard = async (event) => {
        const clipboardData = event.clipboardData.getData("text");

        //Detectamos el separador
        const separator = clipboardData.includes("\t") ? "\t" : clipboardData.includes(",") ? "," : null;

        if (!separator) {
            handleError('Error', 'No se detectó un separador válido en los datos pegados, debe ser tabulación o coma.');
            return;
        }

        const units = await getUnitOptions();
        const categories = await getCategoryOptions();

        //Procesamos los datos pegados
        const parsedData = clipboardData
            .split("\n")
            .filter((row) => row.trim() !== "") //Filtrar filas vacías
            .map((row) => row.split(separator).map((cell) => cell.trim()));

        const newRows = parsedData.map((rowData, index) => {
            const rowObject = {};

            //Asignamos valores a las columnas base
            baseColumns.forEach((col, colIndex) => {
                if (col.field === "unit") {
                    const matchedUnit = units.find(option => option.nombre.trim().toLowerCase() === rowData[colIndex]?.trim().toLowerCase());
                    rowObject[col.field] = matchedUnit ? matchedUnit.id : units[0]?.id || 398;
                } else if (col.field === "category") {
                    const matchedCategory = categories.find(option => option.nombre.trim().toLowerCase() === rowData[colIndex]?.trim().toLowerCase());
                    rowObject[col.field] = matchedCategory ? matchedCategory.id : categories[0]?.id || 401;
                } else {
                    rowObject[col.field] = rowData[colIndex];
                }
            });

            return rowObject;
        });

        setRows(newRows); //Actualizamos los datos
        setFilteredRows(newRows); //Sincronizamos con los datos filtrados
    };

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredData = rows.filter((row) =>
            Object.values(row).some((value) =>
                value.toString().toLowerCase().includes(query)
            )
        );
        setFilteredRows(filteredData);
    };

    const handleUploadTable = () => {
        window.location.reload();
    };

    //Manejo principal para guardar productos
    const handleSaveProducts = async () => {
        if (!rows || rows.length === 0) {
            handleError('Error', 'No hay productos para guardar.');
            return;
        }

        try {
            setLoading(true);

            const productos = await transformData(rows);

            let sendData = {
                jornada_plan: Number(formFields.typePlan),
                productos
            }

            const { data, status } = await convocationProductsServices.saveProductsByConvocation(sendData);

            if (status === ResponseStatusEnum.BAD_REQUEST) {
                const perItemErrors = data?.data?.errores?.productos ?? [];

                const messages = perItemErrors
                    .map((obj, idx) => {
                        if (!obj || Object.keys(obj).length === 0) return null; // sin errores en ese índice

                        const lines = Object.entries(obj).flatMap(([field, val]) => {
                            const arr = Array.isArray(val) ? val : [val];
                            return arr.map(msg =>
                                field === "non_field_errors" ? `${msg}` : `${field}: ${msg}`
                            );
                        });

                        return `Producto #${idx + 1}: ${lines.join(" | ")}`;
                    })
                    .filter(Boolean);

                if (messages.length) {
                    AlertComponent.warning("Errores de validación", messages.join("\n"));
                } else {
                    AlertComponent.warning("Errores de validación", data?.message ?? "Revisa los datos enviados.");
                }
                return;
            }

            if (status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
                handleError(`${data?.data?.errores}`);
            }

            if(status === ResponseStatusEnum.CREATED) {
                showAlert('', 'Todos los productos se han creado exitosamente');
            }

            // Limpiamos la tabla
            setRows([]);
            setFilteredRows([]);
        } catch (error) {
            handleError('Error', `${error.message}`);
        } finally {
            setLoading(false); // Ocultar indicador de carga
        }
    };

    //Obtener las claves ambientales
    const getEnvironmentalCategoryKeys = async () => {
        const categories = await getEnvironmentalCategories();
        return categories.map((category) => category.codigo);
    };

    const buildData = (product, keys) => {
        return Object.fromEntries(
            keys.map((key) => [key, 1])
        );
    };

    //Transformar datos para ajustarlos al formato esperado por la API
    const transformData = async (inputData) => {
        const environmentalKeys = await getEnvironmentalCategoryKeys();

        return inputData.map(product => ({
            categoria_producto: product?.category,
            nombre: product?.name,
            unidad_medida: product?.unit,
            precio_min: Number(product?.price_min),
            precio_max: Number(product?.price_max),
            ambiental: buildData(product, environmentalKeys),
            cantidad_ambiental: {
                cant: parseInt(product?.customValue) || 0,
                ambiental_key: product?.selectedCategory || ""
            },
        }));
    };

    const handleBack = () => navigate('/admin/list-products-by-convocation');

    // Cargar datos iniciales
    useEffect(() => {
        loadData();
        getConvocations();

    }, []);

    useEffect(() => {
        document.addEventListener("paste", handleClipboard);
        return () => {
            document.removeEventListener("paste", handleClipboard);
        };
    }, [rows]);

    return (
        <div className="main-container">
            <HeaderImage
                imageHeader={imgPeople}
                titleHeader={"¡Empieza a agregar tus productos!"}
                bannerIcon={''}
                backgroundIconColor={''}
                bannerInformation={''}
                backgroundInformationColor={''}
            />

            <div className="container mt-lg-3">
                {/* Select */}
                <Row className="gy-3">
                    {/* Select Jornada */}
                    <Col xs={12} md={4}>
                        <Select
                            value={selectedConvocation ?? null}
                            options={convocations?.map(opt => ({ value: opt.id, label: opt.nombre }))}
                            placeholder="Selecciona una Jornada"
                            onChange={handleSelectedConvocation}
                            isClearable
                            classNamePrefix="custom-select"
                            className="custom-select w-100"
                            styles={{
                                placeholder: (base) => ({ ...base, color: '#6c757d' }),
                                singleValue: (base) => ({ ...base, color: '#212529' }),
                            }}
                            noOptionsMessage={() => "Sin opciones"}
                        />
                    </Col>

                    {/* Select Plan */}
                    <Col xs={12} md={4}>
                        <Select
                            value={selectedPlan ?? null}
                            options={planRaw.map(opt => ({ value: opt.id, label: opt.plan_nombre }))}
                            placeholder="Selecciona un Plan"
                            onChange={handleSelectedPlan}
                            isClearable
                            isDisabled={!selectedConvocation || loading}
                            isLoading={loading}
                            classNamePrefix="custom-select"
                            className="custom-select w-100"
                            noOptionsMessage={() => selectedConvocation ? "Sin planes" : "Selecciona una jornada"}
                        />
                    </Col>
                </Row>

                <hr/>

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 w-100 mb-2">
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="input-responsive me-2"
                    />
                    <div className="text-end">
                        <Button
                            variant="outline-success"
                            onClick={handleUploadTable}
                            className="button-order-responsive"
                        >
                            <FaBroom/> Reiniciar tabla
                        </Button>
                        <Button
                            variant="outline-secondary"
                            onClick={handleBack}
                            className="button-order-responsive btn-action-back">
                            <FaBackspace /> Atras
                        </Button>
                    </div>
                </div>


                {loading && <Loading fullScreen text="Cargando..." />}

                <div style={{height: 600, width: "100%"}}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pagination
                        processRowUpdate={handleRowUpdate}
                        editMode="row"
                        pageSize={100}
                        rowsPerPageOptions={[100, 500, 1000]}
                        checkboxSelection
                        componentsProps={{
                            columnHeader: {
                                style: {
                                    textAlign: "left",
                                    fontWeight: "bold",
                                    fontSize: "10px",
                                    wordWrap: "break-word",
                                },
                            },
                        }}
                        sx={{
                            "& .MuiDataGrid-columnHeaders": {
                                backgroundColor: "#2d3a4d",
                                color: "white",
                                fontSize: "14px",
                            },
                            "& .MuiDataGrid-columnHeader": {
                                textAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            },
                            "& .MuiDataGrid-container--top [role=row], .MuiDataGrid-container--bottom [role=row]": {
                                backgroundColor: "#2d3a4d !important",
                                color: "white !important",
                            },
                            "& .MuiDataGrid-cell": {
                                fontSize: "14px",
                                textAlign: "center",
                                justifyContent: "center",
                                display: "flex",
                            },
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#E8F5E9",
                            },
                        }}
                    />
                </div>

                {/* Botón Guardar */}
                <div className="d-flex align-items-end mt-3">
                    <Button
                        variant="outline-success"
                        onClick={handleSaveProducts}
                        className="ms-auto"
                        disabled={loading}
                    >
                        <FaSave/> {loading ? "Guardando..." : "Guardar Productos"}
                    </Button>
                </div>

            </div>

        </div>
    )
}
