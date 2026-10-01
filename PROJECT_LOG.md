# 📋 Registro de Decisiones y Memoria del Proyecto (PROJECT_LOG.md)

Este archivo actúa como la memoria a largo plazo del proyecto, documentando la evolución arquitectónica, decisiones técnicas clave y el estado de los hitos de desarrollo.

---

## 🏛️ Registro de Decisiones de Arquitectura (ADR)

### ADR-001: Integración Nativa de Spec-Kit y SDD
- **Fecha**: 2026-08-16
- **Contexto**: Necesidad de eliminar el "vibe coding" y asegurar que los agentes de IA construyan software con trazabilidad, contratos claros y cero ambigüedad.
- **Decisión**: Integrar el ecosistema GitHub Spec-Kit con carpetas `.specify/` y `specs/`, proporcionando comandos interactivos (`/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`, `/speckit.converge`).
- **Consecuencias**: Mayor calidad de código, documentación viva sincronizada y soporte tanto para repositorios nuevos (Greenfield) como existentes (Brownfield).

### ADR-002: Sistema Universal de Distribución y Protección Zero-Overwrite
- **Fecha**: 2026-08-16
- **Contexto**: Al copiar la plantilla sobre proyectos ya existentes, se producían colisiones de archivos (`README.md`, `AGENTS.md`) que podían sobreescribir la documentación previa del usuario.
- **Decisión**: 
  1. Crear un paquete CLI universal (`bin/cli.js`, ejecutable vía `npx elite-speckit`).
  2. Desacoplar plantillas maestras en `.specify/templates/scaffold/`.
  3. Implementar política estricta **Zero-Overwrite**: en proyectos existentes, no se sobreescribe `README.md` (se crea `SPECKIT_GUIDE.md`) ni `AGENTS.md` (se crea `AGENTS.speckit.md` o backup `.bak`). Los logs y reglas aplican *append* no destructivo.
  4. Actualizar scripts PowerShell y Bash con auto-detección y modos `New`/`Existing`.
- **Consecuencias**: Integración segura en 1 solo comando tanto en proyectos nuevos como en repositorios consolidados sin pérdida de información.

### ADR-003: Subcomandos CLI de Gestión y Limpieza de Código Legado
- **Fecha**: 2026-08-16
- **Contexto**: Necesidad de simplificar el flujo diario de los desarrolladores (crear specs y verificar progreso sin depender de scripts externos de PowerShell o Bash) y eliminar remanentes obsoletos.
- **Decisión**:
  1. Eliminar directorio legado `spec_template/` y duplicados en raíz.
  2. Añadir subcomandos nativos al CLI: `speckit create <nombre>` (con cálculo de ID automático) y `speckit verify` (con barra y porcentaje de tareas completadas).
  3. Soporte para instalador remoto one-liner (`install.ps1` e `install.sh`).
- **Consecuencias**: Repositorio 100% limpio y experiencia de usuario fluida multiplataforma.

### ADR-004: Consolidación del CLI Universal y Limpieza de Deuda Técnica
- **Fecha**: 2026-09-28
- **Contexto**: Dispersión operativa generada por 12 scripts de shell en Bash/PowerShell/Batch con lógica duplicada y redundancia en plantillas markdown (`*-template.md`).
- **Decisión**:
  1. Integrar el comando `install-skill` directamente en `bin/cli.js` de forma multiplataforma y sin dependencias externas.
  2. Reducir los scripts en `scripts/` y `.specify/scripts/` a wrappers transparentes que delegan en `bin/cli.js`.
  3. Consolidar `.specify/templates/` en archivos canónicos (`spec.md`, `plan.md`, `tasks.md`, `clarify.md`, `checklist.md`) eliminando los duplicados `*-template.md`.
  4. Universalizar la configuración recomendada en `docs/kev-decision-guide.md` eliminando paths locales hardcodeados.
  5. Actualizar `package.json` para ejecutar `node bin/cli.js verify` de forma 100% agnóstica de plataforma.
- **Consecuencias**: Mantenimiento simplificado (DRY), cero dependencias adicionales, paridad multiplataforma total y reducción de la superficie de error.

### ADR-005: Registro Tipado de Agentes y Matriz de Separación de Autoridad
- **Fecha**: 2026-09-28
- **Contexto**: Los agentes estaban descritos únicamente como tablas informativas en Markdown, sin esquemas formales, sin límites de rutas y sin controles programáticos de permisos o niveles de riesgo (OWASP for Agentic AI).
- **Decisión**:
  1. Diseñar `schemas/agent.schema.json` y `schemas/registry.schema.json` (JSON Schema Draft-07).
  2. Implementar `.agents/registry.json` con los 7 agentes canónicos (`orchestrator`, `spec-agent`, `implementer`, `tester`, `security-agent`, `reviewer`, `optimization-agent`).
  3. Establecer la regla innegociable de separación de autoridad: `Agent ≠ Authority`. Ningún agente puede auto-aprobarse ni realizar merge directo sin aprobación humana.
  4. Implementar `speckit registry validate` y `speckit registry list` en `bin/cli.js` con validador estructural nativo en Node.js (cero dependencias externas).
  5. Incorporar la validación automática del registro en `.github/workflows/spec-quality-gate.yml`.
