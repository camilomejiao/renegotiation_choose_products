
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
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

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

        return { data, status, statusText }; // Retorna los datos, estado y texto de estado
    }
}

export const authTokenService = new AuthTokenService();
