import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Spinner } from "react-bootstrap";
import {FaFastBackward, FaPlus, FaSave} from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";
import Select from "react-select";

//Utils
import {
    getDeleteActionsColumns,
    getNewCatalogBaseColumns
} from "../../../../../../helpers/utils/ConvocationProductColumns";
import {
    getCategoryOptions,
    getEnvironmentalCategories,
    getUnitOptions
} from "../../../../../../helpers/utils/ValidateProductColumns";
import {handleError, showAlert} from "../../../../../../helpers/utils/utils";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import imgPeople from "../../../../../../assets/image/addProducts/people1.jpg";

//Enum
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

//Services
import { convocationServices } from "../../../../../../helpers/services/ConvocationServices";
import {ConfirmationModal} from "../../../../shared/Modals/ConfirmationModal";

export const EditProductsByConvocation = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [planRaw, setPlanRaw] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [productList, setProductList] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const [unitOptions, setUnitOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    /**
     *
     */
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

    /**
     * Carga los planes de una jornada específica (cuando se selecciona una Jornada).
     * @param {number} convocationId
     */
    const getPlans = async (convocationId) => {
        try {
            setLoading(true);
            const { data, status } = await convocationServices.getPlansByConvocation(convocationId);
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

    const handleSelectedPlan = async (option) => {
        if (option?.value) {
            setSelectedPlan(option);
            await getProductList(option.value);
        }
    };

    /**
     * Obtiene los productos de un plan (para la tabla).
     * @param {number} planId
     */
    const getProductList = async (planId) => {
        setLoading(true);
        try {
            const { data, status } = await convocationServices.getProductByConvocationAndPlan(planId);
            if (status === ResponseStatusEnum.OK) {
                const products = await normalizeRows(data?.data?.productos || []);
                setProductList(products);
                setFilteredData(products);
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Convierte la lista cruda de productos al formato que usa el DataGrid.
     * Incluye mapeo de campos visibles y los campos dinámicos ambientales.
     * @param {Array<object>} data
     * @returns {Promise<Array<object>>}
     */
    const normalizeRows = async (data) => {
        try {
            return data.map((row) => ({
                id: row?.id,
                name: row?.nombre,
                description: row?.especificacion_tecnicas,
                brand: row?.marca_comercial,
                unit: row?.unidad_medida?.id ?? null,
                category: row?.categoria_producto?.id ?? null,
                price_min: row?.precio_min,
                price_max: row?.precio_max,
            }));
        } catch (error) {
            console.error("Error al normalizar filas:", error);
            return [];
        }
    };

    /**
     * MUI DataGrid: procesa la actualización de una fila completa (modo "row").
     * Guarda los cambios en `editedProducts` para enviar luego.
     * @param {object} newRow
     */
    const handleRowUpdate = (newRow) => {
        setProductList((prev) => prev.map((r) => (r.id === newRow.id ? newRow : r)));
        setFilteredData((prev) => prev.map((r) => (r.id === newRow.id ? newRow : r)));
        return newRow;
    };

    const handleDeleteClick = async (productId) => {
        setSelectedRowId(productId);
        setShowModal(true);
    }

    const handleConfirmDelete = async () => {
        try {
            setLoading(true);
            const {status} = await convocationServices.deleteProduct(selectedRowId);

            if (status === ResponseStatusEnum.OK) {
                showAlert("Bien hecho!", "Producto eliminado exitosamente.");
                handleBack();
            }
        } catch (error) {
            handleError('Error', 'Error al guardar los productos.');
        } finally {
            setLoading(false);
        }
    }

    const handleCloseModalConfirm = () => {
        setShowModal(false);
        setSelectedRowId(null);
    };

    const baseColumns = getNewCatalogBaseColumns(unitOptions, categoryOptions, handleRowUpdate, true);
    const accion = getDeleteActionsColumns(handleDeleteClick);
    const columns = [...baseColumns, ...accion];

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = productList.filter(
            (product) =>
                (product.name || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.price_max  || "").toLowerCase().includes(query.toLowerCase()) ||
                (product.price_min || "").toLowerCase().includes(query.toLowerCase())
        );

        setFilteredData(filtered);
    };

    const handleCreateProducts = () => navigate('/admin/product-upload');

    const handleBack = () => navigate('/admin/list-products-by-convocation');

    const handleSaveProducts = async () => {
        try {
            setLoading(true);

            const emptyFields = productList.some(r => {
                return !r.name || !r.price_min || !r.price_max
            });

            if (emptyFields) {
                handleError(
                    "Revisa campos",
                    `Tienes Algún campo vacio.`
                );
                setLoading(false);
                return;
            }

            const productos = await transformData(productList);

            let sendData = {
                jornada_plan: selectedPlan.value,
                productos
            }

            const { status } = await convocationServices.updateValidationEnvironmental(sendData);

            if(status === ResponseStatusEnum.OK) {
                showAlert("Bien hecho!", "Productos actualizados con éxito.");
                handleBack();
            }
        } catch (error) {
            handleError('Error', 'Error al guardar los productos.');
        } finally {
            setLoading(false);
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
            id: product?.id,
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

    // Cargar datos iniciales
    useEffect(() => {
        loadData();
        if (params.id) {
            getPlans(params.id)
        }
    }, []);

    return (
        <>
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
                    <div className="row align-items-center g-2">
                        <div className="col-12 col-md-6">
                            <Select
                                value={selectedPlan}
                                options={planRaw.map(opt => ({ value: opt.id, label: opt.plan_nombre }))}
                                placeholder="Selecciona un Plan"
                                onChange={handleSelectedPlan}
                                isClearable
                                isLoading={loading}
                                classNamePrefix="custom-select"
                                className="custom-select w-100"
                            />
                        </div>

                        <div className="col-12 col-md-6 d-flex justify-content-md-end gap-2 mt-2 mt-md-0">
                            <Button
                                variant="outline-success"
                                size="md"
                                onClick={handleCreateProducts}
                                className="button-order-responsive"
                            >
                                <FaPlus /> Crear Jornada
                            </Button>

                            <Button
                                variant="outline-primary"
                                size="md"
                                onClick={handleBack}
                                className="button-order-responsive"
                            >
                                <FaFastBackward /> Volver al listado
                            </Button>
                        </div>
                    </div>

                    <hr/>

                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-3 mb-3">
                        <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="input-responsive me-2"
                            />
                        </div>
                    </div>

                    <div style={{height: 600, width: "100%"}}>
                        <DataGrid
                            rows={filteredData}
                            columns={columns}
                            pagination
                            processRowUpdate={handleRowUpdate}
                            editMode="row"
                            pageSize={100}
                            rowsPerPageOptions={[100, 500, 1000]}
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
                            getRowClassName={(params) =>
                                (params.row.status === 'Abierto')
                                    ? 'row-open'
                                    : 'row-closed'
                            }
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
                                // fondo base
                                "& .row-open":   { backgroundColor: "rgba(64,165,129,0.10)" }, // verde suave
                                "& .row-closed": { backgroundColor: "rgba(244,67,54,0.08)"  }, // rojo suave
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

                {/* Modal de confirmación */}
                <ConfirmationModal
                    show={showModal}
                    title="Confirmación de Eliminación"
                    message="¿Estás seguro de que deseas eliminar este elemento?"
                    onConfirm={handleConfirmDelete}
                    onClose={handleCloseModalConfirm}
                />

            </div>
        </>
    );
};