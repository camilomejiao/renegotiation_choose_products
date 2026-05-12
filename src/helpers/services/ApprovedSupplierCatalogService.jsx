import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";

class ApprovedSupplierCatalogService {
    constructor() {
        this.baseUrl = GlobalConnex.url;
    }

    buildUrl(endpoint) {
        return this.baseUrl + endpoint;
    }

    normalizeResponse(response) {
        if (response?.status !== 200) {
            return response;
        }

        const proveedores = response?.data?.data?.proveedores ?? [];

        return {
            ...response,
            data: {
                ...response.data,
                data: {
                    ...(response.data?.data ?? {}),
                    proveedores: Array.isArray(proveedores) ? proveedores : [],
                },
            },
        };
    }

    async getApprovedSuppliers() {
        const response = await authTokenService.fetchWithAuth(
            this.buildUrl("proveedores/aprobados/"),
            { method: "GET" }
        );

        return this.normalizeResponse(response);
    }
}

export const approvedSupplierCatalogService = new ApprovedSupplierCatalogService();
