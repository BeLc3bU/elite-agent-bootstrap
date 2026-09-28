# 📝 Desglose de Tareas de Implementación: Fase 4 - Capa de Decisión, Adaptadores y Arnés de Evaluación

**Identificador**: `005-v2-phase4-decision-adapters`  
**Estado**: `Completado`  
**Plan de Referencia**: `specs/005-v2-phase4-decision-adapters/plan.md`

---

## 📋 Lista de Tareas Atómicas

### 1. Proveedor de Decisión y Adaptadores
- [x] **`[TASK-001]`** Crear `lib/adapters/DecisionProvider.js` con arquitectura desacoplada: interfaz abstracta, proveedor determinista en Core y adaptador Kev/Jev en Extended con fallback.
  - *Archivos*: `lib/adapters/DecisionProvider.js`
  - *Criterio de Verificación*: Pruebas de unidad o invocación directa devuelven clasificación correcta de agentes según las políticas.

### 2. Arnés de Evaluación Sintética
- [x] **`[TASK-002]`** Crear estructura `.evals/` con documentación y catálogo canónico `.evals/scenarios/routing-scenarios.json`
  - *Archivos*: `.evals/README.md`, `.evals/scenarios/routing-scenarios.json`
  - *Criterio de Verificación*: Escenarios cubren los 7 roles canónicos y casos de escalada de seguridad.

### 3. Comandos en CLI Universal
- [x] **`[TASK-003]`** Implementar comandos `speckit route <tarea>` y `speckit eval` en `bin/cli.js`
  - *Archivos*: `bin/cli.js`
  - *Criterio de Verificación*: `node bin/cli.js route "crear test"` retorna `tester`, y `node bin/cli.js eval` ejecuta la suite de evaluación con salida 0.

### 4. Automatización en CI/CD y Configuración
- [x] **`[TASK-004]`** Añadir script `test:evals` en `package.json` y actualizar lista de distribución (`files`)
  - *Archivos*: `package.json`
  - *Criterio de Verificación*: `npm run test:evals` ejecutable directamente desde npm.

- [x] **`[TASK-005]`** Integrar paso de evaluación sintética en `.github/workflows/spec-quality-gate.yml`
  - *Archivos*: `.github/workflows/spec-quality-gate.yml`
  - *Criterio de Verificación*: El workflow incluye `node bin/cli.js eval` como paso bloqueante.

### 5. Documentación y Verificación Final
- [x] **`[TASK-006]`** Registrar ADR-007 en `PROJECT_LOG.md` y sincronizar `AGENTS.md`, `README.md` y `AGENT_BOOTSTRAP.md`
  - *Archivos*: `PROJECT_LOG.md`, `AGENTS.md`, `README.md`, `AGENT_BOOTSTRAP.md`
  - *Criterio de Verificación*: Documentación coherente y reflejando las capacidades v2 completas.

- [x] **`[TASK-007]`** Ejecutar suite completa de verificación y validar que todas las especificaciones activas están al 100%
  - *Archivos*: N/A
  - *Criterio de Verificación*: `npm run test:verify`, `test:registry`, `test:handoff`, `test:evidence` y `test:evals` pasan en verde.
