export const TITULAR_STATUS = {
  ATTENTION_FINALIZED: "Atención Finalizada",
  RETIRED: "Retirado",
  NOT_RENEGOTIATED: "No renegociado",
  IN_ATTENTION_PROCESS: "En proceso de atención",
  SUSPENDED: "Suspendido",
};

export const TITULAR_STATUS_COLORS = {
  [TITULAR_STATUS.ATTENTION_FINALIZED]: "success",
  [TITULAR_STATUS.RETIRED]: "error",
  [TITULAR_STATUS.NOT_RENEGOTIATED]: "warning",
  [TITULAR_STATUS.IN_ATTENTION_PROCESS]: "processing",
  [TITULAR_STATUS.SUSPENDED]: "default",
};

export const TITULAR_STATUS_DESCRIPTIONS = {
  [TITULAR_STATUS.RETIRED]: "El Cub Presenta Novedades en el Estado (Retirado).",
  [TITULAR_STATUS.NOT_RENEGOTIATED]:
    "El Cub Presenta Novedades en el Estado (Suspendido)",
  [TITULAR_STATUS.SUSPENDED]: "No cuenta con PLAN DE INVERSION",
  [TITULAR_STATUS.IN_ATTENTION_PROCESS]:
    "Cuenta con saldo para en algún componente, ver en Consultar Titular.",
};
