import { GlobalConnex } from "../GlobalConnex.jsx";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para gestionar �rdenes de compra.
 * Permite obtener, eliminar y operar sobre registros de �rdenes.
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
     * Obtiene todas las �rdenes de compra de forma paginada.
     * @param {number} page - N�mero de p�gina a consultar.
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
     * Elimina una orden de compra espec�fica por su ID.
     * @param {number|string} orderId - ID de la orden de compra a eliminar.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    removeOrder(orderId) {
        const url = this.buildUrl(`${orderId}/`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }
}

export const purchaseOrderServices = new PurchaseOrderServices();


