# Guía Técnica: Arquitectura de Decisiones Tipadas con Kev / Jev

> **Referencia:** [github.com/jaredpalmer/kev](https://github.com/jaredpalmer/kev)  
> **Contrato API:** `/v1/systemone`  
> **Servidor MCP Compatible:** `jev-classifier`  

---

## 1. ¿Qué es Kev y por qué integrarlo?

En la ingeniería de agentes moderna, confiar en grandes modelos de lenguaje (LLMs) generativos para tomar decisiones atómicas (ej. clasificar un elemento, decidir si un dato es válido o elegir la siguiente herramienta) es costoso, lento y propenso a errores de formateo o alucinaciones.

**Kev** (creado por Jared Palmer) es una familia de **modelos de decisión (System 1)** construidos sobre transformadores causales ligeros (serie Qwen con adaptadores LoRA y cabezas de puntero). No generan texto libre: toman un **estado** (un documento o texto de entrada) y una lista de preguntas tipadas, y retornan directamente distribuciones de probabilidad calibradas en un solo forward pass.

Es un sustituto de código abierto compatible al 100% con la API `/v1/systemone` de TypeSafe Jev.

---

## 2. Tipos de Preguntas y Contratos

Kev y la API `/v1/systemone` admiten tres tipos de entradas estructuradas:

### A. Booleana / Sí o No (`noul`)
Evalúa si una condición se cumple con certeza:
```json
{
  "type": "noul",
  "question": "¿El candidato cumple con el requisito de residencia en Albacete o Hellín?"
}
```
*Salida:* Probabilidad `[true, false]`.

### B. Opción Múltiple (`choice`)
Clasifica el estado entre un conjunto cerrado de opciones:
```json
{
  "type": "choice",
  "question": "¿Cuál es el nivel de encaje del puesto?",
  "options": ["Clase A (Directo)", "Clase B (Potencial)", "Clase C (Descartado)"]
}
```
*Salida:* Distribución de probabilidad para cada opción.

### C. Escala Ordenada (`score`)
Asigna una calificación en niveles definidos:
```json
{
  "type": "score",
  "question": "¿Qué nivel de relevancia tiene esta oferta técnica?",
  "levels": ["Muy Baja", "Baja", "Media", "Alta", "Crítica"]
}
```

---

## 3. Integración en Antigravity y MCP

Antigravity integra esta capa de decisión a través del servidor MCP **`jev-classifier`** configurado en `~/.gemini/config/mcp_config.json`:

```json
"jev-classifier": {
  "command": "node",
  "args": ["/path/to/jev-classifier/dist/cli.js", "mcp", "--global", "--client", "antigravity"],
  "env": {
    "JEV_CONFIG_HOME": "${HOME}/.jev-classifier",
    "JEV_STUB": "1"
  }
}
```

Herramientas disponibles para el agente:
* `jev_status`: Comprueba la conexión y el backend activo (stub local, Kev server o endpoint remoto).
* `jev_choose_next_tool`: Selecciona deterministamente la herramienta o paso óptimo basándose en la salida tipada.

---

## 4. Buenas Prácticas para Proyectos SDD

1. **Separación de Responsabilidades:**
   - Usa LLMs generativos (Gemini Flash/Pro, Claude) para **redactar especificaciones**, **diseñar arquitectura** y **escribir código**.
   - Usa Kev / Jev para **clasificación de datos masivos**, **validación de reglas booleanas**, **enrutamiento de flujos** y **filtrado previo**.
2. **Determinismo en Pipelines:**
   - En proyectos como `SeartchJobs`, la clasificación de cientos de ofertas diarias debe ejecutarse mediante reglas o modelos de decisión tipada para mantener el coste en 0 € y la latencia en milisegundos.
