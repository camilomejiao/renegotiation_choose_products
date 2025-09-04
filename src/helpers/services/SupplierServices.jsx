import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para la gestión de proveedores (usuarios tipo proveedor).
 */
class SupplierServices {

    // =============================
    // CONSULTAS AL BACKEND
    // =============================

    /**
     * Obtener todos los proveedores registrados.
     * @returns {Promise<Response>} - Promesa con la lista de proveedores.
     */
    getSuppliersAll() {
        const url = `${GlobalConnex.url}usuario/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener la información detallada de un proveedor por su ID.
     * @param {number|string} supplierId - ID del proveedor.
     * @returns {Promise<Response>} - Promesa con los datos del proveedor.
     */
    getInfoSupplier(supplierId) {
        const url = `${GlobalConnex.url}usuario/${supplierId}/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // =============================
    // GESTIÓN DE LOCALSTORAGE
    // =============================

    /**
     * Obtener el ID del proveedor almacenado en localStorage.
     * @returns {string|null} - ID del proveedor.
     */
    getSupplierId() {
        return localStorage.getItem("id");
    }
}

export const supplierServices = new SupplierServices();
