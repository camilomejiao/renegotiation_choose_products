import { Button, Modal } from "react-bootstrap";

export const PlanHistory = ({ show, handleClose, data }) => {

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Historicos del plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {data.length === 0 ? (
                    <p className="text-center">No hay detalles historicos disponibles.</p>
                ) : (
                    <table style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                        <tr>
                            <th style={styles.header}>CÓDIGO</th>
                            <th style={styles.header}>PLAN</th>
                            <th style={styles.header}>LINEA</th>
                            <th style={styles.header}>FECHA</th>
                            <th style={styles.header}>RESOLUCIÓN</th>
                            <th style={styles.header}>FECHA RESOLUCIÓN</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td style={styles.cellCenter}>{item?.codigo}</td>
                                <td style={styles.cellLeft}>{item?.plan}</td>
                                <td style={styles.cellCenter}>{item?.linea}</td>
                                <td style={styles.cellCenter}>{item?.fecha}</td>
                                <td style={styles.cellCenter}>{item?.no_resolucion}</td>
                                <td style={styles.cellCenter}>{item?.fecha_resolucion}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

// Estilos mejor organizados
const styles = {
    header: {
        textAlign: "center",
        border: "1px solid black",
        padding: "8px",
        backgroundColor: "#f8f9fa",
        fontWeight: "bold",
        fontSize: "10px"
    },
    cellCenter: {
        textAlign: "center",
        border: "1px solid black",
        padding: "8px",
        fontSize: "9px"
    },
    cellLeft: {
        textAlign: "left",
        border: "1px solid black",
        padding: "8px",
        fontSize: "9px"
    },
    cellRight: {
        textAlign: "right",
        border: "1px solid black",
        padding: "8px",
        fontSize: "9px"
    },
    totalLabel: {
        textAlign: "right",
        fontWeight: "bold",
        border: "1px solid black",
        padding: "8px",
        backgroundColor: "#f8f9fa",
    },
    totalValue: {
        textAlign: "right",
        fontWeight: "bold",
        border: "1px solid black",
        padding: "8px",
    },
};