import { useCallback, useState } from "react";

const INITIAL_MODAL = { isOpen: false, rowId: null };

// Encapsula el estado de "Homologación": producto homologado por fila,
// modal de búsqueda y validación.
export const useHomologation = (enabled) => {
  const [byRow, setByRow] = useState({});
  const [touched, setTouched] = useState(false);
  const [modal, setModal] = useState(INITIAL_MODAL);

  const openModal = useCallback((rowId) => setModal({ isOpen: true, rowId }), []);
  const closeModal = useCallback(() => setModal(INITIAL_MODAL), []);

  const select = useCallback((product) => {
    setModal((current) => {
      if (current.rowId != null) {
        setByRow((prev) => ({ ...prev, [current.rowId]: product }));
      }
      return INITIAL_MODAL;
    });
  }, []);

  const clearRow = useCallback((rowId) => {
    setByRow((prev) => {
      if (!(rowId in prev)) return prev;
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  }, []);

  const validate = useCallback((rows) => rows.every((row) => byRow[row.id]), [byRow]);

  const mapRows = useCallback(
    (rows) =>
      rows.map((row) => {
        const homologated = byRow[row.id];
        return {
          ...row,
          homologatedProduct: homologated ?? null,
          producto_homologado_id: homologated?.productId ?? null,
        };
      }),
    [byRow]
  );

  return {
    enabled,
    byRow,
    touched,
    setTouched,
    modal,
    openModal,
    closeModal,
    select,
    removeRow: clearRow,
    clearRow,
    validate,
    mapRows,
  };
};