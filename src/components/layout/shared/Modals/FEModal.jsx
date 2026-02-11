import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

/**
 * Modal para subir/editar Factura Electrónica (FE).
 * Props:
 * - show: boolean -> controla visibilidad.
 * - onClose: () => void -> cerrar modal.
 * - onSave: ({ feNumber, feFile }) => Promise|void -> guardar (padre decide qué hacer).
 * - loading: boolean -> deshabilita botón Guardar.
 * - defaultNumber: string -> número FE inicial (si ya existe).
 */
export const FEModal = ({ show, onClose, onSave, loading, defaultNumber = "" }) => {
    const [feNumber, setFeNumber] = useState(defaultNumber);
    const [feFile, setFeFile] = useState(null);

    useEffect(() => {
        setFeNumber(defaultNumber); // cada vez que cambie, lo reinicia
    }, [defaultNumber]);

    const handleSubmit = () => {
        onSave({ feNumber, feFile });
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton style={{ backgroundColor: "#40A581", color: "#fff" }}>
                <Modal.Title>Factura electrónica (FE)</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Número de FE</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ej: FV235"
                            value={feNumber}
                            required={true}
                            onChange={(e) => setFeNumber(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Archivo (PDF)</Form.Label>
                        <Form.Control
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setFeFile(e.target.files?.[0] ?? null)}
                        />
                        <Form.Text muted>Solo PDF.</Form.Text>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <Button variant="secondary" onClick={onClose} className="btn-action-back">
                    Cancelar
                </Button>
                <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ backgroundColor: "#BFD732", borderColor: "#BFD732", fontWeight: "bold" }}
                >
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

