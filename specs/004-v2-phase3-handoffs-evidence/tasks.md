# 📝 Desglose de Tareas de Implementación: Fase 3 - Puertas de Evidencia, Protocolo de Handoffs y CI/CD Gates

**Identificador**: `004-v2-phase3-handoffs-evidence`  
**Estado**: `Completado`  
**Plan de Referencia**: `specs/004-v2-phase3-handoffs-evidence/plan.md`

---

## 📋 Lista de Tareas Atómicas

### 1. Definición de Esquemas de Intercambio
- [x] **`[TASK-001]`** Crear `schemas/handoff.schema.json` formalizando el contrato tipado de traspaso entre agentes
  - *Archivos*: `schemas/handoff.schema.json`
  - *Criterio de Verificación*: Esquema JSON Schema Draft-07 sintácticamente válido.

- [x] **`[TASK-002]`** Crear `schemas/evidence.schema.json` definiendo la estructura de comprobantes de ejecución
  - *Archivos*: `schemas/evidence.schema.json`
  - *Criterio de Verificación*: Esquema JSON Schema Draft-07 sintácticamente válido.

### 2. Estructura de Directorios y Artefactos Canónicos
- [x] **`[TASK-003]`** Crear directorios `.agents/handoffs/` y `.evidence/` con guías y un handoff canónico de referencia
  - *Archivos*: `.agents/handoffs/README.md`, `.agents/handoffs/HO-001-baseline.json`, `.evidence/README.md`
  - *Criterio de Verificación*: Directorios y archivos base presentes en Git.

### 3. Comandos en CLI Universal
- [x] **`[TASK-004]`** Implementar comandos `speckit handoff list`, `speckit handoff validate` y `speckit evidence verify` en `bin/cli.js`
  - *Archivos*: `bin/cli.js`
  - *Criterio de Verificación*: `node bin/cli.js handoff validate` y `node bin/cli.js evidence verify` ejecutan con código de salida 0.

### 4. Automatización en CI/CD
- [x] **`[TASK-005]`** Integrar pasos de validación de handoffs y comprobación de evidencias en `.github/workflows/spec-quality-gate.yml` y `package.json`
  - *Archivos*: `.github/workflows/spec-quality-gate.yml`, `package.json`
  - *Criterio de Verificación*: `npm run test:handoff` y `npm run test:evidence` configurados y pasando localmente.

### 5. Verificación de Integridad
- [x] **`[TASK-006]`** Ejecutar `npm run test:verify` y asegurar que todas las especificaciones activas estén al 100%
  - *Archivos*: N/A
  - *Criterio de Verificación*: `npm run test:verify` reporta 100% de tareas completadas.
