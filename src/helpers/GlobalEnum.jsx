
export const ResponseStatusEnum = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    MOVED_PERMANENTLY: 301,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    INTERNAL_SERVER_ERROR: 500,
}

export const RolesEnum = {
    ADMIN: 1,
    SUPPLIER: 2,
    TERRITORIAL_LINKS: 3,
    SUPERVISION: 4,
    TECHNICAL: 5,
    ENVIRONMENTAL: 6,
    PAYMENTS: 7,
    SYSTEM_USER: 8,
    TRUST_PAYMENTS: 9
}

export const GeneralStatusDeliveryProductEnum = {
    APPROVED: 'APROBADO',
    PENDING_APPROVAL: 'PENDIENTE',
    REFUSED: 'RECHAZADO'
}

export const StatusTeamProductEnum = {
    DENIED: { id: 0, label: "Denegado" },
    APPROVED: { id: 1, label: "Aprobado" },
    UNREVIEWED: { id: 9, label: "Sin Revisar" }
}

export const ComponentEnum = {
    RENEGOTIATION: 'RENEGOTIATION',
    USER: 'USER',
}

export const UploadFileEnum = {
    FE: 'fe',
    PDF: 'pdf',
    EVIDENCE1: 'evidence_1',
    EVIDENCE2: 'evidence_2',
}

export const BeneficiaresManagementEnum = {
    CONSOLIDATED: "consolidado",
    BALANCE: "saldo"
}

export const DeliveryStatusEnum = {
    REGISTERED:  { key: "registradas",  label: "Registradas",    value: "REGISTRADO" },
    DELIVERED:   { key: "entregadas",   label: "Entregadas",     value: "ENTREGADO" },
    PAID:      { key: "pagadas",      label: "Pagadas",        value: "PAGADO" },
    CORRECTION: { key: "subsanacion",  label: "En Subsanación", value: "SUBSANACION" },
    ISSUEDFORPAYMENT: { key: "emitido_para_pago",  label: "Emitido para pago", value: "EMITIDO_PARA_PAGO" },
};

export const ReportTypePaymentsEnum = {
    EXCEL: "excel",
    PDF: "pdf"
}

export const CollectionAccountStatusEnum = {
    REGISTERED: { key: "REGISTRADA",  label: "Registrado" },
    PAID: { key: "PAGADA",  label: "Pagado" },
    ISSUED_FOR_PAYMENT: { key: "EMITIDO_PARA_PAGO",  label: "Emitido para Pago" }
}

export const DeliveryDocumentReviewAction = {
    DENY: "denegar",
    APPROVE: "aprobar"

}