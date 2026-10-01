# 📝 Lista de Tareas: 007-skills-starter-pack

**Identificador**: `007-skills-starter-pack`  
**Estado**: `Completado`  
**Fecha de Creación**: `2026-10-01`  
**Última Actualización**: `2026-10-01`  
**Orquestador**: `orchestrator`

---

## 📋 Lista de Tareas Atómicas

### 1. Definición y Empaquetado Canónico de Skills
- [x] **`[TASK-001]`** Crear definiciones canónicas de las 5 skills del Starter Pack en `skills/`:
  - `skills/find-skills/SKILL.md` (Vercel Labs)
  - `skills/grill-me/SKILL.md` (Matt Pocock)
  - `skills/frontend-design/SKILL.md` (Anthropic)
  - `skills/web-design-guidelines/SKILL.md` (Vercel Labs)
  - `skills/systematic-debugging/SKILL.md` (Jesse Vincent / obra)
  *Criterio de Verificación*: Archivos creados con frontmatter YAML válido (`name`, `description`).

- [x] **`[TASK-002]`** Sincronizar las 5 skills en el runtime de desarrollo `.agents/skills/`.
  - `.agents/skills/find-skills/SKILL.md`
  - `.agents/skills/grill-me/SKILL.md`
  - `.agents/skills/frontend-design/SKILL.md`
  - `.agents/skills/web-design-guidelines/SKILL.md`
  - `.agents/skills/systematic-debugging/SKILL.md`
  *Criterio de Verificación*: Presencia comprobada de los 5 archivos `SKILL.md` en `.agents/skills/`.

### 2. Comando CLI de Instalación del Starter Pack
- [x] **`[TASK-003]`** Implementar la función `cmdInstallSkillsPack` en `bin/cli.js` (`agent install-skills-pack`, `agent pack`).
  - *Archivos*: `bin/cli.js`
  - *Criterio de Verificación*: `node bin/cli.js --help` muestra el nuevo comando `install-skills-pack`.

### 3. Gobernanza y Registro de Agentes
- [x] **`[TASK-004]`** Actualizar `.agents/registry.json` asociando las nuevas skills a los agentes correspondientes (`orchestrator`, `spec-agent`, `implementer`, `tester`, `reviewer`, etc.).
  - *Archivos*: `.agents/registry.json`
  - *Criterio de Verificación*: `npm run test:registry` pasa al 100% sin violaciones de JSON Schema.

### 4. Alias de Terminal y Scripts NPM
- [x] **`[TASK-005]`** Añadir scripts en `package.json` (`install-skills-pack`, `skills-pack`) y registrar la función `install-skills-pack` en los perfiles de PowerShell del usuario.
  - *Archivos*: `package.json`, `$PROFILE`
  - *Criterio de Verificación*: Script ejecutable vía npm y función disponible en PowerShell.

### 5. Verificación de Instalación y Evidencia Inmutable
- [x] **`[TASK-006]`** Ejecutar `node bin/cli.js install-skills-pack` y verificar aprovisionamiento en `~/.gemini/config/skills/` y `~/.gemini/antigravity/skills/`.
  - *Archivos*: `~/.gemini/config/skills/`
  - *Criterio de Verificación*: Comprobar existencia física de las 5 carpetas de skills en la configuración global.

- [x] **`[TASK-007]`** Emitir comprobante inmutable de evidencia en `.evidence/EV-004-skills-starter-pack.json`.
  - *Archivos*: `.evidence/EV-004-skills-starter-pack.json`
  - *Criterio de Verificación*: `npm run test:evidence` audita y valida el nuevo comprobante.

### 6. Documentación y Cierre
- [x] **`[TASK-008]`** Registrar **ADR-009: Starter Pack de Skills (skills.sh)** en `PROJECT_LOG.md` y actualizar `AGENTS.md`, `README.md` y `checklist.md`.
  - *Archivos*: `PROJECT_LOG.md`, `AGENTS.md`, `README.md`, `specs/007-skills-starter-pack/checklist.md`
  - *Criterio de Verificación*: `node bin/cli.js verify` valida 8/8 tareas completadas (100%).
