# Especificación de Característica: Línea Base de Elite Agent Bootstrap (Ecosistema SDD)

- **Identificador:** `specs/001-template-baseline/spec.md`
- **Fecha:** 2026-09-28
- **Autor / Creador:** Pedro Úbeda Sánchez
- **Estado:** `IMPLEMENTED`

---

## 1. Contexto y Planteamiento del Problema
El repositorio `elite-agent-bootstrap` requería una modernización integral para adoptar el estándar internacional de **GitHub Spec Kit**, incorporando el ciclo formal de desarrollo guiado por especificaciones (`.specify/` y `specs/`), la integración con la arquitectura de decisiones tipadas de Jared Palmer (**Kev** / `/v1/systemone`) y automatizaciones para su despliegue en múltiples ordenadores.

---

## 2. Requerimientos Funcionales (FR)
- **FR-1:** Contener una plantilla de constitución formal (`constitution-template.md`) con reglas de oro innegociables para gobernar cualquier IA.
- **FR-2:** Proveer las plantillas estándar oficiales de Spec Kit (`spec.md`, `plan.md`, `tasks.md`).
- **FR-3:** Ofrecer una Skill global de Antigravity (`speckit-sdd`) para orquestar las fases de desarrollo sin dependencias de compiladores externos.
- **FR-4:** Incluir scripts de instalación desatendida de un clic (`install-sdd.bat` / `.ps1`) para clonar el entorno en cualquier ordenador en segundos.
- **FR-5:** Proveer una guía de arquitectura de decisión tipada (Kev/Jev) para clasificaciones rápidas y enrutamiento a coste cero.

---

## 3. Requerimientos No Funcionales (NFR)
- **NFR-1 (Compatibilidad Multiplataforma):** Scripts compatibles con Windows (PowerShell y CMD Batch) y rutas dinámicas (`$HOME` / `%USERPROFILE%`).
- **NFR-2 (Idioma):** Todo el repositorio redactado 100% en español.
- **NFR-3 (Eficiencia de Contexto):** Mantener las reglas de prompt (`AGENTS.md`) por debajo de las 500 líneas.

---

## 4. Criterios de Aceptación (Acceptance Criteria)
- [x] **AC-1:** La estructura de directorios sigue fielmente el estándar `.specify/` y `specs/`.
- [x] **AC-2:** La skill `speckit-sdd` está documentada con frontmatter YAML compatible con Antigravity.
- [x] **AC-3:** Los scripts de instalación instalan la skill y reglas en la ruta de usuario correspondiente.
- [x] **AC-4:** Se elimina el directorio legacy `spec_template/` para evitar confusiones de estándares.
