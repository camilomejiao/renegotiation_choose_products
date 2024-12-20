import { Global } from "../Global";
import { authTokenService } from "./AuthTokenService";


class SupplierServices {

    getSuppliersAll() {
        const url = `${Global.url}usuario/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /*
    * Obtener información de un proveedor
    */
    getInfoSupplier(supplierId){
        const url = `${Global.url}usuario/${supplierId}/`;
        return authTokenService.fetchWithAuth(url, { method: "GET" });
    }

    /**
     * Obtiene el ID del proveedor almacenado en localStorage.
     * @returns {string|null} - ID del proveedor.
     */
    getSupplierId() {
        return localStorage.getItem("id");
    }

    saveLocationToLocalStorage(locationKey, locationId, locationName) {
        localStorage.setItem("location_key", locationKey);
        localStorage.setItem("location_id", locationId);
        localStorage.setItem("location_name", locationName);
    }

    getLocation() {
        return {
            locationKey: localStorage.getItem("location_key"),
            location_id: localStorage.getItem("location_id"),
            locationName: localStorage.getItem("location_name")
        };
    }
}

export const supplierServices = new SupplierServices();