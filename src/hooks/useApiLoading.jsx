import { useCallback, useState } from "react";

/**
 * Hook personalizado para manejar el estado de loading en llamadas a API
 * Proporciona un wrapper automático que maneja el loading state
 *
 * @param {boolean} initialLoading - Estado inicial del loading
 * @returns {Object} - { loading, executeWithLoading }
 */
export const useApiLoading = (initialLoading = false) => {
  const [loading, setLoading] = useState(initialLoading);

  /**
   * Ejecuta una función asíncrona y maneja automáticamente el estado de loading
   * @param {Function} asyncFunction - Función asíncrona a ejecutar
   * @param {...any} args - Argumentos para la función
   * @returns {Promise} - Resultado de la función asíncrona
   */
  const executeWithLoading = useCallback(async (asyncFunction, ...args) => {
    try {
      setLoading(true);
      const result = await asyncFunction(...args);
      return result;
    } catch (error) {
      throw error; // Re-lanzar el error para que el componente lo maneje
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Ejecuta múltiples funciones asíncronas en paralelo con loading
   * @param {Array<Function>} asyncFunctions - Array de funciones asíncronas
   * @returns {Promise<Array>} - Array con los resultados
   */
  const executeMultipleWithLoading = useCallback(async (asyncFunctions) => {
    try {
      setLoading(true);
      const results = await Promise.all(asyncFunctions.map((fn) => fn()));
      return results;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Establece manualmente el estado de loading
   * @param {boolean} isLoading - Nuevo estado de loading
   */
  const setLoadingState = useCallback((isLoading) => {
    setLoading(isLoading);
  }, []);

  return {
    loading,
    executeWithLoading,
    executeMultipleWithLoading,
    setLoadingState,
  };
};

export default useApiLoading;
