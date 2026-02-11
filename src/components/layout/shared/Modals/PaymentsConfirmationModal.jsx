import { Button, Modal, Form } from "react-bootstrap";

export const PaymentsConfirmationModal = ({
      show,
      variant = "approve",
      title = "Confirmación",
      message = "¿Estás seguro de que deseas realizar esta acción?",
      confirmLabel = "Confirmar",
      cancelLabel = "Cancelar",
      rolesOptions = [],
      selectedRole = null,
      onChangeRole = () => {},
      onConfirm,
      onClose,
      confirmDisabled = false,
}) => {
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p className="mb-3">{message}</p>

                {variant === "deny" && (
                    <Form.Group className="mb-2">
                        <Form.Label>Rol encargado de subsanar <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                            value={selectedRole ?? ""}
                            onChange={(e) => onChangeRole(Number(e.target.value))}
                        >
                            <option value="" disabled>Seleccione una opción</option>
                            {rolesOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {opt.label}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Este rol recibirá la entrega para subsanación.
                        </Form.Text>
                    </Form.Group>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={onClose} className="btn-action-back">
                    {cancelLabel}
                </Button>
                <Button
                    variant={variant === "deny" ? "danger" : "success"}
                    onClick={onConfirm}
                    disabled={confirmDisabled}
                >
                    {confirmLabel}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

