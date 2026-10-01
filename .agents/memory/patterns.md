# 🧩 Patrones de Arquitectura e Implementación (patterns.md)

Este documento recopila patrones técnicos probados y reutilizables descubiertos durante el desarrollo de **Elite Agent Bootstrap**.

---

### MEM-001: Validación Estructural Nativa en Node.js sin Dependencias
- **ID**: `MEM-001-native-structural-validation`
- **Tipo**: `pattern`
- **Estado**: `active`
- **Confianza**: `high`
- **Fecha**: `2026-09-28`
- **Fuente**: `specs/003-v2-phase2-agent-registry`
- **Autor**: `implementer`
- **Resumen**: Validar estructuras JSON en el CLI mediante chequeos funcionales directos en Node.js nativo sin instalar paquetes como Ajv en tiempo de ejecución.
- **Detalles**:
  - Para mantener el CLI distribuible sin descargas pesadas (`npx elite-speckit`), las funciones `validateRegistry`, `validateHandoffs` y `validateEvidences` analizan recursivamente propiedades requeridas, patrones regex (`/^HO-[0-9]{3}-.../`) y rangos enumerados directamente.
  - Los archivos `.schema.json` se mantienen como el contrato formal estándar de la industria (Draft-07), mientras que el CLI implementa la verificación programática ligera equivalente.
  - Si un campo no cumple el tipo o faltan claves requeridas, se lanza un error descriptivo con el archivo y la propiedad causante.

---

### MEM-006: Estructuración Atómica de Tareas SDD con Comandos Verificables
- **ID**: `MEM-006-atomic-sdd-tasks-with-commands`
- **Tipo**: `pattern`
- **Estado**: `active`
- **Confianza**: `high`
- **Fecha**: `2026-08-16`
- **Fuente**: `specs/000-ejemplo-autenticacion`
- **Autor**: `spec-agent`
- **Resumen**: Cada tarea en `tasks.md` debe incluir el identificador `[TASK-XXX]`, los archivos exactos a tocar y un comando de verificación terminal ejecutable.
- **Detalles**:
  - Esto habilita la verificación automática en `speckit verify` (o `verify-spec.ps1`/`.sh`), calculando el porcentaje exacto de avance a partir de los checkboxes `[x]` vs `[ ]`.
  - Asegura que ningún agente comience a implementar sin saber cómo demostrará que la tarea está completada.
