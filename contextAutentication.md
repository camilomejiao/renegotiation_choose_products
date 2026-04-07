# Contexto de autenticación y restricciones

Este documento resume cómo funciona actualmente la autenticación, la navegación privada y la interacción entre:

- cambio obligatorio de contraseña,
- advertencia por vencimiento próximo de contraseña,
- validación de documentación incompleta para proveedores.

## 1. Fuente de verdad de la sesión

La sesión se hidrata desde `AuthProvider`.

Archivo principal:

- `src/context/AuthProvider.jsx`

Responsabilidades:

- resolver la sesión inicial con `resolveSession()`,
- exponer `auth`, `loading`, `logout`, `setAuth`,
- consultar y mantener `supplierCompliance`,
- exponer `refreshSupplierCompliance`,
- limpiar la sesión cuando no hay autenticación válida.

## 2. Cómo se construye `auth`

Los claims del token se transforman en el objeto `auth` en:

- `src/shared/auth/lib/authSession.js`

Campos relevantes:

- `id`
- `user_id`
- `supplier_id`
- `rol_id`
- `must_change_password`
- `password_validity`

Helpers clave:

- `hasForcedPasswordChange(auth)`
- `hasPasswordValidityWarning(auth)`
- `normalizeAuthSession(payload)`

Reglas:

- `hasForcedPasswordChange(auth)` evalúa el claim `must_change_password`.
- `hasPasswordValidityWarning(auth)` retorna `true` cuando `password_validity <= 10`.

## 3. Entrada al sistema: login y conex

Los puntos de entrada revisados son:

- `src/pages/login/model/useLoginPage.js`
- `src/pages/conex/model/useConexPage.js`

Ambos hacen lo mismo después de autenticarse:

1. guardan la sesión con `setAuth(response)`,
2. disparan `window.dispatchEvent(new Event("authUpdated"))`,
3. normalizan el auth con `normalizeAuthSession(response)`,
4. deciden redirección inicial.

Regla de redirección:

- si `must_change_password === true` -> `/admin/edit-user`
- si no -> `/admin`

Regla de advertencia de vencimiento:

- solo envían `state: { showPasswordValidityNotice: true }` si:
  - `must_change_password === false`
  - `password_validity <= 10`

Conclusión:

- la advertencia de vencimiento próximo nunca se programa si el usuario ya está obligado a cambiar contraseña.

## 4. Control global dentro del layout privado

Archivo:

- `src/components/layout/private/PrivateLayout.jsx`

Este layout controla el acceso general a la zona privada.

Orden de validaciones relevantes:

1. si `loading` de auth está activo -> muestra loader.
2. si no existe `auth.id` -> hace logout y redirige a `/login`.
3. si `mustChangePassword === true` y la ruta actual no es:
   - `/admin/edit-user`
   - `/admin/logout`
   entonces redirige a `/admin/edit-user`.

Esto significa que el cambio obligatorio de contraseña tiene prioridad global sobre casi cualquier módulo privado.

## 5. Modal de advertencia por vencimiento de contraseña

También en:

- `src/components/layout/private/PrivateLayout.jsx`

La modal `PasswordValidityNoticeModal` solo se abre cuando:

- `mustChangePassword === false`
- `hasPasswordValidityWarning(auth) === true`
- `location.state?.showPasswordValidityNotice === true`

Esto evita que la modal aparezca por sí sola en cada render. Solo se muestra cuando login o conex la activan explícitamente.

Resumen:

- `must_change_password = true` -> no aparece esta modal.
- `password_validity <= 10` y sin cambio forzado -> sí puede aparecer.

## 6. Validación de documentación del proveedor

La validación de documentos se controla desde dos partes:

### 6.1 Estado global

Archivo:

- `src/context/AuthProvider.jsx`

`AuthProvider` consulta:

- `supplierServices.getSupplierWithoutDocuments(userId)`

y guarda en `supplierCompliance`:

- `loading`
- `isComplete`
- `missing`
- `message`
- `supplierName`
- `lastFetchedAt`

TTL actual:

- 5 minutos (`COMPLIANCE_TTL_MS = 5 * 60 * 1000`)

Política ante error:

- si la validación falla, el sistema marca al proveedor como incompleto y lo bloquea preventivamente.

### 6.2 Guard de navegación

Archivo:

- `src/guards/SupplierDocsGuard.jsx`

El guard redirige al proveedor a completar documentación cuando:

- el usuario tiene rol `SUPPLIER`,
- `supplierCompliance.loading === false`,
- `supplierCompliance.isComplete === false`,
- no está ya en `/admin/edit-suppliers/:id`,
- no está obligado a cambiar contraseña.

Cuando esto pasa:

