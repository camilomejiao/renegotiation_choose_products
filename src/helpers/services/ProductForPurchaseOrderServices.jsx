import { GlobalConnex } from "../GlobalConnex.jsx";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para gestionar productos y operaciones asociadas a órdenes de compra.
 */
class ProductForPurchaseOrderServices {
    constructor() {
        this.baseUrl = GlobalConnex.url + "producto/";
    }

    /**
     * Construye la URL completa para un endpoint relativo de productos.
     * @param {string} endpoint - Ruta relativa del endpoint.
     * @returns {string} URL completa del endpoint.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    // =============================
    // CONSULTA DE PRODUCTOS
    // =============================

    /**
     * Busca productos por nombre o término de búsqueda.
     * @param {string} searchData - Término de búsqueda del producto.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    searchProduct(searchData) {
        const url = this.buildUrl(`buscar/${searchData}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene un producto por su ID.
     * @param {number|string} id - ID del producto a consultar.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    getProductId(id) {
        const url = this.buildUrl(`${id}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // =============================
    // OPERACIONES DE ORDEN
    // =============================

    /**
     * Guarda una orden de productos.
     * @param {object} products - Objeto con los productos a guardar.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    saveOrderProducts(products) {
        const url = GlobalConnex.url + "orden/";
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }
}

export const productForPurchaseOrderServices = new ProductForPurchaseOrderServices();

