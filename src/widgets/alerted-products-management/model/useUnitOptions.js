import { useEffect, useState } from "react";

import { getUnitOptions } from "../../../helpers/utils/ValidateProductColumns";

// Carga las unidades de medida (recurso producto/lista/unidades/) y las mapea
// al shape { value, label } que consume AppSelect.
export const useUnitOptions = () => {
  const [unitOptions, setUnitOptions] = useState([]);
  const [unitsLoading, setUnitsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setUnitsLoading(true);

    getUnitOptions()
      .then((data) => {
        if (!active) return;
        setUnitOptions(
          (data ?? []).map((unit) => ({ value: unit.id, label: unit.nombre }))
        );
      })
      .catch(() => {
        if (active) setUnitOptions([]);
      })
      .finally(() => {
        if (active) setUnitsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { unitOptions, unitsLoading };
};