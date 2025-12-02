import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";

class BeneficiaryInformationServices {

    /**
     * Crea una nueva instancia del servicio de Jornadas.
     *  @type {string}
     */
    constructor() {
        this.baseUrl = GlobalConnex.url + "cub/";
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
    getCubStatus() {
        const url = GlobalConnex.url+ `lista/parametros/?tipo_parametro_id=1`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getCubActivity() {
        const url = GlobalConnex.url+ `lista/parametros/?tipo_parametro_id=9`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    searchForUserOrCubInformation(
        pageSize = 100,
        page = 1,
        cubId,
        identification,
        name,
        lastName,
        state,
        activity,
        depto,
        muni
    ) {
        const params = new URLSearchParams();

        // Siempre enviamos paginación
        params.append("page_size", pageSize);
        params.append("page", page);

        // Parámetros opcionales
        if (cubId) {
            params.append("cub_id", cubId);
        }
        if (identification) {
            params.append("identificacion", identification);
        }
        if (name) {
            params.append("nombre", name);
        }
        if (lastName) {
            params.append("apellido", lastName);
        }
        if (state) {
            params.append("estado", state);
        }
        if (activity) {
            params.append("actividad", activity);
        }
        if (depto) {
            params.append("departamento", depto);
        }
        if (muni) {
            params.append("municipio_id", muni);
        }

        const queryString = params.toString();

        const urlOpt = this.buildUrl(`beneficiarios/buscar/?${queryString}`);
        return authTokenService.fetchWithAuth(urlOpt, { method: "GET" });
    }

    getDetailInformation(cubId) {
        const url = this.buildUrl(`beneficiario/${cubId}/detalle/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

}

export const beneficiaryInformationServices = new BeneficiaryInformationServices();