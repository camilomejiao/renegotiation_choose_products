
import { useNavigate } from "react-router-dom";

//Components
import { HeaderImage } from "../../../../shared/header-image/HeaderImage";

//Img
import imgPayments from "../../../../../../assets/image/payments/payments.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import territorial from "../../../../../../assets/image/payments/territorial.png";
import tecnico from "../../../../../../assets/image/payments/tecnico.png";
import supervision from "../../../../../../assets/image/payments/supervision.png";
import pagos from "../../../../../../assets/image/payments/pagos.png";
import fiduciaria from "../../../../../../assets/image/payments/fiduciaria.png";

//Css
import "./PaymentsMenu.css";

export const PaymentsMenu = () => {

    const navigate = useNavigate();

    const handleRedirect = (role) => {
        navigate(`/admin/payments/${role}`);
    };

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
                        <div className="payment-card" onClick={() => handleRedirect('territorial')} style={{ cursor: "pointer" }}>
                            <p className="payment-card-title">Territorial</p>
                            <img src={territorial} alt="Territorial" />
                        </div>
                        <div className="payment-card" onClick={() => handleRedirect('tecnico')} style={{ cursor: "pointer" }}>
                            <p className="payment-card-title">Técnico</p>
                            <img src={tecnico} alt="Técnico" />
                        </div>
                        <div className="payment-card" onClick={() => handleRedirect('pagos')} style={{ cursor: "pointer" }}>
                            <p className="payment-card-title">Pagos</p>
                            <img src={pagos} alt="Pagos" />
                        </div>
                        <div className="payment-card" onClick={() => handleRedirect('supervision')} style={{ cursor: "pointer" }}>
                            <p className="payment-card-title">Supervisión</p>
                            <img src={supervision} alt="Supervisión" />
                        </div>
                    </div>
                </div>

                <div className="payment-status">
                    <div>
                        <h3>Estado</h3>
                        <div className="payment-status-card">
                            <p className="payment-status-text">Fiduciaria</p>
                            <img src={fiduciaria} alt="Fiduciaria" />
                        </div>
                    </div>
                    <div>
                        <h3>Estado</h3>
                        <div className="payment-status-card">
                            <p className="payment-status-text">Fiduciaria</p>
                            <img src={fiduciaria} alt="Fiduciaria" />
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}