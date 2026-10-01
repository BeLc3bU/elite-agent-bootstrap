# ❓ Preguntas de Aclaración y Validación: 008-mcp-starter-pack

Este documento registra los puntos de aclaración y diseño para la integración del **Pack de Servidores MCP Esenciales**.

---

## 1. Preguntas y Decisiones Técnicas

### P1: ¿Cuáles son las definiciones técnicas de los 5 servidores MCP?
1. **Chrome DevTools (Google)**:
   - Tipo: Local Stdio
   - Comando: `npx -y chrome-devtools-mcp@latest`
2. **Context7 (Upstash)**:
   - Tipo: Remoto SSE / HTTP
   - Servidor: `https://mcp.context7.com/mcp`
   - Nota: El usuario ya tiene una clave activa configurada en su entorno (`CONTEXT7_API_KEY`). **Debe preservarse estrictamente**.
3. **GitHub (GitHub)**:
   - Tipo: Local Stdio o Remoto
   - Local: `npx -y @modelcontextprotocol/server-github` (requiere `GITHUB_PERSONAL_ACCESS_TOKEN`)
4. **Figma (Figma)**:
   - Tipo: Local Stdio
   - Comando: `npx -y figma-developer-mcp` (o `figma-context-mcp`, utiliza `FIGMA_ACCESS_TOKEN` o `FIGMA_API_KEY`)
5. **Supabase (Supabase)**:
   - Tipo: Remoto SSE / Local Stdio
   - Remoto: `https://mcp.supabase.com/mcp` (con autenticación OAuth/Bearer) o `npx -y @supabase/mcp-server`

### P2: ¿Cómo se maneja la coexistencia con `mcp_config.json` global de Antigravity?
* En `~/.gemini/config/mcp_config.json`, el usuario ya tiene configurados:
  - `context7` (con su clave real)
  - `jev-classifier` (con su ruta a node y stub)
* **Regla crítica**: La función `cmdInstallMcpPack` debe realizar un **Merge No Destructivo**:
  - Si una clave de servidor ya existe en el archivo (`context7`, `jev-classifier`), se respetan sus valores intactos.
  - Solo se insertan los servidores que falten (`chrome-devtools`, `github`, `figma`, `supabase`).

### P3: ¿Cómo se mapean a los roles de agentes en `.agents/registry.json`?
* `orchestrator`: añade `github-mcp`, `context7-mcp`.
* `spec-agent`: añade `context7-mcp`, `figma-mcp`.
* `implementer`: añade `chrome-devtools-mcp`, `supabase-mcp`, `figma-mcp`, `context7-mcp`.
* `tester`: añade `chrome-devtools-mcp`, `supabase-mcp`.
* `security-agent`: añade `github-mcp`.
* `reviewer`: añade `github-mcp`, `chrome-devtools-mcp`.
* `optimization-agent`: añade `chrome-devtools-mcp`.

---

## 2. Estado de Validación
- [x] Protocolo validado contra la documentación oficial de Antigravity (`docs/mcp_servers.md`).
- [x] Preservación de credenciales existentes garantizada.
- [x] Reglas constitucionales de SDD y gobernanza respetadas.
