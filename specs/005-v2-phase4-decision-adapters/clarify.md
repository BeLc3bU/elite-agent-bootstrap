# ❓ Registro de Dudas y Clarificaciones Técnicas: Fase 4 - Capa de Decisión y Adaptadores

**Identificador**: `005-v2-phase4-decision-adapters`  
**Estado**: `Resuelto`  

---

### Pregunta 1: ¿Debe el CLI depender de un endpoint HTTP activo para funcionar?
- **Respuesta**: **No**. La regla constitucional de "Cero Sobreingeniería" exige que el Core sea 100% autónomo. El proveedor por defecto es `DeterministicDecisionProvider`, que opera en local mediante el registro tipado de agentes y reglas léxicas. La integración con Kev/Jev (`KevJevDecisionProvider`) es un adaptador opcional que solo se activa si se definen variables de entorno o configuración explícita, con fallback automático.

### Pregunta 2: ¿Cómo debe responder el enrutador ante una orden de merge a main?
- **Respuesta**: Debe aplicar la regla constitucional `Agent ≠ Authority`. Toda solicitud que implique modificar producción, realizar merges directos o saltarse las revisiones debe enrutarse con `requires_human_approval: true` y asociarse al rol `reviewer` o solicitar intervención humana explícita.

### Pregunta 3: ¿Qué formato tendrá el arnés de evaluación sintética?
- **Respuesta**: Un archivo JSON estructurado en `.evals/scenarios/routing-scenarios.json` con entradas descriptivas, salida esperada, nivel de riesgo esperado y requerimiento de aprobación. El CLI evaluará cada caso e informará de la tasa de acierto (exigiendo el 100% para éxito en CI).
