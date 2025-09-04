import { useEffect, useState } from "react";
import {Button, Col, Row, Spinner} from "react-bootstrap";
import { FaBackspace, FaBroom, FaSave } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

//
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import imgPeople from "../../../../../../assets/image/addProducts/people1.jpg";

//Utils
import { getNewCatalogBaseColumns, getActionsColumns } from "../../../../../../helpers/utils/ConvocationProductColumns";
import { getCategoryOptions, getUnitOptions } from "../../../../../../helpers/utils/ValidateProductColumns";
import { chunkArray, handleError, showAlert } from "../../../../../../helpers/utils/utils";

//Enum
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

//Services
import { worksDayServices } from "../../../../../../helpers/services/WorksDayServices";

export const ProductUpload = () => {

    const navigate = useNavigate();

    const [convocation, setConvocation] = useState([]);
    const [planOptions, setPlanOptions] = useState([]);
    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [formFields, setFormFields] = useState({
        typeCall: '',
        typePlan: '',
    });

    //

    const getWorksDay = async () => {
        try {
            setLoading(true);
            const {data, status} = await worksDayServices.getConvocations();
            if (status === ResponseStatusEnum.OK) {
                setConvocation(data?.data?.jornadas)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    //Cargar planes
    const getPlans = async (workDayId) => {
        try {
            setLoading(true);
            const { data, status} = await worksDayServices.getPlansByConvocation(workDayId);
            if(status === ResponseStatusEnum.OK) {
                setPlanOptions(data?.data?.planes)
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    //
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormFields({ ...formFields, [name]: value });
    };

    //
    const handleSelectWorkDay = async (e) => {
        const { name, value } = e.target;
        setFormFields((prev) => ({ ...prev, [name]: value, typePlan: "" }));
        setPlanOptions([]);
        if (!value) return;
        await getPlans(value);
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
    const actionsColumns = getActionsColumns(handleDeleteClick)

    const columns = [...baseColumns, ...actionsColumns];

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

            const jornadaPlanId = Number(formFields.typePlan);
            const productos = await transformData(rows);

            let sendData = {
                jornada_plan: jornadaPlanId,
                productos
            }
            //console.log(sendData);
            await sendBatchesInParallel(sendData);

            showAlert('', 'Todos los productos se han creado exitosamente');
            handleBack();

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
        return inputData.map(product => ({
            categoria_producto: product.category,
            nombre: product.name,
            unidad_medida: product.unit,
            precio_min: product.price_min,
            precio_max: product.price_max,
        }));
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
        const { data, status } = await worksDayServices.saveProductsByConvocation(batch);
        if (status === ResponseStatusEnum.BAD_REQUEST) {
            throw new Error(`${data}`);
        }

        if (status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
            throw new Error(`${data}`);
        }
        return data;
    };

    const handleBack = () => navigate('/admin/list-products-by-convocation');

    // Cargar datos iniciales
    useEffect(() => {
        loadData();
        getWorksDay();

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

            {loading && (
                <div className="spinner-container">
                    <Spinner animation="border" variant="success" />
                    <span>Cargando...</span>
                </div>
            )}

            <div className="container mt-lg-3">
                {/* Select */}
                <Row className="gy-3">
                    <Col xs={12} sm={6} md={4}>
                        <label className="form-label fw-semibold">Convocatoria <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            name="typeCall"
                            value={formFields.typeCall}
                            onChange={handleSelectWorkDay}
                            required
                        >
                            <option value="">Seleccione Jornada...</option>
                            {convocation?.map((wd) => (
                                <option key={wd?.id} value={wd?.id}>
                                    {wd?.nombre}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col xs={12} sm={6} md={4}>
                        <label className="form-label fw-semibold">Plan <span className="text-danger">*</span></label>
                        <select
                            className="form-select"
                            name="typePlan"
                            value={formFields.typePlan}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seleccione plan...</option>
                            {planOptions?.map((plan) => (
                                <option key={plan?.id} value={plan?.id}>
                                    {plan?.plan_nombre}
                                </option>
                            ))}
                        </select>
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
                            size="md"
                            onClick={handleUploadTable}
                            className="button-order-responsive"
                        >
                            <FaBroom/> Reiniciar tabla
                        </Button>
                        <Button
                            variant="secondary"
                            size="md"
                            onClick={handleBack}
                            className="button-order-responsive">
                            <FaBackspace /> Atras
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
                        <FaSave/> {loading ? "Guardando..." : "Guardar Productos"}
                    </Button>
                </div>

            </div>

        </div>
    )
}