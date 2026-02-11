import { Navigate, Outlet, useLocation, useOutletContext } from "react-router-dom";
import { useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { RolesEnum } from "../helpers/GlobalEnum";
import AlertComponent from "../helpers/alert/AlertComponent";

/**
 * SupplierDocsGuard
 * -----------------------------------------------------------------------------
 * OBJETIVO
 * - Bloquear el acceso a m�dulos privados cuando el usuario autenticado es PROVEEDOR
 *   y NO tiene su informaci�n/documentos completos.
 * - Si falta informaci�n -> redirigir al formulario de "Completar documentos" (edit-suppliers/:id).
 *
 * POR QUÉ EXISTE (regla de negocio)
 * - Si un proveedor no tiene documentaci�n completa, no debe poder continuar con
 *   acciones del sistema (pagos, cuentas de cobro, etc.) hasta corregirlo.
 *
 * PRINCIPIO DE DISEÑO
 * - El AuthProvider debe manejar datos globales (estado, fetch, TTL).
 * - El Guard debe manejar la navegaci�n y UX de bloqueo (redirect + alert).
 *   → Por eso el alert se muestra aqu�, no en AuthProvider.
 *
 * DEPENDENCIAS
 *  - useAuth(): expone { auth, supplierCompliance }.
 *  - auth.rol_id determina si aplica el guard.
 *  - supplierCompliance controla si redirigir o dejar pasar.
 */

/**
 * --------------------------------------------------------------------------
 * Helper mensaje que ver� el usuario.
 */
const buildMissingDocsMessage = (supplierCompliance) => {
    if (!supplierCompliance) {
        return "Faltan documentos por cargar.";
    }

    // Backend ya manda un mensaje listo para mostrar
    if (supplierCompliance.message) {
        return supplierCompliance.message;
    }

    // Fallback: armamos el texto con la lista de campos faltantes
    if (supplierCompliance.missing?.length) {
        return `Falta por diligenciar: ${supplierCompliance.missing.join(", ")}.`;
    }

    return "Faltan documentos por cargar.";
};

export const SupplierDocsGuard = () => {
    // Router context
    const location = useLocation();

    /**
     * Outlet context (reenviado)
     * ---------------------------------------------------------------------------
     * Esto es CR�TICO muchos componentes hacen:
     *   const { userAuth } = useOutletContext();
     * Si no reenviamos outletCtx, ese destructuring revienta (undefined).
     */
    const outletCtx = useOutletContext();

    // Auth context
    const { auth, supplierCompliance } = useAuth();

    /**
     * alertedRef
     * ---------------------------------------------------------------------------
     * Evita que el Alert se dispare en cada render.
     * React puede renderizar varias veces (estricto, cambios de estado, etc).
     * Este ref garantiza que el mensaje salga SOLO 1 vez por evento de redirecci�n.
     */
    const alertedRef = useRef(false);

    // -------------------------
    // FLAGS (solo l�gica)
    // -------------------------

    /**
     * isSupplier
     * - El guard solo aplica a proveedores
     */
    const isSupplier = auth?.rol_id === RolesEnum.SUPPLIER;

    /**
     * isLoading
     * - Mientras el provider valida compliance, no queremos redirigir ni alertar.
     */
    const isLoading = supplierCompliance?.loading === true;

    /**
     * docsPath
     * - Ruta de “pantalla de completar documentos”.
     * - Si en el futuro cambias el m�dulo donde se completan docs, cambia esto.
     */
    const docsPath = auth?.id ? `/admin/edit-suppliers/${auth.id}` : "/admin";

    /**
     * alreadyOnDocs
     * - Protege contra loop infinito:
     *   si ya est� en la pantalla de docs, no redirigir a la misma pantalla.
     */
    const alreadyOnDocs = location.pathname.startsWith("/admin/edit-suppliers/");

    /**
     * mustRedirect
     * - Regla final de bloqueo:
     *   - es proveedor
     *   - no est� cargando
     *   - compliance indica incompleto
     *   - no est� ya en pantalla de docs
     */
    const mustRedirect =
        isSupplier &&
        !isLoading &&
        supplierCompliance?.isComplete === false &&
        !alreadyOnDocs;

    // -------------------------
    // EFECTO
    // -------------------------
    useEffect(() => {
        if (!mustRedirect) {
            alertedRef.current = false;
            return;
        }

        // Si ya avisamos una vez, no repetir
        if (alertedRef.current) return;

        alertedRef.current = true;

        AlertComponent.warning("Informaci�n incompleta", buildMissingDocsMessage(supplierCompliance));
    }, [mustRedirect, supplierCompliance]);


    /**
     * Si no es proveedor:
     * - no aplicamos regla de documentos
     * - dejamos pasar a las rutas hijas reenviando outletCtx
     */
    if (!isSupplier) {
        return <Outlet context={outletCtx} />;
    }

    /**
     * Si est� cargando validaci�n:
     * - mostramos un loader
     * - no alertamos
     * - no redirigimos
     */
    if (isLoading) {
        return <div>Cargando...</div>;
    }

    /**
     * Si ya est� en pantalla de documentos:
     * - dejamos pasar (evita loop)
     */
    if (alreadyOnDocs) {
        return <Outlet context={outletCtx} />;
    }

    /**
     * Si falta info:
     * - redirigir al formulario de completar docs
     * - state.from guarda la ruta previa (por si luego quieres “volver”)
     */
    if (mustRedirect) {
        return (
            <Navigate
                to={docsPath}
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    /**
     * Si todo est� ok:
     * - continuar normal
     */
    return <Outlet context={outletCtx} />;
};


