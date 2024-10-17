import { Global } from "../Global.jsx";
import { authTokenService } from "./AuthTokenService";

class ProductsServices {

    //search product by name
    async searchProduct(searchData) {
        let url = Global.url + "producto/buscar/"+searchData+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    };

    async getProductId(id) {
        let url = Global.url + "producto/"+id+"/";
        return await authTokenService.fetchWithAuth(url, {
            method: "GET"
        });
    };

    async saveProducts(products, cubId) {
        const params = JSON.stringify(products); // Convertir productos a JSON
        const url = Global.url + "orden/";

        return await authTokenService.fetchWithAuth(url, {
            method: "POST",
            body: params,
        });
    };

}

export const productsServices = new ProductsServices();