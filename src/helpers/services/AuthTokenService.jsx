
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
        const isPdf    = contentType.includes('application/pdf');
        const isImage  = contentType.startsWith('image/');

        if (isPdf || isImage) {
            const blob = await response.blob();
            const type = contentType || blob.type;
            return {
                blob,
                status: response.status,
                type
            };
        }

        // Si no es PDF, intenta parsear como JSON
        try {
            return {
                data: await response.json(),
                status: response.status,
                statusText: response.statusText
            };
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return { status: response.status, message: "Invalid JSON response" };
        }
    }
}

export const authTokenService = new AuthTokenService();
