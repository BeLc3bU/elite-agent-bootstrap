# 🛡️ Sistema de Evidencias Reproducibles (.evidence/)

Este directorio contiene las evidencias inmutables de ejecución y verificación que respaldan que las tareas marcadas como completadas `[x]` en `specs/` fueron realmente ejecutadas y validadas.

## 📋 Reglas Fundamentales (Hard Gates)
1. **Evidencia antes de Afirmaciones**: Un agente no puede marcar `[x]` en `tasks.md` sin generar un comprobante estructurado en `.evidence/`.
2. Cada comprobante debe cumplir con [`schemas/evidence.schema.json`](../schemas/evidence.schema.json).
3. Los comprobantes registran: comando ejecutado, código de salida (`exit_code: 0`), agente ejecutor y resumen.

## 🛠️ Comandos de Terminal
- `speckit evidence verify`: Audita que las tareas completadas cuenten con comprobantes válidos.
