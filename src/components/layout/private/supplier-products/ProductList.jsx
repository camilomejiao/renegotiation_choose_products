import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {FaCheck, FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import { DataGrid } from "@mui/x-data-grid";

// Img
import imgPeople from "../../../../assets/image/addProducts/people1.jpg";

// Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";
import { Footer } from "../../shared/footer/Footer";
import { ConfirmationModal } from "../../shared/Modals/ConfirmationModal";

// Services
import { productServices } from "../../../../helpers/services/ProductServices";
import AlertComponent from "../../shared/alert/AlertComponent";

// Enum
import { ProductStatusEnum, RolesEnum, ResponseStatusEnum } from "../../../../helpers/GlobalEnum";

const PAGE_SIZE = 50;

export const ProductList = () => {
    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    const [productList, setProductList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const productColumns = [
        { field: "id", headerName: "COD", flex: 0.5 },
        {
            field: "name",
            headerName: "NOMBRE",
            flex: 3,
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
                        overflow: "visible",
                    }}
                >
                    {params.value}
                </div>
            ),
        },
        { field: "brand", headerName: "MARCA", flex: 1.5 },
        { field: "state", headerName: "ESTADO", flex: 1.5 },
        {
            field: "actions",
            headerName: "ACCIONES",
            flex: 1,
            renderCell: (params) => (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FaTrash style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDeleteClick(params.row.id)} />
                    {(userAuth.rol_id === RolesEnum.ADMIN || userAuth.rol_id === RolesEnum.AUDITOR) && (
                        <FaCheck style={{ cursor: 'pointer', color: 'green' }} onClick={() => handleApproveByAudit(params.row.id)} />
                    )}
                </div>
            ),
            sortable: false,
            filterable: false,
        },
    ];

    const getProductList = async () => {
        setIsLoading(true);
        try {
            const { data, status } = await productServices.getProductList();
            console.log('data: ', data);
            if (status === ResponseStatusEnum.OK) {
                const products = normalizeRows(data.results);
                setProductList(products);
                setFilteredData(products);
            }
        } catch (error) {
            console.error("Error al obtener la lista de productos:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const normalizeRows = (data) => {
        return data.map((row) => ({
            id: row.id,
            name: row.nombre,
            description: row.especificacion_tecnicas,
            brand: row.marca_comercial,
            state: row?.fecha_aprobado !== null ? ProductStatusEnum.APPROVED : ProductStatusEnum.PENDING_APPROVAL,
        }));
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleApproveByAudit = async () => {
        try {
            const { status } = await productServices.productApprove(selectedId);
            if (status === ResponseStatusEnum.OK) {
                showAlert("Bien hecho!", "Producto aprobado exitosamente!");
                await getProductList();
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al aprobar el producto:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    const handleConfirmDelete = async () => {
        try {
            const { status } = await productServices.productRemove(selectedId);
            if (status === ResponseStatusEnum.NO_CONTENT) {
                showAlert("Bien hecho!", "Producto eliminado exitosamente!");
                await getProductList();
                handleCloseModal();
            }
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };

    const handleSearchQueryChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const filtered = productList.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase()) ||
            product.state.toLowerCase().includes(query.toLowerCase())
        );

        setFilteredData(filtered);
    };

    const showAlert = (title, message) => AlertComponent.success(title, message);
    const handleCreateProducts = () => navigate(`/admin/create-products`);

    const handleEditProducts = () => navigate(`/admin/edit-product`);

    useEffect(() => {
        getProductList();
    }, []);

    return (
        <>
            <HeaderImage imageHeader={imgPeople} titleHeader="¡Listado de productos!" />

            <div className="container mt-4">
                <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                    className="input-responsive"
                />

                <Button onClick={handleCreateProducts} className="button-order-responsive">
                    Agregar productos <FaPlus />
                </Button>

                <Button variant="secondary" onClick={handleEditProducts} className="button-order-responsive">
                    Editar productos <FaEdit />
                </Button>

                <DataGrid
                    columns={productColumns}
                    rows={filteredData}
                    pagination
                    page={page}
                    pageSize={pageSize}
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => {
                        setPageSize(newPageSize);
                        setPage(0);
                    }}
                    rowsPerPageOptions={[10, 50, 100]}
                    rowCount={filteredData.length}
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

                <ConfirmationModal
                    show={showModal}
                    title="Confirmación de Eliminación"
                    message="¿Estás seguro de que deseas eliminar este elemento?"
                    onConfirm={handleConfirmDelete}
                    onClose={handleCloseModal}
                />
            </div>

            <Footer />
        </>
    );
};