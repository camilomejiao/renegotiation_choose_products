import { useNavigate, useOutletContext } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { FaMoneyBillWave, FaEye, FaUniversity, FaBalanceScale } from "react-icons/fa";

//Components
import { ModernBanner } from "../../../../../shared/ModernBanner";
import { Breadcrumb } from "../../../../../shared/Breadcrumb";

//Img
import imgPayments from "../../../../../../assets/image/payments/payments.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import supervision from "../../../../../../assets/image/payments/supervision.png";
import pagos from "../../../../../../assets/image/payments/pagos.png";
import fiduciaria from "../../../../../../assets/image/payments/fiduciaria.png";

//Enum
import { RolesEnum } from "../../../../../../helpers/GlobalEnum";

const userCards = [
    { 
        title: "Pagos", 
        role: [RolesEnum.PAYMENTS, RolesEnum.TRUST_PAYMENTS], 
        key: "pagos", 
        icon: FaMoneyBillWave,
        color: "#28a745",
        description: "Gestionar pagos y órdenes"
    },
    { 
        title: "Supervisión", 
        role: RolesEnum.SUPERVISION, 
        key: "supervision", 
        icon: FaEye,
        color: "#007bff",
        description: "Revisar y supervisar entregas"
    },
];

const adminCards = [
    {
        title: "Fiduciaria",
        key: "fiduciary",
        icon: FaUniversity,
        color: "#6f42c1",
        description: "Gestión fiduciaria",
        action: "handleFiduciary"
    },
    {
        title: "Conciliación",
        key: "conciliation", 
        icon: FaBalanceScale,
        color: "#fd7e14",
        description: "Procesos de conciliación",
        action: "handleConciliation"
    }
];

export const PaymentsMenu = () => {
    const { userAuth } = useOutletContext();

    const navigate = useNavigate();

    const handleRedirect = (role) => {
        navigate(`/admin/payments/${role}`);
    };

    const handleFiduciary = () => {
        navigate(`/admin/fiduciary/list-account-suppliers`);
    }

    const handleConciliation = () => {
        navigate(`/admin/conciliation/list-conciliation`);
    }

    return (
        <>
            <Breadcrumb />
            <div className="container-fluid px-4">
                <ModernBanner
                    imageHeader={imgPayments}
                    titleHeader="​"
                    bannerIcon={imgAdd}
                    bannerInformation="Proceso de Pago"
                    backgroundInformationColor="#2148C0"
                    infoText="Accede a las diferentes opciones de gestión de pagos según tu rol y permisos."
                />

                {/* Revisiones Section */}
                <div className="mb-5">
                    <h3 className="mb-4 text-primary fw-bold">
                        <FaEye className="me-2" />
                        Revisiones
                    </h3>
                    <Row className="g-4">
                        {userCards.map((card) => {
                            const roles = Array.isArray(card.role) ? card.role : [card.role];
                            const userRole = userAuth?.rol_id;
                            const hasAccess = userRole != null && roles.includes(userRole);
                            const IconComponent = card.icon;

                            return (
                                <Col key={card.key} xs={12} sm={6} md={4} lg={3}>
                                    <Card 
                                        className={`h-100 text-center payment-card-modern ${hasAccess ? 'card-hover' : 'card-disabled'}`}
                                        onClick={hasAccess ? () => handleRedirect(card.key) : undefined}
                                        style={{ 
                                            cursor: hasAccess ? "pointer" : "not-allowed",
                                            opacity: hasAccess ? 1 : 0.6
                                        }}
                                    >
                                        <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                                            <div 
                                                className="icon-wrapper mb-3"
                                                style={{ 
                                                    backgroundColor: hasAccess ? card.color : '#6c757d',
                                                    borderRadius: '50%',
                                                    width: '60px',
                                                    height: '60px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                <IconComponent size={24} color="white" />
                                            </div>
                                            <h5 className="card-title mb-2">{card.title}</h5>
                                            <p className="card-text text-muted small">{card.description}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </div>

                {/* Admin Section */}
                {[RolesEnum.ADMIN, RolesEnum.TRUST_PAYMENTS].includes(userAuth.rol_id) && (
                    <div className="mb-5">
                        <h3 className="mb-4 text-primary fw-bold">
                            <FaUniversity className="me-2" />
                            Administración
                        </h3>
                        <Row className="g-4">
                            {adminCards.map((card) => {
                                const IconComponent = card.icon;
                                const handleClick = card.action === "handleFiduciary" ? handleFiduciary : handleConciliation;

                                return (
                                    <Col key={card.key} xs={12} sm={6} md={4} lg={3}>
                                        <Card 
                                            className="h-100 text-center payment-card-modern card-hover"
                                            onClick={handleClick}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                                                <div 
                                                    className="icon-wrapper mb-3"
                                                    style={{ 
                                                        backgroundColor: card.color,
                                                        borderRadius: '50%',
                                                        width: '60px',
                                                        height: '60px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center'
                                                    }}
                                                >
                                                    <IconComponent size={24} color="white" />
                                                </div>
                                                <h5 className="card-title mb-2">{card.title}</h5>
                                                <p className="card-text text-muted small">{card.description}</p>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    </div>
                )}
            </div>
        </>
    )
}
