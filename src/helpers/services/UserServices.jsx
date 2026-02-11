import { GlobalConnex } from "../GlobalConnex.jsx";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para la gesti�n de usuarios
 */
class UserServices {
    constructor() {
        this.baseUrl = GlobalConnex.url;
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
     * Buscar un usuario por t�rmino de b�squeda.
     * Puede ser nombre, c�dula, n�mero CUB u otro dato.
     *
     * @param {string} data - T�rmino de b�squeda.
     * @returns {Promise<object>} - Promesa con la respuesta del servidor.
     */
    searchUser(data) {
        const url = this.buildUrl(`cub/buscar/${data}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener informaci�n detallada de un usuario por ID de CUB.
     *
     * @param {number|string} cubId - ID del usuario (CUB).
     * @returns {Promise<object>} - Promesa con los datos del usuario.
     */
    userInformation(cubId) {
        const url = this.buildUrl(`cub/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }


    /**
     *
     */
    getRoles() {
        const url = this.buildUrl(`usuarios/roles/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     *
     */
    getUsers(page, pageSize) {
        const url = this.buildUrl(`usuarios/?page=${page}&page_size=${pageSize}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     *
     */
    getUserById(id) {
        const url = this.buildUrl(`usuarios/${id}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     *
     */
    createUser(payload) {
        const url = this.buildUrl(`usuarios/crear/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

    /**
     *
     */
    updateUser(id, payload) {
        const url = this.buildUrl(`usuarios/${id}/actualizar/`);
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: JSON.stringify(payload),
        });
    }

    /**
     *
     */
    updateStatus(id, payload) {
        const url = this.buildUrl(`usuarios/${id}/actualizar-parcial/`);
        return authTokenService.fetchWithAuth(url, {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    }

    /**
     *
     */
    updatePassword(id, payload) {
        const url = this.buildUrl(`usuarios/${id}/cambiar-password/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }

}

export const userServices = new UserServices();


