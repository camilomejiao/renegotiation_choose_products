export const managementTypeAssignmentOptions = [
  {
    value: "acta-complementaria",
    label: "Acta complementaria",
    description:
      "Aplicable cuando se requiere complementar información mediante acta.",
  },
  {
    value: "homologacion",
    label: "Homologación",
    description:
      "Aplicable para productos que requieren ser homologados.",
  },
  {
    value: "justificacion-tecnica",
    label: "Justificación técnica",
    description:
      "Aplicable cuando se aporta una justificación técnica del sobreprecio.",
  },
  {
    value: "indeterminado",
    label: "Indeterminado",
    description:
      "Aplicable cuando no se ha determinado el tipo de gestión.",
  },
  {
    value: "ajuste-precios",
    label: "Ajuste de precios",
    description:
      "Aplicable cuando se solicita ajustar precios del producto.",
  },
];

export const getManagementTypeAssignmentLabel = (value) =>
  managementTypeAssignmentOptions.find((option) => option.value === value)?.label || "";
