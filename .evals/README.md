# 🧪 Arnés de Evaluación Sintética (.evals)

Este directorio contiene la infraestructura de pruebas sintéticas y escenarios de evaluación de agentes para **Elite Agent Bootstrap v2**.

---

## 🎯 Propósito
Garantizar de forma determinista y reproducible que:
1. Las tareas técnicas son enrutadas al agente correcto según su especialidad.
2. Los límites de permisos declarados en `.agents/registry.json` se respetan estrictamente.
3. Las solicitudes de alto riesgo (como merges directos a `main` o saltarse revisiones) activan inmediatamente el mecanismo de escalada a aprobación humana (**Agent ≠ Authority**).
4. No existen regresiones en la toma de decisiones al evolucionar el sistema.

---

## 📂 Estructura
```text
.evals/
├── README.md                          # Este documento
└── scenarios/
    └── routing-scenarios.json         # Batería canónica de casos de prueba
```

---

## 🚀 Ejecución
Para evaluar la suite completa:
```bash
# Vía CLI
speckit eval

# Vía npm
npm run test:evals
```
Un fallo en cualquier escenario provocará la salida con código de error `1`, bloqueando el despliegue en CI/CD.
