# Feature: 000-ejemplo-autenticacion

## Objective and problem
Migrado desde especificación SDD original en specs/000-ejemplo-autenticacion.

## Scope and constraints
- Proyecto: Plantilla Proyecto / GamingOptimization
- Runner: Node / PowerShell
- Estándar: Organic-Driven Development (ODD)

## Specs
# 📋 Especificación Funcional: Autenticación de Usuarios con JWT

**Identificador**: `000-ejemplo-autenticacion`  
**Estado**: `Completado (Ejemplo de Referencia)`  
**Fecha de Creación**: `2026-08-16`  
**Última Actualización**: `2026-08-16`  
**Autor/Agente**: `OrchestratorAgent`

---

## 🎯 1. Resumen Ejecutivo y Objetivo
Proveer un sistema seguro de registro, inicio de sesión y validación de sesiones mediante JSON Web Tokens (JWT) y cookies `HttpOnly`, garantizando que los usuarios puedan autenticarse de forma segura y acceder a recursos protegidos.

---

## 👤 2. Historias de Usuario (User Stories)

### Historia 1: Inicio de Sesión Seguro
- **Como** usuario registrado
- **Quiero** iniciar sesión con mi correo electrónico y contraseña
- **Para** acceder a mi panel personalizado de forma segura

#### Criterios de Aceptación (Given-When-Then)
- **Escenario 1.1**: Inicio de sesión exitoso con credenciales correctas
  - **Dado** un usuario registrado activo con email `usuario@ejemplo.com` y clave válida
  - **Cuando** envía el formulario de login con sus credenciales correctas
  - **Entonces** el sistema responde con código `200 OK`
  - **Y** emite una cookie segura `HttpOnly` con el token de sesión
  - **Y** redirige al usuario al panel principal

- **Escenario 1.2**: Intento de login con credenciales inválidas
  - **Dado** un email no registrado o contraseña incorrecta
  - **Cuando** el usuario intenta iniciar sesión
  - **Entonces** el sistema responde con código `401 Unauthorized`
  - **Y** muestra el mensaje: *"Correo electrónico o contraseña incorrectos"* sin revelar cuál de los dos falló

---

## ⚙️ 3. Requisitos Funcionales y No Funcionales

### Requisitos Funcionales (RF)
- `[RF-01]`: El sistema debe cifrar las contraseñas usando Argon2id o BCrypt con factor de costo >= 12.
- `[RF-02]`: El token JWT debe tener una caducidad máxima de 15 minutos y mecanismo de rotación con Refresh Token.
- `[RF-03]`: Endpoint `POST /api/auth/login` para autenticación y `POST /api/auth/logout` para invalidación.

### Requisitos No Funcionales (RNF)
- `[RNF-01] Rendimiento`: Tiempo de respuesta del endpoint de autenticación menor a 300ms.
- `[RNF-02] Seguridad`: Protección contra ataques de fuerza bruta (Rate Limiting de máximo 5 intentos por minuto por IP).
- `[RNF-03] Idioma`: Todos los mensajes de error y respuestas traducidos al **Español**.

---

## 🔍 4. Casos Límite y Reglas de Negocio (Edge Cases)

| ID | Caso Límite / Condición | Comportamiento Esperado |
|---|---|---|
| `[EC-01]` | Cuenta bloqueada temporalmente por intentos fallidos | Responder con `429 Too Many Requests` indicando tiempo restante |
| `[EC-02]` | Token expirado en petición autenticada | Responder con `401 Token Expired` e invocar flujo de refresco automático |

---

## 🚫 5. Fuera de Alcance (Out of Scope)
- [ ] Autenticación OAuth2 / Social Login (Google, GitHub) - *Se abordará en la feature 002*.
- [ ] Autenticación multifactor (2FA/MFA) por SMS.


## Tasks
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


## Log
- L1: Especificación histórica implementada.
- L2 (2026-11-04): Migración a estándar ODD (Gentle Shell). Documento en odd/tasks/000-ejemplo-autenticacion.md.
