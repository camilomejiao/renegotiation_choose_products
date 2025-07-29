import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para la gestión de reportes relacionados con órdenes y consolidado de CUB.
 */
class ReportServices {
    constructor() {
        this.baseUrl = Global.url + "orden/reporte/";
    }

    /**
     * Genera la URL completa para los endpoints de reportes.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    // =============================
    // REPORTES
    // =============================

    /**
     * Obtener el reporte general de un CUB.
     * @param {number} cubId - ID del CUB.
     * @returns {Promise<Response>} - Promesa con los datos del reporte.
     */
    headlineReport(cubId) {
        const url = this.buildUrl(`cub/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener reporte consolidado por proveedor según rango de fechas.
     * @param {string} startDate - Fecha inicial en formato 'YYYY-MM-DD'.
     * @param {string} endDate - Fecha final en formato 'YYYY-MM-DD'.
     * @returns {Promise<Response>} - Promesa con los datos del reporte.
     */
    companyReport(startDate, endDate) {
        const url = this.buildUrl(`proveedor/?fecha_ini=${startDate}&fecha_fin=${endDate}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener reporte de un proveedor específico y CUB.
     * @param {number} cubId - ID del CUB.
     * @returns {Promise<Response>} - Promesa con los datos del reporte.
     */
    companyAndUserReport(cubId) {
        const url = this.buildUrl(`proveedor/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // =============================
    // CARGA DE ARCHIVOS
    // =============================

    /**
     * Subir archivo de reporte consolidado para un CUB.
     * @param {number} cubId - ID del CUB.
     * @param {FormData} formData - Archivo a subir (como FormData).
     * @returns {Promise<Response>} - Promesa con la respuesta del servidor.
     */
    uploadFileReport(cubId, formData) {
        const url = `${Global.url}cub/consolidado/${cubId}/`;
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: formData,
        });
    }
}

export const reportServices = new ReportServices();
