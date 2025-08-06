
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

        const contentType = response.headers.get('content-type');

        // Si la respuesta es PDF, devuelve un Blob
        if (contentType && contentType.includes('application/pdf')) {
            return { blob: await response.blob(), status: response.status };
        }

        // Si no es PDF, intenta parsear como JSON
        try {
            return { data: await response.json(), status: response.status,  statusText: response.statusText };
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return { status: response.status, message: "Invalid JSON response" };
        }
    }
}

export const authTokenService = new AuthTokenService();
