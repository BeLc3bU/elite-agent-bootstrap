# Actualización ODD — Gentle Shell v4.6 a v5.0+ (`gentle-shell`)

Este documento resume las mejoras metodológicas y técnicas incorporadas desde [`Gentleman-Programming/gentle-shell`](https://github.com/Gentleman-Programming/gentle-shell) (versiones `v4.6.0` hasta `v5.0.0` y `main` a noviembre de 2026) y cómo se reflejan en `elite-agent-bootstrap`.

---

## 1. Protocolo ODD de 7 Pasos y Clasificación por *Resume Test*
1. **Authorize**: Lectura estricta salvo autorización explícita de cambio; una sola aclaración si la intención es ambigua.
2. **Explore**: Presupuesto acotado de lectura inline (1 batch paralelo, ≤3 llamadas, ~10k tokens). Si se necesita más mapa, delegar exploración read-only (handoff ≤2k tokens con `path:line`).
3. **Resolve uncertainty**: Investigación acotada o máximo 1 desafío de supuestos; usar herramientas nativas de elección cuando apliquen; nunca resumir o truncar opciones bloqueantes.
4. **Classify**: Solo `small` o `large`:
   - **Small**: entendida en 1 batch, riesgo contenido (ningún ítem 1–6) y supera el *resume test* (alguien podría terminarla solo con la petición original y `git diff`).
   - **Large**: falla el *resume test* -> seguimiento automático en `odd/tasks/NNN-<feature>.md`.
5. **Track before the first write**: Documento único con orden fijo (`Header` -> `## Specs` verbatim -> `## Tasks` con `S#`, ruta y riesgo -> `## Log` creciente con `L1` verbatim).
6. **Implement task by task**: TDD aplicable (`strict-tdd`), verificación diferencial `PRESERVE` en código compartido, `Allowed edit surfaces` en delegaciones a writer y *work-unit commits* (~400 líneas).
7. **Close**: Verificar antes de escribir `Risk: none` si el diff toca código compartido (ítem 3), emitir `Risk: item N (razón)` o `Risk: none`, y ejecutar las puertas de verificación.

## 2. Modos de Flujo (`organic` vs `full-delegation`) y *Allowed edit surfaces*
- **`organic`** (por defecto): el coordinador ejecuta inline lo entendido y delega solo cuando dispara un *trigger* (presupuesto de evidencia, verificación de alto riesgo, paralelismo real ≥2 unidades independientes ~100+ líneas o *context backstop*).
- **`full-delegation`**: el coordinador nunca muta archivos directamente; toda escritura va a un writer acotado con `## Allowed edit surfaces` explícito (rutas/globs relativos exactos; nunca `.` ni rutas absolutas).
- Soportado en `DecisionProvider.js` y `node bin/cli.js route "<tarea>" --full-delegation`.

## 3. Continuidad de Trabajo Acotada (*Work Continuity*)
- Un check fallido dentro del alcance se diagnostica por su salida real y se corrige cambiando la hipótesis (sin rendirse por un contador arbitrario ni repetir el mismo parche).
- Si la recuperación de espejo/estado ya recibió confirmación explícita de escritura completa, inspeccionar solo las líneas modificadas sin re-leer ambos documentos completos en cada transición.
- Si una unidad queda `partial` o `blocked` por un requisito externo o falta de permisos, se reporta el bloqueo exacto sin detener trabajo independiente autorizado.

## 4. Guardrails Deterministas (`lib/guards/GentleGuards.js` y `agent guard`)
- **Rutas sensibles**: `.ssh/`, `.credentials/`, `library/keychains/`, `.aws/credentials`, `.config/gh/hosts.yml`, `secrets/`, `.env*`, `.envrc`, `.netrc` (añadidos en v4.7), `auth.json`, `*.pem|key|p12|pfx`.
- **Comandos destructivos**: clasificación en `git`, `filesystem` y `database` con política de confirmación (`allow_once`, `allow_session`, `deny`), ignorando texto dentro de comillas o heredocs.
- **Marcadores de conflicto**: bloqueo preventivo antes de comitear cuando hay `<<<<<<<`, `=======`, `>>>>>>>` sin resolver (`agent guard --conflicts`).
- **Validación de superficies**: `validateEditSurfaces` e `isPathInSurfaces` para delegaciones seguras.
