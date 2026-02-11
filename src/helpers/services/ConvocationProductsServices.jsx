import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para interactuar con el m�dulo de Jornadas (WorksDay) en la API.
 *
 *
 */
class ConvocationProductsServices {
    /**
     * Crea una nueva instancia del servicio de Jornadas.
     *  @type {string}
     */
    constructor() {
        this.baseUrl = GlobalConnex.url + "jornadas/";
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
     * Obtiene las **jornadas abiertas**.
     *
     * GET `/jornadas/abiertas/`
     *
     * @returns {Promise<{ data: any, status: number }>} Promesa con `data` (payload de la API) y `status`.
     */
    getConvocations() {
        const url = this.buildUrl(`abiertas/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene los **planes activos** asociados a una jornada.
     *
     * GET `/jornadas/planes/?jornada_id={id}&activo=true`
     *
     * @param {number|string} convocationId - ID de la jornada.
     * @returns {Promise<{ data: any, status: number }>} Promesa con `data` y `status`.
     *
     */
    getPlansByConvocation(convocationId) {
        const url = this.buildUrl(`planes/?jornada_id=${convocationId}&activo=true`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene **todas las jornadas** (completas).
     *
     * GET `/jornadas/completas/`
     *
     * @returns {Promise<{ data: any, status: number }>} Promesa con `data` y `status`.
     */
    getConvocationInformation() {
        const url = this.buildUrl(`completas/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Registra productos para una **jornada/plan**.
     *
     * POST `/jornadas/productos/`
     *
     * @param {object} products - Payload a enviar.
     * @param {number|string} products.jornada_plan - Identificador de la relaci�n jornada–plan (o el que defina tu API).
     * @param {Array<object>} products.productos - Arreglo de productos a registrar (puede enviar en lotes).
     * @returns {Promise<{ data: any, status: number }>} Promesa con `data` y `status`.
     */
    saveProductsByConvocation(products) {
        const url = this.buildUrl(`productos/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }

    /**
     * Obtiene los **productos asociados a un proveedor**.
     *
     * GET `/jornadas/productos/proveedor/?proveedor_id={id}`
     *
     * @param {number|string} supplierId - ID del proveedor.
     * @returns {Promise<{ data: any, status: number }>} Promesa con `data` y `status`.
     */
    getProductsBySupplier(supplierId, jornadaPlanId, onlyMe) {
        const url = this.buildUrl(`productos/proveedor/?proveedor_id=${supplierId}&jornada_plan_id=${jornadaPlanId}&only_me=${onlyMe}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Registra productos para un **proveedor** en modo bulk.
     *
     * POST `/jornadas/productos/proveedor/bulk/`
     *
     * @param {object} products - Payload a enviar.
     * @param {number|string} products.proveedor_id - Identificador del proveedor (seg�n contrato).
     * @param {Array<object>} products.productos - Arreglo de productos a registrar.
     * @returns {Promise<{ data: any, status: number }>} Promesa con `data` y `status`.
     */
    saveProductBySupplier(products) {
        const url = this.buildUrl(`productos/proveedor/bulk/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }

    /**
     *
     */
    getProductByConvocationAndPlan(page = 1, pageSize = 100, ConvocationPlanId) {
        const url = this.buildUrl(`productos-por-plan/?jornada_plan_id=${ConvocationPlanId}&page=${page}&page_size=${100}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     *
     */
    getSupplierByConvocation(convocationId) {
        const url = this.buildUrl(`proveedores-por-jornada/?jornada_id=${convocationId}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     *
     */
    updateValidationEnvironmental(products) {
        const url = this.buildUrl(`productos/ambiental/bulk/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }

    /**
     *
     */
    approveOrDennyEnvironmental(products) {
        const url = this.buildUrl(`productos/aprobacion/bulk/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }

    /**
     *
     */
    convocationServices(page = 1, pageSize = 100, convocationPlanId, supplierId) {
        const url = this.buildUrl(`productos-con-aprobaciones/?jornada_plan_id=${convocationPlanId}&proveedor_id=${supplierId}&page=${page}&page_size=${100}`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     *
     */
    deleteProduct(productId) {
        const url = this.buildUrl(`productos/${productId}/`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

}

export const convocationProductsServices = new ConvocationProductsServices();


