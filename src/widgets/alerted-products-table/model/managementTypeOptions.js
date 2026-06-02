export const managementTypeAssignmentOptions = [
  {
    value: 5275,
    label: "ACTA COMPLEMENTARIA",
    description:
      "Aplicable cuando se requiere complementar información mediante acta.",
  },
  {
    value: 5276,
    label: "HOMOLOGACIÓN",
    description:
      "Aplicable para productos que requieren ser homologados.",
  },
  {
    value: 5277,
    label: "JUSTIFICACION TÉCNICA",
    description:
      "Aplicable cuando se aporta una justificación técnica del sobreprecio.",
  },
  {
    value: 5278,
    label: "PRODUCTO INDETERMINADO",
    description:
      "Aplicable cuando no se ha determinado el tipo de gestión.",
  },
  {
    value: 5279,
    label: "AJUSTE DE PRECIO",
    description:
      "Aplicable cuando se solicita ajustar precios del producto.",
  },
];

export const getManagementTypeAssignmentLabel = (value) =>
  managementTypeAssignmentOptions.find((option) => option.value === value)?.label || "";
