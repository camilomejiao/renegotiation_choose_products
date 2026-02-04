import { Modal, Button } from "react-bootstrap";

export const LineDetailModal = ({ show, handleClose, userData, planData }) => {

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalles del plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {planData.length === 0 ? (
                    <p className="text-center">No hay detalles disponibles.</p>
                ) : (
                    <>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                            <tr>
                                <th style={styles.userHeader}>DEPARTAMENTO:</th>
                                <th style={styles.userText}>{userData?.departamento}</th>
                                <th style={styles.userHeader}>MUNICIPIO:</th>
                                <th style={styles.userText}>{userData?.municipio}</th>
                                <th style={styles.userHeader}>VEREDA:</th>
                                <th style={styles.userText}>{userData?.vereda}</th>
                            </tr>
                                <tr>
                                    <th style={styles.userHeader}>NOMBRE:</th>
                                    <th style={styles.userText}>{userData?.nombre} {userData?.apellido} </th>
                                    <th style={styles.userHeader}>CUB:</th>
                                    <th style={styles.userText}>{userData?.cub_id}</th>
                                    <th style={styles.userHeader}>CC:</th>
                                    <th style={styles.userText}>{userData?.identificacion}</th>
                                </tr>
                                <tr>
                                    <th style={styles.userHeader}>PLAN:</th>
                                    <th style={styles.userText}>{userData?.plan}</th>
                                    <th style={styles.userHeader}>LINEA:</th>
                                    <th style={styles.userText}>{userData?.linea}</th>
                                    <th style={styles.userHeader}>SALDO:</th>
                                    <th style={styles.userText}>
                                        $ {parseInt(userData.deuda_componente).toLocaleString("es-CO")}
                                    </th>

                                </tr>
                            </thead>
                        </table>
                        <br/>
                        <table style={{ borderCollapse: "collapse", width: "100%" }}>
                            <thead>
                                <tr>
                                    <th style={styles.header}>CÓDIGO</th>
                                    <th style={styles.header}>DESCRIPCIÓN</th>
                                    <th style={styles.header}>UNIDAD</th>
                                    <th style={styles.header}>CANTIDAD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {planData.map((item, index) => (
                                    <tr key={index}>
                                        <td style={styles.cellCenter}>{item.codigo}</td>
                                        <td style={styles.cellLeft}>{item.descripcion}</td>
                                        <td style={styles.cellCenter}>{item.unidad}</td>
                                        <td style={styles.cellCenter}>{item.cantidad}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} className="btn-action-back">
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

// Estilos mejor organizados
const styles = {
    userHeader: {
        textAlign: "left",
        border: "1px solid black",
        padding: "7px",
        backgroundColor: "#d7d7d7",
        fontWeight: "bold",
        fontSize: "10px"
    },
    userText: {
        textAlign: "left",
        border: "1px solid black",
        padding: "8px",
        backgroundColor: "#f6f6f6",
        fontWeight: "bold",
        fontSize: "9px"
    },
    header: {
        textAlign: "center",
        border: "1px solid black",
        padding: "8px",
        backgroundColor: "#dcdcdc",
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
