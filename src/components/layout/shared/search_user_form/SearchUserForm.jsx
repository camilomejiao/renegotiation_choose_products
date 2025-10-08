import { useState } from "react";
import magnifyingGlass from "../../../../assets/image/icons/magnifying_glass.png";
import PropTypes from "prop-types";

// Services
import { userServices } from "../../../../helpers/services/UserServices";

//Enum
import {ComponentEnum, ResponseStatusEnum} from "../../../../helpers/GlobalEnum";

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

    const isRenegotiation = component === ComponentEnum.RENEGOTIATION;

    return (
        <form className="search-panel" onSubmit={handleSearch}>
            <div className="search-panel__controls">
                {isRenegotiation && (
                    <select
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                        className="input-field input-field--accent search-panel__input"
                    >
                        <option value="2">Cédula</option>
                        <option value="1">CUB</option>
                    </select>
                )}

                <input
                    type="number"
                    min="1"
                    placeholder="Buscar"
                    className="input-field input-field--accent search-panel__input"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <button type="submit" className="button-pill button-pill--icon" aria-label="Buscar">
                    <img src={magnifyingGlass} alt="" role="presentation" width="22" height="22" />
                </button>
            </div>

            <p className="search-panel__hint">
                {isRenegotiation && searchType === "1"
                    ? "Ingrese número del CUB del titular PNIS"
                    : "Ingrese número de cédula del titular PNIS"}
            </p>
        </form>
    );
};

SearchUserForm.propTypes = {
    component: PropTypes.string.isRequired,
    onSearchSuccess: PropTypes.func.isRequired,
};
