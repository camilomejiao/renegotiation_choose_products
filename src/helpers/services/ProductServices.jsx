import { Global } from "../Global";
import { authTokenService } from "./AuthTokenService";

/**
 * Servicio para gestionar productos, unidades, categorías y operaciones CRUD relacionadas.
 */
class ProductServices {
    constructor() {
        this.baseUrl = Global.url + "producto/";
    }

    /**
     * Construye la URL completa para un endpoint de producto.
     * @param {string} endpoint - Ruta relativa del endpoint.
     * @returns {string} URL completa del endpoint.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    // =============================
    // Nuevo Flujo
    // =============================

    // =============================
    // LISTAS AUXILIARES
    // =============================

    /**
     * Obtiene la lista de unidades disponibles.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    getUnitList() {
        const url = `${Global.url}lista/unidades/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene la lista de categorías disponibles.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    getCategoryList() {
        const url = `${Global.url}lista/categorias/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // =============================
    // CONSULTAS DE PRODUCTOS
    // =============================

    /**
     * Obtiene el listado de productos, filtrando opcionalmente por proveedor.
     * @param {string} [supplierId=""] - ID del proveedor (opcional).
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    getProductList(supplierId = "") {
        let url = this.baseUrl;
        if (supplierId) {
            url = `${url}?proveedor=${supplierId}`;
        }
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene categorías ambientales (ID 1).
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    getCategoriesENVIRONMENTAL() {
        const url = this.buildUrl(`categorias/1/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // =============================
    // CRUD DE PRODUCTOS
    // =============================

    /**
     * Crea múltiples productos de forma masiva.
     * @param {object[]} products - Array de productos a crear.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    save(products) {
        const url = this.buildUrl(`bulk/crear/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }

    /**
     * Elimina un producto por su ID.
     * @param {number|string} productId - ID del producto a eliminar.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    productRemove(productId) {
        const url = this.buildUrl(`${productId}`);
        return authTokenService.fetchWithAuth(url, { method: "DELETE" });
    }

    /**
     * Aprueba múltiples productos.
     * @param {object} data - Datos con los productos a aprobar.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    productApprove(data) {
        const url = this.buildUrl(`aprobar/multiple/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    /**
     * Modifica productos de forma masiva para un proveedor específico.
     * @param {object[]} products - Productos a modificar.
     * @param {string} supplierId - ID del proveedor.
     * @returns {Promise<Response>} Promesa con la respuesta del servidor.
     */
    edit(products, supplierId) {
        const url = this.buildUrl(`bulk/modificar/?proveedor=${supplierId}`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }

}

export const productServices = new ProductServices();
