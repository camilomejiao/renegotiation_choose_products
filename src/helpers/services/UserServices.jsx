import { GlobalConnex } from "../GlobalConnex.jsx";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para la gestión de usuarios
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
     * Buscar un usuario por término de búsqueda.
     * Puede ser nombre, cédula, número CUB u otro dato.
     *
     * @param {string} data - Término de búsqueda.
     * @returns {Promise<object>} - Promesa con la respuesta del servidor.
     */
    searchUser(data) {
        const url = this.buildUrl(`cub/buscar/${data}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener información detallada de un usuario por ID de CUB.
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
    getUsers(page, pageSize, search = "") {
        const params = new URLSearchParams();
        params.set("page", page);
        params.set("page_size", pageSize);
        if (search) {
            params.set("search", search);
        }
        const url = this.buildUrl(`usuarios/?${params.toString()}`);
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

