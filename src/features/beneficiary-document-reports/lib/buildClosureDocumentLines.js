export const buildClosureDocumentLines = ({ beneficiaryDetails, row }) => {
  const holderName = beneficiaryDetails?.nombre_completo || "Titular PNIS";
  const holderCub = beneficiaryDetails?.cub || "---";

  return [
    "Documento de cierre PNIS",
    "",
    `Titular: ${holderName}`,
    `CUB: ${holderCub}`,
    `Estado titular: ${row?.holderStatus || "---"}`,
    `Causal de graduacion: ${row?.graduationCause || "---"}`,
    "",
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    "",
    "Documento generado como prueba tecnica para visor y descarga.",
  ];
};
