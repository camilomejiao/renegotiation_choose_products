export const managementTypeAssignmentOptions = [
  {
    value: 1,
    label: "REVISIÓN",
    description:
      "Aplicable cuando el producto requiere una revisión de precios.",
  },
  {
    value: 2,
    label: "JUSTIFICACIÓN TÉCNICA",
    description:
      "Aplicable cuando se aporta una justificación técnica del sobreprecio.",
  },
  {
    value: 3,
    label: "SUBSANACIÓN",
    description:
      "Aplicable cuando se requiere subsanar información del producto.",
  },
  {
    value: 4,
    label: "ACTA COMPLEMENTARIA",
    description:
      "Aplicable cuando se requiere complementar información mediante acta.",
  },
  {
    value: 5,
    label: "AJUSTE DE PRECIO",
    description:
      "Aplicable cuando se solicita ajustar precios del producto.",
  },
];

export const getManagementTypeAssignmentLabel = (value) =>
  managementTypeAssignmentOptions.find((option) => option.value === value)?.label || "";
