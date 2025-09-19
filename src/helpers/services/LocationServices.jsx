import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";

class LocationServices {

    /**
     * Crea una nueva instancia del servicio de Jornadas.
     *  @type {string}
     */
    constructor() {
        this.baseUrl = GlobalConnex.url + "ubicaciones/";
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
     *
     */

    getDeptos() {
        const url = this.buildUrl(`jerarquia/?jerarquia=2`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     *
     */
    getMunis(deptoId) {
        const url = this.buildUrl(`hijas/?padre_id=${deptoId}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

}

export const locationServices = new LocationServices();