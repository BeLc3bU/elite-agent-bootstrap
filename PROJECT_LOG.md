# 📋 Registro de Decisiones y Memoria del Proyecto (PROJECT_LOG.md)

Este archivo actúa como la memoria a largo plazo del proyecto, documentando la evolución arquitectónica, decisiones técnicas clave y el estado de los hitos de desarrollo.

---

## 🏛️ Registro de Decisiones de Arquitectura (ADR)

### ADR-001: Integración Nativa de Spec-Kit y SDD
- **Fecha**: 2026-08-16
- **Contexto**: Necesidad de eliminar el "vibe coding" y asegurar que los agentes de IA construyan software con trazabilidad, contratos claros y cero ambigüedad.
- **Decisión**: Integrar el ecosistema GitHub Spec-Kit con carpetas `.specify/` y `specs/`, proporcionando comandos interactivos (`/speckit.specify`, `/speckit.plan`, `/speckit.tasks`, `/speckit.implement`, `/speckit.converge`).
- **Consecuencias**: Mayor calidad de código, documentación viva sincronizada y soporte tanto para repositorios nuevos (Greenfield) como existentes (Brownfield).

### ADR-002: Sistema Universal de Distribución y Protección Zero-Overwrite
- **Fecha**: 2026-08-16
- **Contexto**: Al copiar la plantilla sobre proyectos ya existentes, se producían colisiones de archivos (`README.md`, `AGENTS.md`) que podían sobreescribir la documentación previa del usuario.
- **Decisión**: 
  1. Crear un paquete CLI universal (`bin/cli.js`, ejecutable vía `npx elite-speckit`).
  2. Desacoplar plantillas maestras en `.specify/templates/scaffold/`.
  3. Implementar política estricta **Zero-Overwrite**: en proyectos existentes, no se sobreescribe `README.md` (se crea `SPECKIT_GUIDE.md`) ni `AGENTS.md` (se crea `AGENTS.speckit.md` o backup `.bak`). Los logs y reglas aplican *append* no destructivo.
  4. Actualizar scripts PowerShell y Bash con auto-detección y modos `New`/`Existing`.
- **Consecuencias**: Integración segura en 1 solo comando tanto en proyectos nuevos como en repositorios consolidados sin pérdida de información.

### ADR-003: Subcomandos CLI de Gestión y Limpieza de Código Legado
- **Fecha**: 2026-08-16
- **Contexto**: Necesidad de simplificar el flujo diario de los desarrolladores (crear specs y verificar progreso sin depender de scripts externos de PowerShell o Bash) y eliminar remanentes obsoletos.
- **Decisión**:
  1. Eliminar directorio legado `spec_template/` y duplicados en raíz.
  2. Añadir subcomandos nativos al CLI: `speckit create <nombre>` (con cálculo de ID automático) y `speckit verify` (con barra y porcentaje de tareas completadas).
  3. Soporte para instalador remoto one-liner (`install.ps1` e `install.sh`).
- **Consecuencias**: Repositorio 100% limpio y experiencia de usuario fluida multiplataforma.

---

## 🗺️ Historial de Fases e Hitos

| Fase | Descripción | Estado | Fecha de Cierre |
|---|---|---|---|
| **Fase 1** | Refactorización de la plantilla base e integración de Spec-Kit | ✅ Completado | 2026-08-16 |
| **Fase 2** | CLI Universal distribuible, plantillas scaffold y protección Zero-Overwrite | ✅ Completado | 2026-08-16 |
| **Fase 3** | Subcomandos de gestión (create/verify), limpieza de legado y despliegue | ✅ Completado | 2026-08-16 |


