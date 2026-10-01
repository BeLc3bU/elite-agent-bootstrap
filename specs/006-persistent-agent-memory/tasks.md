# 📝 Desglose de Tareas de Implementación: Sistema de Memoria Persistente de Agentes

**Identificador**: `006-persistent-agent-memory`  
**Estado**: `Completado`  
**Plan de Referencia**: `specs/006-persistent-agent-memory/plan.md`

---

## 📋 Lista de Tareas Atómicas

### 1. Esquema Formal y Estructura de Memoria
- [x] **`[TASK-001]`** Crear `schemas/memory.schema.json` para formalizar la estructura de memorias persistentes (`id`, `type`, `status`, `title`, `created`, `confidence`, `summary`, `details`).
  - *Archivos*: `schemas/memory.schema.json`
  - *Criterio de Verificación*: Archivo JSON sintácticamente válido según JSON Schema Draft-07.

- [x] **`[TASK-002]`** Crear estructura modular `.agents/memory/` con los archivos canónicos especializados (`decisions.md`, `patterns.md`, `lessons.md`, `context.md`, `archive/README.md`) y el índice de alto nivel `MEMORY.md`.
  - *Archivos*: `MEMORY.md`, `.agents/memory/decisions.md`, `.agents/memory/patterns.md`, `.agents/memory/lessons.md`, `.agents/memory/context.md`, `.agents/memory/archive/README.md`
  - *Criterio de Verificación*: Archivos creados con contenido inicial de alta calidad y formateados para progressive disclosure.

- [x] **`[TASK-003]`** Crear la regla de Antigravity `.agents/rules/memory-protocol.md` documentando el protocolo de lectura progresiva, evaluación y persistencia.
  - *Archivos*: `.agents/rules/memory-protocol.md`
  - *Criterio de Verificación*: Documento explicativo de progressive disclosure y jerarquía normativa.

### 2. Integración de Gobernanza y Catálogo de Agentes
- [x] **`[TASK-004]`** Actualizar `.agents/registry.json` incorporando capacidades de memoria (`memory-read`, `memory-write`, `memory-maintenance`) y permisos específicos respetando `Agent ≠ Authority`.
  - *Archivos*: `.agents/registry.json`
  - *Criterio de Verificación*: `npm run test:registry` pasa en verde sin violaciones de esquema.

### 3. Comandos CLI para Gestión de Memoria (`speckit memory`)
- [x] **`[TASK-005]`** Implementar comandos de gestión de memoria en `bin/cli.js`: `speckit memory list`, `validate`, `search`, `show`, `add`, `archive`.
  - *Archivos*: `bin/cli.js`
  - *Criterio de Verificación*: `node bin/cli.js memory list` y `node bin/cli.js memory validate` ejecutan con éxito y detectan memorias válidas.

### 4. Automatización de Quality Gates y Pruebas
- [x] **`[TASK-006]`** Añadir script `test:memory` en `package.json`, actualizar `.github/workflows/spec-quality-gate.yml` y lista de archivos distribuibles.
  - *Archivos*: `package.json`, `.github/workflows/spec-quality-gate.yml`
  - *Criterio de Verificación*: `npm run test:memory` ejecutable vía npm y workflow de GitHub Actions actualizado.

### 5. Documentación, Evidencia y Sincronización
- [x] **`[TASK-007]`** Actualizar documentación del proyecto (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `README.md`, `AGENT_BOOTSTRAP.md`) y registrar ADR-008 en `PROJECT_LOG.md`.
  - *Archivos*: `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `README.md`, `AGENT_BOOTSTRAP.md`, `PROJECT_LOG.md`
  - *Criterio de Verificación*: Documentación alineada con la nueva capacidad de memoria persistente.

- [x] **`[TASK-008]`** Generar comprobante de evidencia `.evidence/EV-003-memory-system.json` y verificar que la suite completa pase en verde (`npm run test:verify`, `test:registry`, `test:handoff`, `test:evidence`, `test:evals`, `test:memory`).
  - *Archivos*: `.evidence/EV-003-memory-system.json`
  - *Criterio de Verificación*: Todos los Quality Gates en verde (100% de éxito).
