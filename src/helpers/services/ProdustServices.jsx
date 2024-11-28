import {Global} from "../Global";
import {authTokenService} from "./AuthTokenService";

class ProdustServices {

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

    save(products) {
        const url = this.buildUrl(`orden/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }
}

export const produstServices = new ProdustServices();