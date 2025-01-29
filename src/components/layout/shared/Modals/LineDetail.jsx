import { Modal, Button } from "react-bootstrap";

export const LineDetail = ({ show, handleClose, data }) => {

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalles del plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {data.length === 0 ? (
                    <p className="text-center">No hay detalles disponibles.</p>
                ) : (
                    <table style={{ borderCollapse: "collapse", width: "100%" }}>
                        <thead>
                        <tr>
                            <th style={styles.header}>CÓDIGO</th>
                            <th style={styles.header}>DESCRIPCIÓN</th>
                            <th style={styles.header}>UNIDAD</th>
                            <th style={styles.header}>CANTIDAD</th>
                            <th style={styles.header}>COSTO UNITARIO</th>
                            <th style={styles.header}>COSTO TOTAL</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td style={styles.cellCenter}>{item.codigo}</td>
                                <td style={styles.cellLeft}>{item.descripcion}</td>
                                <td style={styles.cellCenter}>{item.unidad}</td>
                                <td style={styles.cellCenter}>{item.cantidad}</td>
                                <td style={styles.cellRight}>
                                    {parseFloat(item.costo_unitario).toLocaleString("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                    })}
                                </td>
                                <td style={styles.cellRight}>
                                    {item.costo_total.toLocaleString("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                    })}
                                </td>
                            </tr>
                        ))}
                        {/* Fila Total */}
                        <tr>
                            <td colSpan="5" style={styles.totalLabel}>
                                Total
                            </td>
                            <td style={styles.totalValue}>
                                {data
                                    .reduce((total, item) => total + item.costo_total, 0)
                                    .toLocaleString("es-CO", { style: "currency", currency: "COP" })}
                            </td>
                        </tr>
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
    );
};

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
