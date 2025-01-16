import { Modal, Button } from "react-bootstrap";

export const LineDetail = ({ show, handleClose, data }) => {
    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Detalles de la Línea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Aquí se puede mostrar cualquier información dinámica */}
                <p>{data || "No hay información disponible."}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
