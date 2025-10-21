import {useEffect, useState} from "react";

//Img
import imgPayments from "../../../../../../assets/image/payments/pay-supplier.png";

import imgAdd from "../../../../../../assets/image/payments/imgPay.png";
//Components
import { HeaderImage } from "../../../../shared/header_image/HeaderImage";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Col, Row} from "react-bootstrap";
import downloadImg from "../../../../../../assets/image/payments/download.png";
import {ReportTypePaymentsEnum, ResponseStatusEnum} from "../../../../../../helpers/GlobalEnum";
import {FaStepBackward} from "react-icons/fa";
import {paymentServices} from "../../../../../../helpers/services/PaymentServices";


export const ConciliationDetail = () => {

    const params = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [accountInformation, setAccountInformation] = useState(null);

    const getAccountInformaction = async (accountId) => {
        setLoading(true);
        try {
            setInformationLoadingText("Obteniendo información");
            const { data, status } = await paymentServices.getCollectionAccountsById(accountId);
            if (status === ResponseStatusEnum.OK) {
                setAccountInformation(data);
            }
        } catch (error) {
            console.error("Error obteniendo las entregas:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            getAccountInformaction(params.id);
        }
    }, [params.id]);

    return (
        <>
            <HeaderImage
                imageHeader={imgPayments}
                titleHeader={'Detalle cuenta de cobro'}
                bannerIcon={imgAdd}
                backgroundIconColor={'#2148C0'}
                bannerInformation={'Aquí podrás revisar el detalle de la cuenta de cobro enviadas al fondo.'}
                backgroundInformationColor={'#40A581'}
            />

            {loading && (
                <div className="overlay">
                    <div className="loader">{informationLoadingText}</div>
                </div>
            )}

            {accountInformation && (
                <div className="content-collection-details">
                    <Row className="mb-4">
                        <Col md={5}>
                            <h5 className="section-title">Proveedor</h5>
                            <div><strong>Nombre:</strong> {accountInformation?.proveedor.nombre}</div>
                            <div><strong>NIT:</strong> {accountInformation?.proveedor.nit}</div>
                            <div><strong>Cuenta N°:</strong> {accountInformation?.cuenta_cobro.numero}</div>
                        </Col>

                        <Col md={3}>
                            <h5 className="section-title">Cuenta bancaria</h5>
                            <div><strong>Entidad:</strong> {accountInformation?.banco?.entidad_bancaria}</div>
                            <div><strong>Número:</strong> {accountInformation?.banco?.numero_cuenta}</div>
                        </Col>

                        <Col md={4}>
                            <div className="total">
                                Total: <strong>$ {parseFloat(accountInformation?.cuenta_cobro.valor_total).toLocaleString('es-CO')}</strong>
                            </div>
                        </Col>
                    </Row>


                </div>
            )}


        </>
    )
}