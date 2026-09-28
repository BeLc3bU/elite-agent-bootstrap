# 🤖 Plantilla de Agente de Élite (Elite Agent Bootstrap Template)

Ecosistema y plantilla maestra de **Bootstrapping** para ingeniería de agentes de IA, diseñado para estandarizar el desarrollo de software bajo el estándar oficial de **GitHub Spec Kit** ([github/spec-kit](https://github.com/github/spec-kit)) e incorporar modelos de decisión tipada ultrarrápidos con **Kev** ([jaredpalmer/kev](https://github.com/jaredpalmer/kev)).

Garantiza calidad profesional, elimina el "vibe coding" y permite portar todo el entorno a cualquier ordenador en segundos.

---

## 🚀 Características Principales

* **📐 Spec-Driven Development (GitHub Spec Kit)**: Establece una metodología formal y gobernable. Cada cambio pasa obligatoriamente por el ciclo `Specify` (qué/por qué) ➔ `Plan` (arquitectura técnica) ➔ `Tasks` (desglose atómico) ➔ `Implement` (TDD) ➔ `Converge` (verificación total) dentro de `.specify/` y `specs/`.
* **🏛️ Gobernanza Constitucional (`constitution.md`)**: Cada proyecto cuenta con un archivo rector que define sus leyes innegociables de arquitectura, costes, calidad y dependencias, impidiendo alucinaciones del modelo.
* **⚡ Capa de Decisión Tipada (Kev / Jev Integration)**: Integración con la arquitectura de modelos de decisión System 1 de Jared Palmer y la API `/v1/systemone` (compatible con el MCP `jev-classifier`). Permite clasificaciones booleanas (`noul`), de opción múltiple (`choice`) y scoring a coste cero y latencia mínima.
* **🛠️ Skill Global de Antigravity (`speckit-sdd`)**: Habilidad modular lista para instalar en `~/.gemini/config/skills/` que enseña a los agentes a orquestar las 5 fases de Spec Kit de forma nativa.
* **🔄 Portabilidad de 1 Clic para Múltiples Ordenadores**: Scripts automatizados (`install-sdd.bat` / `.ps1` e `init-project-sdd.bat` / `.ps1`) para clonar y configurar el entorno en cualquier equipo en segundos.
* **🔄 Loop Engineering & TDD**: Bucles iterativos cerrados (RED -> GREEN -> REFACTOR) que resuelven fallos de compilación, linters y tests de forma autónoma antes de entregar el control al usuario.
* **👥 Higiene de Contexto y Subagentes**: Límite estricto de 500 líneas en el archivo de arnés (`AGENTS.md`) y particionamiento de memoria en `docs/` para evitar saturación de la ventana de contexto.
* **🇪🇸 100% en Español**: Documentación, especificaciones, tests, mensajes de commit (Conventional Commits) y changelogs generados exclusivamente en español.

---

## 📁 Estructura del Repositorio

```text
elite-agent-bootstrap-main/
├── .specify/                         # Infraestructura estándar de Spec Kit
│   ├── memory/
│   │   └── constitution-template.md  # Plantilla de constitución y reglas innegociables
│   └── templates/                    # Modelos de artefactos SDD
│       ├── spec.md                   # Qué y Por qué (Requisitos y Criterios de Aceptación)
│       ├── plan.md                   # Cómo (Diseño técnico, contratos y riesgos)
│       └── tasks.md                  # Checklist atómico con comandos de test
├── specs/                            # Historial y registro de características
│   └── 001-template-baseline/        # Ejemplo documentado de feature
├── skills/                           # Habilidades exportables de Antigravity
│   └── speckit-sdd/
│       └── SKILL.md                  # Definición oficial de la skill SDD
├── scripts/                          # Automatizaciones y portabilidad
│   ├── install-sdd.bat / .ps1        # Instala la skill y reglas en ~/.gemini/config/
│   └── init-project-sdd.bat / .ps1   # Inyecta la estructura SDD en cualquier proyecto
├── docs/                             # Guías técnicas de arquitectura
│   └── kev-decision-guide.md         # Guía de modelos de decisión tipada Kev / Jev
├── AGENT_BOOTSTRAP.md                # El Mega-Prompt maestro para nuevos proyectos
└── README.md                         # Este manual de referencia
```

---

## 💻 ¿Cómo Usar y Portar a Otros Ordenadores?

### 1. En un Nuevo Ordenador (Instalación en 1 Clic)
1. Clona o copia este repositorio en tu nuevo equipo.
2. Ejecuta haciendo doble clic en:
   ```cmd
   scripts\install-sdd.bat
   ```
   *(O corre `.\scripts\install-sdd.ps1` en PowerShell).*
3. **¡Listo!** La skill global `speckit-sdd` y las reglas universales en `~/.gemini/config/GEMINI.md` quedarán configuradas para todas las sesiones de Antigravity en ese ordenador.

### 2. Inicializar SDD en un Proyecto Nuevo o Existente
Para dotar a cualquier proyecto de la estructura Spec Kit y arnés de agentes:
* **Opción A (Vía Script):** Ejecuta desde la terminal:
  ```cmd
  scripts\init-project-sdd.bat "C:\Ruta\A\Tu\Proyecto"
  ```
* **Opción B (Vía Agente / Mega-Prompt):**
  Copia el contenido de [AGENT_BOOTSTRAP.md](file:///c:/Users/pubes/Desktop/Proyectos/elite-agent-bootstrap-main/AGENT_BOOTSTRAP.md), pégalo en tu asistente de IA (Antigravity) y dile:
  `"Inicializa este proyecto bajo el estándar SDD"`.

---

## 📚 Comandos del Agente en el Flujo SDD

| Comando | Función |
| :--- | :--- |
| `/speckit.specify <feature>` | Crea `specs/NNN-<feature>/spec.md` y valida contra la constitución. |
| `/speckit.plan` | Genera `plan.md` con arquitectura, contratos y mitigación de riesgos. |
| `/speckit.tasks` | Desglosa tareas atómicas en `tasks.md` con comandos de verificación. |
| `/speckit.implement` | Implementa código paso a paso aplicando TDD estricto. |
| `/speckit.converge` | Corre suite completa de tests, linters y verifica criterios de aceptación. |

---
*Lleva el desarrollo agéntico al estándar de la ingeniería de software moderna: especificaciones claras, decisiones calibradas y verificación basada en evidencia.*
