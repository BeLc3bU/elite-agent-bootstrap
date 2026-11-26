# Reglas de Proyecto: Plantilla ODD (Gentle Shell v5)

Este proyecto es la plantilla maestra bajo el estándar **Organic-Driven Development (ODD)** del arnés **el Gentleman** (`Gentleman-Programming/gentle-shell` v5).

---

## 🏛️ Gobernanza y Operación ODD (Protocolo en 7 Pasos)
1. **Idioma Estricto**: Toda comunicación, comentario de código, commits (Conventional Commits) y documentos ODD deben ser en **Español**.
2. **Flujo ODD (`Authorize -> Explore -> Resolve -> Classify -> Track -> Implement -> Close`)**:
   - **Exploración acotada**: Máximo 1 batch paralelo (≤3 llamadas / ~10k tokens) antes de delegar exploración read-only.
   - **Task Size (`small` vs `large`)**: Pequeña solo si está entendida, tiene riesgo contenido (sin ítems 1–6) y pasa el *resume test* (reanudable desde la petición + `git diff`).
   - **Tareas pequeñas**: Ejecución directa inline (sin documento en `odd/tasks/`, TDD aplicable + verificación focalizada inline).
   - **Tareas grandes**: Seguimiento automático en `odd/tasks/NNN-<feature>.md` (cabecera, `## Specs` verbatim, `## Tasks`, `## Log` creciente).
3. **Línea de Riesgo y Separación de Autoridad (`Agent ≠ Authority`)**:
   - Cerrar todo cambio de código con `Risk: item N (razón)` o `Risk: none` (verificando antes si el diff toca código compartido -> ítem 3).
   - Ningún agente puede auto-aprobarse ni mergear a `main` sin revisión humana explícita.
4. **Superficies y Guardrails (`agent guard`)**:
   - Todo writer delegado requiere `## Allowed edit surfaces` no vacío (rutas relativas acotadas; nunca `.` ni absolutas).
   - Prohibido exponer rutas sensibles (`.env*`, `.envrc`, `.netrc`, `.ssh/`, `secrets/`, `auth.json`, `*.pem|key|p12|pfx`) o comitear marcadores de conflicto (`agent guard --conflicts`).
5. **Work-Unit Commits & Continuidad**:
   - Commits por unidades de trabajo coherentes (~400 líneas uniendo código + pruebas + documentación; unidades de alto riesgo en su propio commit).
   - Ante un fallo en scope, diagnosticar la causa desde la salida y corregir sin detener trabajo independiente autorizado.
6. **Verificación Continua**: Ejecutar `npm test` y los quality gates (`test:verify`, `test:registry`, `test:handoff`, `test:evidence`, `test:evals`, `test:memory`, `test:guards`) antes de proponer cambios.
