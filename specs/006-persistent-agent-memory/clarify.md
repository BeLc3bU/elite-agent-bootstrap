# ❓ Registro de Dudas y Clarificaciones Técnicas: Sistema de Memoria Persistente

**Identificador**: `006-persistent-agent-memory`  
**Estado**: `Resuelto`  
**Fecha**: `2026-10-01`

---

### Pregunta 1: ¿Por qué separar `MEMORY.md` en raíz de `.agents/memory/`?
- **Respuesta**: Por el principio de **divulgación progresiva (Progressive Disclosure)** y ergonomía multi-herramienta. Herramientas como Claude Code, Gemini CLI, Antigravity y Cursor leen de forma natural archivos en raíz como `MEMORY.md`. Mantener `MEMORY.md` como un índice de alto valor y mapa de navegación permite una lectura ultrarrápida (<500 tokens) sin saturar la ventana de contexto. Las memorias especializadas en `.agents/memory/` (`decisions.md`, `patterns.md`, `lessons.md`, `context.md` y `archive/`) solo se consultan cuando la tarea lo requiere específicamente.

### Pregunta 2: ¿Cómo interactúa el sistema de memoria con los Handoffs (`.agents/handoffs/`) y las Evidencias (`.evidence/`)?
- **Respuesta**:
  - `HANDOFF`: Representa el estado y contexto de la **ejecución actual** de una tarea delegada de un agente a otro (transitorio).
  - `EVIDENCE`: Representa los comprobantes **inmutables y forenses** de que un comando/test se ejecutó con éxito.
  - `MEMORY`: Representa el **conocimiento reutilizable futuro** derivado de tareas completadas. Un handoff finalizado o una lección aprendida durante la ejecución puede dar origen a una entrada de memoria persistente, pero nunca se deben mezclar los tres conceptos.

### Pregunta 3: ¿Cuál es la jerarquía estricta ante discrepancias normativas?
- **Respuesta**:
  $$\text{Constitution} > \text{Specifications} > \text{Rules (AGENTS/GEMINI)} > \text{Architecture Decisions (ADR)} > \text{Memory} > \text{Conversación previa}$$
  La memoria jamás puede invalidar ni relajar una regla de seguridad, un criterio constitucional o una especificación aprobada. Si una memoria contradice una especificación o regla, la memoria se ignora, se reporta y se marca como obsoleta (`stale`).

### Pregunta 4: ¿Qué agentes tienen autorización para escribir o alterar la memoria?
- **Respuesta**: Siguiendo el principio constitucional `Agent ≠ Authority`, los roles tienen permisos segmentados:
  - `orchestrator`: Lectura, Escritura y Mantenimiento (síntesis y orquestación).
  - `spec-agent`: Lectura y Escritura (decisiones operativas y contexto de especificación).
  - `implementer`: Lectura y Escritura (patrones de código y lecciones aprendidas).
  - `tester`: Lectura y Escritura (lecciones y patrones de testing).
  - `security-agent`: Lectura y Escritura (lecciones de seguridad).
  - `reviewer`: Lectura y Validación (validador neutral; no crea memorias de implementación pero valida promociones).
  - `optimization-agent`: Lectura y Escritura (patrones y lecciones de rendimiento).
  Ningún agente puede promover una memoria a Principio Constitucional sin autorización humana explícita.
