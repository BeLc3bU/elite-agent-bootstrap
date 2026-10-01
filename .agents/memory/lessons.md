# 💡 Lecciones Aprendidas y Errores Evitados (lessons.md)

Este documento registra trampas técnicas, errores de entorno y problemas resueltos durante el desarrollo para evitar repetir investigaciones innecesarias.

---

### MEM-002: Manejo de Scripts Multiplataforma y Codificación en Windows
- **ID**: `MEM-002-windows-powershell-crossplatform-lesson`
- **Tipo**: `lesson`
- **Estado**: `active`
- **Confianza**: `high`
- **Fecha**: `2026-09-28`
- **Fuente**: `specs/002-v2-phase1-consolidation`
- **Autor**: `implementer`
- **Resumen**: Evitar scripts de shell (.ps1, .sh, .bat) con lógica compleja dividida; centralizar la lógica en JavaScript de Node.js y usar scripts como meros wrappers.
- **Detalles**:
  - Al ejecutar scripts de PowerShell en entornos CI de Linux o máquinas Windows con Execution Policy restringida, los scripts `.ps1` causan fallos espurios.
  - Los scripts `.sh` en Windows fallan si no existe un entorno Git Bash o WSL configurado en el PATH.
  - Solución adoptada: Migrar la lógica al CLI de Node.js (`bin/cli.js`), permitiendo que `npm run test:verify` y demás comandos corran idénticamente en cualquier sistema operativo con `node bin/cli.js ...`.

---

### MEM-007: Preservación de Archivos Existentes y Prevención de Sobreescritura Destructiva
- **ID**: `MEM-007-zero-overwrite-preservation-lesson`
- **Tipo**: `lesson`
- **Estado**: `active`
- **Confianza**: `high`
- **Fecha**: `2026-08-16`
- **Fuente**: `specs/001-template-baseline`
- **Autor**: `orchestrator`
- **Resumen**: Al integrar la plantilla sobre un proyecto preexistente (Brownfield), nunca sobreescribir `README.md` ni destruir `AGENTS.md` del usuario.
- **Detalles**:
  - En un proyecto con documentación previa, destruir su `README.md` borra contexto del negocio irrecuperable.
  - La directriz Zero-Overwrite exige generar `SPECKIT_GUIDE.md` y `AGENTS.speckit.md` (o respaldo `.bak`), y en archivos de reglas o logs realizar adiciones mediante *append* no destructivo si no existe ya el bloque.
