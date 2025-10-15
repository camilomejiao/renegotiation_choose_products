import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

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
        <>
            <div className="page-wrapper">
                <section className="page-hero">
                    <h1 className="page-hero__title">
                        Bienvenido al <span className="text-highlight">Banco de Proveedores</span> de la DSCI
                    </h1>
                    <p className="page-hero__subtitle">
                        <strong>RENEGOCIACIÓN.</strong>
                    </p>
                </section>

                <section className="surface-card">
                    <header className="surface-card__header">
                        <h2 className="surface-card__title">Consulta de beneficiarios</h2>
                        <span className="text-soft">Ingresa el documento para iniciar</span>
                    </header>

                    <div className="surface-card__body">
                        <SearchUserForm component={ComponentEnum.RENEGOTIATION} onSearchSuccess={handleSearchSuccess} />
                    </div>
                </section>
            </div>
        </>
    );
}