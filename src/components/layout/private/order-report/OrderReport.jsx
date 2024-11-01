import { useEffect, useState } from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import Swal from "sweetalert2";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

//Image
import imgDCSIPeople from "../../../../assets/image/addProducts/imgDSCIPeople.png";

//Services
import { purchaseOrderServices } from "../../../../helpers/services/PurchaseOrderServices";

//Enum
import { StatusEnum } from "../../../../helpers/GlobalEnum";

//Css
import './OrderReport.css';
import {FaTrash} from "react-icons/fa";

export const OrderReport = () => {
    const [purcharseOrder, setPurcharseOrder] = useState([]); //Obtener los datos
    const [totalSize, setTotalSize] = useState(0); //Total de datos
    const [page, setPage] = useState(1); //Paginas
    const [isLoading, setIsLoading] = useState(false); //Cargando la data
    const sizePerPage = 10; // Tamaño fijo del array de datos
    const [showModal, setShowModal] = useState(false); //Mostrar modal
    const [selectedId, setSelectedId] = useState(null); //Id seleccionado para la eliminacion
    const [searchQuery, setSearchQuery] = useState(""); //Buscar item
    const [filteredData, setFilteredData] = useState([]); //Guardar la busqueda

    //Columnas de la tabla
    const columns = [
        { dataField: "id", text: "Order ID" },
        { dataField: "persona_cub_id", text: "CUB ID" },
        { dataField: "persona_cub_id", text: "DOCUMENTO ID" },
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
    const getPurcharseOrder = async (pageNumber = 1) => {
        setIsLoading(true);
        try {
            const { data, status } = await purchaseOrderServices.getAll(`?page=${pageNumber}`);
            console.log('data: ', data);

            if (status === StatusEnum.OK) {
                setPurcharseOrder(data.results);
                setTotalSize(data.count); // Establece el tamaño total de los registros
                setPage(pageNumber);

                //setFilteredData(data.results); // Misma data para buscar
            }

            if (status === StatusEnum.BAD_REQUEST) {
                Swal.fire({
                    title: "Error",
                    text: "Error",
                    icon: "error",
                    width: 300,
                    heightAuto: true,
                });
            }
        } catch (error) {
            console.error("Error obteniendo las órdenes de compra:", error);
        } finally {
            setIsLoading(false);
        }
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
    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    useEffect(() => {
        if (searchQuery === "") {
            setFilteredData(purcharseOrder);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = purcharseOrder.filter((order) =>
                Object.values(order).some(
                    (value) =>
                        value &&
                        value.toString().toLowerCase().includes(lowerCaseQuery)
                )
            );
            setFilteredData(filtered);
        }
    }, [searchQuery, purcharseOrder]);

    useEffect(() => {
        getPurcharseOrder()
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
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ marginBottom: "20px", padding: "10px", width: "100%" }}
                    />
                    <div className="table-responsive">
                        <BootstrapTable
                            keyField="id"
                            data={purcharseOrder}
                            columns={columns}
                            pagination={paginationFactory({
                                page,
                                sizePerPage,
                                totalSize,
                                hideSizePerPage: true, // Oculta el selector de tamaño de página
                                withFirstAndLast: true, // Opcional, oculta los botones de primera y última página
                            })}
                            remote
                            onTableChange={handleTableChange} // Asegúrate de que esta línea está presente
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
