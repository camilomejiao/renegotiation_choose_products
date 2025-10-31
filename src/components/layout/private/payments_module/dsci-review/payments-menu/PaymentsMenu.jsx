import { useNavigate, useOutletContext } from "react-router-dom";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";

//Img
import imgPayments from "../../../../../../assets/image/payments/payments.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import supervision from "../../../../../../assets/image/payments/supervision.png";
import pagos from "../../../../../../assets/image/payments/pagos.png";
import fiduciaria from "../../../../../../assets/image/payments/fiduciaria.png";

//Enum
import { RolesEnum } from "../../../../../../helpers/GlobalEnum";

//Css
import "./PaymentsMenu.css";

const userCards = [
    { title: "Supervisión", role: RolesEnum.SUPERVISION, key: "supervision", img: supervision },
    { title: "Pagos", role: [RolesEnum.PAYMENTS, RolesEnum.TRUST_PAYMENTS], key: "pagos", img: pagos },
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
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Proceso de pago'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar el estado de tus órdenes de pago.'}
                backgroundInformationColor={'#F66D1F'}
            />

            <div className="payment-container">

                <div className="revisions">
                    <h3>Revisiones</h3>
                    <div className="payment-cards">
                        {userCards.map((card) => {
                            const roles = Array.isArray(card.role) ? card.role : [card.role];
                            const userRole = userAuth?.rol_id;
                            const hasAccess = userRole != null && roles.includes(userRole);

                            return (
                                <div
                                    key={card.key}
                                    className={`payment-card ${hasAccess ? "" : "disabled"}`}
                                    onClick={hasAccess ? () => handleRedirect(card.key) : undefined}
                                    style={{ cursor: hasAccess ? "pointer" : "not-allowed" }}
                                    role="button"
                                    aria-disabled={!hasAccess}
                                    tabIndex={hasAccess ? 0 : -1}
                                >
                                    <p className="payment-card-title">{card.title}</p>
                                    <img src={card.img} alt={card.title} />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {
                    [RolesEnum.ADMIN, RolesEnum.TRUST_PAYMENTS].includes(userAuth.rol_id) && (
                        <>
                            <div className="payment-status">
                                <div className="payment-srarys-content">
                                    <h3>Fiduciaria</h3>
                                    <div
                                        className="payment-status-card"
                                        onClick={() => handleFiduciary()}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <p className="payment-status-text">Fiduciaria</p>
                                        <img src={fiduciaria} alt="Fiduciaria" />
                                    </div>
                                </div>
                                <div className="payment-srarys-content"
                                     onClick={() => handleConciliation()}
                                     style={{ cursor: "pointer" }}
                                >
                                    <h3>Conciliación</h3>
                                    <div className="payment-status-card">
                                        <p className="payment-status-text">Conciliación</p>
                                        <img src={fiduciaria} alt="Fiduciaria" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div>

        </>
    )
}