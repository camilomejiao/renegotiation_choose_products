import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";


class NewProductServices {

    constructor() {
        this.baseUrl = GlobalConnex.url + "producto/";
    }

    /**
     * Construye la URL completa para un endpoint de producto.
     * @param {string} endpoint - Ruta relativa del endpoint.
     * @returns {string} URL completa del endpoint.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    /**
     */
    getgetProductsByConvocation() {

    }

    /**
     * Crea múltiples productos de forma masiva.
     * @param {object[]} products - Array de productos a crear.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    saveProductUpload(products) {
        const url = this.buildUrl(`bulk/crear/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }

    /**
     */
    getProductPriceQuoteList(supplierId) {

    }

    /**
     */
    saveProductPriceQuotes() {

    }
}

export const newProductServices = new NewProductServices();
