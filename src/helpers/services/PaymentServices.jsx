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

    getReviewApprovedDeliveriesById(deliveryId) {
        const url = this.buildUrl(`entregas-revision/${deliveryId}/detalle/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    approveOrDenyPayments(payload, id) {
        const url = this.buildUrl(`entregas-revision/${id}/aprobar/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    getCollectionAccounts(page = 1, pageSize = 100, supplierId) {
        let url = `cuentas-cobro/?page=${page}&page_size=${pageSize}`;
        if (supplierId) {
            url += `&proveedor_id=${supplierId}`;
        }
        return authTokenService.fetchWithAuth(this.buildUrl(url), { method: "GET" });
    }

    getDetailCollectionAccounts(accountId) {
        const url = this.buildUrl(`cuentas-cobro/${accountId}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getAllApprovedDeliveriesBySupplier(page = 1, pageSize = 100) {
        const url = this.buildUrl(`entregas-aprobadas/?page=${page}&page_size=${pageSize}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    createCollectionAccounts(formData) {
        const url = this.buildUrl(`informacion-pago/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: formData,
        });
    }

    downloadFile(id) {
        const url = this.buildUrl(`archivos-entrega/${id}/descargar/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }


}

export const paymentServices = new PaymentServices();