import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

class PurchaseOrderServices {

    async getAll(page) {
        let url = Global.url + "orden/"+page;
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    }

    async removeOrder(orderId) {
        let url = Global.url + "orden/"+orderId+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "DELETE"
        });
    }

}

export const purchaseOrderServices = new PurchaseOrderServices();
