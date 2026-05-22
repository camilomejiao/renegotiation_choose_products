import { GRADUATION_CAUSE } from "../../../entities/beneficiary";

export const DOCUMENT_TEMPLATE_TITLE =
  "FORMALIZACION DEL CIERRE DE LA IMPLEMENTACION DEL PROGRAMA NACIONAL DE SUSTITUCION DE CULTIVOS DE USO ILICITO - PNIS";

export const DOCUMENT_JUSTIFICATION_PARAGRAPHS = [
  "Con fundamento en la informacion registrada en los sistemas de informacion institucionales y los soportes documentales asociados al expediente del titular, se deja constancia que la Direccion de Sustitucion de Cultivos de Uso Ilicito (DSCI) adelanto las acciones que se encontraban a su cargo en el marco de la implementacion de los componentes del Programa Nacional Integral de Sustitucion de Cultivos de Uso Ilicito (PNIS).",
  "En este contexto, el presente formato constituye el instrumento de consolidacion de la informacion tecnica, administrativa y financiera del proceso de atencion, mediante el cual se documentan las acciones ejecutadas, se verifica el cumplimiento de las obligaciones a cargo de las partes y se formaliza el cierre de la implementacion del programa en el proceso del titular.",
];

export const SECTION_ONE_BASE_FIELDS = [
  { label: "CUB", sourceKey: "cub" },
  { label: "Nombre del Titular:", sourceKey: "nombre_completo" },
  { label: "Cedula del titular", sourceKey: "identificacion" },
  { label: "Nombre del beneficiario", sourceKey: "nombre_completo_beneficiario" },
  { label: "Cedula del beneficiario", sourceKey: "identificacion_beneficiario" },
  { label: "Departamento", sourceKey: "departamento" },
  { label: "Municipio:", sourceKey: "municipio" },
  { label: "Vereda:", sourceKey: "vereda" },
  { label: "Tipo de atencion", sourceKey: "causal" },
];

export const PRODUCTIVE_PROJECT_SECTION_ONE_FIELDS = [
  { label: "Plan de inversion", sourceKey: "plan" },
  { label: "Linea productiva", sourceKey: "linea" },
  { label: "Condicionante ambiental", sourceKey: "condicionante_ambiental" },
];

export const SECTION_TWO_M2_LABEL =
  "¿Cuenta con validacion de M22? (No aplica para no cultivadores y recolectores)";

export const SECTION_TWO_TITLE = "VISITA DE MONITOREO DE ERRADICACION";

export const SECTION_TWO_M2_CHOICES = [
  { id: "yes", label: "Si" },
  { id: "no", label: "No" },
  { id: "not_applicable", label: "No aplica" },
];

export const SECTION_THREE_TITLE =
  "DETALLE DE LOS COMPONENTES DEL PAI FAMILIAR EJECUTADOS AL CUB:";

export const SECTION_THREE_COMPONENT_COLUMNS = [
  { key: "component", label: "Componente", width: 176, align: "left" },
  {
    key: "totalExecuted",
    label: "Valor total ejecutado ($)",
    width: 138,
    align: "center",
  },
  { key: "operator", label: "Operador", width: 112, align: "center" },
  {
    key: "lastDeliveryDate",
    label: "Fecha de ultima entrega",
    width: 118,
    align: "center",
  },
];

export const SECTION_THREE_TEMPLATE_COMPONENT_ROWS = [
  {
    key: "aai",
    component: "Asistencia Alimentaria Inmediata AAI",
    matchers: ["ASISTENCIA ALIMENTARIA INMEDIATA", " AAI"],
    balanceSourceKeys: ["saldo_componente_aai"],
  },
  {
    key: "asa_before_renegotiation",
    component:
      "Autosostenimiento y Seguridad Alimentaria-ASA (anterior a la renegociacion)",
    matchers: ["AUTOSOSTENIMIENTO", "SEGURIDAD ALIMENTARIA", "ASA"],
    balanceSourceKeys: ["saldo_componente_asa"],
  },
  {
    key: "ppcc_before_renegotiation",
    component:
      "Proyecto Productivo Ciclo Corto PPCC (anterior a la renegociacion)",
    matchers: ["PROYECTO PRODUCTIVO CICLO CORTO", "PPCC"],
    balanceSourceKeys: ["saldo_componente_ppcc"],
  },
  {
    key: "ppcl_before_renegotiation",
    component:
      "Proyecto Productivo Ciclo Largo PPCL (anterior a la renegociacion)",
    matchers: ["PROYECTO PRODUCTIVO CICLO LARGO", "PPCL"],
    balanceSourceKeys: ["saldo_componente_ppcl"],
  },
  {
    key: "after_renegotiation",
    component:
      "Autosostenimiento y Seguridad Alimentaria-ASA, Proyecto Productivo Ciclo Corto PPCC, Proyecto Productivo Ciclo Largo PPCL (despues a la renegociacion)",
    matchers: ["RENEGOCI"],
    fallbackOperator: "No aplica",
    matchMode: "aggregate",
  },
  {
    key: "lower_balances",
    component: "Manejo de saldos inferiores",
    matchers: ["MANEJO DE SALDOS", "SALDOS INFERIORES"],
    fallbackOperator: "No aplica",
  },
];

