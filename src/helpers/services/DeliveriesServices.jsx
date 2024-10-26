import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

class DeliveriesServices {

    async getSuppliers(cubId) {
        let url = Global.url + "entrega/proveedores/"+cubId+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }

    async searchDeliveriesToUser(cubId) {
        let url = Global.url + "entrega/cub/"+cubId+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }

    async productsToBeDelivered(companyId, cubId) {
        let url = Global.url + "entrega/"+companyId+"/"+cubId+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }

    async saveProducts(companyId, cubId, products) {
        const params = JSON.stringify(products); // Convertir productos a JSON
        const url = Global.url + "entrega/guardar/"+companyId+"/"+cubId+"/";

        return await authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: params,
        });
    }

    async deliveryReport(deliveryId) {
        let url = Global.url + "entrega/"+deliveryId+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }

}

export const deliveriesServices = new DeliveriesServices();