import { Modal, Form, Button } from "react-bootstrap";
import { useState } from "react";
import AlertComponent from "../alert/AlertComponent";

export const LocationModal = ({ show, optionsArray, onConfirm }) => {
    const [selectedOption, setSelectedOption] = useState(null); // Manejar como objeto seleccionado

    const handleOptionChange = (event) => {
        const selectedValue = parseInt(event.target.value, 10); // Asegurar que sea un número
        const selectedLocation = optionsArray.find(option => option.value === selectedValue);
        setSelectedOption(selectedLocation); // Guardar el objeto completo
    };

    const handleConfirm = () => {
        if (!selectedOption) {
            AlertComponent.warning('', "Por favor, selecciona una opción.");
            return;
        }
        onConfirm(selectedOption); // Enviar el objeto completo
    };

    return (
        <Modal show={show} centered>
            <Modal.Header>
                <Modal.Title>Selecciona una opción</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Por favor, selecciona en donde te encuentras:</p>
                <Form.Group controlId="selectOption">
                    <Form.Label>Opciones disponibles</Form.Label>
                    <Form.Control
                        as="select"
                        onChange={handleOptionChange}
                        value={selectedOption?.value || ""} // Manejar el valor actual
                    >
                        <option value="" disabled>
                            Selecciona una opción
                        </option>
                        {optionsArray.map((option, index) => (
                            <option key={index} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