export const SECTION_THREE_BALANCE_FIELDS = [
  { label: "Saldo Componente AAI", sourceKey: "saldo_componente_aai" },
  { label: "Saldo Componente ASA", sourceKey: "saldo_componente_asa" },
  { label: "Saldo Componente PPCC", sourceKey: "saldo_componente_ppcc" },
  { label: "Saldo Componente PPCL", sourceKey: "saldo_componente_ppcl" },
];

export const SECTION_FOUR_TITLE =
  "CONSOLIDACION Y TRAZABILIDAD DE LA INFORMACION";

export const SECTION_FOUR_PARAGRAPHS = [
  "Se deja constancia que los soportes que acreditan la ejecucion de los componentes, las verificaciones realizadas y demas actuaciones adelantadas en el marco del PNIS se encuentran almacenados en los repositorios oficiales de la DSCI; los cuales hacen parte integral del expediente del titular, garantizandose la trazabilidad, conservacion e integridad de la informacion asociada al proceso de atencion.",
];

export const SECTION_FOUR_SUBTITLE = "SOPORTE DOCUMENTAL DEL PROCESO";

export const SECTION_FOUR_SUBTITLE_PARAGRAPHS = [
  "La informacion relacionada con la ejecucion de los componentes y la verificacion de compromisos se encuentra relacionada en los siguientes soportes documentales, los cuales reposan los siguientes sistemas y en SISPINIS:",
];

export const SECTION_FIVE_SUPPORT_COLUMNS = [
  { key: "item", label: "Item", width: 40, align: "center" },
  { key: "document", label: "Documento", width: 292, align: "left" },
  { key: "repository", label: "Repositorio", width: 190, align: "left" },
];

export const SECTION_FIVE_SUPPORT_ROWS = [
  {
    item: "1",
    document: "Acuerdo de sustitucion (acuerdo de no resiembra)",
    repository: "Sistema Gestion documental DSCI",
  },
  {
    item: "2",
    document: "Soportes de pagos AAI",
    repository: "Sistema Marte",
  },
  {
    item: "3",
    document: "Informe de verificacion: Informe visita M2",
    repository: "SIG-Sistema Gestion documental DSCI",
  },
  {
    item: "4",
    document: "Soportes de entregas de ASA (si aplica)",
    repository: "AZURE-Fisicos en FCP",
  },
  {
    item: "5",
    document: "Soportes de entregas de PPCC (si aplica)",
    repository: "AZURE-Fisicos en FCP",
  },
  {
    item: "6",
    document: "Soportes de entregas de PPCL (si aplica)",
    repository: "AZURE-Fisicos en FCP",
  },
  {
    item: "7",
    document:
      "Resolucion de la atencion diferenciada y documentos soporte: copia de cedula de ciudadania o certificado de discapacidad emitido por el Ministerio de Salud",
    repository: "Juridica- Sistema Gestion documental DSCI",
  },
  {
    item: "8",
    document: "Soportes de entregas de componentes por renegociacion",
    repository: "Portal de Proveedores (Sistemas)",
  },
  {
    item: "9",
    document: "Soportes de transferencia al Banco Agrario",
    repository: "Sistema Marte",
  },
];

export const GRADUATION_CAUSE_GROUPS = {
  PRODUCTIVE_PROJECTS: [
    GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS,
    GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS,
  ],
};

export const DOCUMENT_TEMPLATE_VARIANTS = {
  [GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION]: {
    heading: GRADUATION_CAUSE.DIFFERENTIAL_ATTENTION,
    sectionOneFields: SECTION_ONE_BASE_FIELDS,
  },
  [GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT]: {
    heading: GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT,
    sectionOneFields: SECTION_ONE_BASE_FIELDS,
  },
  [GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS]: {
    heading: GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS,
    sectionOneFields: [
      ...SECTION_ONE_BASE_FIELDS,
      ...PRODUCTIVE_PROJECT_SECTION_ONE_FIELDS,
    ],
  },
  [GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS]: {
    heading: GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS,
    sectionOneFields: [
      ...SECTION_ONE_BASE_FIELDS,
      ...PRODUCTIVE_PROJECT_SECTION_ONE_FIELDS,
    ],
  },
};

export const getDocumentTemplateVariant = (graduationCause) =>
  DOCUMENT_TEMPLATE_VARIANTS[graduationCause] || null;

export const buildSectionOneFields = (beneficiaryDetails, graduationCause) => {
  const variant = getDocumentTemplateVariant(graduationCause);

  if (!variant) {
    return [];
  }

  return variant.sectionOneFields.map(({ label, sourceKey }) => ({
    label,
    value: beneficiaryDetails?.[sourceKey],
  }));
};
