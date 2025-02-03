import { useState } from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import magnifyingGlass from "../../../../assets/image/icons/magnifying_glass.png";
import PropTypes from "prop-types";

// Services
import { userService } from "../../../../helpers/services/UserServices";

//Enum
import {ComponentEnum, ResponseStatusEnum} from "../../../../helpers/GlobalEnum";

//Css
import './SearchUserForm.css';
import AlertComponent from "../../../../helpers/alert/AlertComponent";
import {renegotiationServices} from "../../../../helpers/services/RenegociationServices";

export const SearchUserForm = ({ component, onSearchSuccess }) => {
    const [searchValue, setSearchValue] = useState("");
    const [searchType, setSearchType] = useState("cedula");

    const handleSearch = async (e) => {
        e.preventDefault();

        //Validar búsqueda
        if (!isValidSearch(searchValue)) {
            showAlert('error', 'Oops...', 'El número que buscas debe ser mayor a 5 dígitos');
            return;
        }

        try {
            //Realizar búsqueda
            const { data, status } =
                component === ComponentEnum.USER
                    ? await userService.searchUser(searchValue)
                    : await renegotiationServices.getUserRenegotiation(searchType, searchValue);

            if (handleSearchErrors(data, status)) return;

            if (!data || Object.keys(data).length === 0) {
                return showAlert("error", "Oops...", "Usuario no existe en el sistema");
            }

            showAlert("success", "Bien hecho!", "Usuario encontrado");
            onSearchSuccess(data);
        } catch (error) {
            console.error("Search Error:", error);
        }
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
        <Col md={12} className="text-center">
            <Form className="search-form" onSubmit={handleSearch}>
                <Row className="g-2 justify-content-center align-items-center">
                    {component === ComponentEnum.RENEGOTIATION ? (
                        <Col xs={12} sm={7} md={6} className="d-flex align-items-center gap-2">
                            <Form.Select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="search-select"
                            >
                                <option value="cedula">Cédula</option>
                                <option value="cub">CUB</option>
                            </Form.Select>

                            <Form.Control
                                type="number"
                                min="1"
                                placeholder="Buscar"
                                className="search-input"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                style={{ width: '80% !important' }}
                            />

                            <Button type="submit" variant="outline-primary" className="search-button">
                                <img src={magnifyingGlass} alt="Buscar" style={{ width: '20px', height: '20px' }} />
                            </Button>
                        </Col>
                    ) : (
                        <Col xs={12} sm={7} md={6} className="d-flex align-items-center">
                            <Form.Control
                                type="number"
                                min="1"
                                placeholder="Buscar"
                                className="search-input"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                style={{ width: '95% !important' }}
                            />

                            <Button type="submit" variant="outline-primary" className="search-button" style={{marginLeft: '10px'}}>
                                <img src={magnifyingGlass} alt="Buscar" style={{ width: '20px', height: '20px', }} />
                            </Button>
                        </Col>
                    )}
                </Row>
            </Form>

            <p className="search-helper-text mt-2">
                {searchType === "cedula" ? "Ingrese número de C.C" : "Ingrese número del CUB"}
            </p>
        </Col>

    );
};

SearchUserForm.propTypes = {
    component: PropTypes.string.isRequired,
    onSearchSuccess: PropTypes.func.isRequired,
};
