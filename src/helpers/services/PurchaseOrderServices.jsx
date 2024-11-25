import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

class PurchaseOrderServices {
    constructor() {
        this.baseUrl = Global.url + "orden/";
    }

    /**
     * Genera la URL completa para los endpoints de órdenes de compra.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    /**
     * Obtener todas las órdenes de compra paginadas.
     * @param {number} page - Número de página.
     * @returns {Promise<object>} - Promesa con los datos de la respuesta.
     */
    getAll(page) {
        const url = this.buildUrl(`${page}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Eliminar una orden de compra por su ID.
     * @param {number} orderId - ID de la orden.
     * @returns {Promise<object>} - Promesa con los datos de la respuesta.
     */
    removeOrder(orderId) {
        const url = this.buildUrl(`${orderId}/`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }
}

export const purchaseOrderServices = new PurchaseOrderServices();
