import { GlobalConnex } from "../GlobalConnex.jsx";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para gestionar órdenes de compra.
 * Permite obtener, eliminar y operar sobre registros de órdenes.
 */
class PurchaseOrderServices {
    constructor() {
        this.baseUrl = GlobalConnex.url + "orden/";
    }

    /**
     * Construye la URL completa para un endpoint de orden de compra.
     * @param {string} endpoint - Ruta relativa del endpoint.
     * @returns {string} URL completa del endpoint.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    // =============================
    // CONSULTAS
    // =============================

    /**
     * Obtiene todas las órdenes de compra de forma paginada.
     * @param {number} page - Número de página a consultar.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    getAll(page) {
        const url = this.buildUrl(`${page}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene la lista paginada de solicitudes de anulación asociadas a órdenes.
     * @param {string} queryString - Query string ya serializado.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    getCancellationRequests(queryString = "") {
        const url = this.buildUrl(`solicitudes/${queryString}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Consulta solicitudes de aprobación para líderes.
     * @param {Object} payload - Filtros y paginación de la consulta.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    getApprovalRequests(payload = {}) {
        const url = this.buildUrl("solicitudes/aprobacion/consulta");
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    /**
     * Registra una solicitud de anulación de orden de compra.
     * @param {Object} payload - Datos de la solicitud.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    createCancellationRequest(payload = {}) {
        const url = this.buildUrl("solicitudes/");
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    // =============================
    // ELIMINACIÓN
    // =============================

    /**
     * Elimina una orden de compra específica por su ID.
     * @param {number|string} orderId - ID de la orden de compra a eliminar.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    removeOrder(orderId, payload = {}) {
        const url = this.buildUrl(`${orderId}/`);
        const options = {
            method: "DELETE",
        };

        if (Object.keys(payload).length > 0) {
            options.body = JSON.stringify(payload);
        }

        return authTokenService.fetchWithAuth(url, options);
    }

    /**
     * Cancela una solicitud de anulación previamente registrada.
     * @param {number|string} requestId - ID de la solicitud.
     * @param {Object} payload - Datos adicionales de cancelación.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    cancelCancellationRequest(requestId, payload = {}) {
        const url = this.buildUrl(`solicitudes/${requestId}/cancelar/`);
        const options = {
            method: "PATCH",
        };

        if (Object.keys(payload).length > 0) {
            options.body = JSON.stringify(payload);
        }

        return authTokenService.fetchWithAuth(url, options);
    }

    /**
     * Actualiza una solicitud de anulación mediante el endpoint unificado.
     * @param {Object} payload - Datos de actualización de la solicitud.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    updateCancellationRequest(payload = {}) {
        const url = this.buildUrl("solicitudes/");
        return authTokenService.fetchWithAuth(url, {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    }
}

export const purchaseOrderServices = new PurchaseOrderServices();
