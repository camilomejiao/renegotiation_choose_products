import { GRADUATION_CAUSE } from "../../../entities/beneficiary";

export const DOCUMENT_TEMPLATE_TITLE =
  "FORMALIZACIÓN DEL CIERRE DE LA IMPLEMENTACIÓN DEL PROGRAMA NACIONAL DE SUSTITUCIÓN DE CULTIVOS DE USO ILÍCITO - PNIS";

export const DOCUMENT_JUSTIFICATION_PARAGRAPHS = [
  "Con fundamento en la información registrada en los sistemas de información institucionales y los soportes documentales asociados al expediente del titular, se deja constancia que la Dirección de Sustitución de Cultivos de Uso Ilícito (DSCI) adelantó las acciones que se encontraban a su cargo en el marco de la implementación de los componentes del Programa Nacional Integral de Sustitución de Cultivos de Uso Ilícito (PNIS).",
  "En este contexto, el presente formato constituye el instrumento de consolidación de la información técnica, administrativa y financiera del proceso de atención, mediante el cual se documentan las acciones ejecutadas, se verifica el cumplimiento de las obligaciones a cargo de las partes y se formaliza el cierre de la implementación del programa en el proceso del titular.",
];

export const SECTION_ONE_BASE_FIELDS = [
  { label: "CUB", sourceKey: "cub" },
  { label: "Nombre del Titular:", sourceKey: "nombre_completo" },
  { label: "Cédula del titular", sourceKey: "identificacion" },
  { label: "Nombre del beneficiario", sourceKey: "nombre_completo_beneficiario" },
  { label: "Cédula del beneficiario", sourceKey: "identificacion_beneficiario" },
  { label: "Departamento", sourceKey: "departamento" },
  { label: "Municipio:", sourceKey: "municipio" },
  { label: "Vereda:", sourceKey: "vereda" },
  { label: "Tipo de atención", sourceKey: "causal" },
];

export const PRODUCTIVE_PROJECT_SECTION_ONE_FIELDS = [
  { label: "Plan de inversión", sourceKey: "plan" },
  { label: "Línea productiva", sourceKey: "linea" },
  { label: "Condicionante ambiental", sourceKey: "condicionante_ambiental" },
];

export const SECTION_TWO_M2_LABEL =
  "¿Cuenta con validación de M2? (No aplica para no cultivadores y recolectores)";

export const SECTION_TWO_TITLE = "VISITA DE MONITOREO DE ERRADICACION";

export const SECTION_TWO_M2_CHOICES = [
  { id: "yes", label: "Sí" },
  { id: "no", label: "No" },
  { id: "not_applicable", label: "No aplica" },
];

export const SECTION_THREE_TITLE =
  "DETALLE DE LOS COMPONENTES DEL PAI FAMILIAR EJECUTADOS AL CUB:";

