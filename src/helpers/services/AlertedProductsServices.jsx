import { GlobalConnex } from "../GlobalConnex";
import { authTokenService } from "./AuthTokenService";

class AlertedProductsServices {
  constructor() {
    this.baseUrl = `${GlobalConnex.url}alertas`;
  }

  buildUrl(endpoint) {
    return `${this.baseUrl}/${endpoint}`;
  }

  getProducts(queryString = "") {
    return authTokenService.fetchWithAuth(this.buildUrl(`productos${queryString}`), {
      method: "GET",
    });
  }

  updateProductsManagementType(payload) {
    return authTokenService.fetchWithAuth(this.buildUrl("productos/gestion/"), {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  createProductRequest(formData) {
    return authTokenService.fetchWithAuth(this.buildUrl("productos/solicitud/"), {
      method: "POST",
      body: formData,
    });
  }

  getJourneyDocuments(journeyId) {
    const params = new URLSearchParams({
      jornada_id: String(journeyId),
    });

    return authTokenService.fetchWithAuth(
      this.buildUrl(`jornada/documentos?${params.toString()}`),
      { method: "GET" }
    );
  }

  saveJourneyDocuments(formData) {
    return authTokenService.fetchWithAuth(this.buildUrl("jornada/documentos/"), {
      method: "POST",
      body: formData,
    });
  }

  getSolicitudes(queryString = "") {
    const normalizedQuery = queryString
      ? `/${String(queryString).replace(/^\//, "").replace(/^\?/, "?")}`
      : "/";

    return authTokenService.fetchWithAuth(this.buildUrl(`productos/solicitud${normalizedQuery}`), {
      method: "GET",
    });
  }
}

export const alertedProductsServices = new AlertedProductsServices();
