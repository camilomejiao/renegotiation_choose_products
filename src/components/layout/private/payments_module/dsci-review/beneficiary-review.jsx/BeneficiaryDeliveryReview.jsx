import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
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
    const [img, setImg] = useState('');

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
                setImg(pagos);
                break;
            case 'supervision':
                setTitle(capitalizeFirstLetter(role));
                setImg(supervision);
                break;
            default:
                setTitle('');
                setImg('');
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
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Proceso de pago'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar la documentación de las órdenes de pago.'}
                backgroundInformationColor={'#40A581'}
            />

            <div className="beneficiary-review-header">
                <div className="beneficiary-review-content">
                    <h4>Revision</h4>
                    <h2>{title}</h2>
                </div>
                <img className="beneficiary-review-img" src={img} alt="Proveedor"/>
            </div>

            <div className="container mt-lg-5">
                <BeneficiaryDeliveryList onRowSelect={handleRowSelect} />
            </div>

        </>
    )
}
