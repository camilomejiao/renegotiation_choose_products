import { useNavigate } from "react-router-dom";

//Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import imgWorker from "../../../../../../assets/image/payments/worker.png";
import imgHead from "../../../../../../assets/image/payments/head-calendar.png";
import imgPlus from "../../../../../../assets/image/payments/plus.png";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import { ListCollectionAccount } from "../list-collection-account/ListCollectionAccount";

//Css

export const PaySuppliers = () => {

    const navigate = useNavigate();

    const handleCreateCollectionAccount = () => {
        navigate(`/admin/payments-suppliers/create-collection-account`);
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

            <div className="supplier-header">
                <div className="supplier-content">
                    <h2>Proveedor</h2>
                    <img src={imgWorker} alt="Proveedor" className="supplier-img" />
                </div>
            </div>
            <div className="supplier-footer">
                <div className="footer-content" onClick={handleCreateCollectionAccount} style={{ cursor: "pointer" }}>
                    <img src={imgHead} alt="Ícono calendario" />
                    <span>Crear nueva cuenta de cobro</span>
                    <img src={imgPlus} alt="Plus"  />
                </div>
            </div>

            <div  className="container mt-lg-5">
                <ListCollectionAccount  />
            </div>

        </>
    )
}

