import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect } from "react";
import {Col, Container, Row} from "react-bootstrap";


// Colores corporativos
const COLORS = {
    green: "#40A581",
    lime:  "#BFD732",
    blue:  "#2148C0",
    gray:  "#6c757d",
};

export const Dashboard = () => {

    //
    const navigate = useNavigate();

    // Si ya usas contexto con userAuth / userData, ajusta aquí:
    const { userAuth } = useOutletContext?.() || {};
    const nombre = userAuth?.nombres || userAuth?.name || "proveedor/a";

    // //Quitar cuando ya se pueda ver
    useEffect(() => {
        //navigate("/admin/search-user", { replace: true });
    }, []);

    return (
        <div className="pb-5">
            {/* Banner de bienvenida */}
            <div
                className="mb-4 p-4 p-md-5 rounded-3 shadow-sm"
                style={{
                    background: `linear-gradient(90deg, ${COLORS.green}, ${COLORS.blue})`,
                    color: "#fff",
                }}
            >
                <Container>
                    <h2 className="mb-1" style={{ fontWeight: 800 }}>
                        ¡Bienvenido, {nombre}!
                    </h2>
                    <p className="mb-0">
                        Portal de la <b>Dirección de Sustitución de Cultivos de Uso Ilícito</b>.
                    </p>
                </Container>
            </div>

            <Container>
                <Row className="g-4">
                    {/* Sección de Alertas */}
                    <Col xs={12}>

                    </Col>

                    {/* Sección de Gráficas */}
                    <Col xs={12}>

                    </Col>
                </Row>
            </Container>
        </div>
    );
}
