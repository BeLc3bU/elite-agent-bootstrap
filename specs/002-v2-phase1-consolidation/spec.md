# 📋 Especificación Funcional: Fase 1 - Consolidación del CLI y Limpieza de Legado

**Identificador**: `002-v2-phase1-consolidation`  
**Estado**: `Aprobado`  
**Fecha de Creación**: `2026-09-28`  
**Última Actualización**: `2026-09-28`  
**Autor/Agente**: `Principal AI Architect`

---

## 🎯 1. Resumen Ejecutivo y Objetivo
La Fase 1 de la evolución a la v2 de `elite-agent-bootstrap` tiene como objetivo resolver la dispersión operativa, eliminar la duplicación de código en scripts de terminal y establecer el CLI de Node.js (`bin/cli.js`) como la **única fuente de verdad** para la gestión del repositorio y la integración de Spec-Kit. Se eliminan plantillas duplicadas y se limpian referencias locales obsoletas en la documentación, manteniendo compatibilidad total.

---

## 👤 2. Historias de Usuario (User Stories)

### Historia 1: Gestión Centralizada desde el CLI Universal
- **Como** desarrollador o agente de IA trabajando en cualquier sistema operativo (Windows, macOS, Linux)
- **Quiero** ejecutar todas las tareas de instalación de skills, verificación y scaffolding desde el comando unificado `speckit` / `npx elite-speckit`
- **Para** no depender de scripts fragmentados en PowerShell, CMD Batch o Bash.

#### Criterios de Aceptación (Given-When-Then)
- **Escenario 1.1**: Instalación de la skill de Antigravity
  - **Dado** un entorno con Antigravity instalado en la máquina del usuario
  - **Cuando** ejecuto `speckit install-skill` (o `node bin/cli.js install-skill`)
  - **Entonces** la skill `speckit-sdd` se copia a `~/.gemini/config/skills/speckit-sdd/SKILL.md`
  - **Y** las directrices SDD se añaden en UTF-8 al archivo `~/.gemini/config/GEMINI.md` de forma idempotente.

- **Escenario 1.2**: Retrocompatibilidad de scripts heredados
  - **Dado** que un usuario o proceso antiguo ejecuta `scripts/install-sdd.bat`, `install-sdd.ps1`, o `init-project-sdd.bat`
  - **Cuando** se invoca el script
  - **Entonces** el script delega limpiamente la ejecución en `bin/cli.js` sin duplicar lógica interna.

### Historia 2: Limpieza de Plantillas y Deuda Técnica
- **Como** mantenedor del proyecto
- **Quiero** una estructura limpia sin duplicados en `.specify/templates/` y sin paths absolutos locales en `docs/`
- **Para** evitar confusiones entre desarrolladores y consumo innecesario de contexto.

#### Criterios de Aceptación
- **Escenario 2.1**: Consolidación de plantillas
  - **Dado** el directorio `.specify/templates/`
  - **Cuando** audito los archivos existentes
  - **Entonces** solo existen los archivos canónicos (`spec.md`, `plan.md`, `tasks.md`, `clarify.md`, `checklist-template.md`) y se han eliminado los duplicados redundantes `*-template.md`.

- **Escenario 2.2**: Documentación agnóstica
  - **Dado** el archivo `docs/kev-decision-guide.md`
  - **Cuando** se inspecciona la configuración recomendada de MCP
  - **Entonces** no existen rutas locales hardcodeadas como `C:\Users\...` sino variables de entorno estándar (`$HOME` / `%USERPROFILE%`).

---

## ⚙️ 3. Requisitos Funcionales y No Funcionales

### Requisitos Funcionales (RF)
- `[RF-01]`: Implementar el subcomando `install-skill` en `bin/cli.js` para instalar `speckit-sdd` y actualizar `GEMINI.md` de forma agnóstica de SO.
- `[RF-02]`: Refactorizar los scripts en `scripts/` para actuar como wrappers ligeros (sh/ps1/bat) de 1 línea hacia `bin/cli.js`.
- `[RF-03]`: Eliminar plantillas redundantes (`spec-template.md`, `plan-template.md`, `tasks-template.md`) en `.specify/templates/`.
- `[RF-04]`: Limpiar configuraciones de path hardcodeadas en `docs/kev-decision-guide.md`.
- `[RF-05]`: Asegurar que `npm run test:verify` y GitHub Actions pasen sin advertencias ni errores.

### Requisitos No Funcionales (RNF)
- `[RNF-01] Zero Dependencies`: `bin/cli.js` no debe añadir dependencias externas al `package.json` (mantener Node.js nativo).
- `[RNF-02] Multiplataforma`: Garantizar funcionamiento idéntico en Windows (PowerShell/CMD) y Unix (Bash/Zsh).
- `[RNF-03] Idioma`: Todos los logs y mensajes del CLI en terminal deben ser en Español.

---

## 🔍 4. Casos Límite y Reglas de Negocio (Edge Cases)

| ID | Caso Límite / Condición | Comportamiento Esperado |
|---|---|---|
| `[EC-01]` | `~/.gemini/config` no existe todavía | Crear el directorio recursivamente antes de copiar la skill. |
| `[EC-02]` | `GEMINI.md` ya contiene las reglas SDD | No duplicar el bloque de texto (idempotencia estricta). |
| `[EC-03]` | Ejecución sin permisos de administrador | Operar en el espacio de usuario (`$HOME` / `%USERPROFILE%`) sin requerir elevación. |

---

## 🚫 5. Fuera de Alcance (Out of Scope)
- No se implementa el nuevo esquema de agentes `.agents/registry.json` todavía (corresponde a la Fase 2).
- No se implementa el sistema de evidencias ni el evaluador de evals (corresponde a las Fases 3 y 4).

---

## 📌 6. Dependencias y Bloqueantes
- **Depende de**: Arquitectura y Plan Director v2 aprobado.
- **Bloquea a**: Fase 2 (Gobernanza y Registro Tipado de Agentes).
