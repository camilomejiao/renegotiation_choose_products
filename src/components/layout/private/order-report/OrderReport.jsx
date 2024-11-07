import { useEffect, useState } from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { FaTrash } from "react-icons/fa";

//Image
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";

//Services
import { purchaseOrderServices } from "../../../../helpers/services/PurchaseOrderServices";

//Enum
import { StatusEnum } from "../../../../helpers/GlobalEnum";

//Css
import './OrderReport.css';

export const OrderReport = () => {
    const [purcharseOrder, setPurcharseOrder] = useState([]); //Obtener los datos
    const [totalSize, setTotalSize] = useState(0); //Total de datos
    const [page, setPage] = useState(1); //Paginas
    const [isLoading, setIsLoading] = useState(false); //Cargando la data
    const sizePerPage = 10; // Tamaño fijo del array de datos
    const [showModal, setShowModal] = useState(false); //Mostrar modal
    const [selectedId, setSelectedId] = useState(null); //Id seleccionado para la eliminacion
    const [searchQuery, setSearchQuery] = useState(""); //Buscar item

    //Columnas de la tabla
    const columns = [
        { dataField: "id", text: "Order ID" },
        { dataField: "fecha_registro", text: "Fecha de Registro" },
        {
            dataField: "cub.id",
            text: "CUB",
            formatter: (cell, row) => row?.cub?.id // Accede a `cub.id`
        },
        {
            dataField: "cub.identificacion",
            text: "DOCUMENTO",
            formatter: (cell, row) => row.cub.identificacion // Accede a `cub.identificacion`
        },
        {
            dataField: "valor_total",
            text: "Valor Total",
            formatter: (cell) => {
                const valorFormateado = parseInt(cell).toLocaleString('es-CO');
                return `$${valorFormateado}`;
            }
        },
        {
            dataField: "delete",
            text: "Acciones",
            formatter: (cell, row) => (
                <FaTrash
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => handleDeleteClick(row.id)} // Llama a la función con el ID de la fila
                />
            ),
        },
    ];

    //Obtiene la data inicial y pagina
    const getPurcharseOrder = async (pageNumber = 1, documentId = "") => {
        setIsLoading(true);
        try {
            const url = buildUrl(pageNumber, documentId);
            const response = await fetchPurchaseOrders(url);

            if (response.status === StatusEnum.OK) {
                updateOrderData(response.data, pageNumber);
            } else {
                showAlert("Error", "Error al obtener las órdenes de compra");
            }
        } catch (error) {
            console.error("Error obteniendo las órdenes de compra:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const buildUrl = (pageNumber, documentId) => {
        return documentId
            ? `?cedula=${documentId}&page=${pageNumber}`
            : `?page=${pageNumber}`;
    }

    // Función para llamar al servicio de órdenes de compra
    const fetchPurchaseOrders = async (url) => {
        return await purchaseOrderServices.getAll(url);
    };

// Actualizar los datos en el estado después de la respuesta exitosa
    const updateOrderData = (data, pageNumber) => {
        setPurcharseOrder(data.results);
        setTotalSize(data.count);
        setPage(pageNumber);
    };

    const showAlert = (title, message) => {
        Swal.fire({
            title: title,
            text: message,
            icon: "error",
            width: 300,
            heightAuto: true,
        });
    };

    //Recibe la pagina a mostrar
    const handleTableChange = (type, { page }) => {
        if (type === "pagination") {
            setPage(page);
            getPurcharseOrder(page);
        }
    };

    // Función para abrir el modal de confirmación
    const handleDeleteClick = (id) => {
        setSelectedId(id); // Guarda el ID del elemento a eliminar
        setShowModal(true); // Muestra el modal
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedId(null);
    };

    // Función para confirmar la eliminación
    const handleConfirmDelete = async () => {
        try {
            const { status} = await purchaseOrderServices.removeOrder(selectedId);

            if(status === StatusEnum.NO_CONTENT) {
                Swal.fire({
                    title: 'Bien hecho!',
                    html: 'Orden elimnada exitosamente!',
                    icon: 'success',
                    width: 300,
                    heightAuto: true
                });
                getPurcharseOrder();
                handleCloseModal()
            }
        } catch (error) {
            console.error("Error al eliminar el elemento:", error);
        }
    };

    //Busqueda
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Función para ejecutar la búsqueda al hacer clic en "Buscar"
    const handleSearch = () => {
        if (searchQuery.length >= 5) {
            getPurcharseOrder(1, searchQuery); // Busca con el valor de cédula
        }

        if(searchQuery.length < 5) {
            Swal.fire({
                title: "Error",
                text: "El valor a buscar debe ser mayor a 5 caracteres",
                icon: "error",
                width: 300,
                heightAuto: true,
            });
        }
    };

    // Función para limpiar la búsqueda
    const handleClearSearch = () => {
        setSearchQuery("");
        getPurcharseOrder(1);
    };

    useEffect(() => {
        getPurcharseOrder(1)
    }, []);

    return (
        <>
            <div className="main-container">
                <div className="header-image position-relative">
                    <img src={imgDCSIPeople} alt="Fondo" className="background-image w-100" />
                    <div className="overlay-text position-absolute w-100 text-center">
                        <h1>¡Órdenes de Compra!</h1>
                    </div>
                </div>

                {isLoading && (
                    <div className="spinner-container">
                        <Spinner animation="border" variant="success" />
                        <span>Cargando...</span>
                    </div>
                )}

                <div className="container mt-lg-5">
                    <div className="d-flex flex-wrap align-items-center mt-3 mb-3">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            className="input-responsive me-2 mb-2 mb-md-0" // Clase personalizada para el input
                        />
                        <Button variant="primary" onClick={handleSearch} className="button-order-responsive me-2 mb-2 mb-md-0">
                            Buscar
                        </Button>
                        <Button variant="secondary" onClick={handleClearSearch} className="button-order-responsive">
                            Limpiar
                        </Button>
                    </div>

                    <div className="table-responsive mt-3">
                        <BootstrapTable
                            keyField="id"
                            data={purcharseOrder}
                            columns={columns}
                            pagination={paginationFactory({
                                page,
                                sizePerPage,
                                totalSize,
                                hideSizePerPage: true, // Oculta el selector de tamaño de página
                                withFirstAndLast: true, // Oculta los botones de primera y última página
                            })}
                            remote
                            onTableChange={handleTableChange}
                            wrapperClasses="pagination-buttons"
                        />
                    </div>
                </div>


                {/* Modal de Confirmación */}
                <Modal show={showModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmación</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Estás seguro de que deseas eliminar este elemento?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="danger" onClick={handleConfirmDelete}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};
