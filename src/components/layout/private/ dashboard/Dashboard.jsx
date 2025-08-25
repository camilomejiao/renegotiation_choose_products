import { useOutletContext } from "react-router-dom";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";

// Colores corporativos
const COLORS = {
    green: "#40A581",
    lime:  "#BFD732",
    blue:  "#2148C0",
    gray:  "#6c757d",
};

// --- Datos ---
const mockAlerts = [
    { id: 1, title: "Entrega pendiente", text: "Hay 4 entregas sin consolidado.", level: "warning" },
    { id: 2, title: "Aprobación técnica", text: "2 entregas esperan visto bueno.", level: "info" },
    { id: 3, title: "Factura electrónica", text: "1 FE rechazada por número inválido.", level: "danger" },
];

const barData = [
    { name: "Ene", entregas: 12 }, { name: "Feb", entregas: 18 },
    { name: "Mar", entregas: 9  }, { name: "Abr", entregas: 22 },
    { name: "May", entregas: 15 }, { name: "Jun", entregas: 27 },
];

const pieData = [
    { name: "Aprobadas", value: 58 },
    { name: "Pendientes", value: 28 },
    { name: "Rechazadas", value: 14 },
];

const levelToVariant = (level) => {
    switch (level) {
        case "warning": return "warning";
        case "danger":  return "danger";
        case "info":    return "info";
        case "success": return "success";
        default:        return "secondary";
    }
};

// ----- Componente: Tarjeta de alerta -----
const AlertCard = ({ title, text, level }) => (
    <Card className="h-100 shadow-sm" style={{ borderLeft: `6px solid ${COLORS.green}` }}>
        <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
                <Card.Title className="mb-1" style={{ fontWeight: 700 }}>{title}</Card.Title>
                <Badge bg={levelToVariant(level)}>{level.toUpperCase()}</Badge>
            </div>
            <Card.Text className="mb-0" style={{ color: "#444" }}>{text}</Card.Text>
        </Card.Body>
    </Card>
);

// ----- Componente: Bloque de gráficas -----
const ChartsBlock = () => (
    <Card className="shadow-sm">
        <Card.Header style={{ background: COLORS.green, color: "#fff", fontWeight: 700 }}>
            Indicadores
        </Card.Header>
        <Card.Body>
            <Row className="g-4">
                <Col xs={12} lg={8}>
                    <div style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="entregas" radius={[6, 6, 0, 0]} fill={COLORS.blue} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-muted small">Entregas por mes</div>
                </Col>

                <Col xs={12} lg={4}>
                    <div style={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={4}
                                >
                                    <Cell fill={COLORS.green} />
                                    <Cell fill={COLORS.lime} />
                                    <Cell fill={COLORS.blue} />
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} />
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-muted small">Estado de entregas</div>
                </Col>
            </Row>
        </Card.Body>
    </Card>
);

export const Dashboard = () => {
    // Si ya usas contexto con userAuth / userData, ajusta aquí:
    const { userAuth } = useOutletContext?.() || {};
    const nombre = userAuth?.nombres || userAuth?.name || "proveedor/a";

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
                        <Card className="shadow-sm">
                            <Card.Header style={{ background: COLORS.green, color: "#fff", fontWeight: 700 }}>
                                Alertas
                            </Card.Header>
                            <Card.Body>
                                {mockAlerts.length === 0 ? (
                                    <div className="text-muted">No hay alertas por ahora.</div>
                                ) : (
                                    <Row className="g-3">
                                        {mockAlerts.map((a) => (
                                            <Col xs={12} md={6} lg={4} key={a.id}>
                                                <AlertCard {...a} />
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Sección de Gráficas */}
                    <Col xs={12}>
                        <ChartsBlock />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
