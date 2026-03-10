# AUTH.md

## Objetivo

Definir reglas obligatorias para autenticación y manejo de sesión en frontend.

Estas reglas existen para evitar que la app confíe en datos manipulables del cliente y para dejar preparada una migración futura a un endpoint `/me` sin reestructurar consumidores.

---

## Fuente de verdad

1. La identidad del usuario debe derivarse de una única fuente confiable.

2. Mientras no exista `/me`, la fuente de verdad es el `access token` decodificado en memoria.

3. Cuando exista `/me`, solo debe cambiar la implementación de resolución de sesión. Los consumidores no deben cambiar.

---

## Persistencia permitida

Solo se permite persistir en `localStorage`:

- `token`
- `refresh`

No se debe persistir:

- `user`
- `id`
- `rol_id`
- `jornada_id`
- cualquier copia derivada de claims del token

---

## Construcción de auth

1. `AuthProvider` no debe leer identidad desde `localStorage.user` ni claves derivadas.

2. `AuthProvider` debe hidratar `auth` solo a través de una función de estrategia, por ejemplo `resolveSession()`.

3. La implementación actual de `resolveSession()` debe resolver sesión desde claims del token.

4. `auth` debe vivir en memoria y ser consumido por contexto.

---

## Uso en la app

1. La UI, los guards, los menús, las rutas y la lógica de negocio deben consumir `useAuth()`.

2. Ningún feature, widget, page o servicio de negocio debe leer identidad desde `localStorage`.

3. Si un módulo necesita `rol_id`, `seg_usuario`, `supplier_id` o `jornada_id`, debe obtenerlos desde `auth` o desde una capa shared de sesión.

---

## Servicios de autenticación

1. La lectura y escritura de tokens debe estar encapsulada en una capa shared de auth.

2. La decodificación del token debe estar centralizada.

3. No deben existir múltiples implementaciones dispersas de `jwtDecode`.

4. La limpieza de sesión debe borrar solo claves de autenticación, no hacer `localStorage.clear()`.

Esto evita eliminar estado no relacionado, por ejemplo preferencias de tema.

---

## Manejo de errores de sesión

1. Si no existe token, la sesión debe invalidarse.

2. Si el token no decodifica, la sesión debe invalidarse.

3. Si los claims mínimos requeridos no existen, la sesión debe invalidarse.

Claims mínimos actuales:

- `rol_id`
- al menos uno entre `id` o `seg_usuario`

4. Si un request autenticado responde `401`, la sesión debe limpiarse y el usuario debe volver a login.

---

## Seguridad

1. El frontend no es una frontera de seguridad.

2. Estas reglas reducen manipulación del cliente, pero no reemplazan validación de permisos en backend.

3. Mientras el token viva en `localStorage`, sigue existiendo riesgo residual si alguien reemplaza el token completo.

4. El backend debe validar permisos y alcance por endpoint aunque el frontend oculte acciones.

---

## Preparación para `/me`

Cuando backend entregue `/me`:

1. `resolveSession()` debe cambiar para consultar backend.

2. `AuthProvider` no debe cambiar su contrato público.

3. Los consumidores de `useAuth()` no deben cambiar.

4. No se deben reintroducir claims derivados en `localStorage`.

---

## Restricciones de implementación

1. No guardar copias “cómodas” del payload JWT en storage.

2. No duplicar `rol_id`, `id`, `jornada_id` o similares en persistencia.

3. No leer `localStorage` directamente en formularios, pages o widgets para resolver identidad.

4. Toda nueva lógica de sesión debe pasar por la capa shared de auth.