- **Consecuencias**: Gobernanza determinista, tipado estricto de permisos y capacidades, prevención de excesiva agencia y compatibilidad universal con cualquier editor.

### ADR-006: Protocolo de Handoffs Tipados y Sistema de Evidencias Reproducibles
- **Fecha**: 2026-09-28
- **Contexto**: Las transiciones entre agentes en sistemas multiagente sufrían pérdida de contexto y falta de contratos claros. Adicionalmente, el cumplimiento de la regla constitucional "Evidencia antes de Afirmaciones" requería un mecanismo de auditoría inmutable e independiente del modelo para verificar la ejecución real de comandos y pruebas.
- **Decisión**:
  1. Formalizar esquemas JSON Schema Draft-07: `schemas/handoff.schema.json` y `schemas/evidence.schema.json`.
  2. Implementar almacenamiento de traspasos en `.agents/handoffs/` con identificadores unívocos (`HO-XXX-*`) y comprobación cruzada contra `.agents/registry.json`.
  3. Implementar almacenamiento de evidencias en `.evidence/` con identificadores (`EV-XXX-*`), comandos, código de salida y estados (`passed`, `failed`, `skipped`).
  4. Incorporar comandos nativos en `bin/cli.js`: `speckit handoff validate|list` y `speckit evidence verify|list`.
  5. Añadir `test:handoff` y `test:evidence` en `package.json` y Quality Gate bloqueante en `.github/workflows/spec-quality-gate.yml`.
- **Consecuencias**: Auditoría 100% determinista de traspasos y evidencias de pruebas, sin dependencias externas en tiempo de ejecución, eliminando falsos positivos o alucinaciones en CI/CD.

### ADR-007: Capa de Decisión Desacoplada y Arnés de Evaluación Sintética (.evals)
- **Fecha**: 2026-09-28
- **Contexto**: El enrutamiento de agentes y la toma de decisiones requerían una separación limpia entre el núcleo básico (Core) y las capacidades avanzadas opcionales (Extended), evitando acoplamiento rígido con servicios de IA externos o microservicios pesados, a la vez que se requerían pruebas sintéticas para prevenir regresiones en la asignación de roles y la detección de riesgos.
- **Decisión**:
  1. Diseñar la arquitectura desacoplada en `lib/adapters/DecisionProvider.js` con una clase base abstracta `DecisionProvider`.
  2. Implementar `DeterministicDecisionProvider` en Core: reglas léxico-semánticas y cruce con `.agents/registry.json`, con latencia < 5ms y cero dependencias de red o paquetes npm.
  3. Implementar `KevJevDecisionProvider` en Extended: adaptador HTTP/MCP hacia `/v1/systemone` o Kev/Jev con fallback automático al motor determinista en caso de desconexión o fallo.
  4. Incorporar un mecanismo de escalada constitucional: cualquier intento de bypass, force-push o merge a ramas protegidas activa inmediatamente `escalate: true` y exige aprobación humana (`Agent ≠ Authority`).
  5. Crear el arnés sintético `.evals/scenarios/routing-scenarios.json` y los comandos CLI `speckit route <tarea>` y `speckit eval`.
  6. Integrar `npm run test:evals` como Quality Gate bloqueante en `.github/workflows/spec-quality-gate.yml`, emitiendo comprobantes de evidencia en `.evidence/`.
- **Consecuencias**: Sistema agéntico determinista, testeable y extensible sin vendor lock-in; cumplimiento estricto de la regla constitucional y evaluación automatizada en CI/CD.

