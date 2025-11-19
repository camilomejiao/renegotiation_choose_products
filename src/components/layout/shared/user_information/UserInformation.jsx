import { Row, Col } from "react-bootstrap";
import { FaUser, FaIdCard, FaMapMarkerAlt, FaPhone, FaClipboardList } from "react-icons/fa";
import imgAdd from "../../../../assets/image/addProducts/imgAdd.png";

const detailsConfig = [
    { key: "departamento", label: "Departamento", icon: FaMapMarkerAlt },
    { key: "municipio", label: "Municipio", icon: FaMapMarkerAlt },
    { key: "vereda", label: "Vereda", icon: FaMapMarkerAlt },
    { key: "estado_cub", label: "Estado", icon: FaClipboardList },
    { key: "actividad", label: "Actividad", icon: FaClipboardList },
    { key: "tipo", label: "Tipo de persona", icon: FaUser },
    { key: "telefono", label: "Teléfono", icon: FaPhone },
    { key: "plan", label: "Plan", icon: FaClipboardList },
    { key: "linea", label: "Línea", icon: FaClipboardList },
    { key: "restriccion", label: "Restricción", icon: FaClipboardList },
    { key: "etnico", label: "Etnia", icon: FaUser },
    { key: "observaciones", label: "Observaciones", icon: FaClipboardList },
];

export const UserInformation = ({ userData = {} }) => {
    const nombre = [userData?.nombre, userData?.apellido].filter(Boolean).join(" ");

    const entries = detailsConfig
        .map(({ key, label, icon }) => ({ label, value: userData?.[key], icon }))
        .filter(({ value }) => value !== undefined && value !== null && value !== "");

    return (
        <div className="beneficiary-card mb-4">
            <div className="beneficiary-header">
                <div className="beneficiary-avatar">
                    <img src={imgAdd} alt="Usuario" />
                </div>
                
                <div className="beneficiary-info">
                    <h4 className="beneficiary-name">
                        <FaUser className="me-2" />
                        {nombre || "No disponible"}
                    </h4>
                    
                    <div className="beneficiary-meta">
                        <div className="meta-item">
                            <FaIdCard className="meta-icon" />
                            <span className="meta-label">C.C:</span>
                            <span className="meta-value">{userData?.identificacion || "—"}</span>
                        </div>
                        <div className="meta-item">
                            <FaClipboardList className="meta-icon" />
                            <span className="meta-label">CUB:</span>
                            <span className="meta-value">{userData?.cub_id || "—"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {entries.length > 0 && (
                <div className="beneficiary-details">
                    <h5 className="details-title">Información adicional</h5>
                    <Row>
                        {entries.map(({ label, value, icon: Icon }) => (
                            <Col md={6} lg={4} key={label} className="mb-3">
                                <div className="detail-item">
                                    <div className="detail-label">
                                        <Icon className="detail-icon" />
                                        {label}
                                    </div>
                                    <div className="detail-value">{value}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </div>
    );
};
