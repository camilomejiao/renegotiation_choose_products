import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para la gestión de usuarios asociados a CUB.
 */
class UserService {
    constructor() {
        this.baseUrl = Global.url + "cub/";
    }

    /**
     * Genera la URL completa para los endpoints del servicio.
     * @param {string} endpoint - Endpoint relativo al recurso.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    // =============================
    // MÉTODOS DE CONSULTA
    // =============================

    /**
     * Buscar un usuario por término de búsqueda.
     * Puede ser nombre, cédula, número CUB u otro dato.
     *
     * @param {string} data - Término de búsqueda.
     * @returns {Promise<object>} - Promesa con la respuesta del servidor.
     */
    searchUser(data) {
        const url = this.buildUrl(`buscar/${data}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener información detallada de un usuario por ID de CUB.
     *
     * @param {number|string} cubId - ID del usuario (CUB).
     * @returns {Promise<object>} - Promesa con los datos del usuario.
     */
    userInformation(cubId) {
        const url = this.buildUrl(`${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

// Exportamos una instancia única del servicio
export const userService = new UserService();
