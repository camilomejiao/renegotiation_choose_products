import { useState } from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import magnifyingGlass from "../../../../assets/image/icons/magnifying_glass.png";
import PropTypes from "prop-types";

// Services
import { userServices } from "../../../../helpers/services/UserServices";

//Enum
import {ComponentEnum, ResponseStatusEnum} from "../../../../helpers/GlobalEnum";

//Css
import AlertComponent from "../../../../helpers/alert/AlertComponent";
import {renegotiationServices} from "../../../../helpers/services/RenegociationServices";

export const SearchUserForm = ({ component, onSearchSuccess }) => {
    const [searchValue, setSearchValue] = useState("");
    const [searchType, setSearchType] = useState("2");

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
                    ? await userServices.searchUser(searchValue)
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
                        <Col xs={12} sm={7} md={6} className="d-flex flex-row flex-md-row align-items-stretch align-items-md-start gap-2 search-form--renegotiation">
                            <Form.Select
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                                className="search-select"
                            >
                                <option value="2">Cédula</option>
                                <option value="1">CUB</option>
                            </Form.Select>

                            <div className="search-input-with-icon">
                                <img src={magnifyingGlass} alt="" className="search-input-with-icon__icon" />
                                <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="Ingrese número de documento"
                                    className="search-input"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>

                            <Button type="submit" variant="outline-primary" className="search-button">
                                <img src={magnifyingGlass} alt="Buscar" style={{ width: '16px', height: '16px' }} />
                                Buscar Usuario
                            </Button>
                        </Col>
                    ) : (
                        <Col xs={12} sm={7} md={6} className="search-form2 d-flex flex-row flex-md-row align-items-stretch align-items-md-end gap-2">
                            <div className="search-input-with-icon">
                                <img src={magnifyingGlass} alt="" className="search-input-with-icon__icon" />
                                <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="Ingrese número de documento"
                                    className="search-input"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>

                            <Button type="submit" variant="outline-primary" className="search-button">
                                <img src={magnifyingGlass} alt="Buscar" style={{ width: '16px', height: '16px' }} />
                                Buscar Usuario
                            </Button>
                        </Col>
                    )}
                </Row>
            </Form>

            <p className="search-helper-text mt-2">
                {searchType === "2" ? "Ingrese número de cédula del titular PNIS" : "Ingrese número del CUB del titular PNIS"}
            </p>
        </Col>

    );
};

SearchUserForm.propTypes = {
    component: PropTypes.string.isRequired,
    onSearchSuccess: PropTypes.func.isRequired,
};

