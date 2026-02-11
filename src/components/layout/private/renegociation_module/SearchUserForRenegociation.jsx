import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

//Components
import { SearchUserForm } from "../../shared/search_user_form/SearchUserForm";
import { ComponentEnum } from "../../../../helpers/GlobalEnum";

export const SearchUserForRenegociation = () => {

    const navigate = useNavigate();

    const handleSearchSuccess = (userData) => {
        const { cub_id: cubId } = userData;
        navigate(`/admin/renegociation/${cubId}`)
    }

    return (
        <div className="search-user-page">
            <section className="search-user-hero">
                <div className="search-user-hero__card">
                    <h1 className="search-user-hero__title">
                        Bienvenido al Portal de <span>Proveedores</span>
                    </h1>
                    <p className="search-user-hero__subtitle">
                        Sistema de gestión para proveedores de la DSCI - RenHacemos
                    </p>
                    <div className="search-user-hero__cta">
                        DA EL SIGUIENTE PASO EN TUS VENTAS AHORA
                    </div>
                </div>
            </section>

            <section className="search-user-card">
                <header className="search-user-card__header">
                    <h2 className="search-user-card__title">
                        <FaSearch />
                        Búsqueda de Usuario
                    </h2>
                    <p className="search-user-card__subtitle">
                        Ingrese el documento de identidad para buscar un beneficiario
                    </p>
                </header>

                <div className="search-user-card__body">
                    <SearchUserForm component={ComponentEnum.RENEGOTIATION} onSearchSuccess={handleSearchSuccess} />
                </div>
            </section>
        </div>
    );
}

