import { Global } from "../Global";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para gestionar renegociaciones y acuerdos del usuario.
 */
class RenegotiationServices {
    constructor() {
        this.baseUrl = Global.url + "renegociacion/";
    }

    /**
     * Construye la URL completa para un endpoint de renegociación.
     * @param {string} endpoint - Ruta relativa del endpoint.
     * @returns {string} URL completa del endpoint.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    // =============================
    // CONSULTAS PRINCIPALES
    // =============================

    /**
     * Obtener información de renegociación de un usuario.
     * @param {string} type - Tipo de identificación (por ejemplo: "cedula").
     * @param {string|number} identificationId - Número de identificación del usuario.
     * @returns {Promise<Response>}
     */
    getUserRenegotiation(type, identificationId) {
        const url = this.buildUrl(`cub/${type}/${identificationId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener la lista de planes disponibles.
     * @returns {Promise<Response>}
     */
    getPlan() {
        const url = `${Global.url}lista/planes`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener líneas asociadas a un plan y un CUB.
     * @param {number} planId - ID del plan.
     * @param {number|string} cubId - ID del CUB.
     * @returns {Promise<Response>}
     */
    getLine(planId, cubId) {
        const url = this.buildUrl(`lineas/${planId}/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // =============================
    // DETALLES Y REPORTE DE ACUERDOS
    // =============================

    /**
     * Obtener información del acuerdo de compromiso para reporte.
     * @param {number|string} cubId - ID del CUB.
     * @returns {Promise<Response>}
     */
    getInformationEngagement(cubId) {
        const url = this.buildUrl(`acuerdo/reporte/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener el detalle del plan de compromiso.
     * @param {number|string} cubId - ID del CUB.
     * @returns {Promise<Response>}
     */
    getDetailPlan(cubId) {
        const url = this.buildUrl(`acuerdo/detalle/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener historial de planes del CUB.
     * @param {number|string} cubId - ID del CUB.
     * @returns {Promise<Response>}
     */
    getPlanHistory(cubId) {
        const url = this.buildUrl(`acuerdo/historia/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // =============================
    // ACTUALIZACIÓN Y ENVÍO
    // =============================

    /**
     * Actualizar información de compromiso del usuario.
     * @param {number|string} cubId - ID del CUB.
     * @param {object} data - Datos a actualizar.
     * @returns {Promise<Response>}
     */
    updateUserInformationRenegotiation(cubId, data) {
        const url = this.buildUrl(`acuerdo/${cubId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    /**
     * Descargar el archivo del acuerdo de compromiso.
     * @param {number|string} cubId - ID del CUB.
     * @param {string} type - Tipo de archivo (PDF, DOC, etc).
     * @returns {Promise<Response>}
     */
    getEngagementDownload(cubId, type) {
        const url = this.buildUrl(`acuerdo/descarga/${cubId}/${type}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Enviar archivo firmado del acuerdo de compromiso.
     * @param {number|string} cubId - ID del CUB.
     * @param {FormData} formData - Formulario con el archivo adjunto.
     * @returns {Promise<Response>}
     */
    sendEngagement(cubId, formData) {
        const url = this.buildUrl(`acuerdo/archivo/${cubId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: formData,
        });
    }
}

export const renegotiationServices = new RenegotiationServices();
