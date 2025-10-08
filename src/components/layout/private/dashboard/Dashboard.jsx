import { useNavigate, useOutletContext } from "react-router-dom";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import {useEffect} from "react";

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
        case "warning":
        case "danger":
        case "info":
        case "success":
            return level;
        default:
            return "secondary";
    }
};

// ----- Componente: Tarjeta de alerta -----
const AlertCard = ({ title, text, level }) => (
    <div className={`alert-card alert-card--${level}`}>
        <div className="alert-card__header">
            <h4 className="alert-card__title">{title}</h4>
            <span className={`badge-soft badge-soft--${levelToVariant(level)}`}>
                {level.toUpperCase()}
            </span>
        </div>
        <p className="alert-card__text">{text}</p>
    </div>
);

// ----- Componente: Bloque de gráficas -----
const ChartsBlock = () => (
    <section className="surface-card">
        <header className="surface-card__header">
            <h3 className="surface-card__title">Indicadores</h3>
            <span className="text-soft">Últimos 6 meses</span>
        </header>

        <div className="surface-card__body">
            <div className="dashboard-charts">
                <div>
                    <div className="dashboard-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="name" stroke="#9ba9bf" tickLine={false} axisLine={{ stroke: "#e0e6f0" }} />
                                <YAxis stroke="#9ba9bf" tickLine={false} axisLine={{ stroke: "#e0e6f0" }} />
                                <Tooltip cursor={{ fill: "rgba(4, 105, 153, 0.05)" }} />
                                <Bar dataKey="entregas" radius={[6, 6, 0, 0]} fill={COLORS.blue} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="dashboard-chart__caption">Entregas por mes</p>
                </div>

                <div>
                    <div className="dashboard-chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={60}
                                    outerRadius={92}
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
                    <p className="dashboard-chart__caption">Estado de entregas</p>
                </div>
            </div>
        </div>
    </section>
);

export const Dashboard = () => {

    //
    const navigate = useNavigate();

    // Si ya usas contexto con userAuth / userData, ajusta aquí:
    const { userAuth } = useOutletContext?.() || {};
    const nombre = userAuth?.nombres || userAuth?.name || "proveedor/a";

    // //Quitar cuando ya se pueda ver
    useEffect(() => {
        navigate("/admin/search-user", { replace: true });
    }, [navigate]);

    return (
        <div className="dashboard-layout">
            <section className="page-hero">
                <h2 className="page-hero__title">¡Bienvenido, {nombre}!</h2>
                <p className="page-hero__subtitle">
                    Portal de la <strong>Dirección de Sustitución de Cultivos de Uso Ilícito</strong>.
                </p>
                <div className="page-hero__cta">
                    Gestión integrada de beneficiarios, proveedores y entregas.
                </div>
            </section>

            <section className="surface-card">
                <header className="surface-card__header">
                    <h3 className="surface-card__title">Alertas</h3>
                    <span className="text-soft">Tareas rápidas por resolver</span>
                </header>

                <div className="surface-card__body">
                    {mockAlerts.length === 0 ? (
                        <div className="text-soft">No hay alertas por ahora.</div>
                    ) : (
                        <div className="stat-grid">
                            {mockAlerts.map((alert) => (
                                <AlertCard key={alert.id} {...alert} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <ChartsBlock />
        </div>
    );
}
