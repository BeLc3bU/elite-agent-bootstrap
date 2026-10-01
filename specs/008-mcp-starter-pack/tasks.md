# 📝 Lista de Tareas: 008-mcp-starter-pack

**Identificador**: `008-mcp-starter-pack`  
**Estado**: `Completado`  
**Fecha de Creación**: `2026-10-01`  
**Última Actualización**: `2026-10-01`  
**Orquestador**: `orchestrator`

---

## 📋 Lista de Tareas Atómicas

### 1. Plantilla Canónica y Catálogo Local
- [x] **`[TASK-001]`** Crear `.agents/mcp/` con `mcp_config.template.json` y `README.md` documentando los 5 servidores MCP (Chrome DevTools, Context7, GitHub, Figma, Supabase).
  - *Archivos*: `.agents/mcp/mcp_config.template.json`, `.agents/mcp/README.md`
  - *Criterio de Verificación*: Archivos creados con JSON sintácticamente válido.

### 2. Comando CLI de Instalación y Fusión Segura
- [x] **`[TASK-002]`** Implementar la función `cmdInstallMcpPack` en `bin/cli.js` (`agent install-mcp-pack`, `agent mcp-pack`) con soporte de respaldo `.bak` y fusión no destructiva.
  - *Archivos*: `bin/cli.js`
  - *Criterio de Verificación*: `node bin/cli.js --help` expone el comando `install-mcp-pack`.

- [x] **`[TASK-003]`** Actualizar `cmdInit` en `bin/cli.js` para aprovisionar automáticamente `.agents/mcp/` en proyectos existentes y futuros.
  - *Archivos*: `bin/cli.js`
  - *Criterio de Verificación*: Revisión de la lógica de inicialización en `bin/cli.js`.

### 3. Gobernanza y Registro de Agentes
- [x] **`[TASK-004]`** Actualizar `.agents/registry.json` a v2.3.0 asignando las herramientas MCP a los roles pertinentes (`orchestrator`, `spec-agent`, `implementer`, `tester`, `security-agent`, `reviewer`, `optimization-agent`).
  - *Archivos*: `.agents/registry.json`
  - *Criterio de Verificación*: `npm run test:registry` valida sin errores.

### 4. Alias de Terminal y Scripts NPM
- [x] **`[TASK-005]`** Añadir scripts en `package.json` (`install-mcp-pack`, `mcp-pack`) y registrar la función `install-mcp-pack` en los perfiles de PowerShell del usuario.
  - *Archivos*: `package.json`, `$PROFILE`
  - *Criterio de Verificación*: Script ejecutable vía npm y función en PowerShell.

### 5. Verificación de Instalación y Evidencia Inmutable
- [x] **`[TASK-006]`** Ejecutar `node bin/cli.js install-mcp-pack` y validar que `~/.gemini/config/mcp_config.json` integra los nuevos servidores sin alterar `context7` ni `jev-classifier`.
  - *Archivos*: `~/.gemini/config/mcp_config.json`
  - *Criterio de Verificación*: Comprobar presencia de los 5 servidores y preservación de la API key de Context7.

- [x] **`[TASK-007]`** Emitir comprobante inmutable de evidencia en `.evidence/EV-005-mcp-starter-pack.json`.
  - *Archivos*: `.evidence/EV-005-mcp-starter-pack.json`
  - *Criterio de Verificación*: `npm run test:evidence` audita y valida el nuevo comprobante.

### 6. Documentación y Cierre
- [x] **`[TASK-008]`** Registrar **ADR-010: Pack de Servidores MCP Esenciales** en `PROJECT_LOG.md` y actualizar `AGENTS.md`, `README.md` y `checklist.md`.
  - *Archivos*: `PROJECT_LOG.md`, `AGENTS.md`, `README.md`, `specs/008-mcp-starter-pack/checklist.md`
  - *Criterio de Verificación*: `node bin/cli.js verify` valida 8/8 tareas completadas (100%).
