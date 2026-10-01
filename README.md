# 🤖 Plantilla de Agente de Élite (Elite Agent Bootstrap Template)

Ecosistema y plantilla maestra de **Bootstrapping** para ingeniería de agentes de IA, diseñado para estandarizar el desarrollo de software bajo el estándar oficial de **GitHub Spec Kit** ([github/spec-kit](https://github.com/github/spec-kit)) e incorporar modelos de decisión tipada ultrarrápidos con **Kev** ([jaredpalmer/kev](https://github.com/jaredpalmer/kev)).

Garantiza calidad profesional, elimina el "vibe coding" y permite portar todo el entorno a cualquier ordenador en segundos.

---

## 🚀 Características Principales

* **📐 Spec-Driven Development (GitHub Spec Kit)**: Metodología formal y gobernable. Cada cambio pasa obligatoriamente por el ciclo `Specify` (qué/por qué) ➔ `Clarify` ➔ `Plan` (arquitectura técnica) ➔ `Tasks` (desglose atómico) ➔ `Implement` (TDD) ➔ `Converge` (verificación total) dentro de `.specify/` y `specs/`.
* **👥 Gobernanza y Catálogo Tipado de Agentes (`.agents/registry.json`)**: Definición formal de permisos, herramientas, archivos restringidos y niveles de riesgo con el principio innegociable `Agent ≠ Authority`.
* **🤝 Protocolo de Traspasos Tipados (Handoff Protocol)**: Contrato estructurado en `.agents/handoffs/` que transfiere tareas preservando contexto, decisiones tomadas, artefactos y riesgos sin pérdida de información.
* **🛡️ Sistema de Evidencias Reproducibles (`.evidence/`)**: Registro inmutable de comprobantes de ejecución, comandos y códigos de retorno que garantiza la política constitucional "Evidencia antes de Afirmaciones".
* **🧠 Memoria Persistente de Agentes (`MEMORY.md` y `.agents/memory/`)**: Arquitectura de memoria modular con divulgación progresiva (*Progressive Disclosure*). Los agentes recuerdan patrones, decisiones operativas y lecciones aprendidas entre sesiones respetando la jerarquía $\text{Constitución} > \text{Spec} > \text{Reglas} > \text{ADR} > \text{Memoria}$.
* **🏛️ Gobernanza Constitucional (`constitution.md`)**: Cada proyecto cuenta con un archivo rector que define sus leyes innegociables de arquitectura, costes, calidad y dependencias, impidiendo alucinaciones del modelo.
* **⚡ Capa de Decisión Tipada (Kev / Jev Integration)**: Integración con la arquitectura de modelos de decisión System 1 de Jared Palmer y la API `/v1/systemone` (compatible con el MCP `jev-classifier`). Permite clasificaciones booleanas (`noul`), de opción múltiple (`choice`) y scoring a coste cero y latencia mínima.
* **🛠️ Skill Global de Antigravity (`speckit-sdd`)**: Habilidad modular lista para instalar en `~/.gemini/config/skills/` que enseña a los agentes de Antigravity a orquestar las fases de Spec Kit de forma nativa.
* **🔄 Portabilidad Universal (CLI, One-Liners y Scripts)**:
  - CLI distribuible vía `npx` y `npm` con comandos `registry`, `handoff`, `evidence`, `memory`, `route`, `eval`, `create`, `verify`.
  - Instalador de 1 clic para Antigravity (`scripts\install-sdd.bat` / `.ps1`).
  - One-liners para PowerShell y Bash con garantía **Zero-Overwrite**.
* **🔄 Loop Engineering & TDD**: Bucles iterativos cerrados (RED -> GREEN -> REFACTOR) que resuelven fallos de compilación, linters y tests de forma autónoma antes de entregar el control al usuario.
* **👥 Higiene de Contexto y Subagentes**: Límite estricto de 500 líneas en el archivo de arnés (`AGENTS.md`) y particionamiento de memoria en `docs/`, `.agents/memory/` y `PROJECT_LOG.md` para evitar saturación de la ventana de contexto.
* **🇪🇸 100% en Español**: Documentación, especificaciones, tests, mensajes de commit (Conventional Commits) y changelogs generados exclusivamente en español con `release-please`.

---

## 🛠️ Comandos Disponibles en el Agente (Chat)

Una vez integrado en tu editor o asistente de IA (Antigravity, Cursor, Claude Code, GitHub Copilot, Gemini CLI), puedes invocar estos comandos directamente en el chat:

| Comando | Alias Corto | Función | Artefacto Generado / Modificado |
|---|---|---|---|
| `/constitution` | `/speckit.constitution` | Define las reglas inmutables y gobernanza del proyecto | `.specify/memory/constitution.md` |
| `/specify` | `/speckit.specify` | Crea la especificación funcional con historias de usuario y criterios Given-When-Then | `specs/[ID]-[NOMBRE]/spec.md` |
| `/clarify` | `/speckit.clarify` | Plantea preguntas clave para resolver ambigüedades y casos límite | `specs/[ID]-[NOMBRE]/clarify.md` |
| `/plan` | `/speckit.plan` | Diseña la arquitectura técnica, diagramas Mermaid, esquemas y contratos | `specs/[ID]-[NOMBRE]/plan.md` |
| `/tasks` | `/speckit.tasks` | Desglosa el plan en tareas granulares y ejecutables con IDs `[TASK-XXX]` | `specs/[ID]-[NOMBRE]/tasks.md` |
| `/implement` | `/speckit.implement` | Implementa secuencialmente cada tarea mediante TDD | Código en `src/` y tests |
| `/converge` | `/speckit.converge` | Ejecuta la suite de calidad (lint, test, typecheck), actualiza logs y prepara el PR | `PROJECT_LOG.md`, checklist y PR |

---

## 📦 Estructura del Repositorio

```text
elite-agent-bootstrap-main/
├── MEMORY.md                       # Índice canónico y memoria operativa de alto valor
├── .agents/                        # Gobernanza y Registro Tipado de Agentes
│   ├── registry.json               # Catálogo formal de agentes, roles y permisos
│   ├── handoffs/                   # Protocolo formal de traspaso de tareas
│   ├── rules/                      # Reglas de comportamiento (memory-protocol.md)
│   └── memory/                     # Memorias especializadas modulares
│       ├── decisions.md            # Decisiones técnicas operativas (no-ADR)
│       ├── patterns.md             # Patrones probados de diseño e implementación
│       ├── lessons.md              # Trampas técnicas, errores resueltos y lecciones
│       ├── context.md              # Contexto operacional estable y tooling
│       └── archive/                # Registro histórico de memorias retiradas
├── .evidence/                      # Registro inmutable de comprobantes de ejecución
├── .evals/                         # Arnés de evaluación sintética de agentes
│   └── scenarios/                  # Casos de prueba de enrutamiento y guardrails
├── lib/adapters/                   # Capa de decisión desacoplada (Core + Extended)
│   └── DecisionProvider.js         # Motor determinista y adaptador Kev/Jev
├── schemas/                        # Esquemas JSON de validación (Draft-07)
│   ├── agent.schema.json
│   ├── registry.schema.json
│   ├── handoff.schema.json
│   ├── evidence.schema.json
│   └── memory.schema.json
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
│       └── spec-quality-gate.yml    # Verificación CI/CD de tests, lint, specs y agentes
├── .specify/                       # Directorio de control de Spec-Kit
│   ├── memory/
│   │   └── constitution.md         # Principios inmutables del repositorio
│   ├── templates/                  # Plantillas oficiales en español (canónicas)
│   │   ├── spec.md
│   │   ├── plan.md
│   │   ├── tasks.md
│   │   ├── clarify.md
│   │   └── checklist.md
│   └── scripts/                    # Scripts de automatización local
│       ├── create-feature.ps1 / .sh
│       └── verify-spec.ps1 / .sh
├── skills/                         # Habilidades exportables de Antigravity
│   └── speckit-sdd/
│       └── SKILL.md                # Definición oficial de la skill SDD
├── scripts/                        # Wrappers de conveniencia para bin/cli.js
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
│   └── cli.js                      # CLI Universal sin dependencias externas
├── AGENT_BOOTSTRAP.md              # El Mega-Prompt maestro para la IA
├── PROJECT_LOG.md                  # Memoria técnica y Architectural Decision Records (ADRs)
├── AGENTS.md                       # Arnés de control y catálogo de gobernanza
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

#### C. Mediante CLI Universal / Alias Directos
Si tienes instalado el paquete localmente o enlazado (`agent` o `speckit`):
```bash
agent init                     # Asistente interactivo en el directorio actual
agent init /ruta/a/proyecto    # Inicializa en un directorio destino específico
```

> 🛡️ **Garantía Zero-Overwrite**:
> * Si tu proyecto ya tiene `README.md`, se mantiene intacto y se crea `SPECKIT_GUIDE.md`.
> * Si ya tiene `AGENTS.md`, se crea `AGENTS.speckit.md` o backup `.bak` para preservar tus reglas.
> * Si ya tiene `PROJECT_LOG.md` o `.cursorrules`, se agregan las nuevas directrices al final (*append*).

---

### 4. Catálogo Completo de Comandos (CLI y Alias Directos)

Puedes invocar los comandos mediante `agent <comando>`, `speckit <comando>` o directamente con su **alias de terminal** configurado:

| Comando | Alias Directo | Descripción |
|---|---|---|
| `agent init [dir]` | `init [dir]` | Inicializa o integra la infraestructura SDD y agentes (asistente guiado) |
| `agent verify` | `verify` | Audita y comprueba el avance de todas las especificaciones y tareas (`specs/`) |
| `agent create <nombre>` | `create <nombre>` | Crea una nueva especificación numerada con plantillas canónicas (`specs/NNN-<nombre>/`) |
| `agent memory list` | `memory list` | Lista el catálogo de memorias activas categorizadas |
| `agent memory validate` | `memory validate` | Audita la integridad y formato del sistema de memoria persistente |
| `agent memory search "<q>"` | `memory search "<q>"` | Busca patrones, decisiones o lecciones en el corpus de memoria |
| `agent memory show <id>` | `memory show <id>` | Muestra la ficha técnica detallada de una memoria |
| `agent memory archive <id>` | `memory archive <id>` | Archiva una memoria obsoleta en `.agents/memory/archive/` |
| `agent registry list` | `registry list` | Lista el catálogo oficial de agentes, capacidades y niveles de riesgo |
| `agent registry validate` | `registry validate` | Valida el catálogo de gobernanza contra su JSON Schema |
| `agent handoff list` | `handoff list` | Muestra el histórico de delegaciones entre agentes |
| `agent handoff validate` | `handoff validate` | Valida la integridad del protocolo formal de traspasos |
| `agent evidence list` | `evidence list` | Lista los comprobantes de evidencia inmutables registrados |
| `agent evidence verify` | `evidence verify` | Audita y verifica la autenticidad de los comprobantes de ejecución |
| `agent route "<tarea>"` | `route "<tarea>"` | Enruta una tarea hacia el agente idóneo mediante la capa de decisión |
| `agent eval` | `eval-agent` | Ejecuta la suite de evaluación sintética de agentes (`.evals/`) |
| `agent install-skill` | `install-skill` | Instala la skill global `speckit-sdd` en Antigravity (`~/.gemini/config/`) |
| `agent version` | - | Muestra la versión actual del framework |

---

## 🧠 Persistent Agent Memory (Memoria Persistente de Agentes)

Elite Agent Bootstrap v2 incorpora un sistema nativo de memoria persistente inspirado conceptualmente en agentes avanzados (Claude Code, Antigravity) para retener conocimiento operativo, patrones de solución y lecciones aprendidas entre sesiones de trabajo sin saturar la ventana de contexto.

### 🏛️ Jerarquía de Precedencia Normativa
Ante cualquier discrepancia, la jerarquía de gobierno es estricta:
$$\text{Constitución} > \text{Especificaciones (specs/)} > \text{Reglas (AGENTS/GEMINI)} > \text{ADR (PROJECT_LOG)} > \text{Memoria Persistente} > \text{Contexto de Chat}$$

### 🗺️ Arquitectura por Capas (Progressive Disclosure)
- **`MEMORY.md`**: Índice raíz compacto (<150 líneas) con principios operativos de alto valor y mapa de navegación.
- **`.agents/memory/decisions.md`**: Decisiones técnicas operativas que no requieren un ADR formal.
- **`.agents/memory/patterns.md`**: Patrones probados de diseño, arquitectura e implementación.
- **`.agents/memory/lessons.md`**: Errores conocidos, trampas de entorno resueltas y soluciones empíricas.
- **`.agents/memory/context.md`**: Contexto operacional estable y particularidades del stack.
- **`.agents/memory/archive/`**: Repositorio de memorias obsoletas o retiradas para preservar la trazabilidad histórica.

### 🛠️ Comandos CLI de Gestión de Memoria
| Comando | Descripción |
|---|---|
| `agent memory list` | Lista todas las memorias activas y su clasificación |
| `agent memory validate` | Audita la integridad, unicidad de IDs y formato contra el esquema JSON |
| `agent memory search "<query>"` | Búsqueda léxica instantánea en el corpus de memorias |
| `agent memory show <id>` | Muestra la ficha técnica completa de una memoria |
| `agent memory archive <id>` | Mueve una memoria obsoleta a `.agents/memory/archive/` |

---

## 🛡️ Guardrails de Calidad (Innegociables)

1. **Zero Errors Policy**: Prohibido abrir PRs si fallan tests, linter o compilación de tipos.
2. **Evidencia Visual**: Obligatorio adjuntar capturas de pantalla o grabaciones en PRs con cambios de UI.
3. **Releases en Español**: Integración con `release-please` para generar versiones semánticas y notas de release en español.
4. **Memoria de Decisiones**: Registro automático en `PROJECT_LOG.md` de decisiones arquitectónicas y progreso.
5. **Decisiones Tipadas**: Uso de Kev / Jev (`/v1/systemone`) para clasificaciones y scoring atómico a coste cero.
6. **Memoria Persistente Validada**: `agent memory validate` (o `speckit memory validate`) debe pasar en verde en cada ciclo de CI/CD.

---

## 📄 Licencia

Distribuido bajo licencia MIT. ¡Úsalo libremente para potenciar tus proyectos con ingeniería agéntica de alto rendimiento!
