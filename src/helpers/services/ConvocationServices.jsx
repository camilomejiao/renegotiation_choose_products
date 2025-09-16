import { GlobalConnex } from "../GlobalConnex";
import {authTokenService} from "./AuthTokenService";


class ConvocationServices {

    /**
     * Crea una nueva instancia del servicio de Jornadas.
     *  @type {string}
     */
    constructor() {
        this.baseUrl = GlobalConnex.url + "jornadas/";
    }

    /**
     * Construye la URL completa para un endpoint relativo a jornadas.
     *
     * @param {string} endpoint - Ruta relativa del endpoint (por ejemplo: `"abiertas/"`).
     * @returns {string} URL absoluta resultante.
     *
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    /**
     * Registra convocatorias.
     * POST `/jornadas/crear/`
     *
     * @param {object} payload - Payload a enviar.
     * @returns {Promise<{ data: any, status: number }>} Promesa con `data` y `status`.
     */
    create(payload) {
        const url = this.buildUrl(`crear/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    /**
     *
     */
    update(id, payload) {
        const url = this.buildUrl(`/${id}/actualizar/`);
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    }

    /**
     *
     */
    get() {
        const url = this.buildUrl('/');
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getById(convocationId) {
        const url = this.buildUrl(`${convocationId}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     *
     */
    delete(convoctaionId) {
        const url = this.buildUrl(`${convoctaionId}/eliminar`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

}

export const convocationServices = new ConvocationServices();