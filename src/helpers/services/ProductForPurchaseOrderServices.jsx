import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

class ProductForPurchaseOrderServices {
    constructor() {
        this.baseUrl = Global.url + "producto/";
    }

    /**
     * Genera la URL completa para los endpoints de productos.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    /**
     * Buscar un producto por nombre.
     * @param {string} searchData - Término de búsqueda.
     * @returns {Promise<object>} - Promesa con los datos de la respuesta.
     */
    searchProduct(searchData) {
        const url = this.buildUrl(`buscar/${searchData}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener un producto por su ID.
     * @param {number} id - ID del producto.
     * @returns {Promise<object>} - Promesa con los datos de la respuesta.
     */
    getProductId(id) {
        const url = this.buildUrl(`${id}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Guardar productos.
     * @param {object} products - Productos a guardar.
     * @returns {Promise<object>} - Promesa con los datos de la respuesta.
     */
    saveOrderProducts(products) {
        const url = Global.url + "orden/";
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }
}

export const productForPurchaseOrderServices = new ProductForPurchaseOrderServices();
