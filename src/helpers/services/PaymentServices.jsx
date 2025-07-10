import { Global } from "../Global";
import { authTokenService } from "./AuthTokenService";


class PaymentServices {
    constructor() {
        this.baseUrl = Global.url + "pagos/";
    }

    /**
     * Genera la URL completa para los endpoints de entrega.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    getApprovedDeliveries(page = 1, pageSize = 100) {
        const url = this.buildUrl(`cuentas-para-verificacion/?page=${page}&page_size=${pageSize}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getReviewApprovedDeliveriesById(beneficiaryId) {
        const url = this.buildUrl(`entregas-revision/${beneficiaryId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    approveOrDenyPayments(payload, id) {
        const url = this.buildUrl(`entregas-revision/${id}/aprobar/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    getCollectionAccounts(page = 1) {
        const url = this.buildUrl(`cuentas-cobro/?page=${page}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getDetailCollectionAccounts(accountId) {
        const url = this.buildUrl(`cuentas-cobro/${accountId}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getAllApprovedDeliveriesBySupplier(page = 1, pageSize = 100) {
        const url = this.buildUrl(`entregas-aprobadas/?page=${page}&page_size=${pageSize}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    createCollectionAccounts(payload) {
        const url = this.buildUrl(`cuentas-cobro/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

}

export const paymentServices = new PaymentServices();