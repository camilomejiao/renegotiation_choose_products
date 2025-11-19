import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

//Components
import { SearchUserForm } from "../../shared/search_user_form/SearchUserForm";
import { Breadcrumb } from "../../../shared/Breadcrumb";
import { ComponentEnum } from "../../../../helpers/GlobalEnum";

export const SearchUserForRenegociation = () => {

    const navigate = useNavigate();

    const handleSearchSuccess = (userData) => {
        const { cub_id: cubId } = userData;
        navigate(`/admin/renegociation/${cubId}`)
    }

    return (
        <>
            <Breadcrumb />
            <div className="container-fluid px-4">
                {/* Hero Section */}
                <div className="card mb-5">
                    <div className="card-body text-center py-5">
                        <h1 className="display-4 fw-bold text-primary mb-3">
                            Bienvenido al Portal de <span className="text-success">Renegociación</span>
                        </h1>
                        <p className="lead text-muted mb-4">
                            Sistema de gestión para proveedores de la DSCI - PNIS
                        </p>
                        <div className="badge badge-primary fs-sm px-4 py-2">
                            Da el siguiente paso en tus <strong>renegociaciones</strong> ahora
                        </div>
                    </div>
                </div>

                {/* Search Form */}
                <div className="form-container">
                    <div className="form-header">
                        <h2 className="form-title">
                            <FaSearch className="me-2" />
                            Búsqueda de Usuario
                        </h2>
                        <p className="form-subtitle">
                            Ingrese el documento de identidad para buscar un beneficiario y gestionar renegociaciones
                        </p>
                    </div>

                    <SearchUserForm 
                        component={ComponentEnum.RENEGOTIATION} 
                        onSearchSuccess={handleSearchSuccess} 
                    />
                </div>
            </div>
        </>
    );
}