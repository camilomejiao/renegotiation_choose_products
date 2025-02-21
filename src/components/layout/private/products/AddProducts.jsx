import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import { FaBackspace, FaBroom, FaSave, FaTrash } from "react-icons/fa";

// Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";

// Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";

//Services
import { productServices } from "../../../../helpers/services/ProductServices";
import { supplierServices } from "../../../../helpers/services/SupplierServices";

//Enum
import { ResponseStatusEnum } from "../../../../helpers/GlobalEnum";

//Utils
import {
    chunkArray,
    extractMunicipios,
    handleError,
    showAlert
} from "../../../../helpers/utils/utils";
import {
    getBaseColumns,
    getDynamicColumnsBySupplier,
    getUnitOptions,
    getCategoryOptions,
    getEnvironmentalCategories
} from "../../../../helpers/utils/ProductColumns";

export const AddProducts = () => {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [dynamicMunicipalityColumns, setDynamicMunicipalityColumns] = useState([]);

    const baseColumns = getBaseColumns(unitOptions, categoryOptions, true);
    const actionsColumns = [
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 0.7,
            renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FaTrash
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() => handleDeleteClick(params.row.id)}
                    />
                </div>
            ),
            sortable: false,
            filterable: false,
        },
    ]

    const columns = [...baseColumns, ...dynamicMunicipalityColumns, ...actionsColumns];

    const loadData = async () => {
        try {
            const supplierId = getSupplierId();
            const [unitData, categoryData, { newDynamicColumns }] = await Promise.all([
                getUnitOptions(),
                getCategoryOptions(),
                getDynamicColumnsBySupplier(supplierId, true)
            ]);

            setUnitOptions(unitData);
            setCategoryOptions(categoryData);
            setDynamicMunicipalityColumns(newDynamicColumns);
        } catch (error) {
            handleError(error, "Error cargando los datos iniciales.");
        }
    };

    //
    const handleClipboard = async (event) => {
        const clipboardData = event.clipboardData.getData("text");

        //Detectamos el separador
        const separator = clipboardData.includes("\t") ? "\t" : clipboardData.includes(",") ? "," : null;

        if (!separator) {
            handleError('Error', 'No se detectó un separador válido en los datos pegados, debe ser tabulación o coma.');
            return;
        }

        // Esperar a que se carguen las columnas dinámicas
        const supplierId = getSupplierId();
        const { newDynamicColumns: dynamicColumns } = await getDynamicColumnsBySupplier(supplierId,true);
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
                    rowObject[col.field] = rowData[colIndex] || getDefaultBaseValue(col.field);
                }
            });

            //Asignamos valores a las columnas dinámicas
            dynamicColumns.forEach((col, colIndex) => {
                const dynamicFieldIndex = baseColumns.length + colIndex; //Índice basado en el orden
                rowObject[col.field] = rowData[dynamicFieldIndex]
                    ? parseFloat(rowData[dynamicFieldIndex].replace(/[^\d.]/g, ""))
                    : '0.00';
            });

            return rowObject;
        });

        setRows(newRows); //Actualizamos los datos
        setFilteredRows(newRows); //Sincronizamos con los datos filtrados
    };

    const getDefaultBaseValue = (field) => {
        const defaultValues = {
            name: "Producto sin nombre", // Valor por defecto para el nombre
            description: "Descripción no disponible", // Valor por defecto para la descripción
            unit: "Unidad", // Valor por defecto para la unidad
            category: "Piscicultura", // Valor por defecto para la categoría
        };

        return defaultValues[field] || ""; // Retorna el valor predeterminado o vacío si no está configurado
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

    const handleBack = () => navigate('/admin/products');

    //Manejo principal para guardar productos
    const handleSaveProducts = async () => {
        if (!rows || rows.length === 0) {
            handleError('Error', 'No hay productos para guardar.');
            return;
        }

        try {
            setLoading(true); // Mostrar indicador de carga
            const transformedData = await transformData(rows); // Transformar los datos
            const batches = chunkArray(transformedData, 500);

            await sendBatchesInParallel(batches);

            showAlert('', 'Todos los productos se han creado exitosamente');

            // Limpiamos la tabla
            setRows([]);
            setFilteredRows([]);
        } catch (error) {
            handleError('Error', `${error.message}`);
        } finally {
            setLoading(false); // Ocultar indicador de carga
        }
    };

    //Transformar datos para ajustarlos al formato esperado por la API
    const transformData = async (inputData) => {
        const supplierId = parseInt(getSupplierId());
        const environmentalKeys = await getEnvironmentalCategoryKeys();

        return inputData.map(product => ({
            proveedor_id: supplierId,
            nombre: product.name,
            especificacion_tecnicas: product.description,
            referencia: product.reference,
            marca_comercial: product.brand,
            unidad_medida: product.unit,
            categoria_producto: product.category,
            valor_municipio: extractMunicipios(product),
            ambiental: buildData(product, environmentalKeys),
        }));
    };

    //Obtener el ID del proveedor
    const getSupplierId = () => {
        return supplierServices.getSupplierId();
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

    //Enviar lotes en paralelo con control de concurrencia
    const sendBatchesInParallel = async (batches, maxConcurrent = 5) => {
        const errors = []; // Para almacenar los errores
        for (let i = 0; i < batches.length; i += maxConcurrent) {
            const batchChunk = batches.slice(i, i + maxConcurrent);

            const results = await Promise.allSettled(
                batchChunk.map(batch => sendBatchToService(batch))
            );

            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    errors.push(result.reason);
                }
            });
        }

        if (errors.length > 0) {
            throw new Error(`${errors}`);
        }
    };

    const sendBatchToService = async (batch) => {
        const { data, status } = await productServices.save(batch);
        if (status === ResponseStatusEnum.BAD_REQUEST) {
            throw new Error(`${data}`);
        }

        if (status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
            throw new Error(`${data}`);
        }
        return data;
    };

    // Función para eliminar un elemento de la tabla
    const handleDeleteClick = (id) => {
        const updatedRows = filteredRows.filter((row) => row.id !== id);
        setFilteredRows(updatedRows);
    };

    // Cargar datos iniciales
    useEffect(() => {
        loadData();
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
                bannerIcon={""}
                bannerInformation={""}
            />

            <div className="container mt-lg-3">
                <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-3 mb-3">
                    <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="input-responsive me-2"
                        />
                        <Button
                            variant="outline-success"
                            size="md"
                            onClick={handleUploadTable}
                            className="button-order-responsive"
                        >
                            Reiniciar tabla <FaBroom/>
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleBack}
                            className="button-order-responsive">
                            Atras <FaBackspace />
                        </Button>
                    </div>
                </div>

                {loading && (
                    <div className="overlay">
                        <div className="loader">Guardando Productos...</div>
                    </div>
                )}

                <div style={{height: 600, width: "100%"}}>
                    <DataGrid
                        rows={filteredRows}
                        columns={columns}
                        pagination
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
                                backgroundColor: "#40A581",
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
                                backgroundColor: "#40A581 !important",
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
                        variant="success"
                        size="md"
                        onClick={handleSaveProducts}
                        className="ms-auto"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar Productos"} <FaSave/>
                    </Button>
                </div>

            </div>

        </div>
    );
};
