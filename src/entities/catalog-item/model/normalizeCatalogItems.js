import { CATALOG_ITEM_STATUS } from "./constants";

export const normalizeCatalogItems = (payload) => {
  const sourceRows = payload?.data ?? [];

  return sourceRows.map((row) => {
    const plans = (row?.planes ?? []).map((plan) => ({
      id: plan?.id ?? null,
      name: (plan?.plan?.nombre ?? "").trim(),
    }));

    return {
      id: row?.id,
      date: row?.fcrea?.split("T")?.[0] ?? "",
      name: (row?.nombre ?? "").replace(/\r?\n/g, " ").trim(),
      status: row?.abierto ? CATALOG_ITEM_STATUS.OPEN : CATALOG_ITEM_STATUS.CLOSED,
      n_suppliers: row?.cant_proveedores ?? row?.proveedores?.length ?? 0,
      suppliersList: row?.proveedores ?? [],
      plans,
      plansLabel: plans.length ? plans.map((plan) => plan.name).join(", ") : "—",
    };
  });
};
