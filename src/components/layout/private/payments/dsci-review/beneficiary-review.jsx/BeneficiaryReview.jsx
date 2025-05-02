import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

//Components
import { HeaderImage } from "../../../../shared/header-image/HeaderImage";
import { BeneficiaryList } from "../beneficiary-list/BeneficiaryList";
import { ReviewDocuments } from "../review-documents/ReviewDocuments";

//Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";
import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
import territorial from "../../../../../../assets/image/payments/territorial.png";
import tecnico from "../../../../../../assets/image/payments/tecnico.png";
import supervision from "../../../../../../assets/image/payments/supervision.png";
import pagos from "../../../../../../assets/image/payments/pagos.png";

//Css
import './BeneficiaryReview.css';

export const BeneficiaryReview = () => {

    const params = useParams();

    const [title, setTitle] = useState('');
    const [img, setImg] = useState('');
    const [cubId, setCubId] = useState(null);
    const [showBeneficiaryList, setShowBeneficiaryList] = useState(true);

    const capitalizeFirstLetter = (text) => {
        return text
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const getTitleAndImage = (role) => {
        switch(role) {
            case 'territorial':
                setTitle(capitalizeFirstLetter(role));
                setImg(territorial);
                break;
            case 'tecnico':
                setTitle(capitalizeFirstLetter(role));
                setImg(tecnico);
                break;
            case 'pagos':
                setTitle(capitalizeFirstLetter(role));
                setImg(pagos);
                break;
            case 'supervision':
                setTitle(capitalizeFirstLetter(role));
                setImg(supervision);
                break;
        }
    }

    const handleRowSelect = (id) => {
        setCubId(id);
        setShowBeneficiaryList(false);
    }

    const handleBack = () => {
        setShowBeneficiaryList(true);
        setCubId(null);
    }

    useEffect(() => {
        if(params.role){
            getTitleAndImage(params.role);
        }
    },[params.role]);

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
                {showBeneficiaryList ? (
                    <BeneficiaryList onRowSelect={handleRowSelect} />
                ) : (
                    <ReviewDocuments cubId={cubId} onBack={handleBack} />
                )}
            </div>

        </>
    )
}