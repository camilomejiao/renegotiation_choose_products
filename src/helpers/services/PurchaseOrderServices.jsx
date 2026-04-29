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
}

export const purchaseOrderServices = new PurchaseOrderServices();
