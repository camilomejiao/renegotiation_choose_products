
class AuthTokenService {
    // Función que maneja el fetch con autenticación
    async fetchWithAuth(url, options = {}) {
        const token = localStorage.getItem('token');

        if (!token) {
            localStorage.clear();
            window.location.href = '/login';
            return;
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
            return;
        }

        // Obtén el estado y el texto del estado
        const status = response.status;
        const statusText = response.statusText;

        // Intenta parsear la respuesta a JSON
        let data;
        try {
            data = await response.json();
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }

        return { data, status, statusText };
    }
}

export const authTokenService = new AuthTokenService();
