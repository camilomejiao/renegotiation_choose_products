import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "react-bootstrap";
import { TextField, Select, MenuItem } from "@mui/material";
import {FaBroom, FaFastBackward, FaSave} from "react-icons/fa";

// Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { Footer } from "../../shared/footer/Footer";

// Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";

//Services
import { produstServices } from "../../../../helpers/services/ProdustServices";
import AlertComponentServices from "../../shared/alert/AlertComponentServices";

//Enum
import { StatusEnum } from "../../../../helpers/GlobalEnum";

export const AddProducts = () => {

    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const getUnitOptions = async () => {
        try {
            const {data, status} = await produstServices.getUnitList();
            console.log(data);
            if(status === StatusEnum.OK) setUnitOptions(data);
        } catch (error) {
            console.log(error)
            handleError(error, 'Error buscando productos:');
        }
    }

    const getCategoryOptions = async () => {
        try {
            const {data, status} = await produstServices.getCategoryList();
            console.log(data);
            if(status === StatusEnum.OK) setCategoryOptions(data);
        } catch (error) {
            handleError(error, 'Error buscando productos:');
        }
    }

    const baseColumns = [
        {field: "id", headerName: "ID", width: 90},
        {field: "name", headerName: "Nombre", width: 150, editable: true},
        {field: "description", headerName: "Descripción", width: 200, editable: true},
        {field: "brand", headerName: "Marca", width: 200, editable: true},
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

    const selectedMunicipalities = ["Municipio A", "Municipio B", "Municipio C"];

    const dynamicMunicipalityColumns = selectedMunicipalities.map((municipio) => ({
        field: `price_${municipio}`,
        headerName: `Precio - ${municipio}`,
        width: 150,
        editable: true,
        renderCell: (params) => (
            <TextField
                type="text"
                value={formatPrice(params.value)} // Formatea el valor antes de mostrarlo
                onChange={(e) => {
                    const value = parseFloat(e.target.value.replace(/[^\d]/g, "")); // Remueve caracteres no numéricos
                    if (!isNaN(value)) {
                        params.api.updateRows([{id: params.row.id, [`price_${municipio}`]: value}]);
                    }
                }}
                fullWidth
            />
        ),
    }));

    const columns = [...baseColumns, ...dynamicMunicipalityColumns];

    const formatPrice = (value) => {
        if (!value) return "";
        return new Intl.NumberFormat('es-ES', {style: 'currency', currency: 'COP'}).format(value);
    };

    const handleClipboard = (event) => {
        const clipboardData = event.clipboardData.getData("text");

        //Detectamos la separación la momento del ctrl + v (tabulación o coma)
        const separator = clipboardData.includes("\t") ? "\t" : clipboardData.includes(",") ? "," : null;

        if (!separator) {
            console.error("No se detectó un separador válido en los datos pegados, debe ser tabulacion o coma");
            return;
        }

        // Procesar los datos pegados
        const parsedData = clipboardData
            .split("\n")
            .filter((row) => row.trim() !== "") // Filtrar filas vacías
            .map((row) => row.split(separator).map((cell) => cell.trim())); // Limpiar espacios extra

        const newRows = parsedData.map((rowData, index) => {
            const rowObject = {};

            // Asignar valores a las columnas base
            baseColumns.forEach((col, colIndex) => {
                if (col.field === "unit") {
                    // Buscar la unidad correspondiente
                    const matchedUnit = unitOptions.find(option => option.nombre.trim().toLowerCase() === rowData[colIndex]?.trim().toLowerCase());
                    rowObject[col.field] = matchedUnit
                        ? matchedUnit.id // Asigna el `id` si la unidad existe
                        : unitOptions[0]?.id || 398;
                } else if (col.field === "category") {
                    // Buscar la categoría correspondiente
                    const matchedCategory = categoryOptions.find(option => option.nombre.trim().toLowerCase() === rowData[colIndex]?.trim().toLowerCase());
                    rowObject[col.field] = matchedCategory
                        ? matchedCategory.id // Asigna el `id` si la categoría existe
                        : categoryOptions[0]?.id || 401;
                } else {
                    // Otros campos base
                    rowObject[col.field] = rowData[colIndex] || getDefaultBaseValue(col.field);
                }
            });

            // Asignar valores a las columnas dinámicas (municipios)
            dynamicMunicipalityColumns.forEach((col, colIndex) => {
                const dynamicFieldIndex = baseColumns.length + colIndex; // Índice en los datos pegados
                rowObject[col.field] = rowData[dynamicFieldIndex]
                    ? parseFloat(rowData[dynamicFieldIndex].replace(/[^\d.]/g, "")) // Asegurar que sea numérico
                    : 0; // Default a 0 si está vacío
            });

            // Generar un ID único si no está en los datos pegados
            rowObject.id = rowObject.id || rows.length + index + 1;

            return rowObject;
        });

        // Actualizar los datos
        setRows(newRows);
        setFilteredRows(newRows); // Sincronizar con los datos filtrados
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

    const handleSaveProducts = async () => {
        if (!rows || rows.length === 0) {
            alert("No hay productos para guardar.");
            return;
        }

        setLoading(true); // Mostrar indicador de carga
        console.log('rows: ', rows);
        const batches = chunkArray(rows, 500); // Dividir en lotes de 500
        console.log('batches: ', batches);
        for (const batch of batches) {
            //await sendBatchToService(batch); // Enviar cada lote al servicio
        }
        setLoading(false); // Ocultar indicador de carga
    };

    // Función para dividir en lotes o pedazos el array
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    //
    const sendBatchToService = async (batch) => {
        try {
            const response = await produstServices.save();
            if (!response.ok) throw new Error("Error al enviar el lote");
            return await response.json();
        } catch (error) {
            console.error("Error al enviar el lote:", error);
        }
    };

    //Maneja el error en caso de fallo de la llamada
    const handleError = (error, title) => {
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        AlertComponentServices.error(title,errorMessage);
    };

    useEffect(() => {
        document.addEventListener("paste", handleClipboard);
        return () => {
            document.removeEventListener("paste", handleClipboard);
        };
    }, [rows]);

    useEffect(() => {
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
                            Eliminar busqueda <FaBroom/>
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
