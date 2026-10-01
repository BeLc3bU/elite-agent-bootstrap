# 📐 Plan Técnico y Arquitectura: 008-mcp-starter-pack

**Identificador**: `008-mcp-starter-pack`  
**Estado**: `En Revisión`  
**Fecha de Creación**: `2026-10-01`  
**Última Actualización**: `2026-10-01`  
**Arquitecto**: `spec-agent` / `architect`

---

## 🏛️ 1. Arquitectura de Configuración y Plantillas

Se creará el directorio `.agents/mcp/` con las plantillas oficiales y guías de configuración:

```text
.agents/mcp/
├── README.md                          # Guía de configuración de servidores y variables de entorno
└── mcp_config.template.json           # Definición canónica completa de los 5 MCPs
```

### Contenido canónico de `mcp_config.template.json`:
```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    },
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "figma": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"
      }
    },
    "supabase": {
      "serverUrl": "https://mcp.supabase.com/mcp",
      "headers": {
        "Authorization": "Bearer ${SUPABASE_ACCESS_TOKEN}"
      }
    }
  }
}
```

---

## ⚙️ 2. Algoritmo de Integración y Fusión (Deep Merge Seguro)

La función `cmdInstallMcpPack(options)` en `bin/cli.js`:
1. Lee `~/.gemini/config/mcp_config.json` si existe (o crea estructura básica si no existe).
2. Genera copia de respaldo de seguridad `mcp_config.json.bak`.
3. Para cada servidor en el pack (`chrome-devtools`, `context7`, `github`, `figma`, `supabase`):
   - Si la clave ya existe en `mcpServers`, **NO se sobreescribe** (se respeta la configuración y API key del usuario).
   - Si no existe, se inserta la configuración estándar.
4. Escribe el archivo preservando el formateo JSON (indentación de 2 espacios).
5. Aprovisiona la carpeta local `.agents/mcp/` en el proyecto.

---

## 👥 3. Mapeo en `.agents/registry.json` v2.3.0

Se actualizan las `tools` de los agentes para reflejar el acceso a estos MCPs:
* `orchestrator`: `git`, `speckit-cli`, `github-mcp`, `context7-mcp`
* `spec-agent`: `speckit-cli`, `context7-mcp`, `figma-mcp`
* `implementer`: `terminal`, `editor-tools`, `linter`, `chrome-devtools-mcp`, `supabase-mcp`, `figma-mcp`, `context7-mcp`
* `tester`: `vitest`, `jest`, `pytest`, `playwright`, `chrome-devtools-mcp`, `supabase-mcp`
* `security-agent`: `git`, `npm-audit`, `secret-scanner`, `github-mcp`
* `reviewer`: `git`, `gh-cli`, `github-mcp`, `chrome-devtools-mcp`
* `optimization-agent`: `bundle-analyzer`, `lighthouse`, `chrome-devtools-mcp`

---

## 🧪 4. Quality Gates y Validación
1. `npm run test:registry`: valida el registro actualizado contra JSON Schema.
2. `node bin/cli.js install-mcp-pack`: prueba la ejecución y fusión sin alterar `context7` ni `jev-classifier`.
3. `.evidence/EV-005-mcp-starter-pack.json`: registro de evidencia inmutable.
4. Actualización documental en `AGENTS.md`, `README.md` y `PROJECT_LOG.md` (ADR-010).
