import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para gestionar los pagos, entregas y cuentas de cobro.
 */
class PaymentServices {
    constructor() {
        this.baseUrl = GlobalConnex.url + "pagos/";
    }

    /**
     * Construye la URL completa para un endpoint relativo.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    // =============================
    // ENTREGAS PARA VERIFICACIÓN
    // =============================

    /**
     * Obtiene la lista paginada de entregas aprobadas listas para verificación.
     * @param {number} [page=1] - Número de página.
     * @param {number} [pageSize=100] - Tamaño de página.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    getApprovedDeliveries(page = 1, pageSize = 100, search) {
        let url = `?page=${page}&page_size=${pageSize}`;
        if(search) {
            url = `?search=${search}`;
        }
        const urlOpt = this.buildUrl(`cuentas-para-verificacion/${url}`);
        return authTokenService.fetchWithAuth(urlOpt, { method: "GET" });
    }

    /**
     * Obtiene el detalle de una entrega específica en revisión.
     * @param {number|string} deliveryId - ID de la entrega.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    getReviewApprovedDeliveriesById(deliveryId) {
        const url = this.buildUrl(`entregas-revision/${deliveryId}/detalle/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Aprueba o rechaza una entrega.
     * @param {Object} payload - Cuerpo de la solicitud con la decisión.
     * @param {number|string} id - ID de la entrega.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    approveOrDenyPayments(payload, id) {
        const url = this.buildUrl(`entregas-revision/${id}/aprobar/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    // =============================
    // CUENTAS DE COBRO
    // =============================

    /**
     * Obtiene una lista paginada de cuentas de cobro, opcionalmente filtradas por proveedor.
     * @param {number} [page=1] - Número de página.
     * @param {number} [pageSize=100] - Tamaño de página.
     * @param {number|string} [supplierId] - ID del proveedor (opcional).
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    getCollectionAccounts(page = 1, pageSize = 100, supplierId, status) {
        let url = `cuentas-cobro/?page=${page}&page_size=${pageSize}&estado=${status}`;
        if (supplierId) {
            url += `&proveedor_id=${supplierId}`;
        }
        return authTokenService.fetchWithAuth(this.buildUrl(url), { method: "GET" });
    }

    /**
     * Obtiene el detalle de una cuenta de cobro por su ID.
     * @param {number|string} accountId - ID de la cuenta de cobro.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    getDetailCollectionAccounts(accountId) {
        const url = this.buildUrl(`cuentas-cobro/${accountId}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene el detalle completo de entregas asociadas a una cuenta de cobro.
     * @param {number|string} accountId - ID de la cuenta de cobro.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    getCollectionAccountsById(accountId) {
        const url = this.buildUrl(`cuenta-cobro-entregas/por-cuenta-cobro/${accountId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Crea una nueva cuenta de cobro con la información de pago y documentos adjuntos.
     * @param {FormData} formData - Formulario con los datos y archivos.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    createCollectionAccounts(formData) {
        const url = this.buildUrl(`informacion-pago/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: formData,
        });
    }

    // =============================
    // ENTREGAS APROBADAS
    // =============================

    /**
     * Obtiene todas las entregas aprobadas por proveedor (paginadas).
     * @param {number} [page=1] - Número de página.
     * @param {number} [pageSize=100] - Tamaño de página.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    getAllApprovedDeliveriesBySupplier(page = 1, pageSize = 100) {
        const url = this.buildUrl(`entregas-aprobadas/?page=${page}&page_size=${pageSize}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     *
     */
    getExcelAndPdfFile(SPId, reportType) {
        const url = this.buildUrl(`cuentas-cobro/reporte-${reportType}/?numero_cuenta_cobro=${SPId}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    //
    changeStatusCollectionAccountDetail(SPId) {
        const url = this.buildUrl(`fiduciaria/${SPId}/emitir-para-pago/`);
        return authTokenService.fetchWithAuth(url, {
            method: "PATCH",
            body: JSON.stringify(SPId),
        });
    }

}

export const paymentServices = new PaymentServices();
