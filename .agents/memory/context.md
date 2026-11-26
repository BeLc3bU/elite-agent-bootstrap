# 🌐 Contexto Operacional Estable del Proyecto (context.md)

Este documento describe el contexto operacional estable, tooling disponible y particularidades del entorno de desarrollo de **Elite Agent Bootstrap**.

---

### MEM-004: Estructura del CLI Universal y Wrappers Transparentes
- **ID**: `MEM-004-universal-cli-architecture-context`
- **Tipo**: `context`
- **Estado**: `active`
- **Confianza**: `high`
- **Fecha**: `2026-09-28`
- **Fuente**: `specs/002-v2-phase1-consolidation`
- **Autor**: `orchestrator`
- **Resumen**: Toda la suite de herramientas del sistema reside centralizada en `bin/cli.js`, siendo invocable vía `node bin/cli.js <comando>` o mediante scripts de conveniencia.
- **Detalles**:
  - Rutas canónicas:
    - Documentos ODD: `odd/tasks/`
    - Registro de agentes: `.agents/registry.json`
    - Protocolo de traspasos: `.agents/handoffs/`
    - Comprobantes de evidencias: `.evidence/`
    - Evaluaciones sintéticas: `.evals/scenarios/routing-scenarios.json`
    - Capa de decisión: `lib/adapters/DecisionProvider.js`
    - Guardrails Gentle Shell: `lib/guards/GentleGuards.js`
    - Memoria persistente: `MEMORY.md` y `.agents/memory/`
  - Scripts en `package.json`:
    - `npm test`: Suite de pruebas `node --test tests/*.test.js`.
    - `npm run test:guards`: Audita conflictos y guardrails de seguridad.
    - `npm run test:verify`: Verifica completitud de documentos ODD en `odd/tasks/` y `specs/`.
    - `npm run test:registry`: Valida catálogo `.agents/registry.json`.
    - `npm run test:handoff`: Valida contratos en `.agents/handoffs/`.
    - `npm run test:evidence`: Audita comprobantes en `.evidence/`.
    - `npm run test:evals`: Ejecuta suite sintética de decisiones.
    - `npm run test:memory`: Valida el sistema de memoria persistente.
