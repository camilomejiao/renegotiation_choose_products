import React from "react";
import { Modal, Button } from "react-bootstrap";

export const ConfirmationModal = ({
           show,
           title = "Confirmación",
           message = "¿Estás seguro de que deseas realizar esta acción?",
           confirmLabel = "Confirmar",
           cancelLabel = "Cancelar",
           onConfirm,
           onClose,
   }) => {

    return (
        <>
            <Modal show={show} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose} className="btn-action-back">
                        {cancelLabel}
                    </Button>
                    <Button variant="danger" onClick={onConfirm}>
                        {confirmLabel}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

