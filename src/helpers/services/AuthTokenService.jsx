
class AuthTokenService {
    // Función que maneja el fetch con autenticación
    async fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('token');

        if (!token) {
            localStorage.clear();
            window.location.href = '/login';
            return {status: 401, message: "No token available" };
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        // Detectar si el body es FormData o si el método es GET
        if (options.method !== 'GET' && !(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json'; // Solo agregar Content-Type si no es FormData
        }

        const response = await fetch(url, { ...options, headers });

        if (response.status === 401) {
            // Limpiar el token y redirigir al login si hay un error de autenticación
            localStorage.clear();
            window.location.href = '/login';
            return {status: 401, message: "No token available" };
        }

        const contentType = (response.headers.get('content-type') || '').toLowerCase();
        const contentLength = response.headers.get('content-length');
        const hasBody =
            !(response.status === 204 || response.status === 205 || response.status === 304) && contentLength !== '0';

        if (!hasBody) {
            return { status: response.status };
        }

        // Si es JSON -> parsea JSON; si NO, devuelve blob (excel, pdf, zip, imagen, etc.)
        if (contentType.includes('application/json')) {
            try {
                return {
                    data: await response.json(),
                    status: response.status,
                    statusText: response.statusText
                };
            } catch (e) {
                console.error("Error parsing JSON:", e);
                return { status: response.status, message: 'Invalid JSON response' };
            }
        }

        // Extrae filename del Content-Disposition si viene
        const disposition = response.headers.get('content-disposition') || '';
        let filename = 'archivo';
        const match1 = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(disposition);
        const match2 = /filename="?([^"]+)"?/i.exec(disposition);
        if (match1) {
            filename = decodeURIComponent(match1[1]);
        } else if (match2) {
            filename = match2[1];
        } else {
            // fallback por tipo
            if (contentType.includes('spreadsheetml')) filename += '.xlsx';
            else if (contentType.includes('ms-excel')) filename += '.xls';
            else if (contentType.includes('pdf')) filename += '.pdf';
        }

        const blob = await response.blob();
        return {
            blob,
            status: response.status,
            type: contentType,
            filename
        };
    }
}

export const authTokenService = new AuthTokenService();
