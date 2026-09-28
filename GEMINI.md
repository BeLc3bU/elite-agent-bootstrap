# Reglas de Proyecto: Elite Agent Bootstrap v2 (Spec-Kit SDD)

Este proyecto es el repositorio canónico de **Elite Agent Bootstrap v2** y estándar de ingeniería agéntica para Antigravity.

---

## 🏛️ Gobernanza y Operación de Agentes
1. **Idioma Estricto**: Toda comunicación, comentario de código, commits (Conventional Commits) y especificaciones deben ser en **Español**.
2. **Metodología Spec-Driven Development (SDD)**: Prohibido modificar código de producción sin contar con la especificación aprobada en `specs/NNN-<feature>/` (`spec.md`, `plan.md`, `tasks.md`).
3. **Separación de Autoridad (Agent ≠ Authority)**: Ningún agente puede auto-aprobarse ni mergear a `main` sin revisión humana explícita. Consultar permisos en `.agents/registry.json`.
4. **Protocolo de Traspasos y Evidencias**:
   - Registrar delegaciones en `.agents/handoffs/`.
   - Registrar comprobantes inmutables en `.evidence/` antes de marcar cualquier tarea con `[x]`.
5. **Capa de Decisión y Enrutamiento**: Usar `speckit route "<tarea>"` para asignar el agente idóneo (`lib/adapters/DecisionProvider.js`).
6. **Comprobación Continua**: Ejecutar `npm run test:verify`, `npm run test:registry`, `npm run test:handoff`, `npm run test:evidence` y `npm run test:evals` antes de proponer cambios.
