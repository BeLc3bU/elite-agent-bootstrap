# AGENTS.md - Plantilla Proyecto (Elite Agent + Spec-Kit)

Este repositorio es la plantilla maestra de bootstrapping para **Spec-Driven Development (SDD)** con inteligencia artificial.

**REGLA DE ORO**: Toda la comunicación, documentación y mensajes de sistema deben ser exclusivamente en **ESPAÑOL**.

---

## 🛠️ Comandos de Mantenimiento de la Plantilla
| Comando | Descripción |
|---|---|
| `powershell .\.specify\scripts\verify-spec.ps1` | Verificar estado de las especificaciones del repositorio |
| `powershell .\scripts\integrate-speckit.ps1` | Integrar Spec-Kit en un proyecto existente |
| `git status` | Verificar estado de git y ramas |

---

## 🏗️ Rutas y Estructura
- **Configuración Spec-Kit**: `.specify/`
- **Constitución Base**: `.specify/memory/constitution.md`
- **Plantillas SDD**: `.specify/templates/`
- **Especificaciones**: `specs/`
- **Prompts de Integración**: `.github/prompts/`
- **Scripts de Integración**: `scripts/`
- **Memoria de Decisiones**: `PROJECT_LOG.md`

---

## 👥 Sistema de Agentes Especializados
| Agente | Responsabilidad | Skills / Herramientas |
|--------|-----------------|-----------------------|
| **Orchestrator** | Coordinación de tareas y delegación | orchestrator-core |
| **SpecAgent** | Guardián de especificaciones, contratos y pipeline SDD | spec-kit |
| **OptimizationAgent** | Análisis de bundle, rendimiento y refactorización | performance-audit |

---

## 🛡️ Guardrails de Calidad (Innegociables)
1. **Zero Errors Policy**: Todo código o script debe ser probado y estar libre de errores.
2. **Docs Sync**: Mantener `README.md`, `AGENT_BOOTSTRAP.md` y plantillas sincronizados ante cualquier cambio.
3. **Releases Automáticas**: Commits en formato Conventional Commits en **Español** para `release-please`.
