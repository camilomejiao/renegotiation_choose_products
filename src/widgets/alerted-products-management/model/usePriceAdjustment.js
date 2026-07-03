import { useCallback, useState } from "react";

import { isValidNewSalePrice } from "./constants";

// Encapsula el estado de "Ajuste de precio": nuevo precio por fila + validación.
export const usePriceAdjustment = (enabled) => {
  const [newSalePrices, setNewSalePrices] = useState({});
  const [touched, setTouched] = useState(false);

  const setPrice = useCallback(
    (id, value) => setNewSalePrices((prev) => ({ ...prev, [id]: value })),
    []
  );

  const clearRow = useCallback((id) => {
    setNewSalePrices((prev) => {
      if (!(id in prev)) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const validate = useCallback(
    (rows) => rows.every((row) => isValidNewSalePrice(newSalePrices[row.id], row)),
    [newSalePrices]
  );

  const mapRows = useCallback(
    (rows) => rows.map((row) => ({ ...row, newSalePrice: newSalePrices[row.id] })),
    [newSalePrices]
  );

  return { enabled, newSalePrices, touched, setTouched, setPrice, clearRow, validate, mapRows };
};