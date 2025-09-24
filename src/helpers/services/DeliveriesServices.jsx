import { GlobalConnex } from "../GlobalConnex.jsx";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para gestionar entregas, productos y reportes asociados al CUB.
 */
class DeliveriesServices {
    constructor() {
        this.baseUrl = GlobalConnex.url + "entrega/";
    }

    /**
     * Construye la URL completa para un endpoint relativo.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    // =============================
    // PROVEEDORES
    // =============================

    /**
     * Obtiene los proveedores asociados a un CUB.
     * @param {number|string} cubId - ID del CUB.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    getSuppliers(cubId) {
        const url = this.buildUrl(`proveedores/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // =============================
    // ENTREGAS
    // =============================

    /**
     * Busca entregas realizadas a un usuario según su CUB.
     * @param {number|string} cubId - ID del CUB.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    searchDeliveriesToUser(cubId) {
        const url = this.buildUrl(`cub/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene el detalle PDF de una entrega específica.
     * @param {number|string} deliveryId - ID de la entrega.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    searchDeliveriesPDF(deliveryId) {
        const url = this.buildUrl(`${deliveryId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene los productos de una entrega específica.
     * @param {number|string} deliveryId - ID de la entrega.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    getProductsFromDelivery(deliveryId) {
        const url = this.buildUrl(`${deliveryId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Elimina una entrega específica.
     * @param {number|string} deliveryId - ID de la entrega.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    removeDelivery(deliveryId) {
        const url = this.buildUrl(`${deliveryId}/`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

    /**
     * Aprueba una entrega.
     * @param {number|string} deliveryId - ID de la entrega.
     * @param {Object} payload - Información para aprobación.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    approveDelivery(deliveryId, payload) {
        const url = this.buildUrl(`aprobar/${deliveryId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    // =============================
    // PRODUCTOS A ENTREGAR
    // =============================

    /**
     * Obtiene los productos que deben ser entregados por proveedor y CUB.
     * @param {number|string} companyId - ID del proveedor.
     * @param {number|string} cubId - ID del CUB.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    productsToBeDelivered(companyId, cubId) {
        const url = this.buildUrl(`${companyId}/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Guarda los productos entregados por proveedor y CUB.
     * @param {number|string} companyId - ID del proveedor.
     * @param {number|string} cubId - ID del CUB.
     * @param {Object[]} products - Lista de productos entregados.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    saveProducts(companyId, cubId, products) {
        const url = this.buildUrl(`guardar/${companyId}/${cubId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }

    /**
     * Edita un producto dentro de una entrega.
     * @param {number|string} itemId - ID del producto dentro de la entrega.
     * @param {Object} product - Datos actualizados del producto.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    editDelivery(itemId, product) {
        const url = this.buildUrl(`item/${itemId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(product),
        });
    }

    // =============================
    // REPORTES Y ARCHIVOS
    // =============================

    /**
     * Genera el reporte de entrega (PDF o similar).
     * @param {number|string} deliveryId - ID de la entrega.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    deliveryReport(deliveryId) {
        const url = this.buildUrl(`${deliveryId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Sube evidencia (archivos) de una entrega específica.
     * @param {number|string} deliveryId - ID de la entrega.
     * @param {FormData} formData - Archivos a subir.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    evidenceOfDeliveries(deliveryId, formData) {
        const url = this.buildUrl(`archivo/${deliveryId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: formData,
        });
    }
}

export const deliveriesServices = new DeliveriesServices();
