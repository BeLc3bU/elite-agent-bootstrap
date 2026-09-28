# 🤖 Plantilla de Agente de Élite (Elite Agent Bootstrap Template)

Ecosistema y plantilla maestra de **Bootstrapping** para ingeniería de agentes de IA, diseñado para estandarizar el desarrollo de software bajo el estándar oficial de **GitHub Spec Kit** ([github/spec-kit](https://github.com/github/spec-kit)) e incorporar modelos de decisión tipada ultrarrápidos con **Kev** ([jaredpalmer/kev](https://github.com/jaredpalmer/kev)).

Garantiza calidad profesional, elimina el "vibe coding" y permite portar todo el entorno a cualquier ordenador en segundos.

---

## 🚀 Características Principales

* **📐 Spec-Driven Development (GitHub Spec Kit)**: Metodología formal y gobernable. Cada cambio pasa obligatoriamente por el ciclo `Specify` (qué/por qué) ➔ `Clarify` ➔ `Plan` (arquitectura técnica) ➔ `Tasks` (desglose atómico) ➔ `Implement` (TDD) ➔ `Converge` (verificación total) dentro de `.specify/` y `specs/`.
* **🏛️ Gobernanza Constitucional (`constitution.md`)**: Cada proyecto cuenta con un archivo rector que define sus leyes innegociables de arquitectura, costes, calidad y dependencias, impidiendo alucinaciones del modelo.
* **⚡ Capa de Decisión Tipada (Kev / Jev Integration)**: Integración con la arquitectura de modelos de decisión System 1 de Jared Palmer y la API `/v1/systemone` (compatible con el MCP `jev-classifier`). Permite clasificaciones booleanas (`noul`), de opción múltiple (`choice`) y scoring a coste cero y latencia mínima.
* **🛠️ Skill Global de Antigravity (`speckit-sdd`)**: Habilidad modular lista para instalar en `~/.gemini/config/skills/` que enseña a los agentes de Antigravity a orquestar las fases de Spec Kit de forma nativa.
* **🔄 Portabilidad Universal (CLI, One-Liners y Scripts)**:
  - CLI distribuible vía `npx` y `npm`.
  - Instalador de 1 clic para Antigravity (`scripts\install-sdd.bat` / `.ps1`).
  - One-liners para PowerShell y Bash con garantía **Zero-Overwrite**.
* **🔄 Loop Engineering & TDD**: Bucles iterativos cerrados (RED -> GREEN -> REFACTOR) que resuelven fallos de compilación, linters y tests de forma autónoma antes de entregar el control al usuario.
* **👥 Higiene de Contexto y Subagentes**: Límite estricto de 500 líneas en el archivo de arnés (`AGENTS.md`) y particionamiento de memoria en `docs/` y `PROJECT_LOG.md` para evitar saturación de la ventana de contexto.
* **🇪🇸 100% en Español**: Documentación, especificaciones, tests, mensajes de commit (Conventional Commits) y changelogs generados exclusivamente en español con `release-please`.

---

## 🛠️ Comandos Spec-Kit Disponibles en el Agente

Una vez integrado en tu editor o asistente de IA (Antigravity, Cursor, Claude Code, GitHub Copilot, Gemini CLI), puedes invocar estos comandos en el chat:

| Comando | Función | Artefacto Generado / Modificado |
|---|---|---|
| `/speckit.constitution` | Define las reglas inmutables y gobernanza del proyecto | `.specify/memory/constitution.md` |
| `/speckit.specify` | Crea la especificación funcional con historias de usuario y criterios Given-When-Then | `specs/[ID]-[NOMBRE]/spec.md` |
| `/speckit.clarify` | Plantea preguntas clave para resolver ambigüedades y casos límite | `specs/[ID]-[NOMBRE]/clarify.md` |
| `/speckit.plan` | Diseña la arquitectura técnica, diagramas Mermaid, esquemas y contratos | `specs/[ID]-[NOMBRE]/plan.md` |
| `/speckit.tasks` | Desglosa el plan en tareas granulares y ejecutables con IDs `[TASK-XXX]` | `specs/[ID]-[NOMBRE]/tasks.md` |
| `/speckit.implement` | Implementa secuencialmente cada tarea mediante TDD | Código en `src/` y tests |
| `/speckit.converge` | Ejecuta la suite de calidad (lint, test, typecheck), actualiza logs y prepara el PR | `PROJECT_LOG.md`, checklist y PR |

---

## 📦 Estructura del Repositorio

```text
elite-agent-bootstrap-main/
├── .github/
│   ├── prompts/                    # Prompts integrados para Copilot Chat / VSCode
│   │   ├── speckit.constitution.prompt.md
│   │   ├── speckit.specify.prompt.md
│   │   ├── speckit.clarify.prompt.md
│   │   ├── speckit.plan.prompt.md
│   │   ├── speckit.tasks.prompt.md
│   │   ├── speckit.implement.prompt.md
│   │   └── speckit.converge.prompt.md
│   └── workflows/
│       ├── release-please.yml       # Release automatizada con changelogs en español
│       └── spec-quality-gate.yml    # Verificación CI/CD de tests, lint y specs
├── .specify/                       # Directorio de control de Spec-Kit
│   ├── memory/
│   │   ├── constitution.md         # Principios inmutables del repositorio
│   │   └── constitution-template.md# Plantilla inicial de gobernanza
│   ├── templates/                  # Plantillas oficiales en español
│   │   ├── spec-template.md / spec.md
│   │   ├── plan-template.md / plan.md
│   │   ├── tasks-template.md / tasks.md
│   │   ├── clarify-template.md
│   │   └── checklist-template.md
│   └── scripts/                    # Scripts de automatización local
│       ├── create-feature.ps1 / .sh
│       └── verify-spec.ps1 / .sh
├── skills/                         # Habilidades exportables de Antigravity
│   └── speckit-sdd/
│       └── SKILL.md                # Definición oficial de la skill SDD
├── scripts/                        # Scripts de integración y portabilidad
│   ├── install-sdd.bat / .ps1      # Instalador de la skill Antigravity en ~/.gemini/config/
│   ├── init-project-sdd.bat / .ps1 # Inicializador local de proyecto
│   ├── integrate-speckit.ps1 / .sh # Integrador CLI multiplataforma
│   └── install.ps1 / .sh           # Instaladores remotos one-liner
├── specs/                          # Directorio de especificaciones por feature
│   ├── README.md
│   ├── 000-ejemplo-autenticacion/  # Ejemplo completo de referencia
│   └── 001-template-baseline/      # Línea base del ecosistema
├── docs/                           # Guías técnicas de arquitectura
│   └── kev-decision-guide.md       # Guía de modelos de decisión tipada Kev / Jev
├── bin/
│   └── cli.js                      # CLI ejecutable con npx o npm global
├── AGENT_BOOTSTRAP.md              # El Mega-Prompt maestro para la IA
├── PROJECT_LOG.md                  # Memoria técnica y Architectural Decision Records (ADRs)
├── AGENTS.md                       # Arnés de control de agentes (máx. 500 líneas)
└── README.md                       # Este manual de referencia
```

---

## 💻 Guía de Uso y Portabilidad

### 1. En Antigravity (Instalación de la Skill en 1 Clic)
Para configurar cualquier ordenador nuevo con la skill global de Antigravity:
1. Clona este repositorio en el equipo.
2. Ejecuta haciendo doble clic en:
   ```cmd
   scripts\install-sdd.bat
   ```
3. La skill `speckit-sdd` y las reglas universales en `~/.gemini/config/GEMINI.md` quedarán listas para todas las sesiones.

---

### 2. Iniciar un Proyecto Nuevo (Greenfield)
1. **Copia el contenido** de [`AGENT_BOOTSTRAP.md`](AGENT_BOOTSTRAP.md).
2. **Pégalo en tu asistente de IA** (Antigravity, Gemini, Claude, Cursor, Copilot).
3. **Responde a las 4 preguntas de descubrimiento** que te formulará el agente (Objetivo, Stack, Rigor, Integraciones).
4. El agente creará tu `constitution.md`, `AGENTS.md` y te guiará para redactar tu primera especificación con `/speckit.specify`.

---

### 3. Integrar en un Proyecto Existente (Brownfield)

Puedes ejecutar el integrador directamente desde GitHub **sin necesidad de descargar ni clonar el repositorio**:

#### A. Mediante `npx` (Sin instalación previa)
Abre la terminal en la carpeta de tu proyecto y ejecuta:
```bash
npx --yes github:BeLc3bU/elite-agent-bootstrap
```

#### B. Mediante One-Liner (PowerShell / Bash)
* **En Windows (PowerShell):**
  ```powershell
  irm https://raw.githubusercontent.com/BeLc3bU/elite-agent-bootstrap/main/scripts/install.ps1 | iex
  ```
* **En Linux / macOS (Bash):**
  ```bash
  curl -fsSL https://raw.githubusercontent.com/BeLc3bU/elite-agent-bootstrap/main/scripts/install.sh | bash
  ```

> 🛡️ **Garantía Zero-Overwrite**:
> * Si tu proyecto ya tiene `README.md`, se mantiene intacto y se crea `SPECKIT_GUIDE.md`.
> * Si ya tiene `AGENTS.md`, se crea `AGENTS.speckit.md` o backup `.bak` para preservar tus reglas.
> * Si ya tiene `PROJECT_LOG.md` o `.cursorrules`, se agregan las nuevas directrices al final (*append*).

---

## 🛡️ Guardrails de Calidad (Innegociables)

1. **Zero Errors Policy**: Prohibido abrir PRs si fallan tests, linter o compilación de tipos.
2. **Evidencia Visual**: Obligatorio adjuntar capturas de pantalla o grabaciones en PRs con cambios de UI.
3. **Releases en Español**: Integración con `release-please` para generar versiones semánticas y notas de release en español.
4. **Memoria de Decisiones**: Registro automático en `PROJECT_LOG.md` de decisiones arquitectónicas y progreso.
5. **Decisiones Tipadas**: Uso de Kev / Jev (`/v1/systemone`) para clasificaciones y scoring atómico a coste cero.

---

## 📄 Licencia

Distribuido bajo licencia MIT. ¡Úsalo libremente para potenciar tus proyectos con ingeniería agéntica de alto rendimiento!
