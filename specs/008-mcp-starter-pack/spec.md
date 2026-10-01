# 📋 Especificación Funcional: Pack de Servidores MCP Esenciales (MCP Starter Pack)

**Identificador**: `008-mcp-starter-pack`  
**Estado**: `En Revisión`  
**Fecha de Creación**: `2026-10-01`  
**Última Actualización**: `2026-10-01`  
**Autor/Agente**: `spec-agent` / `architect`

---

## 🎯 1. Resumen Ejecutivo y Objetivo

Esta especificación formaliza la integración, configuración y aprovisionamiento automatizado del **Pack de Servidores MCP Esenciales** (Model Context Protocol) en **Elite Agent Bootstrap v2**.

El ecosistema MCP permite a los agentes de IA de Antigravity (y clientes compatibles como Claude Code, Cursor, Windsurf) conectarse con herramientas externas y servicios en tiempo real:
1. **Chrome DevTools (Google)**: El agente interactúa directamente con un navegador real, ejecuta pruebas visuales, inspecciona la consola y red, y toma capturas.
2. **Context7 (Upstash)**: Provee al agente de documentación oficial actualizada en tiempo real de cualquier librería o framework (`resolve-library-id`, `query-docs`).
3. **GitHub (GitHub)**: Gestión de repositorios, issues, commits, branches y pull requests directamente desde el contexto del agente.
4. **Figma (Figma)**: Conversión de diseños de Figma en código de producción extrayendo tokens, jerarquía y contexto real de diseño.
5. **Supabase (Supabase)**: Consulta, creación y administración de bases de datos Postgres, esquemas, autenticación y storage desde el agente.

Se proveerá:
* Plantilla y configuración canónica en `.agents/mcp/` y `mcp_config.json`.
* Comando CLI universal `agent install-mcp-pack` (y alias `install-mcp-pack`, scripts npm).
* Integración segura en el archivo global de Antigravity `~/.gemini/config/mcp_config.json` preservando claves de API y configuraciones preexistentes (Zero-Overwrite).
* Mapeo de herramientas en `.agents/registry.json` para cada rol de agente.

---

## 👤 2. Historias de Usuario (User Stories)

### Historia 1: Acceso a Herramientas MCP Especializadas por Rol de Agente
- **Como** agente de IA ejecutando tareas del ciclo SDD
- **Quiero** invocar los servidores MCP correspondientes a mi responsabilidad (DevTools para testers/implementers, Figma para frontend, GitHub para revisiones/PRs, Supabase para backend y Context7 para arquitectura)
- **Para** contar con información exacta en tiempo real sin alucinar código ni depender de capturas manuales del usuario.

#### Criterios de Aceptación (Gherkin / Given-When-Then)
- **Escenario 1.1**: Consulta de documentación de APIs
  - **Dado** que el agente requiere sintaxis actualizada de una librería
  - **Cuando** consulta Context7 MCP
  - **Entonces** obtiene la documentación oficial reciente y mitiga alucinaciones.

- **Escenario 1.2**: Validación visual e inspección de frontend
  - **Dado** que se implementa una interfaz o se depura un bug web
  - **Cuando** el agente utiliza Chrome DevTools MCP
  - **Entonces** puede abrir la app, comprobar errores en la consola y verificar el renderizado real.

- **Escenario 1.3**: Conversión de diseño Figma a código
  - **Dado** que se requiere maquetar un componente desde un link de Figma
  - **Cuando** el agente accede a Figma MCP
  - **Entonces** extrae las propiedades de diseño (espaciado, tokens, colores) y genera el código fiel al diseño.

### Historia 2: Aprovisionamiento y Configuración Unificada
- **Como** usuario del framework
- **Quiero** ejecutar `agent install-mcp-pack` (o `install-mcp-pack`)
- **Para** configurar los 5 servidores en el archivo global `~/.gemini/config/mcp_config.json` y en `.agents/mcp/` con un solo comando, preservando servidores ya existentes.

---

## ⚙️ 3. Requisitos Funcionales y No Funcionales

### Requisitos Funcionales (RF)
- `[RF-01]`: Crear plantilla y catálogo de configuración en `.agents/mcp/mcp_config.template.json` con los 5 servidores esenciales (`chrome-devtools`, `context7`, `github`, `figma`, `supabase`).
- `[RF-02]`: Implementar la función `cmdInstallMcpPack` en `bin/cli.js` (`agent install-mcp-pack`).
- `[RF-03]`: Soporte de fusión no destructiva (deep merge) en `~/.gemini/config/mcp_config.json`: no sobreescribir tokens existentes (como la API key activa de Context7 o el stub de jev-classifier).
- `[RF-04]`: Mapear las herramientas MCP en `.agents/registry.json` v2.3.0 (`tools` por agente).
- `[RF-05]`: Crear alias directo en PowerShell (`install-mcp-pack`) y scripts en `package.json` (`npm run install-mcp-pack`).
- `[RF-06]`: Integrar el aprovisionamiento de `.agents/mcp/` dentro del flujo universal `cmdInit` (para proyectos existentes y futuros).

### Requisitos No Funcionales (RNF)
- `[RNF-01] Seguridad de Credenciales`: Las variables de entorno que requieren tokens personales (`GITHUB_PERSONAL_ACCESS_TOKEN`, `FIGMA_ACCESS_TOKEN`, `SUPABASE_ACCESS_TOKEN`) deben contemplar placeholders seguros y variables de entorno del sistema (`env`).
- `[RNF-02] Cero Dependencias`: La fusión del JSON de configuración MCP se realiza con módulos nativos de Node.js (`fs`, `path`).
- `[RNF-03] Idempotencia`: Ejecutar el comando múltiples veces no duplica ni corrompe `mcp_config.json`.

---

## 🔍 4. Casos Límite y Reglas de Negocio (Edge Cases)

| ID | Caso Límite / Condición | Comportamiento Esperado |
|---|---|---|
| `[EC-01]` | `mcp_config.json` no existe en `~/.gemini/config/` | Se crea con la estructura completa |
| `[EC-02]` | Servidores ya configurados con claves personalizadas (ej. `context7`) | Se preservan intactos sin sobreescribir |
| `[EC-03]` | Formato JSON corrupto en el archivo de destino | Se emite advertencia, se crea respaldo `.bak` y se recupera la configuración |

---

## 🚫 5. Fuera de Alcance (Out of Scope)
- [ ] Solicitar de forma interactiva e intrusiva contraseñas en plano; se documenta el uso de variables de entorno estándar.
- [ ] Reemplazar el runtime interno de MCP de Antigravity.

---

## 📌 6. Dependencias y Bloqueantes
- **Depende de**: `specs/007-skills-starter-pack` (Completada).
- **Relacionado con**: `~/.gemini/config/mcp_config.json`, `.agents/registry.json`, `bin/cli.js`.
