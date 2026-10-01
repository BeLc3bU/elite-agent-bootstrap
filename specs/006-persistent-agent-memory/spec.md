# 📋 Especificación Funcional: Sistema de Memoria Persistente de Agentes (Persistent Agent Memory)

**Identificador**: `006-persistent-agent-memory`  
**Estado**: `Aprobado`  
**Fecha de Creación**: `2026-10-01`  
**Última Actualización**: `2026-10-01`  
**Autor/Agente**: `Principal AI Architect (Antigravity & SDD Specialist)`

---

## 🎯 1. Resumen Ejecutivo y Objetivo

El objetivo de esta especificación es dotar a **`elite-agent-bootstrap v2`** de un sistema nativo, modular, auditable y tipado de **Persistent Agent Memory** (Memoria Persistente de Agentes).

Inspirado conceptualmente en la memoria contextual de agentes avanzados, pero diseñado específicamente para **Google Antigravity** y compatible con **Claude Code, Gemini CLI, Cursor y OpenCode**, el sistema permite:
1. Retener conocimiento operacional, patrones arquitectónicos, convenciones y lecciones aprendidas entre distintas sesiones de trabajo.
2. Evitar la repetición de investigaciones técnicas o errores ya subsanados.
3. Compartir conocimiento entre agentes especializados respetando la separación de autoridad (`Agent ≠ Authority`).
4. Prevenir que la memoria se convierta en un monolito incontrolable mediante una arquitectura estratificada con divulgación progresiva (**Progressive Disclosure**).
5. Mantener la jerarquía constitucional de gobernanza estricta:
   $$\text{Constitution} > \text{Specifications} > \text{Rules} > \text{ADR} > \text{Memory} > \text{Conversación previa}$$

---

## 👤 2. Historias de Usuario (User Stories)

### Historia 1: Recuperación Progresiva de Conocimiento en Nueva Sesión
- **Como** Agente de IA al iniciar una nueva tarea en el repositorio
- **Quiero** consultar de manera rápida y sin sobrecargar el contexto el índice de memoria (`MEMORY.md`) y acceder a memorias especializadas solo cuando sea relevante
- **Para** tomar decisiones alineadas con patrones previos sin repetir investigaciones ni saturar la ventana de contexto.

#### Criterios de Aceptación (Given-When-Then)
- **Escenario 1.1**: Consulta de índice de alto nivel
  - **Dado** el inicio de una sesión en el espacio de trabajo
  - **Cuando** el agente identifica la naturaleza de la tarea
  - **Entonces** consulta `MEMORY.md` para extraer directrices y referencias a memorias modulares relevantes (`.agents/memory/`).
- **Escenario 1.2**: Consulta especializada bajo demanda
  - **Dado** una tarea que involucra depuración o integración externa
  - **Cuando** el agente requiere contexto sobre problemas previos o patrones conocidos
  - **Entonces** carga exclusivamente el archivo especializado relevante (`lessons.md`, `patterns.md`, `decisions.md` o `context.md`).

### Historia 2: Registro, Validación y Deduplicación de Memoria
- **Como** Agente de IA o Desarrollador al finalizar una tarea
- **Quiero** persistir únicamente lecciones, decisiones y patrones estables y no triviales mediante un esquema tipado y validado
- **Para** enriquecer la base de conocimiento sin degradar la calidad con información efímera o duplicada.

#### Criterios de Aceptación
- **Escenario 2.1**: Validación de formato y metadatos
  - **Dado** el comando `speckit memory validate` (o `node bin/cli.js memory validate`)
  - **Cuando** se ejecuta la auditoría del sistema de memoria
  - **Entonces** verifica que cada entrada posea metadatos obligatorios (`id`, `type`, `status`, `title`, `created`, `confidence`), no existan identificadores duplicados y los enlaces a archivos existan.
- **Escenario 2.2**: Detección de duplicados o conflictos
  - **Dado** un intento de registrar una memoria redundante o en conflicto con la Constitución
  - **Cuando** el validador analiza el corpus de memoria
  - **Entonces** señala la colisión o rechaza la memoria conflictiva priorizando la fuente superior.

### Historia 3: Ciclo de Vida, Mantenimiento y Archivado
- **Como** Administrador del repositorio o Agente de Mantenimiento
- **Quiero** listar (`speckit memory list`), buscar (`speckit memory search`) y archivar (`speckit memory archive <id>`) memorias obsoletas
- **Para** evitar el crecimiento indefinido y garantizar que solo las memorias activas y verificadas influyan en la toma de decisiones.

#### Criterios de Aceptación
- **Escenario 3.1**: Archivado de memoria obsoleta
  - **Dado** una memoria con `status: stale` o reemplazada por un ADR
  - **Cuando** se ejecuta `speckit memory archive MEM-XXX`
  - **Entonces** la entrada se traslada a `.agents/memory/archive/` preservando su trazabilidad histórica sin sobrecargar las consultas activas.

### Historia 4: Control de Acceso y Gobernanza en el Registro de Agentes
- **Como** Auditor de Seguridad y Gobernanza
- **Quiero** que el catálogo `.agents/registry.json` tipifique explícitamente los permisos de lectura, escritura y mantenimiento de memoria
- **Para** garantizar que ningún agente no autorizado modifique arbitrariamente el conocimiento persistente del repositorio.

#### Criterios de Aceptación
- **Escenario 4.1**: Permisos segmentados por rol
  - **Dado** `.agents/registry.json` actualizado
  - **Cuando** se consulta la matriz de permisos
  - **Entonces** cada agente canónico tiene asignadas sus capacidades (`memory-read`, `memory-write`, `memory-maintenance`) y permisos acordes a su nivel de riesgo.

---

## 🚫 3. Fuera de Alcance (Out of Scope)
- No se implementarán bases de datos vectoriales pesadas (Pinecone, Chroma, etc.) ni daemons en segundo plano; el sistema se basa en archivos Markdown + YAML estructurados legibles por humanos y versionados en Git.
- La memoria no tiene autoridad para sustituir decisiones de arquitectura formalizadas en `PROJECT_LOG.md` (ADR) ni principios de `.specify/memory/constitution.md`.
- No se registran logs de conversaciones completas ni volcado de prompts crudos.

---

## ⚠️ 4. Riesgos y Mitigaciones
- **Riesgo**: Contaminación del contexto por crecimiento descontrolado de `MEMORY.md`.  
  *Mitigación*: `MEMORY.md` actúa únicamente como índice conciso (<150 líneas) con resúmenes ejecutivos; los detalles se desglosan en `.agents/memory/` y se archivan periódicamente.
- **Riesgo**: Alucinación de precedencia (un agente prioriza un aprendizaje viejo sobre una especificación nueva).  
  *Mitigación*: Formalización explícita de la jerarquía normativa en `constitution.md`, `AGENTS.md`, `GEMINI.md` y regla Antigravity `.agents/rules/memory-protocol.md`.
- **Riesgo**: Dependencias de terceros incompatibles.  
  *Mitigación*: Implementación Core nativa en Node.js estándar dentro de `bin/cli.js` sin librerías externas adicionales.
