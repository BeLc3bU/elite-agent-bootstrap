# 📝 Lista de Tareas Accionables: Autenticación de Usuarios con JWT

**Feature Ref**: `000-ejemplo-autenticacion` (enlace a [spec.md](spec.md) y [plan.md](plan.md))  
**Progreso Total**: `[5 / 5 tareas completadas] (100%)`  
**Última Actualización**: `2026-08-16`

---

## 🚦 Fases de Implementación

### 🔹 Fase 1: Modelos, Esquemas y Hashing Base
- [x] **`[TASK-001]`**: Definir esquemas de validación Zod / DTOs para login y contratos de sesión.
  - **Archivos**: `src/schemas/auth.schema.ts`, `src/types/auth.ts`
  - **Dependencias**: Ninguna
  - **Criterio de Verificación**: Tipos exportados y validados con `npm run typecheck`.

- [x] **`[TASK-002]`**: Implementar servicio de hashing de contraseñas (Argon2 / Bcrypt) y JWT.
  - **Archivos**: `src/services/security.service.ts`, `tests/unit/security.test.ts`
  - **Dependencias**: `TASK-001`
  - **Criterio de Verificación**: 100% test passing en hashing y verificación de firma.

---

### 🔹 Fase 2: Servicios y Endpoints de API
- [x] **`[TASK-003]`**: Implementar `AuthService` con lógica de autenticación y manejo de intentos fallidos.
  - **Archivos**: `src/services/auth.service.ts`, `tests/unit/auth.service.test.ts`
  - **Dependencias**: `TASK-002`
  - **Criterio de Verificación**: Pruebas unitarias de login exitoso y login fallido en verde.

- [x] **`[TASK-004]`**: Implementar controlador HTTP y rutas con emisión de cookies `HttpOnly`.
  - **Archivos**: `src/controllers/auth.controller.ts`, `src/routes/auth.routes.ts`
  - **Dependencias**: `TASK-003`
  - **Criterio de Verificación**: Pruebas de integración HTTP pasando (`npm test`).

---

### 🔹 Fase 3: QA y Puerta de Calidad
- [x] **`[TASK-005]`**: Ejecutar suite completa (`lint`, `test`, `typecheck`), actualizar log y cerrar checklist.
  - **Archivos**: `PROJECT_LOG.md`, `specs/000-ejemplo-autenticacion/checklist.md`
  - **Dependencias**: Todas las anteriores
  - **Criterio de Verificación**: 0 errores en todos los guardrails.
