import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { ComponentEnum } from "../../../../helpers/GlobalEnum";
import { Breadcrumb } from "../../../shared/Breadcrumb";
import { ModernBanner } from "../../../shared/ModernBanner";
import { SearchUserForm } from "../../shared/search_user_form/SearchUserForm";

// Imágenes
import deliveriesImg from "../../../../assets/image/icons/deliveries-img.png";

export const SearchUserForDeliveries = () => {
  const navigate = useNavigate();

  const handleSearchSuccess = (userData) => {
    const { id } = userData;
    navigate(`/admin/deliveries/${id}`);
  };

  return (
    <>
      <Breadcrumb />
      <div className="container-fluid px-4">
        <ModernBanner
          imageHeader={deliveriesImg}
          titleHeader="​"
          bannerIcon={deliveriesImg}
          bannerInformation="Entregas de Productos"
          backgroundInformationColor="#2148C0"
          infoText="Busque el beneficiario por su documento de identidad para proceder con la entrega de productos."
        />

        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">
              <FaSearch className="me-2" />
              Búsqueda de Beneficiario
            </h2>
            <p className="form-subtitle">
              Ingrese el documento de identidad para buscar un beneficiario y
              realizar entregas
            </p>
          </div>

          <SearchUserForm
            component={ComponentEnum.USER}
            onSearchSuccess={handleSearchSuccess}
          />
        </div>
      </div>
    </>
  );
};
