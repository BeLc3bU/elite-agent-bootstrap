# Guía de Estilo de Skills (LLM-First — Gentle Shell v5)

Contrato normativo adaptado de `Gentleman-Programming/gentle-shell/docs/skill-style-guide.md` para redactar skills reproducibles y concisas dentro de `skills/` y `.agents/skills/`.

## Propósito
Una skill es un contrato de ejecución en tiempo de runtime para un LLM, no un tutorial ni un README extenso para humanos.

## Estructura Obligatoria

```text
skills/{skill-name}/
├── SKILL.md
├── assets/       # opcional: plantillas, esquemas, ejemplos
└── references/   # opcional: documentación local extensa
```

Orden de secciones en `SKILL.md`:
1. `Activation Contract`
2. `Hard Rules`
3. `Decision Gates`
4. `Execution Steps`
5. `Output Contract`
6. `References`

## Frontmatter YAML

```yaml
---
name: {kebab-case-skill-name}
description: "Trigger: {frases de activación}. {Qué hace la skill}."
license: MIT
metadata:
  author: BeLc3bU
  version: "1.0"
---
```

Reglas:
- `description` debe ocupar una sola línea física, ir entrecomillada y poner los *triggers* al principio.
- No añadir una sección separada `Keywords`.
- Mantener `SKILL.md` conciso (objetivo 180–450 tokens; máximo recomendado 700; límite duro 1000).
- Preferir tablas compactas para *Decision Gates* y listas imperativas frente a prosa extensa.
- Mover ejemplos largos o esquemas a `assets/` o `references/`.