- muestra `AlertComponent.warning("Información incompleta", ...)`
- redirige a `/admin/edit-suppliers/:id`

Importante:

- el aviso de documentos no es una modal de Ant Design ni una pantalla intermedia; es un `SweetAlert2`.

Archivo del alert:

- `src/helpers/alert/AlertComponent.js`

## 7. Excepción para la pantalla de completar documentos

En el router privado, la ruta:

- `/admin/edit-suppliers/:id`

está fuera del `SupplierDocsGuard`, para permitir que el proveedor llegue a corregir su información.

Archivo:

- `src/router/Routing.jsx`

Sin embargo, esa excepción no salta la regla de contraseña obligatoria.

## 8. Protección adicional en `CreateSuppliers`

Archivo:

- `src/components/layout/private/management_module/suppliers/CreateSuppliers.jsx`

Dentro del formulario de proveedor existe una segunda protección:

- si el usuario autenticado es proveedor y `mustChangePassword === true`,
- entonces redirige a `/admin/edit-user`

Esto evita que un proveedor entre manualmente a `edit-suppliers` cuando todavía debe cambiar la contraseña.

## 9. Integración entre las tres reglas

### Caso A: cambio obligatorio de contraseña + documentos incompletos

Resultado actual:

- no se disparan las dos experiencias al tiempo.

Flujo:

1. `PrivateLayout` detecta `must_change_password = true`.
2. redirige a `/admin/edit-user`.
3. `SupplierDocsGuard` no activa la redirección documental porque su condición excluye `mustChangePassword`.
4. si el usuario intenta entrar directo a `/admin/edit-suppliers/:id`, `CreateSuppliers` lo vuelve a mandar a `/admin/edit-user`.

Conclusión:

- prioridad: `cambio obligatorio de contraseña` sobre `documentación incompleta`.

### Caso B: advertencia de vencimiento próximo + documentos incompletos

Resultado actual:

- sí pueden coexistir en la misma sesión, pero no como una sola experiencia combinada.

Flujo posible:

1. login/conex navega a `/admin` con `showPasswordValidityNotice: true`.
2. `PrivateLayout` abre `PasswordValidityNoticeModal`.
3. además, si el usuario es proveedor con documentación incompleta, `SupplierDocsGuard` puede lanzar el `warning` y redirigir a `/admin/edit-suppliers/:id`.

Conclusión:

- aquí no existe exclusión mutua.
- por eso esta advertencia sí puede aparecer en el mismo ingreso que la alerta de documentos.

### Caso C: cambio obligatorio de contraseña + advertencia de vencimiento próximo

Resultado actual:

- no conviven.

Razón:

- la advertencia de vencimiento solo se activa si `must_change_password === false`.

## 10. Qué pasa después de cambiar la contraseña

Archivo:

- `src/widgets/user-form/model/useUserFormScreen.js`

Cuando el usuario actualiza su contraseña desde `/admin/edit-user` y el cambio era obligatorio:

1. se llama `markPasswordChangeComplete()` para limpiar el flag en memoria,
2. se muestra un mensaje de éxito,
3. se ejecuta `logout()`,
4. se redirige a `/login`.

En el siguiente ingreso:

- si el proveedor sigue con documentos incompletos, ahora sí aplica `SupplierDocsGuard` y será redirigido a `/admin/edit-suppliers/:id`.

## 11. Resumen ejecutivo

Prioridad actual de reglas:

1. autenticación válida
2. cambio obligatorio de contraseña
3. validación de documentación incompleta
4. advertencia por vencimiento próximo de contraseña

Lectura práctica:

- si hay cambio obligatorio de contraseña, esa regla gana primero.
- si no hay cambio obligatorio y faltan 10 días o menos, puede salir la modal de advertencia.
- si además el proveedor tiene documentación incompleta, puede salir la alerta de documentos y redirección.

## 12. Estado actual de coexistencia de modales/avisos

- `cambio obligatorio` + `documentos incompletos`: no se muestran ambos.
- `cambio obligatorio` + `advertencia de vencimiento`: no se muestran ambos.
- `advertencia de vencimiento` + `documentos incompletos`: sí pueden aparecer ambos durante el mismo ingreso.

## 13. Archivos clave

- `src/context/AuthProvider.jsx`
- `src/shared/auth/lib/authSession.js`
- `src/pages/login/model/useLoginPage.js`
- `src/pages/conex/model/useConexPage.js`
- `src/components/layout/private/PrivateLayout.jsx`
- `src/guards/SupplierDocsGuard.jsx`
- `src/components/layout/private/management_module/suppliers/CreateSuppliers.jsx`
- `src/router/Routing.jsx`
- `src/helpers/alert/AlertComponent.js`
