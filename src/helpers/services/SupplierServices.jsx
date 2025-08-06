import { Global } from "../Global";
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
        const url = `${Global.url}usuario/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtener la información detallada de un proveedor por su ID.
     * @param {number|string} supplierId - ID del proveedor.
     * @returns {Promise<Response>} - Promesa con los datos del proveedor.
     */
    getInfoSupplier(supplierId) {
        const url = `${Global.url}usuario/${supplierId}/`;
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

    /**
     * Guardar información de ubicación en localStorage.
     * @param {string} locationKey - Clave de ubicación.
     * @param {string|number} locationId - ID de la ubicación.
     * @param {string} locationName - Nombre de la ubicación.
     */
    saveLocationToLocalStorage(locationKey, locationId, locationName) {
        localStorage.setItem("location_key", locationKey);
        localStorage.setItem("location_id", locationId);
        localStorage.setItem("location_name", locationName);
    }

    /**
     * Obtener la información de ubicación desde localStorage.
     * @returns {{locationKey: string|null, location_id: string|null, locationName: string|null}} - Objeto con los datos de ubicación.
     */
    getLocation() {
        return {
            locationKey: localStorage.getItem("location_key"),
            location_id: localStorage.getItem("location_id"),
            locationName: localStorage.getItem("location_name"),
        };
    }
}

export const supplierServices = new SupplierServices();
