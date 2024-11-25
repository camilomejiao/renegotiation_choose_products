import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

class UserService {
    constructor() {
        this.baseUrl = Global.url + "cub/";
    }

    /**
     * Genera la URL completa para los endpoints.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    /**
     * Buscar un usuario por dato (puede ser ID, nombre, etc.)
     * @param {string} data - Dato de búsqueda (ID, nombre, etc.)
     * @returns {Promise<object>} - Respuesta del servicio
     */
    searchUser(data) {
        const url = this.buildUrl(`buscar/${data}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener información de un usuario por cubId.
     * @param {number} cubId - ID del usuario
     * @returns {Promise<object>} - Respuesta del servicio
     */
    userInformation(cubId) {
        const url = this.buildUrl(`${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

// Exportamos una instancia de la clase
export const userService = new UserService();
