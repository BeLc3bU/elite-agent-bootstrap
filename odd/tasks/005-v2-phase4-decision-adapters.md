# Feature: 005-v2-phase4-decision-adapters

## Objective and problem
Migrado desde especificación SDD original en specs/005-v2-phase4-decision-adapters.

## Scope and constraints
- Proyecto: Plantilla Proyecto / GamingOptimization
- Runner: Node / PowerShell
- Estándar: Organic-Driven Development (ODD)

## Specs
# 📋 Especificación Funcional: Fase 4 - Capa de Decisión y Adaptadores (Core Determinista + Extended Kev/Jev) y Arnés de Evaluación

**Identificador**: `005-v2-phase4-decision-adapters`  
**Estado**: `Aprobado`  
**Fecha de Creación**: `2026-09-28`  
**Última Actualización**: `2026-09-28`  
**Autor/Agente**: `Principal AI Architect`

---

## 🎯 1. Resumen Ejecutivo y Objetivo
El objetivo de la Fase 4 es culminar la arquitectura de **`elite-agent-bootstrap v2`** resolviendo la toma de decisiones, el enrutamiento de agentes y la validación empírica de políticas de seguridad.

Siguiendo el principio de **cero sobreingeniería** y la división **Core vs. Extended**:
1. **Core (Sin dependencias externas)**: Proveedor de decisión determinista (`DeterministicDecisionProvider`) basado en análisis léxico-semántico y mapeo declarativo contra las capacidades de [`.agents/registry.json`](file:///c:/Proyectos/Plantilla%20Proyecto/.agents/registry.json).
2. **Extended (Opcional)**: Interfaz abstracta [`lib/adapters/DecisionProvider.js`](file:///c:/Proyectos/Plantilla%20Proyecto/lib/adapters/DecisionProvider.js) con adaptador para modelos de decisión tipada System 1 / Kev / Jev (`/v1/systemone` o MCP).
3. **Arnés de Evaluación (`.evals/`)**: Banco de pruebas sintéticas para medir y auditar el enrutamiento de agentes, los límites de permisos y el bloqueo de auto-aprobaciones, generando comprobantes inmutables en `.evidence/`.

---

## 👤 2. Historias de Usuario (User Stories)

### Historia 1: Enrutamiento y Toma de Decisiones Desacoplada
- **Como** Orquestador de agentes o Desarrollador
- **Quiero** clasificar tareas técnicas y enrutarlas al agente adecuado (`spec-agent`, `implementer`, `tester`, `security-agent`, `reviewer`, `optimization-agent`, `orchestrator`)
- **Para** asegurar que cada agente opere estrictamente dentro de sus capacidades y restricciones de ruta declaradas en `.agents/registry.json`.

#### Criterios de Aceptación (Given-When-Then)
- **Escenario 1.1**: Enrutamiento Determinista de Especificación
  - **Dado** el texto de tarea "Definir historias de usuario y criterios de aceptación para el módulo de facturación"
  - **Cuando** se ejecuta la decisión de enrutamiento
  - **Entonces** el sistema clasifica el destino como `spec-agent` con nivel de riesgo `low`.

- **Escenario 1.2**: Enrutamiento Determinista de Pruebas
  - **Dado** el texto de tarea "Escribir pruebas unitarias y medir cobertura de código"
  - **Cuando** se ejecuta la decisión de enrutamiento
  - **Entonces** el sistema clasifica el destino como `tester`.

- **Escenario 1.3**: Detección de Acciones Restringidas (Bloqueo de Auto-Aprobación)
  - **Dado** una solicitud para "Hacer merge directo a la rama main sin revisión humana"
  - **Cuando** se evalúa la política de seguridad
  - **Entonces** la decisión retorna `escalate_human_approval` y bloquea la ejecución autónoma.

### Historia 2: Comando CLI para Enrutamiento y Consulta
- **Como** usuario en terminal o subagente
- **Quiero** ejecutar `speckit route "<descripción>"`
- **Para** obtener instantáneamente el agente asignado, sus herramientas recomendadas y si requiere aprobación humana.

#### Criterios de Aceptación
- **Escenario 2.1**: Invocación desde terminal
  - **Dado** el comando `node bin/cli.js route "auditar vulnerabilidades OWASP"`
  - **Cuando** se ejecuta
  - **Entonces** imprime el agente `security-agent`, su nivel de riesgo y los archivos permitidos.

### Historia 3: Arnés de Evaluación Sintética (.evals/)
- **Como** Ingeniero de Calidad y DevOps
- **Quiero** ejecutar una suite de escenarios sintéticos (`speckit eval` / `npm run test:evals`)
- **Para** verificar que la lógica de enrutamiento y las reglas de gobernanza no sufren regresiones.

#### Criterios de Aceptación
- **Escenario 3.1**: Ejecución de Suite Sintética
  - **Dado** el catálogo `.evals/scenarios/routing-scenarios.json`
  - **Cuando** se ejecuta `node bin/cli.js eval`
  - **Entonces** todos los escenarios pasan con 100% de coincidencia y se emite un comprobante en `.evidence/`.

---

## 🚫 3. Fuera de Alcance (Out of Scope)
- No se implementarán servidores de microservicios ni bases de datos para guardar decisiones (se utiliza memoria en proceso o archivos locales).
- No se fuerza la llamada de red a la API de Kev si no se configuran variables de entorno; el motor por defecto es 100% local y determinista.

---

## ⚠️ 4. Riesgos y Mitigaciones
- **Ambigüedad léxica en tareas**: Tareas con términos cruzados (ej. "especificar cómo implementar pruebas") se clasifican ponderando verbos principales y se reporta nivel de confianza.
- **Rendimiento**: La evaluación determinista se ejecuta en menos de 10 milisegundos sin latencia de red.


## Tasks
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


## Log
- L1: Especificación histórica implementada.
- L2 (2026-11-04): Migración a estándar ODD (Gentle Shell). Documento en odd/tasks/005-v2-phase4-decision-adapters.md.
