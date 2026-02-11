import { Button, Form, Modal } from "react-bootstrap";

export const ApprovedDeniedModal = ({
       open,
       onClose,
       action,
       setAction,
       comment,
       setComment,
       onSubmit
}) => {

    return (
        <>
            <Modal show={open} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Acción</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Seleccione una acción:</Form.Label>
                            <Form.Select
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                            >
                                <option value="approve">Aprobar</option>
                                <option value="deny">Denegar</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Comentario</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} className="btn-action-back">
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={onSubmit}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

