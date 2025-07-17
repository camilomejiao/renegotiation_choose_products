
import {useNavigate, useOutletContext} from "react-router-dom";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";

//Img
import imgPayments from "../../../../../../assets/image/payments/payments.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import territorial from "../../../../../../assets/image/payments/territorial.png";
import tecnico from "../../../../../../assets/image/payments/tecnico.png";
import supervision from "../../../../../../assets/image/payments/supervision.png";
import pagos from "../../../../../../assets/image/payments/pagos.png";
import fiduciaria from "../../../../../../assets/image/payments/fiduciaria.png";

//Enum
import { RolesEnum } from "../../../../../../helpers/GlobalEnum";

//Css
import "./PaymentsMenu.css";

const userCards = [
    { title: "Territorial", role: RolesEnum.TERRITORIAL_LINKS, key: "territorial", img: territorial },
    { title: "Técnico", role: RolesEnum.TECHNICAL, key: "tecnico", img: tecnico },
    { title: "Supervisión", role: RolesEnum.SUPERVISION, key: "supervision", img: supervision },
    { title: "Pagos", role: RolesEnum.PAYMENTS, key: "pagos", img: pagos },
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
                        {userCards.map(card => (
                            <div
                                key={card.key}
                                className={`payment-card ${userAuth.rol_id !== card.role ? "disabled" : ""}`}
                                onClick={() => userAuth.rol_id === card.role && handleRedirect(card.key)}
                                style={{ cursor: userAuth.rol_id === card.role ? "pointer" : "not-allowed" }}
                            >
                                <p className="payment-card-title">{card.title}</p>
                                <img src={card.img} alt={card.title} />
                            </div>
                        ))}
                    </div>
                </div>

                {
                    [RolesEnum.ADMIN, RolesEnum.PAYMENTS].includes(userAuth.rol_id) && (
                        <>
                            <div className="payment-status">
                                <div className="payment-srarys-content">
                                    <h3>Estado</h3>
                                    <div
                                        className="payment-status-card"
                                        onClick={() => handleFiduciary()}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <p className="payment-status-text">Fiduciaria</p>
                                        <img src={fiduciaria} alt="Fiduciaria" />
                                    </div>
                                </div>
                                <div className="payment-srarys-content">
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