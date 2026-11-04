# Reglas de Proyecto: Plantilla ODD (Gentle Shell)

Este proyecto es la plantilla maestra bajo el estándar **Organic-Driven Development (ODD)** del arnés **el Gentleman** (Gentle Shell).

---

## 🏛️ Gobernanza y Operación ODD
1. **Idioma Estricto**: Toda comunicación, comentario de código, commits (Conventional Commits) y tareas deben ser en **Español**.
2. **Metodología ODD**:
   - Tareas pequeñas: Ejecución directa inline (sin archivos de tareas, test + fix inline).
   - Tareas grandes: Registrar seguimiento en `odd/tasks/<feature>.md`.
3. **Separación de Autoridad (Agent ≠ Authority)**: Ningún agente puede auto-aprobarse ni mergear a `main` sin revisión humana explícita.
4. **Work-Unit Commits**: Commits por unidades de trabajo coherentes (~400 líneas uniendo código + pruebas + documentación).
5. **Verificación Continua**: Ejecutar las pruebas aplicables antes de proponer cambios.
