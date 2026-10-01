# AGENTS.md - Plantilla Proyecto (Elite Agent Bootstrap v2)

Este repositorio es el estándar de ingeniería y gobernanza para **Spec-Driven Development (SDD)** con inteligencia artificial y arquitectura de agentes tipados.

**REGLA DE ORO**: Toda la comunicación, documentación y mensajes de sistema deben ser exclusivamente en **ESPAÑOL**.

---

## 🛠️ Comandos de Mantenimiento y Gobernanza
| Comando | Descripción |
|---|---|
| `agent init [dir]` (o `init`) | Inicializar o integrar la infraestructura de agentes y SDD |
| `agent verify` (o `verify`) | Verificar estado y tareas de todas las especificaciones |
| `agent create <nombre>` (o `create`) | Crear una nueva especificación numerada en `specs/` |
| `agent memory list` (o `memory list`) | Listar el catálogo de memorias activas categorizadas |
| `agent memory validate` | Auditar la integridad del sistema de memoria persistente |
| `agent memory search "<query>"` | Buscar patrones, decisiones o lecciones en la memoria |
| `agent memory show <id>` | Consultar el detalle técnico completo de una memoria |
| `agent memory archive <id>` | Archivar una memoria obsoleta en `.agents/memory/archive/` |
| `agent registry validate` | Validar formalmente el registro de agentes contra JSON Schema |
| `agent registry list` (o `registry list`) | Mostrar el catálogo oficial de agentes, permisos y niveles de riesgo |
| `agent handoff validate` | Validar el protocolo formal de traspaso de tareas entre agentes |
| `agent handoff list` (o `handoff list`) | Listar el registro histórico de traspasos (handoffs) |
| `agent evidence verify` | Auditar y verificar los comprobantes de ejecución inmutables |
| `agent evidence list` (o `evidence list`) | Listar el catálogo de comprobantes de evidencia registrados |
| `agent route "<tarea>"` (o `route`) | Enrutar una tarea al agente idóneo mediante la capa de decisión |
| `agent eval` (o `eval`) | Ejecutar la suite de evaluación sintética de agentes (.evals/) |
| `agent install-skill` (o `install-skill`) | Instalar la skill global en Antigravity (`~/.gemini/config`) |
| `agent version` | Mostrar la versión del framework |
| `npm run test:verify` | Ejecución automatizada de la suite de validación de specs |
| `npm run test:memory` | Validación automatizada del sistema de memoria persistente |
| `npm run test:evals` | Ejecución automatizada del arnés de evaluación sintética |
| `git status` | Verificar estado de git y ramas |

---

## 🏗️ Rutas y Estructura del Sistema
- **Índice Canónico de Memoria**: `MEMORY.md`
- **Memorias Especializadas Modulares**: `.agents/memory/` (`decisions.md`, `patterns.md`, `lessons.md`, `context.md`, `archive/`)
- **Protocolo de Memoria Antigravity**: `.agents/rules/memory-protocol.md`
- **Catálogo de Agentes y Gobernanza**: `.agents/registry.json`
- **Protocolo de Traspasos (Handoffs)**: `.agents/handoffs/`
- **Registro de Evidencias Reproducibles**: `.evidence/`
- **Arnés de Evaluación Sintética**: `.evals/`
- **Capa de Decisión y Adaptadores**: `lib/adapters/DecisionProvider.js`
- **Esquemas JSON de Validación**: `schemas/agent.schema.json`, `schemas/registry.schema.json`, `schemas/handoff.schema.json`, `schemas/evidence.schema.json`, `schemas/memory.schema.json`
- **Configuración Spec-Kit**: `.specify/`
- **Constitución Inmutable**: `.specify/memory/constitution.md`
- **Plantillas SDD Canónicas**: `.specify/templates/`
- **Especificaciones Activas**: `specs/`
- **Prompts de Integración**: `.github/prompts/`
- **CLI Universal**: `bin/cli.js`
- **Memoria de Decisiones y ADRs**: `PROJECT_LOG.md`

---

## 👥 Sistema de Agentes y Separación de Autoridad
La autoridad reside en las políticas deterministas y la aprobación humana (**Agent ≠ Authority**). Ningún agente puede auto-aprobar su trabajo.

### Jerarquía de Precedencia Normativa:
$$\text{Constitución} > \text{Especificación (specs/)} > \text{Reglas (AGENTS/GEMINI)} > \text{ADR (PROJECT_LOG)} > \text{Memoria} > \text{Contexto de Chat}$$

El catálogo formal con permisos de lectura/escritura de archivos, memoria persistente, herramientas MCP y niveles de riesgo está tipado en [`.agents/registry.json`](file:///.agents/registry.json):

| Agente ID | Rol | Nivel de Riesgo | Mod. Código | Mod. Specs | Memoria (Read/Write) | Aprobación Humana |
|---|---|---|---|---|---|---|
| `orchestrator` | Orquestador | `medium` | ❌ No | ✅ Sí | 📖 Lectura / ✍️ Escritura | ⚡ No requerida |
| `spec-agent` | Especificación SDD | `low` | ❌ No | ✅ Sí | 📖 Lectura / ✍️ Escritura | ⚡ No requerida |
| `implementer` | Implementación TDD | `medium` | ✅ Sí | ❌ No | 📖 Lectura / ✍️ Escritura | ⚡ No requerida |
| `tester` | Pruebas y Cobertura | `low` | ✅ Sí (tests) | ❌ No | 📖 Lectura / ✍️ Escritura | ⚡ No requerida |
| `security-agent` | Auditoría OWASP | `low` | ❌ No | ❌ No | 📖 Lectura / ✍️ Escritura | ⚡ No requerida |
| `reviewer` | Puerta de Revisión | `medium` | ❌ No | ❌ No | 📖 Lectura / 🔒 Solo Valida | 🔒 Obligatoria para Merge |
| `optimization-agent` | Rendimiento/Bundle | `low` | ❌ No | ❌ No | 📖 Lectura / ✍️ Escritura | ⚡ No requerida |

---

## 🛡️ Guardrails de Calidad (Innegociables)
1. **Zero Errors Policy**: Todo código, test o script debe estar libre de errores antes de proponer PR.
2. **Registro de Agentes Válido**: `agent registry validate` (o `speckit registry validate`) debe pasar en verde en cada ciclo de CI.
3. **Docs Sync**: Mantener `README.md`, `AGENT_BOOTSTRAP.md` y `PROJECT_LOG.md` sincronizados ante cualquier cambio de arquitectura.
4. **Releases Automáticas**: Commits en formato Conventional Commits en **Español** para `release-please`.
