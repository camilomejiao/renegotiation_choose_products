import { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import magnifyingGlass from "../../../../assets/image/icons/magnifying_glass.png";
import PropTypes from "prop-types";

// Services
import { userService } from "../../../../helpers/services/UserServices";

//Enum
import { ResponseStatusEnum } from "../../../../helpers/GlobalEnum";

//Css
import './SearchUserForm.css';
import AlertComponent from "../../shared/alert/AlertComponent";

export const SearchUserForm = ({ onSearchSuccess }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        //Validar búsqueda
        if (!isValidSearch(searchValue)) {
            showAlert('error', 'Oops...', 'El número que buscas debe ser mayor a 5 dígitos');
            return;
        }

        //Realizar búsqueda
        const { data, status } = await userService.searchUser(searchValue);

        //Manejar estados de respuesta
        if (handleSearchErrors(data, status)) return;

        //Manejar resultados de la búsqueda
        if (Object.keys(data).length === 0) {
            showAlert('error', 'Oops...', 'Usuario no existe en el sistema');
            return;
        }

        showAlert('success', 'Bien hecho!', 'Usuario encontrado');
        onSearchSuccess(data);
    };

    //Función para validar la búsqueda
    function isValidSearch(value) {
        return value.trim() !== "" && parseInt(value) > 5;
    }

    //Función para mostrar alertas
    function showAlert(type, title, message) {
        if (type === 'error') {
            AlertComponent.error(title, message);
        } else if (type === 'success') {
            AlertComponent.success(title, message);
        }
    }

    //Función para manejar errores de búsqueda
    function handleSearchErrors(msg = '', status) {
        const errorMessages = {
            [ResponseStatusEnum.BAD_REQUEST]: msg,
            [ResponseStatusEnum.UNAUTHORIZED]: 'Unauthorized access',
            [ResponseStatusEnum.INTERNAL_SERVER_ERROR]: 'Error al buscar este usuario',
        };

        if (errorMessages[status]) {
            showAlert('error', 'Oops...', errorMessages[status]);
            return true;
        }
        return false;
    }

    return (
        <Col md={6} className="text-center">
            <Form className="search-form d-flex align-items-center" onSubmit={handleSearch}>
                <Form.Control
                    type="number"
                    min="1"
                    placeholder="Buscar"
                    className="search-input"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
                <Button type="submit" variant="outline-primary" className="search-button ms-2">
                    <img src={magnifyingGlass} alt="Buscar" style={{ width: "20px", height: "20px" }} />
                </Button>
            </Form>
            <p className="search-helper-text mt-2">Ingrese número de C.C</p>
        </Col>
    );
};

SearchUserForm.propTypes = {
    onSearchSuccess: PropTypes.func.isRequired,
};
