import {Global} from "../Global";
import {authTokenService} from "./AuthTokenService";

class RenegotiationServices {

    constructor() {
        this.baseUrl = Global.url + "renegociacion/";
    }

    /**
     * Genera la URL completa para los endpoints de productos.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    getUserRenegotiation(identificationId) {
        const url = this.buildUrl(`cub/${identificationId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getPlan() {
        const url = `${Global.url}lista/planes`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getLine(planId) {
        const url = this.buildUrl(`lineas/${planId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    updateUserInformationRenegotiation(cubId, data) {
        console.log(cubId, data);
        const url = this.buildUrl(`acuerdo/${cubId}/`)
        return authTokenService.fetchWithAuth(url, {
            method: "PATCH",
            body: JSON.stringify(data),
        });
    }
}

export const renegotiationServices = new RenegotiationServices();