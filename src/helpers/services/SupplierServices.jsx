import { Global } from "../Global";
import { authTokenService } from "./AuthTokenService";


class SupplierServices {

    /*
    * Obtener información de un proveedor
    */
    getInfoSupplier(){
        const url = `${Global.url}usuario/info/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }
}

export const supplierServices = new SupplierServices();