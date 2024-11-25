import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

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

    /**
     * Obtener reporte general por cubId.
     * @param {number} cubId - ID del cub.
     */
    headlineReport(cubId) {
        const url = this.buildUrl(`cub/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener reporte por rango de fechas.
     * @param {string} startDate - Fecha inicial en formato 'YYYY-MM-DD'.
     * @param {string} endDate - Fecha final en formato 'YYYY-MM-DD'.
     */
    companyReport(startDate, endDate) {
        const url = this.buildUrl(`proveedor/?fecha_ini=${startDate}&fecha_fin=${endDate}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener reporte por proveedor y cubId.
     * @param {number} cubId - ID del cub.
     */
    companyAndUserReport(cubId) {
        const url = this.buildUrl(`proveedor/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

export const reportServices = new ReportServices();