export const SECTION_THREE_COMPONENT_COLUMNS = [
  { key: "componente", label: "Componente", width: 100, align: "left" },
  { key: "componenteSecundario", label: "Componente secundario", width: 78, align: "left" },
  { key: "contrato", label: "Contrato", width: 68, align: "center" },
  { key: "detallePago", label: "Detalle del pago", width: 132, align: "left" },
  { key: "valorTotalPagado", label: "Valor total pagado ($)", width: 88, align: "center" },
  { key: "fechaEntrega", label: "Fecha entrega", width: 78, align: "center" },
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
      "Autosostenimiento y Seguridad Alimentaria-ASA (anterior a la renegociación)",
    matchers: ["AUTOSOSTENIMIENTO", "SEGURIDAD ALIMENTARIA", "ASA"],
    balanceSourceKeys: ["saldo_componente_asa"],
  },
  {
    key: "ppcc_before_renegotiation",
    component:
      "Proyecto Productivo Ciclo Corto PPCC (anterior a la renegociación)",
    matchers: ["PROYECTO PRODUCTIVO CICLO CORTO", "PPCC"],
    balanceSourceKeys: ["saldo_componente_ppcc"],
  },
  {
    key: "ppcl_before_renegotiation",
    component:
      "Proyecto Productivo Ciclo Largo PPCL (anterior a la renegociación)",
    matchers: ["PROYECTO PRODUCTIVO CICLO LARGO", "PPCL"],
    balanceSourceKeys: ["saldo_componente_ppcl"],
  },
  {
    key: "after_renegotiation",
    component:
      "Autosostenimiento y Seguridad Alimentaria-ASA, Proyecto Productivo Ciclo Corto PPCC, Proyecto Productivo Ciclo Largo PPCL (después a la renegociación)",
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
  "CONSOLIDACIÓN Y TRAZABILIDAD DE LA INFORMACIÓN";

export const SECTION_FOUR_PARAGRAPHS = [
  "Se deja constancia que los soportes que acreditan la ejecución de los componentes, las verificaciones realizadas y demás actuaciones adelantadas en el marco del PNIS se encuentran almacenados en los repositorios oficiales de la DSCI; los cuales hacen parte integral del expediente del titular, garantizándose la trazabilidad, conservación e integridad de la información asociada al proceso de atención.",
];

export const SECTION_FOUR_SUBTITLE = "SOPORTE DOCUMENTAL DEL PROCESO";

export const SECTION_FOUR_SUBTITLE_PARAGRAPHS = [
  "La información relacionada con la ejecución de los componentes y la verificación de compromisos se encuentra relacionada en los siguientes soportes documentales, los cuales reposan los siguientes sistemas y en SISPINIS:",
];

export const SECTION_FIVE_SUPPORT_COLUMNS = [
  { key: "item", label: "Item", width: 40, align: "center" },
  { key: "document", label: "Documento", width: 292, align: "left" },
  { key: "repository", label: "Repositorio", width: 190, align: "left" },
];

export const SECTION_FIVE_SUPPORT_ROWS = [
  {
    item: "1",
    document: "Acuerdo de sustitución (acuerdo de no resiembra)",
    repository: "Sistema Gestion documental DSCI",
  },
  {
    item: "2",
    document: "Soportes de pagos AAI",
    repository: "Sistema Marte",
  },
  {
    item: "3",
    document: "Informe de verificación: Informe visita M2",
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
      "Resolución de la atención diferenciada y documentos soporte: copia de cédula de ciudadanía o certificado de discapacidad emitido por el Ministerio de Salud",
    repository: "Juridica- Sistema Gestion documental DSCI",
  },
  {
    item: "8",
    document: "Soportes de entregas de componentes por renegociación",
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
    heading: "ATENCIÓN DIFERENCIAL",
    sectionOneFields: SECTION_ONE_BASE_FIELDS,
  },
  [GRADUATION_CAUSE.FINANCIAL_OBLIGATION_PAYMENT]: {
    heading: "PAGO OBLIGACIONES FINANCIERAS",
    sectionOneFields: SECTION_ONE_BASE_FIELDS,
  },
  [GRADUATION_CAUSE.NON_AGRICULTURAL_PRODUCTIVE_PROJECTS]: {
    heading: "PROYECTOS PRODUCTIVOS NO AGROPECUARIOS",
    sectionOneFields: [
      ...SECTION_ONE_BASE_FIELDS,
      ...PRODUCTIVE_PROJECT_SECTION_ONE_FIELDS,
    ],
  },
  [GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS]: {
    heading: "PROYECTOS PRODUCTIVOS AGROPECUARIOS",
    sectionOneFields: [
      ...SECTION_ONE_BASE_FIELDS,
      ...PRODUCTIVE_PROJECT_SECTION_ONE_FIELDS,
    ],
  },
};

const DOCUMENT_TEMPLATE_VARIANT_ALIAS = {
  [GRADUATION_CAUSE.PRODUCTIVE_PROJECTS]:
    GRADUATION_CAUSE.AGRICULTURAL_PRODUCTIVE_PROJECTS,
};

export const getDocumentTemplateVariant = (graduationCause) =>
  DOCUMENT_TEMPLATE_VARIANTS[
    DOCUMENT_TEMPLATE_VARIANT_ALIAS[graduationCause] || graduationCause
  ] || null;

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
