import PropTypes from "prop-types";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

// Services
import { renegotiationServices } from "../../../../helpers/services/RenegociationServices";
import { userServices } from "../../../../helpers/services/UserServices";

//Enum
import {
  ComponentEnum,
  ResponseStatusEnum,
} from "../../../../helpers/GlobalEnum";

import AlertComponent from "../../../../helpers/alert/AlertComponent";
import "./SearchUserForm.css";

export const SearchUserForm = ({ component, onSearchSuccess }) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("2");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!isValidSearch(searchValue)) {
      showAlert(
        "error",
        "Oops...",
        "El número que buscas debe ser mayor a 5 dígitos"
      );
      return;
    }

    setIsLoading(true);

    try {
      const { data, status } =
        component === ComponentEnum.USER
          ? await userServices.searchUser(searchValue)
          : await renegotiationServices.getUserRenegotiation(
              searchType,
              searchValue
            );

      if (status === ResponseStatusEnum.NOT_FOUND) {
        return showAlert("error", "Oops...", "Usuario no existe en el sistema");
      }

      if (!data.success) {
        return showAlert("error", "Oops...", `${data.message}`);
      }

      showAlert("success", "Bien hecho!", "Usuario encontrado");
      onSearchSuccess(data);
    } catch (error) {
      console.error("Search Error:", error);
      showAlert("error", "Error", "Ocurrió un error durante la búsqueda");
    } finally {
      setIsLoading(false);
    }
  };

  function isValidSearch(value) {
    return value.trim() !== "" && parseInt(value) > 5;
  }

  function showAlert(type, title, message) {
    if (type === "error") {
      AlertComponent.error(title, message);
    } else if (type === "success") {
      AlertComponent.success(title, message);
    }
  }

  const isRenegotiation = component === ComponentEnum.RENEGOTIATION;

  return (
    <Form onSubmit={handleSearch}>
      <div className="search-form-container">
        <div className="filters-row">
          {isRenegotiation && (
            <div>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="gov-select"
                disabled={isLoading}
              >
                <option value="2">Cédula</option>
                <option value="1">CUB</option>
              </select>
            </div>
          )}
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input
              type="number"
              min="1"
              placeholder="Ingrese número de documento"
              className="gov-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              <FaSearch />
              {isLoading ? "Buscando..." : "Buscar Usuario"}
            </button>
          </div>
        </div>
      </div>
      <div className="form-text text-center mt-2">
        {isRenegotiation && searchType === "1"
          ? "Ingrese número del CUB del titular PNIS"
          : "Ingrese número de cédula del titular PNIS"}
      </div>
    </Form>
  );
};

SearchUserForm.propTypes = {
  component: PropTypes.string.isRequired,
  onSearchSuccess: PropTypes.func.isRequired,
};
