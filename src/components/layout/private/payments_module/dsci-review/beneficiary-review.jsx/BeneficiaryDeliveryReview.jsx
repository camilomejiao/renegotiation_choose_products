import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import { FaMoneyBillWave, FaEye } from "react-icons/fa";

//Components
import { ModernBanner } from "../../../../../shared/ModernBanner";
import { Breadcrumb } from "../../../../../shared/Breadcrumb";
import { BeneficiaryDeliveryList } from "../beneficiary-delivery-list/BeneficiaryDeliveryList";

//Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import supervision from "../../../../../../assets/image/payments/supervision.png";
import pagos from "../../../../../../assets/image/payments/pagos.png";

export const BeneficiaryDeliveryReview = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [iconType, setIconType] = useState('');
    const [color, setColor] = useState('');

    const capitalizeFirstLetter = useCallback((text = "") => {
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }, []);

    const getTitleAndImage = useCallback((role) => {
        switch(role) {
            case 'pagos':
                setTitle(capitalizeFirstLetter(role));
                setIconType('pagos');
                setColor('#28a745');
                break;
            case 'supervision':
                setTitle(capitalizeFirstLetter(role));
                setIconType('supervision');
                setColor('#007bff');
                break;
            default:
                setTitle('');
                setIconType('');
                setColor('');
                break;
        }
    }, [capitalizeFirstLetter]);

    const handleRowSelect = (id) => {
        navigate(`/admin/payments-beneficiary/${id}/${params.role}`);
    }

    useEffect(() => {
        if(params.role){
            getTitleAndImage(params.role);
        }
    },[getTitleAndImage, params.role]);

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
                    infoText="Aquí podrás revisar la documentación de las órdenes de pago."
                />

                {/* Review Header Card */}
                <Card className="mb-4">
                    <Card.Header className="bg-light">
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                <h4 className="mb-0 me-3">Revisión</h4>
                                <div className="d-flex align-items-center">
                                    {iconType && (
                                        <div 
                                            className="icon-wrapper me-2"
                                            style={{ 
                                                backgroundColor: color,
                                                borderRadius: '50%',
                                                width: '40px',
                                                height: '40px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {iconType === 'pagos' && <FaMoneyBillWave size={20} color="white" />}
                                            {iconType === 'supervision' && <FaEye size={20} color="white" />}
                                        </div>
                                    )}
                                    <h2 className="mb-0 text-primary">{title}</h2>
                                </div>
                            </div>
                        </div>
                    </Card.Header>
                </Card>

                <BeneficiaryDeliveryList onRowSelect={handleRowSelect} />
            </div>
        </>
    )
}
