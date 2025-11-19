import { useNavigate } from "react-router-dom";

//Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import imgWorker from "../../../../../../assets/image/payments/worker.png";
import imgHead from "../../../../../../assets/image/payments/head-calendar.png";
import imgPlus from "../../../../../../assets/image/payments/plus.png";

//Components
import { ModernBanner } from "../../../../../shared/ModernBanner";
import { Breadcrumb } from "../../../../../shared/Breadcrumb";
import { ListCollectionAccount } from "../list-collection-account/ListCollectionAccount";

export const PaySuppliers = () => {
    const navigate = useNavigate();

    const handleCreateCollectionAccount = () => {
        navigate(`/admin/payments-suppliers/create-collection-account`);
    }

    return (
        <>
            <Breadcrumb />
            <div className="container-fluid px-4">
                <ModernBanner
                    imageHeader={imgPayments}
                    titleHeader="Proceso de Pago"
                    bannerIcon={imgAdd}
                    backgroundIconColor="#2148C0"
                    bannerInformation="Aquí podrás revisar el estado de tus órdenes de pago y crear nuevas cuentas de cobro"
                    backgroundInformationColor="#F66D1F"
                    infoText="Recuerda que puedes crear cuentas de cobro para agilizar el proceso de pago de tus entregas aprobadas."
                />

                <div className="card">
                    <div className="card-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <img src={imgWorker} alt="Proveedor" style={{ width: '32px', height: '32px' }} />
                            <h3 className="card-title">Panel de Proveedor</h3>
                        </div>
                    </div>
                    <div className="card-body">
                        <div 
                            onClick={handleCreateCollectionAccount} 
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                padding: '20px',
                                marginBottom: '24px',
                                fontSize: '16px'
                            }}
                        >
                            <img src={imgHead} alt="Ícono calendario" style={{ width: '24px', height: '24px' }} />
                            Crear nueva cuenta de cobro
                            <img src={imgPlus} alt="Plus" style={{ width: '20px', height: '20px' }} />
                        </div>

                        <ListCollectionAccount />
                    </div>
                </div>
            </div>
        </>
    )
}
