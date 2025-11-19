import { useCallback, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Accordion, Col, Row } from "react-bootstrap";
import { FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

//Services
import { paymentServices } from "../../../../../../helpers/services/PaymentServices";
import { supplierServices } from "../../../../../../helpers/services/SupplierServices";

//Enum
import { ResponseStatusEnum, RolesEnum } from "../../../../../../helpers/GlobalEnum";

export const ListCollectionAccount = () => {
    const { userAuth } = useOutletContext();

    const [loading, setLoading] = useState(false);
    const [informationLoadingText, setInformationLoadingText] = useState("");
    const [pagination, setPagination] = useState({
        next: null,
        previous: null,
        count: 0,
        currentPage: 1,
        totalPages: 1,
    });
    const [collectionAccounts, setCollectionAccounts] = useState([]);
    const [detailCollectionAccounts, setDetailCollectionAccounts] = useState({});

    const getSupplierId = useCallback(() => {
        let supplierId = null;
        if (userAuth.rol_id === RolesEnum.SUPPLIER) {
            supplierId = supplierServices.getSupplierId();
        }
        return supplierId;
    }, [userAuth?.rol_id]);

    const getListCollectionAccount = useCallback(async (pageToFetch = 1, sizeToFetch = 100) => {
        setLoading(true);
        setInformationLoadingText("Obteniendo información");
        try {
            const { data, status } = await paymentServices.getCollectionAccounts(pageToFetch, sizeToFetch, Number(getSupplierId()));
            if (status === ResponseStatusEnum.OK) {
                setCollectionAccounts(data?.results);
                const totalPages = Math.ceil(data.count / data.results.length);
                setPagination({
                    next: data.next,
                    previous: data.previous,
                    count: data.count,
                    currentPage: pageToFetch,
                    totalPages: isNaN(totalPages) ? 1 : totalPages,
                });
            }
        } catch (error) {
            console.log("Error al cargar las cuentas de cobro ya creadas");
        } finally {
            setLoading(false);
        }
    }, [getSupplierId]);

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
        const styles = {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 500,
            fontSize: '14px'
        };

        switch (estado) {
            case "APROBADO":
                return (
                    <span style={{ ...styles, color: 'var(--success-color)' }}>
                        <FaCheckCircle />
                        APROBADO
                    </span>
                );
            case "ACTIVO":
                return (
                    <span style={{ ...styles, color: 'var(--warning-color)' }}>
                        <FaHourglassHalf />
                        PENDIENTE
                    </span>
                );
            case "RECHAZADO":
                return (
                    <span style={{ ...styles, color: 'var(--danger-color)' }}>
                        <FaTimesCircle />
                        RECHAZADO
                    </span>
                );
            default:
                return (
                    <span style={{ ...styles, color: 'var(--gray-500)' }}>
                        <FaInfoCircle />
                        DESCONOCIDO
                    </span>
                );
        }
    };

    useEffect(() => {
        getListCollectionAccount(1, 100);
    }, [getListCollectionAccount]);

    return (
        <>
            {loading && (
                <div className="overlay">
                    <div className="loader">
                        <div className="spinner-border"></div>
                        <div className="spinner-text">{informationLoadingText}</div>
                    </div>
                </div>
            )}

            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                padding: '16px',
                background: 'var(--gray-50)',
                borderRadius: 'var(--border-radius)',
                border: '1px solid var(--gray-200)'
            }}>
                <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>
                    <strong>Total cuentas de cobro:</strong> {pagination.count}
                </span>
                <span style={{ fontWeight: 500, color: 'var(--gray-700)' }}>
                    <strong>Página:</strong> {pagination.currentPage} de {pagination.totalPages}
                </span>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Accordion onSelect={handleAccordionSelect}>
                    {collectionAccounts.map((account, index) => (
                        <Accordion.Item 
                            eventKey={index.toString()} 
                            key={account?.id}
                            style={{
                                border: '1px solid var(--gray-200)',
                                borderRadius: 'var(--border-radius)',
                                marginBottom: '12px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-sm)'
                            }}
                        >
                            <Accordion.Header style={{
                                background: 'var(--white)',
                                borderBottom: '1px solid var(--gray-200)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    paddingRight: '16px'
                                }}>
                                    <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                                        📌 {account?.numero}
                                    </span>
                                    <div>
                                        {renderEstadoIcon(account?.estado_nombre)}
                                    </div>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body style={{
                                background: 'var(--white)',
                                padding: '24px'
                            }}>
                                {detailCollectionAccounts[account.id] ? (
                                    <>
                                        <Row className="mb-3">
                                            <Col md={6}>
                                                <div style={{
                                                    padding: '12px',
                                                    background: 'var(--gray-50)',
                                                    borderRadius: 'var(--border-radius)',
                                                    marginBottom: '12px'
                                                }}>
                                                    <strong style={{ color: 'var(--gray-700)' }}>📅 Fecha de creación:</strong>
                                                    <div style={{ color: 'var(--gray-600)', marginTop: '4px' }}>
                                                        {new Date(detailCollectionAccounts[account.id]?.fcrea).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div style={{
                                                    padding: '12px',
                                                    background: 'var(--gray-50)',
                                                    borderRadius: 'var(--border-radius)',
                                                    marginBottom: '12px'
                                                }}>
                                                    <strong style={{ color: 'var(--gray-700)' }}>💰 Valor total:</strong>
                                                    <div style={{ 
                                                        color: 'var(--success-color)', 
                                                        marginTop: '4px',
                                                        fontSize: '16px',
                                                        fontWeight: 600
                                                    }}>
                                                        ${parseFloat(account?.valor_total).toLocaleString()}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>

                                        <hr style={{ margin: '20px 0', borderColor: 'var(--gray-200)' }} />

                                        <div>
                                            <h6 style={{ 
                                                color: 'var(--primary-color)', 
                                                fontWeight: 600,
                                                marginBottom: '16px'
                                            }}>
                                                📄 Entregas asociadas:
                                            </h6>
                                            <div style={{
                                                maxHeight: '300px',
                                                overflowY: 'auto',
                                                border: '1px solid var(--gray-200)',
                                                borderRadius: 'var(--border-radius)',
                                                padding: '16px'
                                            }}>
                                                {detailCollectionAccounts[account.id].entregas_asociadas?.length > 0 ? (
                                                    detailCollectionAccounts[account.id].entregas_asociadas.map((item, idx) => (
                                                        <div key={idx} style={{
                                                            padding: '12px',
                                                            background: 'var(--gray-50)',
                                                            borderRadius: 'var(--border-radius)',
                                                            marginBottom: '12px',
                                                            border: '1px solid var(--gray-200)'
                                                        }}>
                                                            <div style={{ marginBottom: '8px' }}>
                                                                <strong style={{ color: 'var(--gray-700)' }}>Beneficiario: </strong>
                                                                <span style={{ color: 'var(--gray-600)' }}>
                                                                    {item?.entrega?.beneficiario?.nombre + ' ' + item?.entrega?.beneficiario?.apellido}
                                                                </span>
                                                            </div>
                                                            <div style={{ marginBottom: '8px' }}>
                                                                <strong style={{ color: 'var(--gray-700)' }}>Identificación: </strong>
                                                                <span style={{ color: 'var(--gray-600)' }}>
                                                                    {item?.entrega?.beneficiario?.identificacion}
                                                                </span>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                                                <span>
                                                                    📦 <strong style={{ color: 'var(--gray-700)' }}>Productos: </strong>
                                                                    <span style={{ color: 'var(--gray-600)' }}>{item?.entrega?.cantidad_prod}</span>
                                                                </span>
                                                                <span>
                                                                    💰 <strong style={{ color: 'var(--gray-700)' }}>Valor: </strong>
                                                                    <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>
                                                                        ${parseFloat(item?.valor).toLocaleString()}
                                                                    </span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div style={{
                                                        textAlign: 'center',
                                                        padding: '20px',
                                                        color: 'var(--gray-500)'
                                                    }}>
                                                        Sin entregas disponibles.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '40px',
                                        color: 'var(--gray-500)'
                                    }}>
                                        <div className="spinner-border" style={{ 
                                            width: '24px', 
                                            height: '24px',
                                            borderWidth: '2px',
                                            marginBottom: '12px'
                                        }}></div>
                                        <p>Cargando detalles...</p>
                                    </div>
                                )}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                marginTop: '24px'
            }}>
                <button
                    disabled={!pagination.previous}
                    onClick={() => getListCollectionAccount(pagination.currentPage - 1)}
                    style={{
                        padding: '8px 16px',
                        border: '1px solid var(--primary-color)',
                        borderRadius: 'var(--border-radius)',
                        background: pagination.previous ? 'var(--white)' : 'var(--gray-100)',
                        color: pagination.previous ? 'var(--primary-color)' : 'var(--gray-400)',
                        cursor: pagination.previous ? 'pointer' : 'not-allowed',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (pagination.previous) {
                            e.target.style.background = 'var(--primary-color)';
                            e.target.style.color = 'white';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (pagination.previous) {
                            e.target.style.background = 'var(--white)';
                            e.target.style.color = 'var(--primary-color)';
                        }
                    }}
                >
                    ⬅ Anterior
                </button>
                <button
                    disabled={!pagination.next}
                    onClick={() => getListCollectionAccount(pagination.currentPage + 1)}
                    style={{
                        padding: '8px 16px',
                        border: '1px solid var(--primary-color)',
                        borderRadius: 'var(--border-radius)',
                        background: pagination.next ? 'var(--white)' : 'var(--gray-100)',
                        color: pagination.next ? 'var(--primary-color)' : 'var(--gray-400)',
                        cursor: pagination.next ? 'pointer' : 'not-allowed',
                        fontWeight: 500,
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        if (pagination.next) {
                            e.target.style.background = 'var(--primary-color)';
                            e.target.style.color = 'white';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (pagination.next) {
                            e.target.style.background = 'var(--white)';
                            e.target.style.color = 'var(--primary-color)';
                        }
                    }}
                >
                    Siguiente ➡
                </button>
            </div>
        </>
    );
};
