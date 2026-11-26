# Feature: 009-gentle-shell-v5-sync

## Objective and problem
Sincronizar e implementar en `elite-agent-bootstrap` las actualizaciones recientes de `Gentleman-Programming/gentle-shell` (v4.6.0 a v5.0.0 / main hasta 2026-11-25) y reparar las inconsistencias remanentes de la migración inicial a ODD (`d203f15`: rutas a `.specify/`, `.evals/` ausente, erratas en `speckit-odd`, `cmdCreate`/`cmdVerify`/`cmdInit` rotos sin `.specify/`).
- Rama: `main`
- Estrategia de entrega: `single-pr` (implementación incremental por unidades de trabajo coherentes)
- Test runner: `node --test tests/*.test.js` y `npm run test:verify && npm run test:registry && npm run test:handoff && npm run test:evidence && npm run test:evals && npm run test:memory`

## Specs
- `S1`: Implementar guardrails deterministas de Gentle Shell v4.7–v5.0 en `lib/guards/GentleGuards.js`:
  - Política compartida de rutas sensibles (`SENSITIVE_PATH_PATTERNS`, incluyendo `.envrc` y `.netrc`, `.ssh/`, `.credentials/`, `.aws/credentials`, `.config/gh/hosts.yml`, `secrets/`, `auth.json`, `*.pem|key|p12|pfx`).
  - Clasificador de comandos destructivos (`database`, `filesystem`, `git`) con política de confirmación (`allow_once`, `allow_session`, `deny`).
  - Detector de marcadores de conflicto (`<<<<<<<`, `=======`, `>>>>>>>`) antes de commit/entrega.
  - Validador de superficies de edición (`validateEditSurfaces`, `isPathInSurfaces`) que rechaza `.`, raíz desnuda o rutas absolutas.
- `S2`: Ampliar `lib/adapters/DecisionProvider.js` con clasificación ODD v5 (`small` vs `large` mediante resume test, evaluación de los 6 ítems de alto riesgo con `escalate`, modos `organic` vs `full-delegation`) y restaurar `.evals/scenarios/routing-scenarios.json` para que `npm run test:evals` pase al 100%.
- `S3`: Actualizar `bin/cli.js` para operar nativamente con `odd/tasks/<feature>.md` (sin depender del directorio eliminado `.specify/`), mantener compatibilidad con `specs/` existentes en `verify`, añadir comando `guard` (`agent guard`) y opciones ODD en `route`, y corregir `cmdInstallSkill` / `cmdInstallSkillsPack` / `cmdInit`.
- `S4`: Actualizar `skills/speckit-odd/SKILL.md` (y `.agents/skills/speckit-odd/SKILL.md`), añadir `skills/work-unit-commits/SKILL.md` (y `.agents/skills/work-unit-commits/SKILL.md`) siguiendo el estándar LLM-first (`docs/skill-style-guide.md`), y actualizar `.agents/registry.json` (`governance_source: "AGENTS.md"`, sin rutas rotas a `.specify/`).
- `S5`: Sincronizar documentación y gobernanza (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursorrules`, `AGENT_BOOTSTRAP.md`, `README.md`, `GUIA_DE_USO.md`, `PROJECT_LOG.md`, `.agents/memory/`, `package.json`, `.github/workflows/spec-quality-gate.yml`) con las novedades de Gentle Shell v5 (ODD 7 pasos, TDD aplicable, continuidad acotada, work-unit commits, guardrails).
- `S6`: Crear suite de pruebas automatizadas en `tests/gentle-shell-v5.test.js` con `node:test`, verificar todos los scripts `npm run test:*` en verde y registrar comprobante en `.evidence/EV-006-gentle-shell-v5-sync.json`.

## Tasks
- [x] `T1` (`S6` pre-track, route: inline): Crear documento ODD `odd/tasks/009-gentle-shell-v5-sync.md` antes de editar código.
- [x] `T2` (`S1`, route: inline, risk: item 2/3): Implementar `lib/guards/GentleGuards.js` con pruebas RED -> GREEN primero.
- [x] `T3` (`S2`, route: inline, risk: item 3): Actualizar `lib/adapters/DecisionProvider.js` y restaurar `.evals/` con escenarios de enrutamiento y alto riesgo.
- [x] `T4` (`S3`, route: inline, risk: item 3/5): Actualizar `bin/cli.js` (`init`, `create`, `verify`, `guard`, `route`, `install-skill`, `install-skills-pack`) y `package.json`.
- [x] `T5` (`S4`, route: inline, risk: item 3): Actualizar `skills/speckit-odd/SKILL.md`, añadir `skills/work-unit-commits/SKILL.md` (y copias en `.agents/skills/`), añadir `docs/skill-style-guide.md` y `docs/gentle-shell-odd-v5.md`, y actualizar `.agents/registry.json`.
- [x] `T6` (`S5`, route: inline, risk: none): Sincronizar `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursorrules`, `AGENT_BOOTSTRAP.md`, `README.md`, `GUIA_DE_USO.md`, `PROJECT_LOG.md`, `.agents/memory/` y `.github/workflows/spec-quality-gate.yml`.
- [x] `T7` (`S6`, route: inline, risk: none): Ejecutar suite completa (`node --test tests/*.test.js` y todos los `npm run test:*`) y emitir `.evidence/EV-006-gentle-shell-v5-sync.json`.

## Log
- L1 (2026-11-26): Petición original del usuario verbatim: "revisa nuevas actualizaciones de https://github.com/Gentleman-Programming/gentle-shell he implementalas al repositorio"
- L2 (2026-11-26): Revisado `Gentleman-Programming/gentle-shell` desde `v4.6.0` (2026-11-04) hasta `v5.0.0` y `main` (2026-11-25). Detectada además deuda de migración local de `d203f15` (`npm run test:evals` falla por ausencia de `.evals/`, `bin/cli.js` aún referencia `.specify/` eliminado, `skills/speckit-odd/SKILL.md` contiene ` gent verify`).
- L3 (2026-11-26): Fase RED verificada en `tests/gentle-shell-v5.test.js` (`MODULE_NOT_FOUND` para `lib/guards/GentleGuards`). Implementados guardrails, DecisionProvider ODD v5, CLI universal, skills LLM-first y documentación.
- L4 (2026-11-26): Corregido bug en regex de `cmdVerify` (`bin/cli.js`) detectado durante la primera corrida de `npm run test:verify`. Re-ejecución completa en verde: `npm test` (6/6), `test:guards` (96 archivos), `test:verify` (ODD 000..005 al 100%, 009, specs 006..008 al 100%), `test:registry` (v2.4.0, 7 agentes), `test:handoff` (1), `test:evidence`, `test:evals` (10/10), `test:memory` (7/7). Emitido `.evidence/EV-006-gentle-shell-v5-sync.json`. Risk: item 3 (actualización de contratos CLI, esquemas y prompts compartidos con tests completos en verde).
