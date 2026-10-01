# 📋 Especificación Funcional: Pack de Habilidades Esenciales (Starter Pack Skills - skills.sh)

**Identificador**: `007-skills-starter-pack`  
**Estado**: `En Revisión`  
**Fecha de Creación**: `2026-10-01`  
**Última Actualización**: `2026-10-01`  
**Autor/Agente**: `spec-agent` / `architect`

---

## 🎯 1. Resumen Ejecutivo y Objetivo

Esta especificación formaliza la integración e instalación automatizada del **Starter Pack de Skills** del ecosistema abierto [skills.sh](https://skills.sh) en el proyecto **Elite Agent Bootstrap v2**. 

El objetivo es equipar a los agentes de IA (Antigravity, Claude Code, Cursor, Gemini CLI) con un conjunto estandarizado de cinco habilidades críticas de alta productividad, complementando el marco normativo de Spec-Driven Development (SDD):
1. **`find-skills` (Vercel Labs)**: Búsqueda y descubrimiento bajo demanda de nuevas skills del ecosistema.
2. **`grill-me` (Matt Pocock)**: Interrogatorio implacable y exhaustivo sobre planes y diseños para cubrir casos límite antes de escribir código.
3. **`frontend-design` (Anthropic)**: Creación de interfaces de usuario con diseño cuidado, profesional y libre de patrones genéricos ("AI slop").
4. **`web-design-guidelines` (Vercel Labs)**: Auditoría automatizada de interfaces web detectando fallos de accesibilidad, UX y diseño.
5. **`systematic-debugging` (Jesse Vincent / obra - superpowers)**: Metodología estricta de depuración en 4 fases (reproducir, aislar, formular hipótesis y verificar con tests) antes de intentar cualquier arreglo.

Además, se provee el comando nativo `agent install-skills-pack` (y alias `install-skills-pack` / script npm) para instalar o actualizar este pack de skills tanto a nivel de proyecto (`.agents/skills/`) como a nivel global de Antigravity (`~/.gemini/config/skills/` y `~/.gemini/antigravity/skills/`).

---

## 👤 2. Historias de Usuario (User Stories)

### Historia 1: Descubrimiento y Uso de Habilidades por el Agente
- **Como** agente de IA trabajando en un proyecto bajo Elite Agent Bootstrap
- **Quiero** tener a mi disposición el pack inicial de habilidades estandarizadas (`find-skills`, `grill-me`, `frontend-design`, `web-design-guidelines`, `systematic-debugging`)
- **Para** interrogar planes antes de codificar, crear interfaces con alta calidad visual, auditar accesibilidad y depurar metódicamente bugs sin realizar parches ciegos.

#### Criterios de Aceptación (Gherkin / Given-When-Then)
- **Escenario 1.1**: El agente afronta una fase de diseño o planificación
  - **Dado** que el agente está en fase de `/plan` o aclaración de requisitos
  - **Cuando** se invoca o consulta `grill-me`
  - **Entonces** el agente desafía los supuestos del plan realizando preguntas incisivas hasta cubrir todos los casos límite y dependencias.

- **Escenario 1.2**: El agente desarrolla código frontend
  - **Dado** que se implementan componentes visuales o páginas web
  - **Cuando** se activan `frontend-design` y `web-design-guidelines`
  - **Entonces** el código generado cumple principios de diseño modernos y se audita contra accesibilidad (WCAG) y ergonomía UX.

- **Escenario 1.3**: Ocurre un bug o fallo en una prueba
  - **Dado** que un test falla o se detecta un comportamiento inesperado
  - **Cuando** el agente entra en modo de depuración
  - **Entonces** la habilidad `systematic-debugging` prohíbe proponer parches ("no fixes without root cause investigation first") y obliga a reproducir, aislar y comprobar hipótesis con un test antes de modificar código.

### Historia 2: Instalación Unificada del Pack de Skills
- **Como** desarrollador o mantenedor del proyecto
- **Quiero** ejecutar un único comando (`agent install-skills-pack` o alias `install-skills-pack`)
- **Para** aprovisionar todas las skills del starter pack de forma local en el proyecto y globalmente en Antigravity con garantía Zero-Overwrite.

#### Criterios de Aceptación (Gherkin / Given-When-Then)
- **Escenario 2.1**: Instalación exitosa del Starter Pack
  - **Dado** que el usuario ejecuta `agent install-skills-pack`
  - **Cuando** el comando finaliza su ejecución
  - **Entonces** las 5 skills quedan alojadas en `.agents/skills/<skill-name>/SKILL.md` y sincronizadas en la configuración global de Antigravity (`~/.gemini/config/skills/`).

---

## ⚙️ 3. Requisitos Funcionales y No Funcionales

### Requisitos Funcionales (RF)
- `[RF-01]`: Incorporar en el repositorio (`skills/` y `.agents/skills/`) las definiciones canónicas de:
  - `skills/find-skills/SKILL.md` (Vercel Labs)
  - `skills/grill-me/SKILL.md` (Matt Pocock)
  - `skills/frontend-design/SKILL.md` (Anthropic)
  - `skills/web-design-guidelines/SKILL.md` (Vercel Labs)
  - `skills/systematic-debugging/SKILL.md` (obra / Jesse Vincent)
- `[RF-02]`: Implementar en `bin/cli.js` el comando `cmdInstallSkillsPack` ejecutable vía `agent install-skills-pack` (y soporte en `agent install-skill --pack` o `agent pack`).
- `[RF-03]`: Actualizar `.agents/registry.json` para mapear estas skills en los roles correspondientes (`orchestrator`, `spec-agent`, `implementer`, `tester`, `reviewer`).
- `[RF-04]`: Registrar alias directos en PowerShell (`install-skills-pack`) y scripts en `package.json` (`npm run install-skills-pack`).
- `[RF-05]`: Sincronizar documentación en `AGENTS.md`, `README.md` y `PROJECT_LOG.md`.

### Requisitos No Funcionales (RNF)
- `[RNF-01] Progressive Disclosure`: Cada `SKILL.md` debe estar estructurado con frontmatter YAML claro (`name`, `description`) para que el LLM solo consuma tokens de contexto detallados bajo demanda.
- `[RNF-02] Compatibilidad Multiagente`: Funcional nativamente en Antigravity (`~/.gemini/config/skills/`), Claude Code (`.claude/skills/` o `.agents/skills/`), Cursor y Gemini CLI.
- `[RNF-03] Idioma y Claridad`: Documentación y descripciones adaptadas al español manteniendo la terminología y directivas técnicas exactas de los autores originales.

---

## 🔍 4. Casos Límite y Reglas de Negocio (Edge Cases)

| ID | Caso Límite / Condición | Comportamiento Esperado |
|---|---|---|
| `[EC-01]` | Una skill ya existe en el directorio de destino con modificaciones locales | Respetar Zero-Overwrite salvo flag explícito `--force` |
| `[EC-02]` | Directorio global de Antigravity (`~/.gemini/config`) inexistente | Creación recursiva automática y segura |
| `[EC-03]` | Conectividad offline o sin internet | Las skills base residen empaquetadas en el repositorio local; no se requiere conexión para instalarlas |

---

## 🚫 5. Fuera de Alcance (Out of Scope)
- [ ] Ejecutar instalación remota dinámica de cualquier skill arbitraria sin validación de seguridad.
- [ ] Modificar la lógica interna de los adapters de decisión (`lib/adapters/DecisionProvider.js`).

---

## 📌 6. Dependencias y Bloqueantes
- **Depende de**: `specs/006-persistent-agent-memory` (Completada).
- **Relacionado con**: `.agents/registry.json`, `bin/cli.js`.
