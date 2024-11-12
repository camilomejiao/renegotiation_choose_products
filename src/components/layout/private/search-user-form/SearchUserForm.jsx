import { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import magnifyingGlass from "../../../../assets/image/icons/magnifying_glass.png";
import PropTypes from "prop-types";

// Services
import { userService } from "../../../../helpers/services/UserServices";

//Enum
import { StatusEnum } from "../../../../helpers/GlobalEnum";

//Css
import './SearchUserForm.css';

export const SearchUserForm = ({ onSearchSuccess }) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = async (e) => {
        e.preventDefault();

        if (searchValue.trim() !== "" && parseInt(searchValue) > 5) {
            const { data, status} = await userService.searchUser(searchValue);

            if (status === StatusEnum.OK) {
                if (Object.keys(data).length === 0) {
                    Swal.fire({
                        title: "Oops...",
                        html: "Usuario no existe en el sistema",
                        icon: "error",
                        width: 300,
                        heightAuto: true,
                    });
                }

                if (Object.keys(data).length > 0) {
                    Swal.fire({
                        title: "Bien hecho!",
                        html: "Usuario encontrado",
                        icon: "success",
                        width: 300,
                        heightAuto: true,
                    });

                    // Llamar a la acción personalizada después de una búsqueda exitosa
                    onSearchSuccess(data);
                }
            }
        }
    };

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
