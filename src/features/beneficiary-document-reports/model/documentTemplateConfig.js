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
