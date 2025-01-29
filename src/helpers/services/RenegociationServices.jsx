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

    getInformationEngagement(cubId) {
        const url = this.buildUrl(`acuerdo/reporte/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getDetailPlan(cubId) {
        const url = this.buildUrl(`acuerdo/detalle/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    updateUserInformationRenegotiation(cubId, data) {
        console.log(cubId, data);
        const url = this.buildUrl(`acuerdo/${cubId}/`)
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    getEngagementDownload(cubId, type) {
        const url = this.buildUrl(`acuerdo/descarga/${cubId}/${type}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    sendEngagement(cubId, formData) {
        const url = this.buildUrl(`acuerdo/archivo/${cubId}/`)
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: formData,
        });
    }
}

export const renegotiationServices = new RenegotiationServices();