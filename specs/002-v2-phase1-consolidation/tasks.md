# 📝 Desglose de Tareas de Implementación: Fase 1 - Consolidación del CLI y Limpieza de Legado

**Identificador**: `002-v2-phase1-consolidation`  
**Estado**: `Completado`  
**Plan de Referencia**: `specs/002-v2-phase1-consolidation/plan.md`

---

## 📋 Lista de Tareas Atómicas

### 1. Extensión del CLI Universal
- [x] **`[TASK-001]`**: Implementar la función `installSkill()` en `bin/cli.js` y asociarla al subcomando `install-skill`
  - *Archivos*: `bin/cli.js`
  - *Criterio de Verificación*: `node bin/cli.js install-skill` ejecuta sin errores e instala la skill de forma multiplataforma.

### 2. Saneamiento y Wrappers Ligeros en `scripts/`
- [x] **`[TASK-002]`**: Refactorizar `scripts/install-sdd.bat`, `install-sdd.ps1`, `init-project-sdd.bat`, `init-project-sdd.ps1` como wrappers hacia `bin/cli.js`
  - *Archivos*: `scripts/install-sdd.bat`, `scripts/install-sdd.ps1`, `scripts/init-project-sdd.bat`, `scripts/init-project-sdd.ps1`
  - *Criterio de Verificación*: Los scripts delegan limpiamente en Node.js sin lógica duplicada.

- [x] **`[TASK-003]`**: Refactorizar `scripts/integrate-speckit.ps1`, `scripts/integrate-speckit.sh`, `scripts/install.ps1`, `scripts/install.sh` para delegar en `bin/cli.js`
  - *Archivos*: `scripts/integrate-speckit.ps1`, `scripts/integrate-speckit.sh`, `scripts/install.ps1`, `scripts/install.sh`
  - *Criterio de Verificación*: `npm run test:verify` ejecuta `node bin/cli.js verify` con éxito.

### 3. Limpieza de Plantillas Duplicadas y Documentación
- [x] **`[TASK-004]`**: Eliminar `spec-template.md`, `plan-template.md`, `tasks-template.md` de `.specify/templates/`
  - *Archivos*: `.specify/templates/`
  - *Criterio de Verificación*: Solo existen los archivos canónicos (`spec.md`, `plan.md`, `tasks.md`, `clarify.md`, `checklist.md`).

- [x] **`[TASK-005]`**: Limpiar rutas absolutas locales en `docs/kev-decision-guide.md`
  - *Archivos*: `docs/kev-decision-guide.md`
  - *Criterio de Verificación*: Rutas convertidas a sintaxis agnóstica (`${HOME}/.jev-classifier`).

### 4. Verificación y Calidad Final
- [x] **`[TASK-006]`**: Ejecutar verificación integral de specs y validar que `speckit verify` reporte 100% de coherencia
  - *Archivos*: N/A
  - *Criterio de Verificación*: `node bin/cli.js verify` reporta 100% en todas las especificaciones activas.
