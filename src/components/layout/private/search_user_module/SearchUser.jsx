import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

//Component
import { SearchUserForm } from "../../shared/search_user_form/SearchUserForm";
import { Breadcrumb } from "../../../shared/Breadcrumb";

//Enums
import { ComponentEnum, RolesEnum } from "../../../../helpers/GlobalEnum";

export const SearchUser = () => {

    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    //
    const handleSearchSuccess = (userData) => {
        const { id } = userData;

        userAuth.rol_id === RolesEnum.SUPPLIER
            ? navigate(`/admin/create-order/${id}`)
            : navigate(`/admin/reports/${id}`);
    };

    useEffect(() => {}, []);

    return (
        <>
            <Breadcrumb />
            <div className="container-fluid px-4">
            {/* Hero Section */}
            <div className="card mb-5">
                <div className="card-body text-center py-5">
                    <h1 className="display-4 fw-bold text-primary mb-3">
                        Bienvenido al <span className="text-success">Banco de Proveedores</span> de la DSCI
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
                        Consulta de beneficiarios
                    </h2>
                    <p className="form-subtitle">
                        Ingresa el documento o CUB para iniciar
                    </p>
                </div>

                <SearchUserForm component={ComponentEnum.USER} onSearchSuccess={handleSearchSuccess} />
            </div>
            </div>
        </>
    );
}
