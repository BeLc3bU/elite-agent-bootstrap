# Feature: 004-v2-phase3-handoffs-evidence

## Objective and problem
Migrado desde especificación SDD original en specs/004-v2-phase3-handoffs-evidence.

## Scope and constraints
- Proyecto: Plantilla Proyecto / GamingOptimization
- Runner: Node / PowerShell
- Estándar: Organic-Driven Development (ODD)

## Specs
# 📋 Especificación Funcional: Fase 3 - Puertas de Evidencia, Protocolo de Handoffs y CI/CD Gates

**Identificador**: `004-v2-phase3-handoffs-evidence`  
**Estado**: `Aprobado`  
**Fecha de Creación**: `2026-09-28`  
**Última Actualización**: `2026-09-28`  
**Autor/Agente**: `Principal AI Architect`

---

## 🎯 1. Resumen Ejecutivo y Objetivo
El objetivo de la Fase 3 es transformar la colaboración entre agentes de una conversación no estructurada a un **Protocolo de Traspaso Tipado (Handoff Protocol)** y formalizar el **Sistema de Evidencias Reproducibles (`.evidence/`)**. 

Actualmente, las transiciones entre fases (ej. de especificación a implementación, o de implementación a pruebas) carecen de validación formal de artefactos. Además, la regla constitucional "Evidencia antes de Afirmaciones" requiere un mecanismo verificable para asegurar que ninguna tarea se marque como completada sin evidencia inmutable en disco (logs de tests, lint, capturas). Esta fase implementa los esquemas JSON de handoff y evidencia, el soporte en el CLI (`speckit handoff` y `speckit evidence`) y su integración como Quality Gate bloqueante en CI/CD.

---

## 👤 2. Historias de Usuario (User Stories)

### Historia 1: Traspaso Tipado entre Agentes (Handoff Protocol)
- **Como** Orquestador de agentes o Agente Especializado
- **Quiero** generar y validar traspasos de tareas mediante un archivo JSON estructurado en `.agents/handoffs/` que detalle origen, destino, tarea, contexto, decisiones tomadas, artefactos producidos, evidencias y riesgos
- **Para** asegurar que el agente receptor cuenta con toda la información requerida sin ambigüedades ni pérdida de contexto.

#### Criterios de Aceptación (Given-When-Then)
- **Escenario 1.1**: Generación de Handoff Válido
  - **Dado** que `spec-agent` finaliza la redacción y aprobación de `specs/004-feature/`
  - **Cuando** genera un traspaso hacia `implementer` conforme a `schemas/handoff.schema.json`
  - **Entonces** `node bin/cli.js handoff validate` confirma que todos los campos obligatorios están presentes y devuelve código 0.

- **Escenario 1.2**: Rechazo de Handoff sin Artefactos ni Contexto
  - **Dado** un traspaso donde faltan los campos `artifacts` o `evidence`
  - **Cuando** se ejecuta `speckit handoff validate`
  - **Entonces** el comando falla con código de salida 1 e indica el campo faltante, impidiendo que el agente receptor inicie trabajo a ciegas.

### Historia 2: Registro y Validación de Evidencias Reproducibles
- **Como** Revisor Técnico o Auditor de CI/CD
- **Quiero** que cada tarea completada `[x]` cuente con un registro inmutable en `.evidence/TASK-ID/` con comandos ejecutados, código de salida y logs
- **Para** verificar de forma independiente que las pruebas pasaron realmente y no se trata de una alucinación del LLM.

#### Criterios de Aceptación
- **Escenario 2.1**: Auditoría de Evidencias en `speckit evidence verify`
  - **Dado** un conjunto de especificaciones con tareas marcadas como completadas `[x]`
  - **Cuando** ejecuto `node bin/cli.js evidence verify`
  - **Entonces** el comando verifica que para cada tarea con ID `[TASK-XXX]` existe su comprobante en `.evidence/` o `specs/`, confirmando la trazabilidad.

---

## ⚙️ 3. Requisitos Funcionales y No Funcionales

### Requisitos Funcionales (RF)
- `[RF-01]`: Crear `schemas/handoff.schema.json` formalizando el contrato de traspaso entre agentes (emisor, receptor, tarea, artefactos, evidencia, riesgos, aprobación).
- `[RF-02]`: Crear `schemas/evidence.schema.json` definiendo la estructura de un comprobante de evidencia reproducible (comandos, logs, código de salida, autor).
- `[RF-03]`: Crear la estructura de directorios `.agents/handoffs/` y `.evidence/` con directrices y ejemplos base.
- `[RF-04]`: Implementar en `bin/cli.js` los comandos:
  - `speckit handoff list`: Lista los traspasos registrados en el proyecto.
  - `speckit handoff validate`: Valida todos los handoffs contra `schemas/handoff.schema.json`.
  - `speckit evidence verify`: Audita la presencia de evidencias para tareas concluidas.
- `[RF-05]`: Actualizar `.github/workflows/spec-quality-gate.yml` incorporando la validación automática de handoffs y evidencias en cada PR.

### Requisitos No Funcionales (RNF)
- `[RNF-01] Zero Dependencies`: Implementación pura en Node.js nativo sin librerías externas.
- `[RNF-02] Inmutabilidad y Trazabilidad`: Cada handoff y evidencia debe contar con timestamp ISO-8601 y hash o ID identificador.
- `[RNF-03] Idioma`: Mensajes de error, reportes en consola y documentación en Español.

---

## 🔍 4. Casos Límite y Reglas de Negocio (Edge Cases)

| ID | Caso Límite / Condición | Comportamiento Esperado |
|---|---|---|
| `[EC-01]` | Handoff entre agentes que no existen en `.agents/registry.json` | Error de validación: Tanto `from` como `to` deben ser IDs registrados válidos. |
| `[EC-02]` | Tarea marcada con `[x]` sin comando de verificación en `tasks.md` | Advertencia/Fallo en la auditoría de evidencias. |
| `[EC-03]` | Carpeta `.evidence/` vacía en un proyecto que aún no tiene tareas completadas | No fallar en modo inicial si no hay tareas `[x]`. |

---

## 🚫 5. Fuera de Alcance (Out of Scope)
- No se implementa persistencia en base de datos externa (el almacenamiento reside en archivos JSON y Markdown en Git).
- No se implementa protocolo de red distribuido A2A (se utiliza almacenamiento local en el repositorio).

---

## 📌 6. Dependencias y Bloqueantes
- **Depende de**: Fase 2 completada (`specs/003-v2-phase2-agent-registry`).
- **Bloquea a**: Fase 4 (Adaptadores Extended y Evaluaciones).


## Tasks
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


## Log
- L1: Especificación histórica implementada.
- L2 (2026-11-04): Migración a estándar ODD (Gentle Shell). Documento en odd/tasks/004-v2-phase3-handoffs-evidence.md.
