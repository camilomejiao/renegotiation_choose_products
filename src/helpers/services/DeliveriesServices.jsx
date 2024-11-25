import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

class DeliveriesServices {

    constructor() {
        this.baseUrl = Global.url + "entrega/";
    }

    /**
     * Genera la URL completa para los endpoints de entrega.
     * @param {string} endpoint - Endpoint relativo.
     * @returns {string} - URL completa.
     */
    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    // Obtener proveedores
    getSuppliers(cubId) {
        const url = this.buildUrl(`proveedores/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // Buscar entregas realizadas al usuario
    searchDeliveriesToUser(cubId) {
        const url = this.buildUrl(`cub/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // Productos a entregar
    productsToBeDelivered(companyId, cubId) {
        const url = this.buildUrl(`${companyId}/${cubId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // Guardar productos
    saveProducts(companyId, cubId, products) {
        const url = this.buildUrl(`guardar/${companyId}/${cubId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(products),
        });
    }

    // Obtener productos de una entrega
    getProductsFromADelivery(deliveryId) {
        const url = this.buildUrl(`${deliveryId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // Editar entrega
    editDelivery(itemId, product) {
        const url = this.buildUrl(`item/${itemId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: JSON.stringify(product),
        });
    }

    // Generar reporte de entrega
    deliveryReport(deliveryId) {
        const url = this.buildUrl(`${deliveryId}/`);
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    // Subir evidencia de entregas
    evidenceOfDeliveries(deliveryId, formData) {
        const url = this.buildUrl(`archivo/${deliveryId}/`);
        return authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: formData,
        });
    }

}

export const deliveriesServices = new DeliveriesServices();