# COMMIT_AGENT.md

## Objetivo

Estandarizar commits con **Conventional Commits** y mensajes claros, trazables y auditables.

## Cuándo usarlo

Actívalo cuando el usuario pida explícitamente:

- "haz commit"
- "crea commit"
- "commit con conventional commit"
- "versiona estos cambios"

## Reglas obligatorias

1. Formato del mensaje:

`<type>(<scope>): <description>`

2. `type` permitido:

- `feat`
- `fix`
- `refactor`
- `perf`
- `docs`
- `test`
- `build`
- `ci`
- `chore`
- `revert`

3. `scope`:

- Debe representar el dominio o módulo principal afectado.
- Usa kebab-case.
- Si el cambio toca varios slices con mismo objetivo, usa un scope agregador (ej: `catalog-management`).

4. `description`:

- Imperativo, corto y específico.
- Sin punto final.
- Máximo 72 caracteres recomendado.

5. Cuerpo del commit (opcional pero recomendado):

- Añadir cuando haya cambios arquitectónicos, migraciones o decisiones importantes.
- Listar los bloques principales cambiados.

## Flujo sugerido

1. Revisar `git status --short`.
2. Validar que no haya archivos no relacionados.
3. `git add` de cambios requeridos.
4. Crear commit con formato convencional.
5. Reportar al usuario el hash y resumen de archivos.

## Restricciones

- No usar `git commit --amend` salvo pedido explícito.
- No mezclar cambios no solicitados por el usuario.
- Si hay dudas de alcance, usar `refactor` o `chore` según impacto funcional.
