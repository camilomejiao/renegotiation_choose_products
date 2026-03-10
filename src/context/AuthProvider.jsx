import { createContext, useState, useEffect, useCallback } from "react";
import { supplierServices } from "../helpers/services/SupplierServices";
import { RolesEnum } from "../helpers/GlobalEnum";
import {
    clearAuthSession,
} from "../shared/auth/lib/authSession";
import { resolveSession } from "../shared/auth/lib/resolveSession";

const AuthContext = createContext();

/**
 * TTL para evitar consumos excesivos:
 * - Si ya validamos documentos hace < 5 min, no volvemos a consultar.
 * - En navegación interna no pega a BD cada vez.
 */
const COMPLIANCE_TTL_MS = 5 * 60 * 1000; // 5 min

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [loading, setLoading] = useState(true);

    // -----------------------------
    // Estado de cumplimiento de docs del proveedor
    // -----------------------------
    const [supplierCompliance, setSupplierCompliance] = useState({
        loading: false,
        isComplete: true,
        missing: [],
        message: "",
        supplierName: "",
        lastFetchedAt: 0,
    });

    /** Limpia storage y reinicia estados. */
    const logout = () => {
        clearAuthSession();
        setAuth({});
        setSupplierCompliance({
            loading: false,
            isComplete: true,
            missing: [],
            message: "",
            supplierName: "",
            lastFetchedAt: 0,
        });
    };

    /**
     * Hidrata la sesión desde la estrategia activa de resolución.
     * Hoy usa claims del token; mañana puede usar `/me` sin cambiar consumidores.
     */
    const authUser = async () => {
        try {
            const nextAuth = await resolveSession();

            if (!nextAuth) {
                logout();
                return;
            }

            setAuth(nextAuth);
        } catch (error) {
            console.error("Error parsing user data:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ fetchSupplierCompliance:
     * - Se define con useCallback para mantener la referencia estable.
     * - Esto evita loops en useEffect y mantiene dependencias correctas.
     * - ÚNICA responsabilidad: consultar API y mapear resultado al estado.
     */
    const fetchSupplierCompliance = useCallback(async (userId) => {
        setSupplierCompliance((s) => ({ ...s, loading: true }));

        try {
            const { data } = await supplierServices.getSupplierWithoutDocuments(userId);

            const missing = data?.data?.campos_faltantes ?? [];
            const isComplete = Boolean(data?.data?.informacion_completa);
            const message = data?.data?.mensaje ?? "";
            const supplierName = data?.data?.proveedor_nombre ?? "";

            setSupplierCompliance({
                loading: false,
                isComplete,
                missing,
                message,
                supplierName,
                lastFetchedAt: Date.now(),
            });
        } catch (e) {
            // Política de negocio recomendada:
            // Si no puedo validar, bloqueo (para no permitir acciones sin cumplimiento).
            setSupplierCompliance({
                loading: false,
                isComplete: false,
                missing: ["NO_SE_PUDO_VALIDAR_DOCUMENTOS"],
                message: "No se pudo validar la documentación. Por favor intenta nuevamente.",
                supplierName: "",
                lastFetchedAt: Date.now(),
            });
        }
    }, []);

    /**
     * refreshSupplierCompliance:
     * - Se expone por Context para que un módulo (ej: CreateSuppliers) lo llame después de subir/guardar documentos.
     * - useCallback para referencia estable (opcional pero recomendado).
     */
    const refreshSupplierCompliance = useCallback(() => {
        if (auth?.id && auth?.rol_id === RolesEnum.SUPPLIER) {
            fetchSupplierCompliance(auth.id);
        }
    }, [auth?.id, auth?.rol_id, fetchSupplierCompliance]);

    /**
     * Auto-validación con TTL:
     * - Solo corre para proveedor.
     * - Solo consulta si el cache expiró.
     */
    useEffect(() => {
        const isSupplier = auth?.rol_id === RolesEnum.SUPPLIER;
        if (!auth?.id || !isSupplier) return;

        const isFresh =
            Date.now() - supplierCompliance.lastFetchedAt < COMPLIANCE_TTL_MS;

        if (isFresh) return;

        fetchSupplierCompliance(auth.id);
    }, [auth?.id, auth?.rol_id, supplierCompliance.lastFetchedAt, fetchSupplierCompliance]);

    /**
     * Evento que ya venías usando: "authUpdated".
     * - Rehidrata auth
     * - Invalida compliance para recalcular al nuevo usuario
     */
    const handleAuthUpdate = () => {
        authUser();
        setSupplierCompliance((s) => ({ ...s, lastFetchedAt: 0 }));
    };

    useEffect(() => {
        authUser();
        window.addEventListener("authUpdated", handleAuthUpdate);
        return () => window.removeEventListener("authUpdated", handleAuthUpdate);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                loading,
                logout,
                supplierCompliance,
                refreshSupplierCompliance,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
