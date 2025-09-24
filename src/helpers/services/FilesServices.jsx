import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";


class FilesServices {

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
        const url = `${GlobalConnex.url}cub/consolidado/${cubId}/`;
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: formData,
        });
    }


    // =============================
    // DESCARGAS
    // =============================

    /**
     * Descarga un archivo del servidor a partir de su ruta.
     * @param {string} route - Ruta del archivo.
     * @returns {Promise<Response>} Respuesta del servidor.
     */
    downloadFile(route) {
        const url = `${GlobalConnex.url}archivo/descargar_archivo?ruta=${route}`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

export const filesServices = new FilesServices();