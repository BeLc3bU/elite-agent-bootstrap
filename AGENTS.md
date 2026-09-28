# AGENTS.md - Plantilla Proyecto (Elite Agent Bootstrap v2)

Este repositorio es el estándar de ingeniería y gobernanza para **Spec-Driven Development (SDD)** con inteligencia artificial y arquitectura de agentes tipados.

**REGLA DE ORO**: Toda la comunicación, documentación y mensajes de sistema deben ser exclusivamente en **ESPAÑOL**.

---

## 🛠️ Comandos de Mantenimiento y Gobernanza
| Comando | Descripción |
|---|---|
| `speckit verify` (o `node bin/cli.js verify`) | Verificar estado y tareas de todas las especificaciones |
| `speckit registry validate` | Validar formalmente el registro de agentes contra JSON Schema |
| `speckit registry list` | Mostrar el catálogo oficial de agentes, permisos y niveles de riesgo |
| `speckit install-skill` | Instalar la skill global `speckit-sdd` en Antigravity |
| `npm run test:verify` | Ejecución automatizada de la suite de validación de specs |
| `git status` | Verificar estado de git y ramas |

---

## 🏗️ Rutas y Estructura del Sistema
- **Catálogo de Agentes y Gobernanza**: `.agents/registry.json`
- **Esquemas JSON de Validación**: `schemas/agent.schema.json`, `schemas/registry.schema.json`
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

El catálogo formal con permisos de lectura/escritura de archivos, herramientas MCP y niveles de riesgo está tipado en [`.agents/registry.json`](file:///c:/Proyectos/Plantilla%20Proyecto/.agents/registry.json):

| Agente ID | Rol | Nivel de Riesgo | Mod. Código | Mod. Specs | Aprobación Humana |
|---|---|---|---|---|---|
| `orchestrator` | Orquestador | `medium` | ❌ No | ✅ Sí | ⚡ No requerida |
| `spec-agent` | Especificación SDD | `low` | ❌ No | ✅ Sí | ⚡ No requerida |
| `implementer` | Implementación TDD | `medium` | ✅ Sí | ❌ No | ⚡ No requerida |
| `tester` | Pruebas y Cobertura | `low` | ✅ Sí (tests) | ❌ No | ⚡ No requerida |
| `security-agent` | Auditoría OWASP | `low` | ❌ No | ❌ No | ⚡ No requerida |
| `reviewer` | Puerta de Revisión | `medium` | ❌ No | ❌ No | 🔒 Obligatoria para Merge |
| `optimization-agent` | Rendimiento/Bundle | `low` | ❌ No | ❌ No | ⚡ No requerida |

---

## 🛡️ Guardrails de Calidad (Innegociables)
1. **Zero Errors Policy**: Todo código, test o script debe estar libre de errores antes de proponer PR.
2. **Registro de Agentes Válido**: `speckit registry validate` debe pasar en verde en cada ciclo de CI.
3. **Docs Sync**: Mantener `README.md`, `AGENT_BOOTSTRAP.md` y `PROJECT_LOG.md` sincronizados ante cualquier cambio de arquitectura.
4. **Releases Automáticas**: Commits en formato Conventional Commits en **Español** para `release-please`.
