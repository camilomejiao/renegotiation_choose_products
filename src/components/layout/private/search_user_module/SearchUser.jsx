import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

//Component
import { SearchUserForm } from "../../shared/search_user_form/SearchUserForm";

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
        <div className="page-wrapper">
            <section className="page-hero">
                <h1 className="page-hero__title">
                    Bienvenido al <span className="text-highlight">Banco de Proveedores</span> de la DSCI
                </h1>
                <p className="page-hero__subtitle">
                    Da el siguiente paso en tus <strong>ventas</strong> ahora.
                </p>
            </section>

            <section className="surface-card">
                <header className="surface-card__header">
                    <h2 className="surface-card__title">Consulta de beneficiarios</h2>
                    <span className="text-soft">Ingresa el documento o CUB para iniciar</span>
                </header>

                <div className="surface-card__body">
                    <SearchUserForm component={ComponentEnum.USER} onSearchSuccess={handleSearchSuccess} />
                </div>
            </section>
        </div>
    );
}
