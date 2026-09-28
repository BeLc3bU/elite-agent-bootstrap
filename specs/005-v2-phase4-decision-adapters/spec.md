# 📋 Especificación Funcional: Fase 4 - Capa de Decisión y Adaptadores (Core Determinista + Extended Kev/Jev) y Arnés de Evaluación

**Identificador**: `005-v2-phase4-decision-adapters`  
**Estado**: `Aprobado`  
**Fecha de Creación**: `2026-09-28`  
**Última Actualización**: `2026-09-28`  
**Autor/Agente**: `Principal AI Architect`

---

## 🎯 1. Resumen Ejecutivo y Objetivo
El objetivo de la Fase 4 es culminar la arquitectura de **`elite-agent-bootstrap v2`** resolviendo la toma de decisiones, el enrutamiento de agentes y la validación empírica de políticas de seguridad.

Siguiendo el principio de **cero sobreingeniería** y la división **Core vs. Extended**:
1. **Core (Sin dependencias externas)**: Proveedor de decisión determinista (`DeterministicDecisionProvider`) basado en análisis léxico-semántico y mapeo declarativo contra las capacidades de [`.agents/registry.json`](file:///c:/Proyectos/Plantilla%20Proyecto/.agents/registry.json).
2. **Extended (Opcional)**: Interfaz abstracta [`lib/adapters/DecisionProvider.js`](file:///c:/Proyectos/Plantilla%20Proyecto/lib/adapters/DecisionProvider.js) con adaptador para modelos de decisión tipada System 1 / Kev / Jev (`/v1/systemone` o MCP).
3. **Arnés de Evaluación (`.evals/`)**: Banco de pruebas sintéticas para medir y auditar el enrutamiento de agentes, los límites de permisos y el bloqueo de auto-aprobaciones, generando comprobantes inmutables en `.evidence/`.

---

## 👤 2. Historias de Usuario (User Stories)

### Historia 1: Enrutamiento y Toma de Decisiones Desacoplada
- **Como** Orquestador de agentes o Desarrollador
- **Quiero** clasificar tareas técnicas y enrutarlas al agente adecuado (`spec-agent`, `implementer`, `tester`, `security-agent`, `reviewer`, `optimization-agent`, `orchestrator`)
- **Para** asegurar que cada agente opere estrictamente dentro de sus capacidades y restricciones de ruta declaradas en `.agents/registry.json`.

#### Criterios de Aceptación (Given-When-Then)
- **Escenario 1.1**: Enrutamiento Determinista de Especificación
  - **Dado** el texto de tarea "Definir historias de usuario y criterios de aceptación para el módulo de facturación"
  - **Cuando** se ejecuta la decisión de enrutamiento
  - **Entonces** el sistema clasifica el destino como `spec-agent` con nivel de riesgo `low`.

- **Escenario 1.2**: Enrutamiento Determinista de Pruebas
  - **Dado** el texto de tarea "Escribir pruebas unitarias y medir cobertura de código"
  - **Cuando** se ejecuta la decisión de enrutamiento
  - **Entonces** el sistema clasifica el destino como `tester`.

- **Escenario 1.3**: Detección de Acciones Restringidas (Bloqueo de Auto-Aprobación)
  - **Dado** una solicitud para "Hacer merge directo a la rama main sin revisión humana"
  - **Cuando** se evalúa la política de seguridad
  - **Entonces** la decisión retorna `escalate_human_approval` y bloquea la ejecución autónoma.

### Historia 2: Comando CLI para Enrutamiento y Consulta
- **Como** usuario en terminal o subagente
- **Quiero** ejecutar `speckit route "<descripción>"`
- **Para** obtener instantáneamente el agente asignado, sus herramientas recomendadas y si requiere aprobación humana.

#### Criterios de Aceptación
- **Escenario 2.1**: Invocación desde terminal
  - **Dado** el comando `node bin/cli.js route "auditar vulnerabilidades OWASP"`
  - **Cuando** se ejecuta
  - **Entonces** imprime el agente `security-agent`, su nivel de riesgo y los archivos permitidos.

### Historia 3: Arnés de Evaluación Sintética (.evals/)
- **Como** Ingeniero de Calidad y DevOps
- **Quiero** ejecutar una suite de escenarios sintéticos (`speckit eval` / `npm run test:evals`)
- **Para** verificar que la lógica de enrutamiento y las reglas de gobernanza no sufren regresiones.

#### Criterios de Aceptación
- **Escenario 3.1**: Ejecución de Suite Sintética
  - **Dado** el catálogo `.evals/scenarios/routing-scenarios.json`
  - **Cuando** se ejecuta `node bin/cli.js eval`
  - **Entonces** todos los escenarios pasan con 100% de coincidencia y se emite un comprobante en `.evidence/`.

---

## 🚫 3. Fuera de Alcance (Out of Scope)
- No se implementarán servidores de microservicios ni bases de datos para guardar decisiones (se utiliza memoria en proceso o archivos locales).
- No se fuerza la llamada de red a la API de Kev si no se configuran variables de entorno; el motor por defecto es 100% local y determinista.

---

## ⚠️ 4. Riesgos y Mitigaciones
- **Ambigüedad léxica en tareas**: Tareas con términos cruzados (ej. "especificar cómo implementar pruebas") se clasifican ponderando verbos principales y se reporta nivel de confianza.
- **Rendimiento**: La evaluación determinista se ejecuta en menos de 10 milisegundos sin latencia de red.
