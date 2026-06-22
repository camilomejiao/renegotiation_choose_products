export const TITULAR_STATUS = {
    ATTENTION_FINALIZED: "Atención Finalizada",
    RETIRED: "Retirado",
    NOT_RENEGOTIATED: "No renegociado",
    IN_ATTENTION_PROCESS: "En proceso de atención",
    SUSPENDED: "Suspendido",
};

export const GRADUATION_CAUSE = {
    DIFFERENTIAL_ATTENTION: "Atención Diferencial",
    FINANCIAL_OBLIGATION_PAYMENT: "ABONO BAC",
    AGRICULTURAL_PRODUCTIVE_PROJECTS: "RENEGOCIACION AGRO",
    NON_AGRICULTURAL_PRODUCTIVE_PROJECTS: "RENEGOCIACION NO AGRO",
    UNDOC_FAMILIES: "FAMILIAS UNDOC",
    RECOLECTOR: "RECOLECTOR",
    PRODUCTIVE_PROJECTS: "PROYECTO PRODUCTIVO"
};

export const TITULAR_STATUS_COLORS = {
    [TITULAR_STATUS.ATTENTION_FINALIZED]: "success",
    [TITULAR_STATUS.RETIRED]: "error",
    [TITULAR_STATUS.NOT_RENEGOTIATED]: "warning",
    [TITULAR_STATUS.IN_ATTENTION_PROCESS]: "processing",
    [TITULAR_STATUS.SUSPENDED]: "default",
};

export const TITULAR_STATUS_DESCRIPTIONS = {
    [TITULAR_STATUS.ATTENTION_FINALIZED]: " El Cub ha culminado la implementación. Genere el Formato Correspondiente a la Causal de Grado.",
    [TITULAR_STATUS.RETIRED]: "El Cub Presenta Novedades en el Estado Retirado.",
    [TITULAR_STATUS.NOT_RENEGOTIATED]: "El Cub No cuenta con PLAN DE INVERSION",
    [TITULAR_STATUS.SUSPENDED]: "El Cub Presenta Novedades en el Estado Suspendido",
    [TITULAR_STATUS.IN_ATTENTION_PROCESS]:
        "El Cub cuenta con saldo en algún componente, revisar detalle de Resumen de Pagos",
};
