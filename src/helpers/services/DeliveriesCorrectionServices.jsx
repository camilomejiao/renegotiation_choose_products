import {GlobalConnex} from "../GlobalConnex";
import {authTokenService} from "./AuthTokenService";

class DeliveriesCorrectionServices {
    constructor() {
        this.baseUrl = GlobalConnex.url;
    }

    /**
     * Construye la URL completa para un endpoint relativo.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    getDeliveriesCorrection(page = 1, pageSize = 100, search) {
        let url = `?page=${page}&page_size=${pageSize}`;
        if(search) {
            url = `?search=${search}`;
        }
        const urlOpt = this.buildUrl(`entregas-subsanar/${url}`);
        return authTokenService.fetchWithAuth(urlOpt, { method: "GET" });
    }
}

export const deliveriesCorrectionServices = new DeliveriesCorrectionServices();