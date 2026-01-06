import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para la gestión de proveedores (usuarios tipo proveedor).
 */
class SupplierServices {

    /**
     * Crea una nueva instancia del servicio de Jornadas.
     *  @type {string}
     */
    constructor() {
        this.baseUrl = GlobalConnex.url + "proveedores/";
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
    // NUEVO PROVEEDORES
    // =============================

    getSuppliers() {
        const url = this.buildUrl(`aprobados/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    getSuppliersByPage(pageSize = 100, page = 1, search) {
        let url = `?page_size=${pageSize}&page=${page}`;
        if(search) {
            url = `?search=${search}&page_size=${pageSize}&page=${page}`;
        }
        const urlOpt = this.buildUrl(url);
        return authTokenService.fetchWithAuth(urlOpt, { method: "GET" });
    }

    deleteSupplier(supplierId) {
        const url = this.buildUrl(`${supplierId}/eliminar`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

    createSupplier(payload) {
        const url = this.buildUrl(`crear/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(payload),
        });
    }


    updateSupplier(id, formData) {
        const url = this.buildUrl(`${id}/actualizar/`);
        return authTokenService.fetchWithAuth(url, {
            method: "PUT",
            body: formData,
        });
    }

    getSupplierById(supplierId) {
        const url = this.buildUrl(`${supplierId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }


    validateOrDeleteBankAccount(supplierId, accountId) {
        const url = this.buildUrl(`${supplierId}/cuentas-bancarias/${accountId}`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

    getBankAccountsBySupplierId(supplierId) {
        const url = this.buildUrl(`${supplierId}/cuentas-bancarias/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    //
    getAcountsType() {
        const url = GlobalConnex.url+ `lista/parametros/?tipo_parametro_id=29`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    //
    getBanks() {
        const url = GlobalConnex.url + `lista/bancos/`;
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

    getIdActiveConvocationOfSupplier() {
        return localStorage.getItem("jornada_id");
    }
}

export const supplierServices = new SupplierServices();
