# 📝 Desglose de Tareas de Implementación: Fase 2 - Gobernanza y Registro Tipado de Agentes

**Identificador**: `003-v2-phase2-agent-registry`  
**Estado**: `Completado`  
**Plan de Referencia**: `specs/003-v2-phase2-agent-registry/plan.md`

---

## 📋 Lista de Tareas Atómicas

### 1. Definición de Esquemas JSON
- [x] **`[TASK-001]`**: Crear `schemas/agent.schema.json` con especificación completa de propiedades, tipos, listas de control de acceso y riesgos
  - *Archivos*: `schemas/agent.schema.json`
  - *Criterio de Verificación*: Archivo JSON sintácticamente válido compatible con JSON Schema Draft-07.

- [x] **`[TASK-002]`**: Crear `schemas/registry.schema.json` para validar colecciones de agentes y metadatos de gobernanza
  - *Archivos*: `schemas/registry.schema.json`
  - *Criterio de Verificación*: Archivo JSON sintácticamente válido que referencia a `agent.schema.json`.

### 2. Creación del Registro de Agentes Canónicos
- [x] **`[TASK-003]`**: Crear `.agents/registry.json` con los 7 agentes del sistema respetando la matriz de autoridad y permisos
  - *Archivos*: `.agents/registry.json`
  - *Criterio de Verificación*: Contiene `orchestrator`, `spec-agent`, `implementer`, `tester`, `security-agent`, `reviewer` y `optimization-agent`.

### 3. Validador y Comandos en CLI
- [x] **`[TASK-004]`**: Implementar subcomandos `registry list` y `registry validate` en `bin/cli.js`
  - *Archivos*: `bin/cli.js`
  - *Criterio de Verificación*: `node bin/cli.js registry validate` devuelve exit code 0; `node bin/cli.js registry list` imprime la tabla de agentes.

### 4. Sincronización de Arnés y Documentación
- [x] **`[TASK-005]`**: Sincronizar `AGENTS.md` y `AGENT_BOOTSTRAP.md` con el nuevo registro `.agents/registry.json`
  - *Archivos*: `AGENTS.md`, `AGENT_BOOTSTRAP.md`
  - *Criterio de Verificación*: Los archivos mencionan y referencian explícitamente `.agents/registry.json`.

### 5. Verificación de Guardrails
- [x] **`[TASK-006]`**: Ejecutar `npm run test:verify` y verificar que las 4 especificaciones del repositorio estén al 100%
  - *Archivos*: N/A
  - *Criterio de Verificación*: `npm run test:verify` finaliza con código 0 y 100% de tareas completadas.
