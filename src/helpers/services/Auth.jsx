import { GlobalConnex } from "../GlobalConnex.jsx";
import { decodeAccessToken, saveAuthTokens } from "../../shared/auth/lib/authSession";

class AuthService {
    constructor() {
        this.baseUrl = GlobalConnex.url;
    }

    /**
     * Genera la URL completa para los endpoints de entrega.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    /**
     * Realiza la solicitud de inicio de sesión y guarda los tokens en el almacenamiento local.
     * @param {object} data - Datos de inicio de sesión (usuario y contraseña).
     * @returns {Promise<object>} - Respuesta del servidor.
     */
    async login(data) {
        const url = this.buildUrl(`acceder/`);
        const headers = {
            "Content-Type": "application/json"
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers,
                mode: "cors",
            });

            const resp = await response.json();

            // Validar si los tokens están presentes
            if (resp.access && resp.refresh) {
                const decodeToken = await this.decodeToken(resp.access);
                await this.saveToLocalStorage(resp, decodeToken);
            } else {
                console.error("Error: Los tokens no están presentes en la respuesta");
            }
            return resp;
        } catch (error) {
            console.error("Error en el login:", error);
            throw error;
        }
    }

    async conex(data) {
        const url = this.buildUrl(`validar/`);
        const headers = {
            "Content-Type": "application/json"
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers,
                mode: "cors",
            });

            const resp = await response.json();

            if (resp.access && resp.refresh) {
                const decodeToken = await this.decodeToken(resp.access);
                await this.saveToLocalStorage(resp, decodeToken);
            } else {
                console.error("Error: Los tokens no están presentes en la respuesta");
            }
            return resp;
        } catch (error) {
            console.error("Error en el conex:", error);
        }
    }

    /**
     * Decodifica el token JWT.
     * @param {string} token - Token JWT.
     * @returns {object} - Datos decodificados del token.
     */
    decodeToken(token) {
        return decodeAccessToken(token);
    }

    /**
     * Guarda los tokens y datos del usuario en el almacenamiento local.
     * @param {object} tokens - Tokens de acceso y actualización.
     * @param {object} decodeToken - Datos decodificados del token.
     */
    saveToLocalStorage(tokens, decodeToken) {
        saveAuthTokens({
            accessToken: tokens?.access,
            refreshToken: tokens?.refresh,
        });
    }
}

export const authService = new AuthService();
