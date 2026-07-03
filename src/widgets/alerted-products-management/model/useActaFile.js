import { useCallback, useState } from "react";

import AlertComponent from "../../../helpers/alert/AlertComponent";

const toBaseName = (label) =>
  (label || "Acta_Complementaria")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("_");

export const useActaFile = ({ isPriceAdjustment, managementTypeLabel }) => {
  const [actaFile, setActaFile] = useState(null);

  const beforeUpload = useCallback(
    (file) => {
      const isPdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        AlertComponent.error("Formato inválido", "Solo se permite archivos PDF.");
        return false;
      }
      const baseName = isPriceAdjustment
        ? "Formato_Novedad_Ajuste"
        : toBaseName(managementTypeLabel);
      setActaFile(new File([file], `${baseName}.pdf`, { type: file.type }));
      return false;
    },
    [isPriceAdjustment, managementTypeLabel]
  );

  const clear = useCallback(() => setActaFile(null), []);

  return { actaFile, beforeUpload, clear };
};