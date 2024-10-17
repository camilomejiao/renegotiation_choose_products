
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

        return response.json();
    }
}

export const authTokenService = new AuthTokenService();
