import { useEffect, useState } from "react";
import {Accordion, Col, Row} from "react-bootstrap";
import './ListCollectionAccount.css';
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";
import { ResponseStatusEnum } from "../../../../../../helpers/GlobalEnum";

export const ListCollectionAccount = () => {

    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [loading, setLoading] = useState(false);
    const [collectionAccounts, setCollectionAccounts] = useState([]);
    const [detailCollectionAccounts, setDetailCollectionAccounts] = useState({}); // almacena por ID

    const getListCollectionAccount = async () => {
        setLoading(true);
        setInformationLoadingText("Obteniendo información");
        try {
            const { data, status } = await paymentServices.getCollectionAccounts();
            if (status === ResponseStatusEnum.OK) {
                setCollectionAccounts(data?.results);
            }
        } catch (error) {
            console.log("Error al cargar las cuentas de cobro ya creadas");
        } finally {
            setLoading(false);
        }
    };

    const getDetailCollectionAccount = async (accountId) => {
        if (detailCollectionAccounts[accountId]) return; // evitar recarga innecesaria
        try {
            const { data, status } = await paymentServices.getDetailCollectionAccounts(accountId);
            if (status === ResponseStatusEnum.OK) {
                setDetailCollectionAccounts((prev) => ({
                    ...prev,
                    [accountId]: data,
                }));
            }
        } catch (error) {
            console.log("Error al cargar el detalle de la cuenta de cobro");
        }
    };

    const handleAccordionSelect = (eventKey) => {
        const selectedAccount = collectionAccounts.find((item, idx) => `${idx}` === eventKey);
        if (selectedAccount) {
            getDetailCollectionAccount(selectedAccount.id);
        }
    };

    useEffect(() => {
        getListCollectionAccount();
    }, []);

    return (
        <>
            {loading && (
                <div className="overlay">
                    <div className="loader">{informationLoadingText}</div>
                </div>
            )}

            <div className="accordion-outer-scroll">
                <Accordion className="custom-accordion" onSelect={handleAccordionSelect}>
                    {collectionAccounts.map((account, index) => (
                        <Accordion.Item eventKey={index.toString()} key={account.id}>
                            <Accordion.Header>📌 {account.numero}</Accordion.Header>
                            <Accordion.Body>
                                <div className="accordion-scroll-body">
                                    {detailCollectionAccounts[account.id] ? (
                                        <>
                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <strong>📅 Fecha de creación:</strong> {new Date(detailCollectionAccounts[account.id].fcrea).toLocaleDateString()}
                                                </Col>
                                                <Col md={6}>
                                                    <strong>💰 Valor total:</strong> ${account.valor_total.toLocaleString()}
                                                </Col>
                                            </Row>

                                            <hr />

                                            <div>
                                                <strong>📄 Entregas asociadas:</strong>
                                                <ul className="mt-2">
                                                    {detailCollectionAccounts[account.id].entregas_asociadas?.length > 0 ? (
                                                        detailCollectionAccounts[account.id].entregas_asociadas.map((item, idx) => (
                                                            <li key={idx}>
                                                                <strong>Beneficiario: </strong> {item.entrega.beneficiario.nombre + ' ' + item.entrega.beneficiario.apellido + ' - ' }
                                                                <strong>Identificación: </strong> {item.entrega.beneficiario.identificacion} <br />
                                                                📦 <strong>Productos: </strong> {item.entrega.cantidad_prod} – 💰 Valor: ${parseFloat(item.valor).toLocaleString()}
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li>Sin entregas disponibles.</li>
                                                    )}
                                                </ul>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Cargando detalles...</p>
                                    )}
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>
        </>
    );
};
