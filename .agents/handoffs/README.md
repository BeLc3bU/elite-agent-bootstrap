# 🤝 Protocolo de Traspasos entre Agentes (Handoffs)

Este directorio almacena los traspasos estructurados e inmutables generados durante el ciclo de vida **Spec-Driven Development (SDD)**.

## 📋 Estructura y Reglas
1. Cada traspaso debe cumplir estrictamente con el esquema formal [`schemas/handoff.schema.json`](../../schemas/handoff.schema.json).
2. Los nombres de archivo siguen la convención `HO-[ID]-[DESCRIPCION].json` (ej. `HO-001-spec-to-implementer.json`).
3. El agente receptor **no debe comenzar la ejecución** si el archivo de handoff no pasa la validación con `speckit handoff validate`.
4. Si un traspaso marca `required_approval: true`, se requiere confirmación humana explícita antes de que el agente receptor inicie la acción descrita en `next_action`.

## 🛠️ Comandos de Terminal
- `speckit handoff list`: Muestra los traspasos registrados en el repositorio.
- `speckit handoff validate`: Valida que todos los handoffs del directorio cumplan el esquema JSON.
