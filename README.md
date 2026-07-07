# 🤖 Plantilla de Agente de Élite (Elite Agent Bootstrap Template)

Este repositorio contiene un sistema de **bootstrapping** diseñado para configurar automáticamente ecosistemas de agentes de IA altamente estructurados en cualquier proyecto de desarrollo. Utiliza una metodología basada en la ingeniería de agentes moderna, garantizando calidad, control y consistencia bajo estándares profesionales.

## 🚀 Características Principales

*   **📐 Spec-Driven Development (SDD)**: En lugar de un desarrollo informal ("vibe coding"), establece una metodología **Spec-anchored** donde cada cambio relevante pasa primero por crear o actualizar una especificación técnica en `spec/`.
*   **🔄 Loop Engineering**: Configura al agente para resolver problemas de forma autónoma mediante bucles iterativos cerrados (Actuar -> Observar -> Corregir), asegurando la corrección de errores de compilación, linters y tests antes de entregar el control al usuario.
*   **👥 Sistema Multiagente y Subagentes**: Permite al agente principal delegar tareas complejas y masivas (auditorías, lecturas de código extensas, testing) a subagentes de contexto aislado con permisos mínimos, optimizando el uso de la ventana de contexto.
*   **🔌 Integración con MCP y Context7**: Soporta de manera nativa la conexión con servidores Model Context Protocol (MCP) clave, recomendando especialmente **Context7** para acceder a documentación oficial de librerías en tiempo real y mitigar alucinaciones de la IA.
*   **🧠 Higiene de Contexto y Memoria**: Define convenciones claras de particionado de memoria (guardado de logs en `docs/`) y uso del comando `/compact` para mantener el contexto libre de ruido e ineficiencias de tokens.
*   **🛡️ Guardrails e Ingeniería de Arnés**: Limita el archivo de arnés (como `AGENTS.md`) a un máximo estricto de 500 líneas para no comprometer el rendimiento del modelo, y prohíbe los Pull Requests si fallan las validaciones de calidad.
*   **🇪🇸 100% en Español**: Configura el entorno para que toda la documentación técnica, especificaciones, mensajes de commits (Conventional Commits) y changelogs generados automáticamente por `release-please` sean exclusivamente en español.

## 🛠️ Contenido del Repositorio

*   [AGENT_BOOTSTRAP.md](file:///c:/Users/pubes/Desktop/Proyectos/elite-agent-bootstrap-main/AGENT_BOOTSTRAP.md): El **Mega-Prompt** "llave maestra". Copia su contenido y pégalo en tu asistente de IA preferido al iniciar un proyecto.
*   `AGENTS.template.md` (Embebido en el bootstrap): Plantilla adaptable que sirve de base para el archivo `AGENTS.md` (arnés) de tus nuevos desarrollos.

## 📖 Cómo Usarlo

1.  **Copia el contenido** del archivo [AGENT_BOOTSTRAP.md](file:///c:/Users/pubes/Desktop/Proyectos/elite-agent-bootstrap-main/AGENT_BOOTSTRAP.md).
2.  **Pégalo** en tu asistente de IA (como OpenCode, Claude Code, Gemini, Antigravity, etc.) nada más inicializar un nuevo repositorio.
3.  **Responde** a las preguntas de descubrimiento que el agente te planteará para comprender el contexto del proyecto y el stack tecnológico.
4.  **Revisa y aprueba** el plan de arquitectura y el archivo `AGENTS.md` generado en la raíz de tu proyecto.
5.  **¡Empieza a construir!** El agente operará automáticamente bajo la metodología SDD guiada por especificaciones en `spec/`.

---
*Lleva el desarrollo de software con inteligencia artificial al siguiente nivel: pasa de escribir prompts simples a dirigir un equipo de agentes autónomos y disciplinados.*
