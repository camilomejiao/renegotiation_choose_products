import { useNavigate } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

//Components
import { SearchUserForm } from "../../shared/search-user-form/SearchUserForm";
import { ComponentEnum } from "../../../../helpers/GlobalEnum";


export const SearchUserForRenegociation = () => {

    const navigate = useNavigate();

    const handleSearchSuccess = (userData) => {
        const { id } = userData;
        navigate(`/admin/renegociation/${id}`)
    }

    return (
        <>
            <Container fluid className="dashboard-container">
                <Row className="text-center mt-5">
                    <Col>
                        <h1 className="dashboard-title">
                            Bienvenido al <span className="highlight-text">banco de <br/>Proveedores</span> de la DSCI
                        </h1>
                        <p className="green-box">
                            Da el siguiente paso en tus <span className="highlight-text2">entregas</span> ahora.
                        </p>
                    </Col>
                </Row>

                <Row className="justify-content-center mt-4">
                    <SearchUserForm component={ComponentEnum.RENEGOTIATION} onSearchSuccess={handleSearchSuccess} />
                </Row>

            </Container>
        </>
    );
}