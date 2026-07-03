import { useCallback, useEffect, useState } from "react";

import {
  getAlertedProductsJourneyOptions,
  getAlertedProductsPlanOptions,
  getAlertedProductsSuppliersByJourney,
} from "../../../entities/alerted-product";

// Filtros dependientes del buscador de homologación.
//
// - Jornada: se lista desde jornadas/abiertas/ y arranca con la jornada de los
//   items seleccionados (defaultJourney). Es editable.
// - Plan y Proveedor: dependen de la jornada seleccionada; se recargan y se
//   limpian cada vez que cambia la jornada.
export const useHomologationFilters = ({ isOpen, defaultJourney }) => {
  const [journeyOptions, setJourneyOptions] = useState([]);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState(defaultJourney ?? null);

  const [planOptions, setPlanOptions] = useState([]);
  const [planLoading, setPlanLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [supplierOptions, setSupplierOptions] = useState([]);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Carga las jornadas abiertas al abrir el modal.
  useEffect(() => {
    if (!isOpen) return undefined;

    let cancelled = false;
    setJourneyLoading(true);
    getAlertedProductsJourneyOptions()
      .then((options) => {
        if (!cancelled) setJourneyOptions(options);
      })
      .catch(() => {
        if (!cancelled) setJourneyOptions([]);
      })
      .finally(() => {
        if (!cancelled) setJourneyLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  // Al abrir, selecciona por defecto la jornada de los items seleccionados.
  useEffect(() => {
    if (isOpen) {
      setSelectedJourney(defaultJourney ?? null);
    }
  }, [isOpen, defaultJourney]);

  // Plan y proveedor se recargan (y se limpian) según la jornada seleccionada.
  useEffect(() => {
    setSelectedPlan(null);
    setSelectedSupplier(null);

    const jornadaId = selectedJourney?.value ?? null;
    if (!isOpen || jornadaId == null) {
      setPlanOptions([]);
      setSupplierOptions([]);
      return undefined;
    }

    let cancelled = false;
    setPlanLoading(true);
    setSupplierLoading(true);

    getAlertedProductsPlanOptions(jornadaId)
      .then((options) => {
        if (!cancelled) setPlanOptions(options);
      })
      .catch(() => {
        if (!cancelled) setPlanOptions([]);
      })
      .finally(() => {
        if (!cancelled) setPlanLoading(false);
      });

    getAlertedProductsSuppliersByJourney(jornadaId)
      .then((options) => {
        if (!cancelled) setSupplierOptions(options);
      })
      .catch(() => {
        if (!cancelled) setSupplierOptions([]);
      })
      .finally(() => {
        if (!cancelled) setSupplierLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, selectedJourney]);

  const changeJourney = useCallback((option) => setSelectedJourney(option ?? null), []);
  const changePlan = useCallback((option) => setSelectedPlan(option ?? null), []);
  const changeSupplier = useCallback((option) => setSelectedSupplier(option ?? null), []);

  return {
    journeyOptions,
    journeyLoading,
    selectedJourney,
    changeJourney,
    planOptions,
    planLoading,
    selectedPlan,
    changePlan,
    supplierOptions,
    supplierLoading,
    selectedSupplier,
    changeSupplier,
  };
};