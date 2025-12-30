
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
    TRUST_PAYMENTS: 9,
    LEGAL: 10
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
    REGISTERED: {
        key: "registradas",
        label: "Registradas",
        value: "REGISTRADO"
    },
    DELIVERED: {
        key: "entregadas",
        label: "Entregadas con documentación",
        value: "ENTREGADO"
    },
    SENT_TO_SUPERVISION: {
        key: "enviado_a_supervision",
        label: "En Supervisión",
        value: "ENVIADO_A_SUPERVISION"
    },
    SENT_TO_PAYMENTS: {
        key: "enviado_a_pagos",
        label: "En Pagos",
        value: "ENVIADO_A_PAGOS"
    },
    CORRECTION: {
        key: "subsanacion",
        label: "En Subsanación",
        value: "SUBSANACION"
    },
    CORRECTION_IMPLEMENTATION: {
        key: "subsanacion_implementacion",
        label: "En Subsanación Implementación",
        value: "SUBSANACION_IMPLEMENTACION"
    },
    CORRECTION_TERRITORIAL: {
        key: "subsanacion_territorial",
        label: "En Subsanación Territorial",
        value: "SUBSANACION_TERRITORIAL"
    },
    PENDING_FOR_INVOICE: {
        key: "pendiente_para_cuenta_de_cobro",
        label: "Pendiente para cuenta de cobro",
        value: "PENDIENTE_PARA_CUENTA_DE_COBRO"
    },
    fIDUCIARY: {
        key: "fiduciaria",
        label: "En Fiduciaria",
        value: "FIDUCIARIA"
    },
    ISSUEDFORPAYMENT: {
        key: "emitido_para_pago",
        label: "Emitido para pago",
        value: "EMITIDO_PARA_PAGO"
    },
    PAID: {
        key: "pagadas",
        label: "Pagadas",
        value: "PAGADO"
    },
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

export const InvoiceValueRange = {
    INVOICEVALUERANGE: 1000
}

export const TypeActorEnum = {
    CULTIVATOR: 'CULTIVADOR',
    NO_GROWER: 'NO CULTIVADOR',
    COLLECTOR: 'RECOLECTOR',
    NOT_DEFINED: 'NO DEFINIDO'
}