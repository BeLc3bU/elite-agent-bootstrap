# CLAUDE.md - Directrices de Desarrollo para Claude Code

## 🌍 Idioma y Convenciones
- **Español 100%**: Todas las respuestas, explicaciones, commits y PRs deben ser en Español.
- Commits en formato Conventional Commits en español (`feat:`, `fix:`, `refactor:`, `perf:`, `docs:`).

## 🚀 Metodología: Spec-Driven Development (Spec-Kit)
- Este proyecto sigue estrictamente el ciclo SDD:
  1. Revisar `.specify/memory/constitution.md` para las reglas de gobierno.
  2. Cada nueva funcionalidad reside en `specs/[ID]-[NOMBRE]/`.
  3. No escribir código de producción sin `spec.md`, `plan.md` y `tasks.md`.
  4. Marcar tareas completadas en `tasks.md` tras pasar las pruebas.
  5. Validar con `/speckit.converge` antes de cerrar la feature.

## 🛡️ Comandos del Proyecto & Guardrails
- **Desarrollo**: Comprobar scripts en `package.json` o gestor del proyecto.
- **Lint**: `npm run lint` / `ruff check .` / `cargo clippy`
- **Tipos**: `npm run typecheck`
- **Tests**: `npm test` / `pytest` / `cargo test`
- **Crear Spec**: `powershell .\.specify\scripts\create-feature.ps1 -FeatureId "XXX" -FeatureName "nombre"` o `./.specify/scripts/create-feature.sh XXX nombre`
- **Verificar Specs**: `powershell .\.specify\scripts\verify-spec.ps1` o `./.specify/scripts/verify-spec.sh`
