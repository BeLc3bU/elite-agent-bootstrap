---
description: "Protocolo de memoria persistente para agentes: divulgación progresiva, criterios de retención, actualización y jerarquía de gobernanza"
trigger: model_decision
---

# 🧠 Protocolo de Memoria Persistente de Agentes (Memory Protocol)

Este protocolo rige cómo los agentes de IA en **Elite Agent Bootstrap v2** deben consultar, evaluar y actualizar la memoria persistente del repositorio.

---

## 🏛️ 1. Jerarquía de Precedencia Normativa
Ante cualquier contradicción entre el conocimiento almacenado y las directrices del proyecto, la precedencia es innegociable:

$$\text{Constitución} > \text{Especificaciones (specs/)} > \text{Reglas de Proyecto (AGENTS/GEMINI)} > \text{Decisiones Arquitectónicas (ADR)} > \text{Memoria Persistente} > \text{Conversación Previa}$$

- **Regla de Conflicto**: Si una memoria entra en conflicto con la Constitución, una especificación aprobada o una regla, la memoria **debe ignorarse inmediatamente**, reportarse y marcarse como `stale` o candidata a archivo.
- **Agent ≠ Authority**: Ningún agente puede auto-aprobar una memoria que vulnere las restricciones de seguridad ni promover memorias a nivel constitucional sin intervención humana explícita.

---

## 🔍 2. Consulta Progresiva (Progressive Disclosure)

Los agentes **NO** deben cargar todo el catálogo de memoria de manera indiscriminada en cada mensaje, para evitar la saturación de la ventana de contexto.

```text
Nueva Tarea
    │
    ▼
1. Identificar si requiere contexto histórico / patrones previos
    │
    ├─► [No necesario]: Proceder directamente con la especificación/tarea
    │
    └─► [Necesario]:
            │
            ├─► Consultar índice: Leer MEMORY.md (o ejecutar `speckit memory search "<tema>"`)
            │
            └─► Profundizar bajo demanda en el archivo modular específico:
                    • .agents/memory/decisions.md (decisiones operativas no-ADR)
                    • .agents/memory/patterns.md  (patrones de código o arquitectura)
                    • .agents/memory/lessons.md   (errores conocidos y soluciones)
                    • .agents/memory/context.md   (entorno y particularidades del stack)
```

---

## ⚖️ 3. Criterios de Persistencia (Filtro Anti-Ruido)

Al concluir o avanzar en una tarea, el agente debe evaluar si ha obtenido un conocimiento valioso antes de proponer cambios a la memoria.

### ✅ Persistir si:
- Evita repetir una investigación técnica extensa en el futuro.
- Documenta la resolución de un bug, trampa de entorno o problema no obvio.
- Establece un patrón técnico reutilizable no documentado formalmente.
- Captura una convención o decisión operativa menor pero estable.
- Facilita la continuación fluida por parte de otro agente o persona.

### ❌ PROHIBIDO Persistir si:
- Es información transitoria o estado de ejecución momentáneo (utilizar `.agents/handoffs/`).
- Es un resumen conversacional del chat o volcado de prompts crudos.
- Es información que ya reside canónicamente en `PROJECT_LOG.md` (ADR), `constitution.md` o `specs/`.
- Es código o texto fácilmente derivable de inspeccionar los archivos existentes.

---

## 🔄 4. Ciclo de Vida y Transición de Estados

```text
[Observación en Tarea]
         │
         ▼
[Candidato a Memoria]
         │
         ├─► Validar formato y esquema (`speckit memory validate`)
         │
         ▼
[Memoria Activa] (status: active en .agents/memory/)
         │
         ├─► Si queda obsoleta ➔ Marcar `status: stale`
         │
         ├─► Si es superada/retirada ➔ Trasladar a `.agents/memory/archive/` (`speckit memory archive <id>`)
         │
         └─► Si tiene impacto arquitectónico global ➔ Proponer ADR en `PROJECT_LOG.md` (Requiere aprobación humana)
```
