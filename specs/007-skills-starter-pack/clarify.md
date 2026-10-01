# ❓ Preguntas de Aclaración y Validación: 007-skills-starter-pack

Este documento registra los puntos de aclaración y validación de diseño para la integración del **Starter Pack de Skills (skills.sh)**.

---

## 1. Preguntas y Decisiones

### P1: ¿Dónde deben residir los archivos maestros de las skills?
* **Análisis**: En Elite Agent Bootstrap, las habilidades exportables viven en `skills/<skill-name>/SKILL.md` (como `speckit-sdd`) y se instalan en el proyecto en `.agents/skills/<skill-name>/` y globalmente en `~/.gemini/config/skills/`.
* **Decisión**: Los archivos maestros canónicos se incluirán en `skills/<skill-name>/` y `.agents/skills/<skill-name>/`, asegurando distribución local, portabilidad y disponibilidad inmediata sin depender de la red.

### P2: ¿Cuáles son las 5 skills exactas requeridas?
* Conforme a la imagen provista por el usuario (`skills.sh` Starter Pack):
  1. `find-skills` (Vercel): busca e instala skills del ecosistema cuando necesitas una capacidad nueva.
  2. `grill-me` (Matt Pocock): te hace preguntas sobre tu plan hasta cubrir todos los casos antes de implementar.
  3. `frontend-design` (Anthropic): crea interfaces con un diseño cuidado y profesional.
  4. `web-design-guidelines` (Vercel): revisa la interfaz y detecta problemas de accesibilidad, UX y diseño.
  5. `systematic-debugging` (Jesse Vincent / obra): depura con método (reproducir, aislar, formular hipótesis y verificar).

### P3: ¿Cómo se mapean a los roles del registro de agentes (`.agents/registry.json`)?
* `orchestrator`: añade `find-skills`, `grill-me`.
* `spec-agent`: añade `grill-me`, `find-skills`.
* `implementer`: añade `frontend-design`, `web-design-guidelines`, `systematic-debugging`.
* `tester`: añade `systematic-debugging`, `web-design-guidelines`.
* `reviewer`: añade `web-design-guidelines`, `frontend-design`, `grill-me`.

### P4: ¿Qué comandos de instalación se proveerán?
* En CLI: `agent install-skills-pack` (y alias `install-skills-pack`, opción `--pack` en `install-skill`).
* En npm: `npm run install-skills-pack` y `npm run skills-pack`.
* En perfiles de PowerShell: función `install-skills-pack`.

---

## 2. Estado de Validación
- [x] Contenido verificado contra el Starter Pack oficial de skills.sh.
- [x] Compatibilidad validada con Antigravity (formato `SKILL.md` con frontmatter).
- [x] Regla constitucional "Agent ≠ Authority" y "Spec-First" preservadas.
