import {useNavigate, useOutletContext} from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { FaBroom, FaCheck, FaPencilAlt, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";

//Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";

//Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { Footer } from "../../shared/footer/Footer";
import { ConfirmationModal } from "../../shared/Modals/ConfirmationModal";

//Services
import { productServices } from "../../../../helpers/services/ProductServices";
import AlertComponent from "../../shared/alert/AlertComponent";

//Enum
import {ProductStatusEnum, RolesEnum, ResponseStatusEnum} from "../../../../helpers/GlobalEnum";

const PAGE_SIZE = 100;

export const ProductList = () => {

    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    const [productList, setProductList] = useState([]);
    const [rowCountState, setRowCountState] = useState(0);
    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: PAGE_SIZE,
    }); //Paginación
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);

    const productColumns = [
        { field: "id", headerName: "COD", flex: 0.5 },
        {
            field: "name",
            headerName: "NOMBRE",
            flex: 2,
            headerAlign: "left",
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "description",
            headerName: "DESCRIPCIÓN",
            flex: 3,
            headerAlign: "left",
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "brand",
            headerName: "MARCA",
            flex: 2,
            headerAlign: "left",
            renderCell: (params) => (
                <div
                    style={{
                        textAlign: "left",
                        whiteSpace: "normal",
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        {
            field: "state",
            headerName: "ESTADO",
            flex: 1.5,
            renderCell: (params) => {
                return (
                    <div
                        style={{
                            textAlign: "left",
                            whiteSpace: "normal",
                            wordWrap: "break-word",
                            overflow: "visible",
                        }}
                    >
                        {params.value}
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerName: "ACCIONES",
            flex: 1,
            renderCell: (params) => {
                return (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", gap: "10px", }}>
                        <FaPencilAlt
                           style={{ cursor: "pointer", color: "#0d6efd" }}
                           onClick={() => handleEditClick(params.row)}
                        />
                        <FaTrash
                            style={{ cursor: "pointer", color: "red" }}
                            onClick={() => handleDeleteClick(params.row.id)}
                        />
                        {(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.AUDITOR) && (
                            <FaCheck
                                style={{ cursor: "pointer", color: "green" }}
                                onClick={() => handleApproveByAudit(params.row.id)}
                            />
                        )}
                    </div>
                )},
            sortable: false,
            filterable: false,
        },
    ];

    const getProductList = async () => {
        setIsLoading(true);
        try {
            const { page, pageSize } = paginationModel;
            const url = buildUrl(page + 1, pageSize, isSearchActive ? searchQuery : "");

            const {data, status} = await fetchProductList(url);
            if (status === ResponseStatusEnum.OK) {
                updateData(data);
            }

            if (status === ResponseStatusEnum.BAD_REQUEST || status === ResponseStatusEnum.INTERNAL_SERVER_ERROR) {
                showError("Error", "Error al obtener las órdenes de compra");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
            setIsSearchActive(false);
        }
    }

    //
    const buildUrl = (page, size, product = "") => {
        const params = new URLSearchParams({
            page,
            size,
            ...(product && { product }),
        });
        return `?${params.toString()}`;
    };

    const fetchProductList = async (url) => {
        return await productServices.getProductList();
    }

    const updateData = (data) => {
        setProductList(normalizeRows(data.results));
        setRowCountState(data.count);
    };

    // Normaliza los datos recibidos del backend
    const normalizeRows = (data) => {
        return data.map((row) => ({
            id: row.id,
            name: row.nombre,
            description: row.especificacion_tecnicas,
            brand: row.marca_comercial,
            state: row?.fecha_aprobado !== null ? ProductStatusEnum.APPROVED : ProductStatusEnum.PENDING_APPROVAL
        }));
    }

    // Maneja el clic en el ícono de eliminación
    const handleEditClick = (data) => {
        navigate(`/admin/edit-product/${data.id}/`)
    };

    // Maneja el clic en el ícono de eliminación
    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleApproveByAudit = async () => {
        try {
            const {status} = await productServices.productApprove(selectedId);
            if (status === ResponseStatusEnum.OK) {
                showAlert("Bien hecho!", "Producto aprobado exitosamente!");
                await getProductList();
                handleCloseModal();
            }

            if (status === ResponseStatusEnum.FORBIDDEN) {
                showWarning("Algo salio mal!", "No puedes aprobar este producto!");
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al eliminar el elemento:", error);
            showError("Error", "No se pudo eliminar la orden");
        }

    }

    // Cierra el modal de confirmación
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    // Confirma la eliminación de un registro
    const handleConfirmDelete = async () => {
        try {
            const { status } = await productServices.productRemove(selectedId);
            if (status === ResponseStatusEnum.NO_CONTENT) {
                showAlert("Bien hecho!", "Producto eliminado exitosamente!");
                await getProductList();
                handleCloseModal();
            }

            if (status === ResponseStatusEnum.FORBIDDEN) {
                showWarning("Algo salio mal!", "No puedes eliminar un producto aprobado!");
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al eliminar el elemento:", error);
            showError("Error", "No se pudo eliminar la orden");
        }
    };

    // Actualiza el valor del campo de búsqueda
    const handleSearchQueryChange = (e) => setSearchQuery(e.target.value);

    // Realiza la búsqueda
    const handleSearch = () => {
        if (searchQuery.length >= 5) {
            setPaginationModel({ ...paginationModel, page: 0 }); // Cambia la página
            setIsSearchActive(true); // Marca como búsqueda activa
        } else {
            showError("Error", "El valor a buscar debe tener al menos 5 caracteres");
        }
    };

    // Limpia la búsqueda
    const handleClearSearch = () => {
        setSearchQuery("");
        setPaginationModel({ page: 0, pageSize: PAGE_SIZE });
    };

    //
    const showAlert = (title, message) => {
        AlertComponent.success(title, message);
    };

    //
    const showError = (title, message) => {
        AlertComponent.error(title, message);
    };

    const showWarning = (title, message) => {
        AlertComponent.warning(title, message)
    }

    const handleCreateProducts = () => {
        navigate(`/admin/create-products`);
    }

    useEffect(() => {
        getProductList();
    }, [paginationModel])

    return (
        <>
            <div className="main-container">
                <HeaderImage
                    imageHeader={imgPeople}
                    titleHeader={'¡Listado de productos!'}
                    bannerIcon={''}
                    bannerInformation={''}
                />

                <div className="container mt-lg-3">
                    <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mt-3 mb-3">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            className="input-responsive"
                        />
                        <div className="d-flex flex-column flex-md-row w-100 w-md-auto">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleSearch}
                                className="button-order-responsive"
                            >
                                Buscar <FaSearch />
                            </Button>
                            <Button
                                variant="outline-success"
                                size="md"
                                onClick={handleClearSearch}
                                className="button-order-responsive"
                            >
                                Limpiar <FaBroom />
                            </Button>

                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleCreateProducts}
                                className="button-order-responsive"
                                style={{
                                    backgroundColor: "#2148C0",
                                    borderColor: "#007BFF",
                                    fontWeight: "bold",
                                }}
                            >
                                Agregar producto <FaPlus />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <DataGrid
                            columns={productColumns}
                            rows={productList}
                            rowCount={rowCountState}
                            loading={isLoading}
                            paginationModel={paginationModel}
                            onPaginationModelChange={setPaginationModel}
                            paginationMode="server"
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

                    <ConfirmationModal
                        show={showModal}
                        title="Confirmación de Eliminación"
                        message="¿Estás seguro de que deseas eliminar este elemento?"
                        confirmLabel="Eliminar"
                        cancelLabel="Cancelar"
                        onConfirm={handleConfirmDelete}
                        onClose={handleCloseModal}
                    />

                </div>
                <Footer />
            </div>
        </>
    )
}