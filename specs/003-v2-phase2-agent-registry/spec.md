# 📋 Especificación Funcional: Fase 2 - Gobernanza y Registro Tipado de Agentes

**Identificador**: `003-v2-phase2-agent-registry`  
**Estado**: `Aprobado`  
**Fecha de Creación**: `2026-09-28`  
**Última Actualización**: `2026-09-28`  
**Autor/Agente**: `Principal AI Architect`

---

## 🎯 1. Resumen Ejecutivo y Objetivo
El objetivo de la Fase 2 es establecer la **Capa de Gobernanza y Registro Tipado** de `elite-agent-bootstrap`. Hasta ahora, los agentes especializados se describían únicamente como texto informal en tablas Markdown dentro de `AGENTS.md`. Esta especificación define e implementa un registro formal en formato JSON estructurado (`.agents/registry.json`), validado por **JSON Schema**, donde cada agente declara explícitamente sus capacidades, herramientas (MCP/CLI), rutas permitidas y prohibidas, nivel de riesgo y políticas de autorización. Se garantiza el principio de **Separación de Autoridad (Agent ≠ Authority)**: ningún agente puede aprobar su propio trabajo ni modificar partes del repositorio ajenas a su rol.

---

## 👤 2. Historias de Usuario (User Stories)

### Historia 1: Declaración Tipada de Permisos y Capacidades
- **Como** Arquitecto de Software y Seguridad
- **Quiero** definir cada agente mediante un esquema JSON formal con listas blancas de archivos (`allowed_files`), listas negras (`forbidden_files`) y banderas de capacidad (`can_modify_code`, `can_modify_specs`, `can_modify_governance`, `can_commit`, `can_merge`)
- **Para** impedir que agentes de generación de código modifiquen la constitución, o que agentes de revisión aprueben código sin separación de funciones.

#### Criterios de Aceptación (Given-When-Then)
- **Escenario 1.1**: Restricción de permisos de código para agentes de especificación
  - **Dado** un agente con rol `spec-agent`
  - **Cuando** se inspecciona su registro en `.agents/registry.json`
  - **Entonces** `can_modify_code` es `false`, `can_modify_specs` es `true` y `can_modify_governance` es `false`
  - **Y** las rutas de producción (`src/**`, `app/**`) figuran en `forbidden_files`.

- **Escenario 1.2**: Separación entre implementación y aprobación
  - **Dado** un agente con rol `implementer`
  - **Cuando** se inspecciona su registro
  - **Entonces** `can_modify_code` es `true`, pero `can_merge` es `false` y `requires_human_approval` para cambios destructivos es `true`.

### Historia 2: Validación Automatizada del Registro en CLI
- **Como** desarrollador o sistema de CI/CD
- **Quiero** ejecutar un comando CLI (`speckit registry validate` o `speckit registry list`)
- **Para** verificar que la configuración de agentes cumple rigurosamente el esquema JSON sin errores de sintaxis ni contradicciones de permisos.

#### Criterios de Aceptación
- **Escenario 2.1**: Registro válido
  - **Dado** el archivo `.agents/registry.json` configurado correctamente
  - **Cuando** ejecuto `node bin/cli.js registry validate`
  - **Entonces** el comando retorna código de salida 0 con un mensaje de confirmación y el número de agentes validados.

- **Escenario 2.2**: Detección de agente con permisos ilegales o malformado
  - **Dado** un registro donde falta un campo obligatorio (ej. `risk_level` o `role`)
  - **Cuando** ejecuto `node bin/cli.js registry validate`
  - **Entonces** el comando falla con código de salida 1 e indica el agente y campo que incumple el esquema.

---

## ⚙️ 3. Requisitos Funcionales y No Funcionales

### Requisitos Funcionales (RF)
- `[RF-01]`: Crear `schemas/agent.schema.json` definiendo la estructura atómica de un agente (roles, capacidades, permisos de archivo, herramientas MCP, niveles de riesgo).
- `[RF-02]`: Crear `schemas/registry.schema.json` validando la colección de agentes, metadatos del proyecto y versiones de protocolo.
- `[RF-03]`: Crear `.agents/registry.json` con los 7 agentes canónicos:
  1. `orchestrator` (Coordinación y delegación; no escribe código de producción).
  2. `spec-agent` (Redacción y mantenimiento de `specs/`; no toca código de producción).
  3. `implementer` (Desarrollo guiado por tareas TDD; no puede hacer merge ni tocar gobernanza).
  4. `tester` (Generación de pruebas y verificación de cobertura; no aprueba PRs).
  5. `security-agent` (Auditoría de dependencias, escaneo de secretos y OWASP; sólo lectura de código).
  6. `reviewer` (Revisión técnica de pares y validación de criterios; no implementa).
  7. `optimization-agent` (Auditoría de rendimiento, tamaño de bundles y profiling).
- `[RF-04]`: Implementar en `bin/cli.js` los subcomandos `speckit registry validate` y `speckit registry list` con validador de esquemas nativo en Node.js (cero dependencias externas).
- `[RF-05]`: Actualizar `AGENTS.md` y `AGENT_BOOTSTRAP.md` para incorporar la referencia a `.agents/registry.json` como la fuente de verdad inmutable de gobernanza.

### Requisitos No Funcionales (RNF)
- `[RNF-01] Zero Dependencies`: La validación de esquemas y lectura de JSON debe implementarse con módulos nativos de Node.js.
- `[RNF-02] Trazabilidad y Seguridad`: Cada agente debe declarar un `risk_level` (`low`, `medium`, `high`, `critical`) y la bandera `requires_human_approval`.
- `[RNF-03] Idioma`: Todos los esquemas y salidas de terminal deben estar documentados en Español.

---

## 🔍 4. Casos Límite y Reglas de Negocio (Edge Cases)

| ID | Caso Límite / Condición | Comportamiento Esperado |
|---|---|---|
| `[EC-01]` | Intento de definir un agente con `can_modify_governance: true` y `risk_level: low` | Error de validación: La modificación de gobernanza exige estrictamente `risk_level: critical` y `requires_human_approval: true`. |
| `[EC-02]` | Agente que no define `forbidden_files` | Asignar lista negra por defecto que proteja `.specify/memory/constitution.md` y `.github/workflows/`. |
| `[EC-03]` | Registro JSON con sintaxis rota o inexistente | Error claro con línea y causa del parseo. |

---

## 🚫 5. Fuera de Alcance (Out of Scope)
- No se implementa la ejecución de sandboxes Docker (OpenHands) en esta fase (Extended).
- No se implementa el motor de handoffs entre tareas (corresponde a la Fase 3).

---

## 📌 6. Dependencias y Bloqueantes
- **Depende de**: Fase 1 completada (`specs/002-v2-phase1-consolidation`).
- **Bloquea a**: Fase 3 (Puertas de Evidencia, Handoff Protocol y CI/CD Gates).
