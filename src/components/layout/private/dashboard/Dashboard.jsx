import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";

//css
import './Dashboard.css';

//Component
import { Footer } from "../../shared/footer/Footer";
import { SearchUserForm } from "../search-user-form/SearchUserForm";

//Enums
import { RolesEnum } from "../../../../helpers/GlobalEnum";

export const Dashboard = () => {

    const { userAuth } = useOutletContext();
    const navigate = useNavigate();

    const handleSearchSuccess = (userData) => {
        const { id } = userData;

        userAuth.rol_id === RolesEnum.DELIVER
            ? navigate(`/admin/create_order/${id}`)
            : navigate(`/admin/reports/${id}`);
    };

    return (
        <>
            <Container fluid className="dashboard-container">
                <Row className="text-center mt-5">
                    <Col>
                        <h1 className="dashboard-title">
                            Bienvenido al <span className="highlight-text">banco de <br/>Proveedores</span> de la DSCI
                        </h1>
                        <p className="green-box">
                            Da el siguiente paso en tus <span className="highlight-text2">ventas</span> ahora.
                        </p>
                    </Col>
                </Row>

                <Row className="justify-content-center mt-4">
                    <SearchUserForm onSearchSuccess={handleSearchSuccess} />
                </Row>

                <Footer />
            </Container>
        </>
    );
}