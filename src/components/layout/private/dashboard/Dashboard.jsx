import { useNavigate, useOutletContext } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

import { SearchUserForm } from "../../shared/search_user_form/SearchUserForm";
import { Breadcrumb } from "../../../shared/Breadcrumb";
import { ComponentEnum, RolesEnum } from "../../../../helpers/GlobalEnum";

export const Dashboard = () => {
    const navigate = useNavigate();
    const { userAuth } = useOutletContext();

    const handleSearchSuccess = (userData) => {
        const { data } = userData;

        userAuth.rol_id === RolesEnum.SUPPLIER
            ? navigate(`/admin/supplier/create-order/${data.id}`)
            : navigate(`/admin/beneficiary-management/${data.id}`);
    };

    return (
        <>
            <Breadcrumb />
            
            <div className="container-fluid px-4">
                {/* Hero Section */}
                <div className="card mb-5">
                    <div className="card-body text-center py-5">
                        <h1 className="display-4 fw-bold text-primary mb-3">
                            Bienvenido al Portal de <span className="text-success">Proveedores</span>
                        </h1>
                        <p className="lead text-muted mb-4">
                            Sistema de gestión para proveedores de la DSCI - PNIS
                        </p>
                        <div className="badge badge-primary fs-sm px-4 py-2">
                            Da el siguiente paso en tus <strong>ventas</strong> ahora
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
                            Ingrese el documento de identidad para buscar un beneficiario
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
}
