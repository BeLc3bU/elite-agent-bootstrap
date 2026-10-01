# ⚖️ Decisiones Operativas y Convenciones Menores (decisions.md)

Este documento registra decisiones técnicas operativas que no requieren un ADR formal en `PROJECT_LOG.md`, pero que condicionan el comportamiento, diseño y convenciones del proyecto.

---

### MEM-003: Desacoplamiento Estricto Core Determinista vs Extended Kev/Jev
- **ID**: `MEM-003-core-vs-extended-decision`
- **Tipo**: `decision`
- **Estado**: `active`
- **Confianza**: `high`
- **Fecha**: `2026-09-28`
- **Fuente**: `specs/005-v2-phase4-decision-adapters`
- **Autor**: `orchestrator`
- **Resumen**: Mantener el Core del CLI y el sistema de gobernanza 100% operativo sin dependencias de red ni librerías externas en runtime.
- **Detalles**:
  - Toda funcionalidad básica (`verify`, `registry`, `handoff`, `evidence`, `eval`, `memory`) debe ejecutarse de forma determinista usando Node.js nativo (`fs`, `path`, `readline`, `os`).
  - La integración con APIs o MCP externos (como Kev/Jev `/v1/systemone`) debe implementarse como un adaptador opcional en `lib/adapters/` con fallback automático a la implementación local si no hay credenciales o red.
  - Esto garantiza que el Quality Gate en CI y las ejecuciones en local funcionen siempre en menos de 5 segundos.

---

### MEM-005: Formato y Marcado de Comprobantes de Evidencia
- **ID**: `MEM-005-evidence-exit-code-policy`
- **Tipo**: `decision`
- **Estado**: `active`
- **Confianza**: `high`
- **Fecha**: `2026-09-28`
- **Fuente**: `specs/004-v2-phase3-handoffs-evidence`
- **Autor**: `reviewer`
- **Resumen**: Prohibir comprobantes con `status: passed` cuyo `exit_code` sea distinto de 0.
- **Detalles**:
  - En `.evidence/`, una prueba solo se considera `passed` si el código de salida del subproceso es estrictamente 0.
  - Si un test falla (`exit_code != 0`), debe marcarse como `failed`.
  - Esta regla es auditada programáticamente por `speckit evidence verify` y previene falsos positivos en los Quality Gates.
