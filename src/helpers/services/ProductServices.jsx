import {Global} from "../Global";
import {authTokenService} from "./AuthTokenService";

class ProductServices {

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

    getUnitList() {
        const url = `${Global.url}lista/unidades/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getCategoryList() {
        const url = `${Global.url}lista/categorias/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getProductList() {
        const url = this.baseUrl;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    save(products) {
        const url = this.buildUrl(`bulk/crear/`);
        return authTokenService.fetchWithAuth(url, {
             method: "POST",
             body: JSON.stringify(products),
        });
    }

    productRemove(productId) {
        const url = this.buildUrl(`${productId}`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

    productApprove(productId) {
        const url = this.buildUrl(`aprobar/${productId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
        });
    }

    edit(products) {
        const url = this.buildUrl(`bulk/modificar/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }
}

export const productServices = new ProductServices();