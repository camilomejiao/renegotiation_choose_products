import { useCallback } from "react";

import {
  assignAlertedProductsManagementType,
  createAlertedProductsRequest,
} from "../../../entities/alerted-product";
import {
  MANAGEMENT_ERROR_MESSAGES,
  REQUEST_ERROR_MESSAGES,
  buildServiceResult,
} from "../lib/serviceResult";

// Orquesta los dos recursos del envío: actualizar la gestión y, solo si esa
// respondió OK, crear la solicitud documental.
export const useManagementRequestSubmit = ({ appliedFilters, onManagementSuccess }) =>
  useCallback(
    async ({ managementTypeId, observation, pdf, selectedRows }) => {
      if (!appliedFilters) return undefined;

      const result = { management: null, request: null, success: false };

      try {
        const managementResponse = await assignAlertedProductsManagementType({
          managementTypeId,
          selectedRows,
        });
        onManagementSuccess?.();
        result.management = {
          label: "Gestión de alertas",
          ok: true,
          status: 200,
          code: null,
          message:
            managementResponse?.mensaje || "Tipo de gestión actualizado correctamente.",
        };
      } catch (error) {
        result.management = buildServiceResult(
          "Gestión de alertas",
          error,
          MANAGEMENT_ERROR_MESSAGES
        );
      }

      if (result.management?.ok) {
        try {
          const requestResponse = await createAlertedProductsRequest({
            observation,
            pdf,
            selectedRows,
          });
          result.request = {
            label: "Solicitud documental",
            ok: true,
            status: 201,
            code: null,
            message: requestResponse?.mensaje || "Solicitud creada correctamente.",
          };
        } catch (error) {
          result.request = buildServiceResult(
            "Solicitud documental",
            error,
            REQUEST_ERROR_MESSAGES
          );
        }
      }

      result.success = Boolean(result.management?.ok && result.request?.ok);
      return result;
    },
    [appliedFilters, onManagementSuccess]
  );