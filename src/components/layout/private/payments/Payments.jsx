//Components
import { HeaderImage } from "../../shared/header-image/HeaderImage";

//Img
import imgPayments from "../../../../assets/image/payments/payments.png";
import imgAdd from "../../../../assets/image/payments/imgPay.png";
import worker from "../../../../assets/image/payments/worker.png";
import territorial from "../../../../assets/image/payments/territorial.png";
import tecnico from "../../../../assets/image/payments/tecnico.png";
import supervision from "../../../../assets/image/payments/supervision.png";
import pagos from "../../../../assets/image/payments/pagos.png";
import fiduciaria from "../../../../assets/image/payments/fiduciaria.png";

//Css
import "./Payments.css";
import {useNavigate} from "react-router-dom";

export const Payments = () => {

    const navigate = useNavigate();

    const handleRedirect = () => {
        navigate("/admin/payments-suppliers");
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
                <div className="payment-header" onClick={handleRedirect} style={{ cursor: "pointer" }}>
                    <div className="payment-header-content">
                        <h2>Proveedor</h2>
                    </div>
                    <div className="payment-header-text">
                        <p>Ingresa para gestionar los documentos de <br/>tus órdenes de compra</p>
                    </div>
                    <div className="payment-header-img">
                        <img src={worker} alt="Proveedor" />
                    </div>
                </div>

                <div className="revisions">
                    <h3>Revisiones</h3>
                    <div className="payment-cards">
                        <div className="payment-card">
                            <p className="payment-card-title">Territorial</p>
                            <img src={territorial} alt="Territorial" />
                        </div>
                        <div className="payment-card">
                            <p className="payment-card-title">Técnico</p>
                            <img src={tecnico} alt="Técnico" />
                        </div>
                        <div className="payment-card">
                            <p className="payment-card-title">Supervisión</p>
                            <img src={supervision} alt="Supervisión" />
                        </div>
                        <div className="payment-card">
                            <p className="payment-card-title">Pagos</p>
                            <img src={pagos} alt="Pagos" />
                        </div>
                    </div>
                </div>

                <div className="payment-status">
                    <h3>Estado</h3>
                    <div className="payment-status-card">
                        <p className="payment-status-text">Fiduciaria</p>
                        <img src={fiduciaria} alt="Fiduciaria" />
                    </div>
                </div>
            </div>

        </>
    )
}