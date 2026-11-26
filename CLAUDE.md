# CLAUDE.md - Directrices de Desarrollo para Claude Code

## 🌍 Idioma y Convenciones
- **Español 100%**: Todas las respuestas, explicaciones, commits y PRs deben ser en Español.
- Commits en formato Conventional Commits en español (`feat:`, `fix:`, `refactor:`, `perf:`, `docs:`) aplicando *work-unit commits* (~400 líneas código + tests + docs).

## 🚀 Metodología: Organic-Driven Development (ODD) — Gentle Shell v5
- Este proyecto sigue estrictamente el protocolo ODD de 7 pasos (`Authorize -> Explore -> Resolve -> Classify -> Track -> Implement -> Close`):
  1. Consultar `AGENTS.md` y `.agents/registry.json` para las reglas de gobierno y separación de autoridad (`Agent ≠ Authority`).
  2. Tareas pequeñas (entendidas, riesgo contenido, reanudables desde el diff): ejecución inline con TDD aplicable.
  3. Tareas grandes (fallan el *resume test*): crear `odd/tasks/NNN-<feature>.md` (`node bin/cli.js create <nombre>`) antes de editar código.
  4. Todo writer delegado requiere `## Allowed edit surfaces` explícito (nunca `.` ni rutas absolutas).
  5. Cerrar cada cambio de código con `Risk: item N (razón)` o `Risk: none` (ítem 1–6).

## 🛡️ Comandos del Proyecto & Guardrails
- **Pruebas**: `npm test`
- **Guardrails Gentle Shell**: `npm run test:guards` / `node bin/cli.js guard`
- **Verificar ODD**: `node bin/cli.js verify`
- **Enrutamiento y Riesgo**: `node bin/cli.js route "<tarea>"`
- **Validación Integral**: `npm run test:registry`, `npm run test:handoff`, `npm run test:evidence`, `npm run test:evals`, `npm run test:memory`
- **Memoria Persistente**: Consultar `MEMORY.md` y `.agents/memory/` bajo demanda.
