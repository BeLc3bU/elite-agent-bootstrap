# 📐 Plan Técnico y Arquitectura: 007-skills-starter-pack

**Identificador**: `007-skills-starter-pack`  
**Estado**: `En Revisión`  
**Fecha de Creación**: `2026-10-01`  
**Última Actualización**: `2026-10-01`  
**Arquitecto**: `spec-agent` / `architect`

---

## 🏛️ 1. Arquitectura y Estructura de Directorios

Se empaquetará el Starter Pack de 5 habilidades canónicas respetando el estándar oficial de skills para Antigravity y skills.sh:

```text
skills/
├── speckit-sdd/               # Skill preexistente de SDD
├── find-skills/               # Vercel Labs
│   └── SKILL.md
├── grill-me/                  # Matt Pocock
│   └── SKILL.md
├── frontend-design/           # Anthropic
│   └── SKILL.md
├── web-design-guidelines/     # Vercel Labs
│   └── SKILL.md
└── systematic-debugging/      # Jesse Vincent / obra
    └── SKILL.md

.agents/skills/
└── (Espejo sincronizado para el runtime del proyecto local)
```

---

## ⚙️ 2. Diseño del Comando de Instalación en `bin/cli.js`

Se implementará la función `cmdInstallSkillsPack(options)`:
1. Localiza el directorio origen `skills/`.
2. Identifica las 5 skills (`find-skills`, `grill-me`, `frontend-design`, `web-design-guidelines`, `systematic-debugging`).
3. Copia a:
   - Directorio local del proyecto: `.agents/skills/<skill>/SKILL.md`
   - Directorio global de Antigravity: `~/.gemini/config/skills/<skill>/SKILL.md` y `~/.gemini/antigravity/skills/<skill>/SKILL.md`
4. Registra los logs informativos y garantiza Zero-Overwrite.

---

## 👥 3. Asignación de Roles en `.agents/registry.json`

| Rol de Agente | Habilidades Preexistentes | Habilidades Añadidas del Starter Pack |
|---|---|---|
| `orchestrator` | `speckit-sdd` | `find-skills`, `grill-me` |
| `spec-agent` | `speckit-sdd` | `grill-me`, `find-skills` |
| `implementer` | `speckit-sdd` | `frontend-design`, `web-design-guidelines`, `systematic-debugging` |
| `tester` | `speckit-sdd` | `systematic-debugging`, `web-design-guidelines` |
| `reviewer` | `speckit-sdd` | `web-design-guidelines`, `frontend-design`, `grill-me` |
| `security-agent` | `speckit-sdd` | `systematic-debugging` |
| `optimization-agent`| `speckit-sdd` | `web-design-guidelines` |

---

## 🧪 4. Estrategia de Pruebas y Validación (Quality Gates)
1. Ejecución de `node bin/cli.js verify` para auditar la feature `007-skills-starter-pack`.
2. Ejecución de `node bin/cli.js registry validate` para comprobar la coherencia del esquema del registro de agentes.
3. Ejecución de `node bin/cli.js install-skills-pack` en modo prueba y verificación de la existencia de los archivos instalados.
4. Registro de evidencia reproducible en `.evidence/EV-004-skills-starter-pack.json`.
