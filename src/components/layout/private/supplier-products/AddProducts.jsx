import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import { TextField, Select, MenuItem } from "@mui/material";
import {FaBroom, FaFastBackward, FaSave} from "react-icons/fa";

// Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { Footer } from "../../shared/footer/Footer";
import AlertComponentServices from "../../shared/alert/AlertComponentServices";

// Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";

//Services
import { productServices } from "../../../../helpers/services/ProductServices";
import { supplierServices } from "../../../../helpers/services/SupplierServices";

//Enum
import { StatusEnum } from "../../../../helpers/GlobalEnum";
import {authService} from "../../../../helpers/services/Auth";

export const AddProducts = () => {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [dynamicMunicipalityColumns, setDynamicMunicipalityColumns] = useState([]);

    //
    const getInfoSupplier = async () => {
        try {
            const { data, status } = await supplierServices.getInfoSupplier();
            if (status === StatusEnum.OK) {

                const newDynamicColumns = Object.entries(data.municipios).map(([key, value]) => {
                    const [name] = value.split(" : ").map(str => str.trim());
                    return {
                        field: `price_${key}`,
                        headerName: `Precio - ${name}`,
                        width: 150,
                        editable: true,
                        renderCell: (params) => (
                            <TextField
                                type="text"
                                value={formatPrice(params.value)} // Formatea el valor antes de mostrarlo
                                onChange={(e) => {
                                    const value = parseFloat(e.target.value.replace(/[^\d]/g, ""));
                                    if (!isNaN(value)) {
                                        params.api.updateRows([{ id: params.row.id, [`price_${key}`]: value }]);
                                    }
                                }}
                                fullWidth
                            />
                        ),
                    };
                });

                setDynamicMunicipalityColumns(newDynamicColumns);
                return newDynamicColumns; // Devuelve las columnas dinámicas
            }
        } catch (error) {
            console.log(error);
            handleError(error, "Error buscando productos:");
            return [];
        }
    };

    //
    const getUnitOptions = async () => {
        try {
            const {data, status} = await productServices.getUnitList();
            if(status === StatusEnum.OK) setUnitOptions(data);
            return data;
        } catch (error) {
            console.log(error)
            handleError(error, 'Error buscando productos:');
        }
    }

    //
    const getCategoryOptions = async () => {
        try {
            const {data, status} = await productServices.getCategoryList();
            if(status === StatusEnum.OK) setCategoryOptions(data);
            return data;
        } catch (error) {
            handleError(error, 'Error buscando productos:');
        }
    }

    const baseColumns = [
        {field: "id", headerName: "ID", width: 90},
        {field: "name", headerName: "Nombre", width: 150, editable: true},
        {field: "description", headerName: "Descripción", width: 200, editable: true},
        {field: "brand", headerName: "Marca", width: 200, editable: true},
        {field: "reference", headerName: "Referencia", width: 200, editable: true},
        {
            field: "unit",
            headerName: "Unidad",
            width: 150,
            editable: true,
            renderCell: (params) => (
                <Select
                    value={params.value || ""}
                    onChange={(e) =>
                        params.api.updateRows([{id: params.row.id, unit: e.target.value}])
                    }
                    fullWidth
                >
                    {unitOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.nombre}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
        {
            field: "category",
            headerName: "Categoría",
            width: 150,
            editable: true,
            renderCell: (params) => (
                <Select
                    value={params.value || ""}
                    onChange={(e) =>
                        params.api.updateRows([{id: params.row.id, category: e.target.value}])
                    }
                    fullWidth
                >
                    {categoryOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.nombre}
                        </MenuItem>
                    ))}
                </Select>
            ),
        },
    ];

    const columns = [...baseColumns, ...dynamicMunicipalityColumns];

    //
    const formatPrice = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat('es-ES', {style: 'currency', currency: 'COP'}).format(value);
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
        const dynamicColumns = await getInfoSupplier();
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

    const handleClearSearch = () => {
        setSearchQuery("");
        setFilteredRows(rows);
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
            setLoading(true); // Mostrar indicador de carga
            const transformedData = transformData(rows); // Transformar los datos
            const batches = chunkArray(transformedData, 500); // Dividir en lotes de 500

            await sendBatchesInParallel(batches); // Enviar lotes en paralelo

            AlertComponentServices.success('', 'Todos los productos se han creado exitosamente');

            //Limpiamos la tabla
            setRows([]);
            setFilteredRows([]);
        } catch (error) {
            console.error('Error al guardar productos:', error.message);
            handleError('Error', 'Hubo un problema al guardar los productos.');
        } finally {
            setLoading(false); // Ocultar indicador de carga
        }
    };

    //Transformar datos para ajustarlos al formato esperado por la API
    const transformData = (inputData) => {
        const supplierId = parseInt(getSupplierId());

        return inputData.map(product => ({
            proveedor_id: supplierId,
            nombre: product.name,
            especificacion_tecnicas: product.description,
            referencia: product.reference,
            marca_comercial: product.brand,
            unidad_medida: product.unit,
            categoria_producto_id: product.category,
            valor_unitario: 0,
            municipios: extractMunicipios(product), // Extraer municipios dinámicamente
        }));
    };

    //Obtener el ID del proveedor
    const getSupplierId = () => {
        return authService.getSupplierId();
    };

    //Extraer los precios de municipios dinámicos
    const extractMunicipios = (product) => {
        return Object.keys(product)
            .filter(key => key.startsWith("price_")) // Filtrar claves que empiezan con "price_"
            .reduce((acc, key) => {
                const municipioId = key.split("_")[1]; // Obtener el ID del municipio
                acc[municipioId] = product[key]; // Asignar el precio al municipio
                return acc;
            }, {});
    };

    //Dividir un array en lotes
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    //Enviar lotes en paralelo con control de concurrencia
    const sendBatchesInParallel = async (batches, maxConcurrent = 5) => {
        for (let i = 0; i < batches.length; i += maxConcurrent) {
            const batchChunk = batches.slice(i, i + maxConcurrent);

            await Promise.all(
                batchChunk.map(async (batch) => {
                    try {
                        await sendBatchToService(batch);
                    } catch (error) {
                        console.error(`Error al enviar el lote: ${error.message}`);
                        AlertComponentServices.error('Error', `Error al enviar el lote: ${error.message}`);
                    }
                })
            );
        }
    };

    //Enviar un lote al servicio
    const sendBatchToService = async (batch) => {
        try {
            const { status } = await productServices.save(batch);

            if (status === StatusEnum.CREATE) {
                console.log('Lote enviado exitosamente:', batch);
            } else {
                throw new Error(`Estado inválido (${status}) al enviar el lote`);
            }
        } catch (error) {
            console.error('Error al enviar el lote:', error.message);
            throw error; // Re-lanzar el error para que sea manejado en sendBatchesInParallel
        }
    };

    //Maneja el error en caso de fallo de la llamada
    const handleError = (error, title, ) => {
        AlertComponentServices.error(error, title);
    };

    useEffect(() => {
        document.addEventListener("paste", handleClipboard);
        return () => {
            document.removeEventListener("paste", handleClipboard);
        };
    }, [rows]);

    useEffect(() => {
        getInfoSupplier();
        getUnitOptions();
        getCategoryOptions();
    }, []);

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
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="input-responsive me-2"
                    />
                    <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleClearSearch}
                            className="button-order-responsive"
                        >
                            Limpiar busqueda <FaBroom/>
                        </Button>
                        <Button
                            variant="outline-success"
                            size="md"
                            onClick={handleUploadTable}
                            className="button-order-responsive"
                        >
                            Reiniciar tabla <FaBroom/>
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => navigate(-1)}
                            className="button-order-responsive"
                        >
                            Atrás <FaFastBackward/>
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
            <Footer/>
        </div>
    );
};