### ADR-008: Sistema Nativo de Memoria Persistente de Agentes (Persistent Agent Memory)
- **Fecha**: 2026-10-01
- **Contexto**: Los agentes en sesiones independientes perdían contexto de patrones de código, decisiones operativas y lecciones aprendidas previas, provocando repetición de investigaciones o errores. Se requería un sistema de memoria inspirado conceptualmente en agentes avanzados (Claude Code, Antigravity) pero integrado de forma nativa con Spec-Driven Development, gobernanza de agentes y divulgación progresiva (*Progressive Disclosure*).
- **Decisión**:
  1. Diseñar un índice raíz canónico `MEMORY.md` compacto (<150 líneas) y desacoplar memorias especializadas en `.agents/memory/`: `decisions.md` (operativas no-ADR), `patterns.md` (diseño y código), `lessons.md` (errores resueltos), `context.md` (entorno) y `archive/` (trazabilidad histórica de memorias retiradas).
  2. Establecer la jerarquía normativa estricta:
     $$\text{Constitución} > \text{Especificación (specs/)} > \text{Reglas (AGENTS/GEMINI)} > \text{ADR (PROJECT_LOG)} > \text{Memoria} > \text{Contexto de Chat}$$
  3. Formalizar el esquema JSON Schema Draft-07 en `schemas/memory.schema.json` e incorporar capacidades (`memory-read`, `memory-write`, `memory-maintenance`) y permisos segmentados en `.agents/registry.json`.
  4. Implementar los comandos CLI en `bin/cli.js`: `speckit memory list`, `validate`, `search`, `show`, `archive` con validación estructural nativa en Node.js sin dependencias externas.
  5. Crear la regla de Antigravity `.agents/rules/memory-protocol.md` e integrar `test:memory` en `package.json` y `.github/workflows/spec-quality-gate.yml`.
- **Consecuencias**: Reducción drástica del gasto de contexto mediante carga bajo demanda, memoria auditable y versionada en Git, cero dependencia de bases de datos vectoriales externas y preservación de la autoridad de la Constitución y las especificaciones.

### ADR-009: Integración del Starter Pack de Habilidades (skills.sh)
- **Fecha**: 2026-10-01
- **Contexto**: Para maximizar la eficacia de los agentes de IA en el marco Spec-Driven Development (SDD), se identificó la necesidad de equipar a los agentes con habilidades estandarizadas del ecosistema abierto skills.sh para interrogación rigurosa de planes, desarrollo frontend sin patrones genéricos, auditoría de interfaces y depuración científica sin parches a ciegas.
- **Decisión**:
  1. Empaquetar de forma canónica las 5 skills fundamentales en `skills/` y `.agents/skills/`:
     - `find-skills` (Vercel Labs): descubrimiento de nuevas capacidades.
     - `grill-me` (Matt Pocock): interrogatorio sistemático de planes y diseño antes de codificar.
     - `frontend-design` (Anthropic): diseño de interfaces pulidas de calidad de producción.
     - `web-design-guidelines` (Vercel Labs): auditoría de accesibilidad, UX y directrices web.
     - `systematic-debugging` (Jesse Vincent / obra): proceso estricto de depuración en 4 fases.
  2. Implementar el comando nativo `agent install-skills-pack` (y alias directo `install-skills-pack`) en `bin/cli.js` para aprovisionar las skills local y globalmente en Antigravity (`~/.gemini/config/skills/`).
  3. Actualizar `.agents/registry.json` a v2.2.0 mapeando las habilidades a los roles correspondientes (`orchestrator`, `spec-agent`, `implementer`, `tester`, `reviewer`, etc.).
  4. Emitir comprobante inmutable de evidencia en `.evidence/EV-004-skills-starter-pack.json`.
- **Consecuencias**: Mayor calidad en fases de especificación e implementación, consistencia metodológica entre sesiones y disponibilidad inmediata offline de las mejores herramientas del ecosistema agéntico.

---

## 🗺️ Historial de Fases e Hitos

| Fase | Descripción | Estado | Fecha de Cierre |
|---|---|---|---|
| **Fase 1** | Refactorización de la plantilla base e integración de Spec-Kit | ✅ Completado | 2026-08-16 |
| **Fase 2** | CLI Universal distribuible, plantillas scaffold y protección Zero-Overwrite | ✅ Completado | 2026-08-16 |
| **Fase 3** | Subcomandos de gestión (create/verify), limpieza de legado y despliegue | ✅ Completado | 2026-08-16 |
| **v2 - Fase 1** | Consolidación del CLI Universal, wrappers delegados y limpieza de plantillas | ✅ Completado | 2026-09-28 |
| **v2 - Fase 2** | Gobernanza y Registro Tipado de Agentes (.agents/registry.json y esquemas JSON) | ✅ Completado | 2026-09-28 |
| **v2 - Fase 3** | Puertas de Evidencia, Protocolo de Handoffs y CI/CD Gates (.evidence/ y .agents/handoffs/) | ✅ Completado | 2026-09-28 |
| **v2 - Fase 4** | Capa de Decisión Desacoplada (Core + Extended Kev/Jev) y Arnés Sintético (.evals/) | ✅ Completado | 2026-09-28 |
| **v2 - Fase 5** | Sistema Nativo de Memoria Persistente de Agentes (MEMORY.md + .agents/memory/) | ✅ Completado | 2026-10-01 |
| **v2 - Fase 6** | Integración del Starter Pack de Skills (skills.sh) y comando install-skills-pack | ✅ Completado | 2026-10-01 |



