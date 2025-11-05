import {GlobalConnex} from "../GlobalConnex";
import {authTokenService} from "./AuthTokenService";

class DeliveriesInformationServices {
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

    /**
     *
     *
     */
     getDeliveriesInformation(page = 1, pageSize = 100, search, statusDelivery, supplierId, onlySended = false) {
        let url = `?page=${page}&page_size=${pageSize}`;
        if(statusDelivery) {
            url += `&state=${statusDelivery}&only_sended=${onlySended}`;
        }
        if(search) {
            url += `&search=${search}`;
        }
        if(supplierId) {
            url += `&provider_id=${supplierId}`;
        }
        const urlOpt = this.buildUrl(`entrega-reporte/${url}`);
        return authTokenService.fetchWithAuth(urlOpt, { method: "GET" });
    }
}

export const deliveriesInformationServices = new DeliveriesInformationServices();