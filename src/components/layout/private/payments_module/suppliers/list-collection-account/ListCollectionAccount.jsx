import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Accordion, Col, Row } from "react-bootstrap";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

//Css
import './ListCollectionAccount.css';

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";
import { supplierServices } from "../../../../../../helpers/services/SupplierServices";

//Enum
import { ResponseStatusEnum, RolesEnum } from "../../../../../../helpers/GlobalEnum";

export const ListCollectionAccount = () => {

    const { userAuth } = useOutletContext();

    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        next: null,
        previous: null,
        count: 0,
        currentPage: 1,
        totalPages: 1,
    });
    const [collectionAccounts, setCollectionAccounts] = useState([]);
    const [detailCollectionAccounts, setDetailCollectionAccounts] = useState({});

    const getSupplierId = () => {
        let supplierId = null;
        if (userAuth.rol_id === RolesEnum.SUPPLIER) {
            supplierId = supplierServices.getSupplierId();
        }

        return supplierId;
    }

    const getListCollectionAccount = async (pageToFetch = 1, sizeToFetch) => {
        setLoading(true);
        setInformationLoadingText("Obteniendo información");
        try {
            const { data, status } = await paymentServices.getCollectionAccounts(pageToFetch, sizeToFetch, Number(getSupplierId()), '');
            if (status === ResponseStatusEnum.OK) {
                setCollectionAccounts(data?.results);
                const totalPages = Math.ceil(data.count / data.results.length);
                setPagination({
                    next: data.next,
                    previous: data.previous,
                    count: data.count,
                    currentPage: page,
                    totalPages: isNaN(totalPages) ? 1 : totalPages,
                });
            }
        } catch (error) {
            console.log("Error al cargar las cuentas de cobro ya creadas");
        } finally {
            setLoading(false);
        }
    };

    const getDetailCollectionAccount = async (accountId) => {
        if (detailCollectionAccounts[accountId]) return;
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

    const renderEstadoIcon = (estado) => {
        switch (estado) {
            case "APROBADO":
                return (
                    <>
                        <FaCheckCircle style={{ color: "green", marginRight: "8px" }} />
                        APROBADO
                    </>
                );
            case "ACTIVO":
                return (
                    <>
                        <FaHourglassHalf style={{ color: "orange", marginRight: "8px" }} />
                        PENDIENTE
                    </>
                );
            case "RECHAZADO":
                return (
                    <>
                        <FaTimesCircle style={{ color: "red", marginRight: "8px" }} />
                        RECHAZADO
                    </>
                );
            default:
                return (
                    <>
                        <FaInfoCircle style={{ color: "gray", marginRight: "8px" }} />
                        DESCONOCIDO
                    </>
                );
        }
    };

    useEffect(() => {
        getListCollectionAccount(1, 100);
    }, [page]);

    return (
        <>
            {loading && (
                <div className="overlay">
                    <div className="loader">{informationLoadingText}</div>
                </div>
            )}

            <div className="d-flex justify-content-between align-items-center my-3">
                <span><strong>Total cuentas de cobro:</strong> {pagination.count}</span>
                <span><strong>Página:</strong> {pagination.currentPage} de {pagination.totalPages}</span>
            </div>
            <div className="accordion-outer-scroll">
                <Accordion className="custom-accordion" onSelect={handleAccordionSelect}>
                    {collectionAccounts.map((account, index) => (
                        <Accordion.Item eventKey={index.toString()} key={account?.id}>
                            <Accordion.Header>
                                📌 {account?.numero} -
                                Estado: { renderEstadoIcon(account?.estado_nombre) }
                            </Accordion.Header>
                            <Accordion.Body>
                                <div className="accordion-scroll-body">
                                    {detailCollectionAccounts[account.id] ? (
                                        <>
                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <strong>📅 Fecha de creación:</strong> {new Date(detailCollectionAccounts[account.id]?.fcrea).toLocaleDateString()}
                                                </Col>
                                                <Col md={6}>
                                                    <strong>💰 Valor total:</strong> ${parseFloat(account?.valor_total).toLocaleString()}
                                                </Col>
                                            </Row>

                                            <hr />

                                            <div>
                                                <strong>📄 Entregas asociadas:</strong>
                                                <ul className="mt-2">
                                                    {detailCollectionAccounts[account.id].entregas_asociadas?.length > 0 ? (
                                                        detailCollectionAccounts[account.id].entregas_asociadas.map((item, idx) => (
                                                            <li key={idx}>
                                                                <strong>Beneficiario: </strong> {item?.entrega?.beneficiario?.nombre + ' ' + item?.entrega?.beneficiario?.apellido + ' - ' }
                                                                <strong>Identificación: </strong> {item?.entrega?.beneficiario?.identificacion} <br />
                                                                📦 <strong>Productos: </strong> {item?.entrega?.cantidad_prod} – 💰 Valor: ${parseFloat(item?.valor).toLocaleString()}
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
            <div className="d-flex justify-content-end align-items-center my-3">
                <div>
                    <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        disabled={!pagination.previous}
                        onClick={() => getListCollectionAccount(pagination.currentPage - 1)}
                    >
                        ⬅ Anterior
                    </button>
                    <button
                        className="btn btn-outline-secondary btn-sm"
                        disabled={!pagination.next}
                        onClick={() => getListCollectionAccount(pagination.currentPage + 1)}
                    >
                        Siguiente ➡
                    </button>
                </div>
            </div>
        </>
    );
};
